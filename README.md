# 📊 Balancefy

**Balancefy** é uma aplicação web para **gestão financeira pessoal**, desenvolvida com **Next.js**, **TypeScript**, **Prisma** e **TailwindCSS**.  
Ela permite que você controle categorias, registre transações, visualize relatórios e acompanhe a evolução da sua carteira de forma prática e intuitiva.  

---

## ✨ Funcionalidades

- 🔐 **Autenticação segura** com NextAuth  
- 🗂️ **Gerenciamento de categorias** (criar, editar e excluir)  
- 💸 **Registro de transações** com valores e descrições  
- 📊 **Relatórios interativos** com gráficos  
- 💼 **Página de carteira** para acompanhar saldo e distribuição  
- 🎨 **Interface moderna** feita com TailwindCSS e shadcn/ui  
- 🌗 **Suporte a tema claro e escuro (light/dark)**  
- 📱 **Layout responsivo** (desktop e mobile)  

---

## 🖼️ Demonstração

<img width="1906" height="1000" alt="Balancefy" src="https://github.com/user-attachments/assets/7ff86599-e63b-4e5d-af81-a61867e01040" />

---

## 🚀 Tecnologias Utilizadas

- [Next.js](https://nextjs.org/) – Framework React fullstack  
- [TypeScript](https://www.typescriptlang.org/) – Tipagem estática  
- [Prisma](https://www.prisma.io/) – ORM para banco de dados  
- [NextAuth](https://next-auth.js.org/) – Autenticação  
- [TailwindCSS](https://tailwindcss.com/) – Estilização  
- [shadcn/ui](https://ui.shadcn.com/) – Componentes UI acessíveis  
- [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) – Formulários e validação  
- [React Query](https://tanstack.com/query/latest) – Gerenciamento de estado assíncrono  

---

## 📂 Estrutura de Pastas

```bash
balancefy/
├── public/              # Arquivos estáticos (imagens, ícones, etc.)
├── prisma/              # Configurações do Prisma e migrations
├── src/
│   ├── app/             # Rotas da aplicação (Next.js App Router)
│   │   ├── api/         # Rotas de API
│   │   ├── (auth)/      # Login, registro, etc.
│   │   ├── dashboard/   # Dashboard principal
│   │   ├── relatorios/  # Página de relatórios
│   │   └── carteira/    # Página de carteira
│   ├── components/      # Componentes reutilizáveis
│   ├── hooks/           # Hooks customizados
│   ├── lib/             # Configs (prisma, auth, utils)
│   └── types/           # Tipagens globais
└── ...
