"use client";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useTranslation } from "@/hooks/use-translation";

type Tipo = "income" | "expense";

type RadioGroupDemoProps = {
  value: Tipo;
  onValueChange: (val: Tipo) => void;
};

export function RadioGroupSelect({
  value,
  onValueChange,
}: RadioGroupDemoProps) {
  const { t } = useTranslation();
  return (
    <RadioGroup defaultValue="" value={value} onValueChange={onValueChange}>
      <Label htmlFor="date">Tipo</Label>
      <div className="flex gap-4">
        <div className="flex items-center gap-3">
          <RadioGroupItem value="income" id="r1" />
          <Label htmlFor="r1">{t("transaction.income")}</Label>
        </div>
        <div className="flex items-center gap-3">
          <RadioGroupItem value="expense" id="r2" />
          <Label htmlFor="r2">{t("transaction.expense")}</Label>
        </div>
      </div>
    </RadioGroup>
  );
}
