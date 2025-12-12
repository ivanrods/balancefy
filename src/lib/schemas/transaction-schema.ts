import { z } from "zod";

export const transactionSchema = z.object({
  description: z
    .string()
    .trim()
    .min(3, "A descrição deve ter pelo menos 3 caracteres")
    .max(100, "A descrição pode ter no máximo 100 caracteres"),

  value: z
    .number("Informe um valor válido")
    .positive("O valor deve ser maior que zero")
    .max(999999999, "O valor não pode ultrapassar 999.999.999,99"),

  categoryId: z.string().min(1, "Selecione uma categoria válida"),
  walletId: z.string().min(1, "Seleicione uma carteira válida"),

  type: z.enum(["income", "expense"], { message: "Select a valid type" }),

  date: z.date("Selecione uma data válida"),
});

export type TransactionFormData = z.infer<typeof transactionSchema>;
