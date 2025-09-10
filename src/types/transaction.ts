export type Transaction = {
  id: string;
  descricao: string;
  categoria: "Alimentacao" | "Transporte" | "Moradia" | "Lazer" | "Outros";
  valor: number;
  tipo: "entrada" | "saida";
  data: string;
};
