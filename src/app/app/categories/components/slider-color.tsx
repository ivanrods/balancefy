import { Slider } from "@/components/ui/slider";

const colors = [
  "#cccccc", // Cinza claro
  "#b3b3b3",
  "#999999",
  "#808080",
  "#666666",
  "#4d4d4d",
  "#333333",
  "#ff9999", // Vermelho bem claro (rosado)
  "#ff6666",
  "#ff3333",
  "#ff0000", // Vermelho puro
  "#cc0000",
  "#990000",
  "#660000",
  "#330000", // Quase preto com tom vermelho
];

// Componente do Slider
export function SliderColor({
  value,
  onValueChange,
}: {
  value: string;
  onValueChange: (color: string) => void;
}) {
  const index = colors.indexOf(value);

  return (
    <Slider
      value={[index >= 0 ? index : 0]}
      max={colors.length - 1}
      step={1}
      onValueChange={([val]) => onValueChange(colors[val])}
    />
  );
}
