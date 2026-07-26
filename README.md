# Balancefy

Aplicação web para **gestão financeira pessoal** — controle categorias, registre transações, visualize relatórios e acompanhe a evolução da sua carteira.

---

## Funcionalidades

- **Autenticação segura** com NextAuth (Google OAuth + email/senha)
- **Gerenciamento de categorias, transações e carteiras** (CRUD completo)
- **Upload de imagem de perfil** via Cloudinary
- **Relatórios interativos** com gráficos (pizza, linha) e exportação PDF
- **Dashboard** com saldo, resumo mensal e notificações
- **Internacionalização** (pt-BR / en)
- **Tema claro e escuro**
- **Layout responsivo** (desktop e mobile)

---

## Demonstração

<img width="1906" height="1000" alt="Balancefy" src="https://github.com/user-attachments/assets/7ff86599-e63b-4e5d-af81-a61867e01040" />

---

## Tecnologias

| Categoria      | Tecnologias |
|----------------|-------------|
| Framework      | [Next.js](https://nextjs.org/) |
| Linguagem      | [TypeScript](https://www.typescriptlang.org/) |
| Banco          | [PostgreSQL](https://www.postgresql.org/) |
| ORM            | [Prisma](https://www.prisma.io/) |
| Autenticação   | [NextAuth](https://next-auth.js.org/) |
| Estilização    | [TailwindCSS](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/) |
| Formulários    | [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) |
| Upload         | [Cloudinary](https://cloudinary.com/) |
| Estado         | [React Query](https://tanstack.com/query/latest) |
| Gráficos       | [Recharts](https://recharts.org/) |
| PDF            | [jsPDF](https://github.com/parallax/jsPDF) |
| Testes         | [Jest](https://jestjs.io/) + [Testing Library](https://testing-library.com/) |

---

## Estrutura de Pastas

```bash
src/
├── app/                          # Next.js App Router
│   ├── (app)/                    # Rotas protegidas (requer login)
│   │   ├── categories/           # CRUD de categorias
│   │   │   └── components/       #   diálogos, tabela, slider de cor
│   │   ├── dashboard/            # Página inicial pós-login
│   │   │   └── components/       #   summary, gráfico pizza
│   │   ├── help/                 # Ajuda
│   │   ├── reports/              # Relatórios com gráficos
│   │   │   └── components/       #   chart-line, chart-pie, export
│   │   ├── transactions/         # CRUD de transações
│   │   │   └── components/       #   diálogos, seletores
│   │   ├── wallet/               # Gerenciamento de carteiras
│   │   │   └── components/       #   cards, diálogos, grid
│   │   └── layout.tsx
│   ├── api/                      # Rotas de API
│   │   ├── auth/                 # NextAuth
│   │   ├── categories/
│   │   ├── notifications/
│   │   ├── profile/              # Upload de avatar
│   │   ├── register/
│   │   ├── transactions/
│   │   ├── upload/
│   │   └── wallets/
│   ├── login/
│   ├── register/
│   ├── layout.tsx                # Layout raiz
│   ├── providers.tsx             # Providers globais
│   └── globals.css
├── components/                   # Componentes reutilizáveis
│   ├── header/
│   ├── sidebar/
│   ├── ui/                       # shadcn/ui (28 componentes)
│   ├── chart-area.tsx
│   ├── period-filter-header.tsx
│   └── transactions-table.tsx
├── context/                      # Contextos React
│   ├── currency-context.tsx
│   ├── locale-context.tsx
│   ├── period-context.tsx
│   └── theme-context.tsx
├── hooks/                        # Hooks customizados
│   ├── use-categories.ts
│   ├── use-export-pdf.ts
│   ├── use-mobile.ts
│   ├── use-notifications.ts
│   ├── use-summary-all.ts
│   ├── use-summary-month.ts
│   ├── use-transactions.ts
│   ├── use-transactions-type.ts
│   ├── use-translation.ts
│   └── use-wallets.ts
├── i18n/                         # Internacionalização
│   ├── index.ts
│   ├── pt-BR.json
│   └── en.json
├── lib/                          # Configurações e utilitários
│   ├── schemas/                  # Schemas Zod
│   ├── services/                 # Lógica de negócio (services)
│   ├── api-handler.ts            # Helpers para API routes
│   ├── auth-options.ts           # Configuração NextAuth
│   ├── locale.ts                 # Server-side locale
│   ├── prisma.ts                 # Cliente Prisma singleton
│   └── utils.ts
├── types/                        # Tipagens globais
│   ├── categories.ts
│   ├── next-auth.d.ts
│   ├── notification.ts
│   ├── transaction.ts
│   └── wallet.ts
└── middleware.ts                 # Middleware de autenticação

prisma/
├── schema.prisma                 # Schema do banco
└── migrations/                   # Migrations
```

---

## Como Rodar

### Pré-requisitos

- Node.js 20+
- PostgreSQL
- Conta no [Cloudinary](https://cloudinary.com/)

### 1. Clone e instale

```bash
git clone https://github.com/ivanrods/balancefy
cd balancefy
npm install
```

### 2. Configure as variáveis de ambiente

```bash
cp .env.exemple .env
```

Preencha as credenciais no `.env`:

| Variável | Descrição |
|----------|-----------|
| `DATABASE_URL` | URL de conexão do PostgreSQL |
| `NEXTAUTH_URL` | URL da aplicação (ex: `http://localhost:3000`) |
| `NEXTAUTH_SECRET` | Segredo para criptografia dos tokens |
| `GOOGLE_CLIENT_ID` | Client ID do Google OAuth |
| `GOOGLE_CLIENT_SECRET` | Client Secret do Google OAuth |
| `CLOUDINARY_CLOUD_NAME` | Cloud name do Cloudinary |
| `CLOUDINARY_API_KEY` | API Key do Cloudinary |
| `CLOUDINARY_API_SECRET` | API Secret do Cloudinary |

### 3. Prepare o banco

```bash
npx prisma migrate deploy
```

### 4. Inicie

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000)

---

## Testes

O projeto utiliza **Jest** + **Testing Library**. Os testes estão organizados próximos aos arquivos que testam (`.spec.ts` / `.spec.tsx`).

### Rodar todos os testes

```bash
npm test
```

### Rodar em modo watch

```bash
npm run test:watch
```

### Rodar um arquivo específico

```bash
npm test -- src/lib/locale.spec.ts
```

### Cobertura atual

- **~510 testes**, ~67 suites
- Testes de **hooks**, **contextos**, **componentes**, **services**, **API routes**, **schemas**, **utils** e **middleware**
- API routes testadas com mocks (sem necessidade de servidor)
- Hooks e contextos testados com `renderHook`
- Componentes testados com `render` e interações do usuário

---

## Comandos Úteis

```bash
npm run dev          # Inicia em desenvolvimento
npm run build        # Build de produção
npm run lint         # ESLint
npm test             # Testes
npm run test:watch   # Testes em modo watch
```
