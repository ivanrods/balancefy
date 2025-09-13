import { Button } from "@/components/ui/button";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function helpPage() {
  return (
    <div className="h-full flex justify-center mx-auto flex-col gap-4 w-full md:w-md lg:w-lg xl:w-xl">
      <section className="space-y-4 mt-6 w-full">
        <Accordion
          type="single"
          collapsible
          className="w-full"
          defaultValue="item-1"
        >
          <AccordionItem value="item-1" className="border-b-1 pb-2 ">
            <AccordionTrigger>Como adicionar uma transação</AccordionTrigger>
            <AccordionContent className="flex flex-col gap-4 text-balance">
              <p>
                Para registrar uma nova transação no sistema, siga os passos
                abaixo: Clique no botão “Nova Transação” ou no ícone de ➕.
              </p>
              <p>
                Preencha as informações obrigatórias, como descrição da
                transação, valor, categoria da transação, data em que ocorreu,
                depois clique em “Adicionar” para confirmar.
              </p>
              <p>
                A nova transação aparecerá automaticamente na lista de
                transações.
              </p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>Como apagar uma transação</AccordionTrigger>
            <AccordionContent className="flex flex-col gap-4 text-balance">
              <p>Se você precisar remover uma transação existente:</p>
              <p>
                Localize a transação desejada na lista. Clique no ícone de três
                pontos ao lado da transação. Clique em excluir.
              </p>
              <p>Atenção: essa ação é permanente e não poderá ser desfeita.</p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>Como editar uma transação</AccordionTrigger>
            <AccordionContent className="flex flex-col gap-4 text-balance">
              <p>Caso precise corrigir alguma informação:</p>
              <p>
                Localize a transação desejada na lista. Clique nos três pontos e
                editar. Altere os campos necessários (título, valor, categoria
                ou data) Clique em “Salvar alterações”.
              </p>
              <p>As mudanças serão atualizadas imediatamente na lista.</p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

      <section className="w-full flex flex-col items-center gap-2">
        <h2 className="text-md font-semibold">Ainda precisa de ajuda?</h2>
        <p className="text-sm">Entre em contato com nosso suporte.</p>
        <Button>Contatar suporte</Button>
      </section>
    </div>
  );
}
