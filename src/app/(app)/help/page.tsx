import { Button } from "@/components/ui/button";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { getServerTranslations } from "@/lib/locale";

export async function generateMetadata() {
  const t = await getServerTranslations();
  return {
    title: t("meta.help.title"),
    description: t("meta.help.description"),
  };
}

export default async function helpPage() {
  const t = await getServerTranslations();

  return (
    <div className="h-full flex justify-center mx-auto flex-col gap-4 w-full md:w-md lg:w-lg xl:w-xl">
      <section className="space-y-4 mt-6 w-full">
        <Accordion type="single" collapsible className="w-full" defaultValue="item-1">
          <AccordionItem value="item-1" className="border-b pb-2 ">
            <AccordionTrigger>{t("help.howToAddTransaction")}</AccordionTrigger>
            <AccordionContent className="flex flex-col gap-4 text-balance">
              <p>{t("help.howToAddTransactionP1")}</p>
              <p>{t("help.howToAddTransactionP2")}</p>
              <p>{t("help.howToAddTransactionP3")}</p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>{t("help.howToDeleteTransaction")}</AccordionTrigger>
            <AccordionContent className="flex flex-col gap-4 text-balance">
              <p>{t("help.howToDeleteTransactionP1")}</p>
              <p>{t("help.howToDeleteTransactionP2")}</p>
              <p>{t("help.howToDeleteTransactionP3")}</p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>{t("help.howToEditTransaction")}</AccordionTrigger>
            <AccordionContent className="flex flex-col gap-4 text-balance">
              <p>{t("help.howToEditTransactionP1")}</p>
              <p>{t("help.howToEditTransactionP2")}</p>
              <p>{t("help.howToEditTransactionP3")}</p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-4" className="border-b pb-2 ">
            <AccordionTrigger>{t("help.howToAddWallet")}</AccordionTrigger>
            <AccordionContent className="flex flex-col gap-4 text-balance">
              <p>{t("help.howToAddWalletP1")}</p>
              <p>{t("help.howToAddWalletP2")}</p>
              <p>{t("help.howToAddWalletP3")}</p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-5" className="border-b pb-2 ">
            <AccordionTrigger>{t("help.howToAddCategory")}</AccordionTrigger>
            <AccordionContent className="flex flex-col gap-4 text-balance">
              <p>{t("help.howToAddCategoryP1")}</p>
              <p>{t("help.howToAddCategoryP2")}</p>
              <p>{t("help.howToAddCategoryP3")}</p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

      <section className="w-full flex flex-col items-center gap-2">
        <h2 className="text-md font-semibold">{t("help.stillNeedHelp")}</h2>
        <p className="text-sm">{t("help.contactSupport")}</p>
        <Button asChild>
          <a href="mailto:contaivanrodrigues@gmail.com">{t("help.supportButton")}</a>
        </Button>
      </section>
    </div>
  );
}
