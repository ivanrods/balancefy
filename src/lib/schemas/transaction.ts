import { z } from "zod";

export const transactionSchema = z.object({
  descricao: z
    .string()
    .min(3, "A descrição deve ter pelo menos 3 caracteres")
    .max(100, "A descrição pode ter no máximo 100 caracteres"),

  valor: z
    .number("Informe um valor válido")
    .positive("O valor deve ser maior que zero"),

  categoria: z.enum(
    ["Alimentacao", "Transporte", "Lazer", "Moradia", "Outros"],
    {
      message: "Selecione uma categoria válida",
    }
  ),

  tipo: z.enum(["entrada", "saida"], { message: "Selecione um tipo válido" }),

  data: z.date("Selecione uma data válida"),
});

export type TransactionFormData = z.infer<typeof transactionSchema>;
