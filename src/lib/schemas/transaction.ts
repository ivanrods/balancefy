import { z } from "zod";

export const transactionSchema = z.object({
  description: z
    .string()
    .min(3, "A descrição deve ter pelo menos 3 caracteres")
    .max(100, "A descrição pode ter no máximo 100 caracteres"),

  value: z
    .number("Informe um valor válido")
    .positive("O valor deve ser maior que zero"),

  categoryId: z.string().min(1, "Select a valid category"),

  type: z.enum(["income", "expense"], { message: "Select a valid type" }),

  data: z.date("Selecione uma data válida"),
});

export type TransactionFormData = z.infer<typeof transactionSchema>;
