import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

type Tipo = "income" | "expense";

type RadioGroupDemoProps = {
  value: Tipo;
  onValueChange: (val: Tipo) => void;
};

export function RadioGroupSelect({
  value,
  onValueChange,
}: RadioGroupDemoProps) {
  return (
    <RadioGroup defaultValue="" value={value} onValueChange={onValueChange}>
      <Label htmlFor="date">Tipo</Label>
      <div className="flex gap-4">
        <div className="flex items-center gap-3">
          <RadioGroupItem value="income" id="r1" />
          <Label htmlFor="r1">Entrada</Label>
        </div>
        <div className="flex items-center gap-3">
          <RadioGroupItem value="expense" id="r2" />
          <Label htmlFor="r2">Saída</Label>
        </div>
      </div>
    </RadioGroup>
  );
}
