export type Transaction = {
  id: string;
  descricao: string;
  categoria: "Alimentação" | "Transporte" | "Moradia" | "Lazer" | "Outros";
  valor: number;
  tipo: "entrada" | "saida";
  data: string;
};
