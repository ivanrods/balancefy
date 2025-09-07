import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

type Tipo = "entrada" | "saida";

type RadioGroupDemoProps = {
  value: Tipo;
  onValueChange: (val: Tipo) => void;
};

export function RadioGroupDemo({ value, onValueChange }: RadioGroupDemoProps) {
  return (
    <RadioGroup defaultValue="" value={value} onValueChange={onValueChange}>
      <Label htmlFor="date">Tipo</Label>
      <div className="flex items-center gap-3">
        <RadioGroupItem value="entrada" id="r1" />
        <Label htmlFor="r1">Entrada</Label>
      </div>
      <div className="flex items-center gap-3">
        <RadioGroupItem value="saida" id="r2" />
        <Label htmlFor="r2">Saída</Label>
      </div>
    </RadioGroup>
  );
}
