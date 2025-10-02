import { z } from "zod";
export const walletSchema = z.object({
  name: z
    .string()
    .min(3, "O nome da carteira deve ter pelo menos 3 caracteres")
    .max(100, "O nome da carteira pode ter no máximo 100 caracteres"),
});
export type CategoriesFormData = z.infer<typeof walletSchema>;
