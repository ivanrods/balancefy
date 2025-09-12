import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@radix-ui/react-accordion";

export default function helpPage() {
  return (
    <div className="flex justify-center items-center flex-col">
      <section className="space-y-4 mt-6">
        <Accordion type="single" collapsible>
          <AccordionItem value="faq1">
            <AccordionTrigger>Como criar uma transação?</AccordionTrigger>
            <AccordionContent>
              Vá até a página Transações e clique em Nova Transação...
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="faq2">
            <AccordionTrigger>Como gerar relatórios?</AccordionTrigger>
            <AccordionContent>
              Vá até a página Relatórios e selecione o período desejado...
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-semibold">Ainda precisa de ajuda?</h2>
        <p className="text-muted-foreground">
          Entre em contato com nosso suporte.
        </p>
        <Button>Contatar suporte</Button>
      </section>
    </div>
  );
}
