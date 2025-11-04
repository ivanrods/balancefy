import { z } from "zod";

export const updateUserSchema = z.object({
  name: z.string().trim().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("E-mail inválido"),
  password: z
    .string()
    .min(6, "A senha deve ter no mínimo 6 caracteres")
    .optional()
    .or(z.literal("")),
  image: z.string().nullable().optional(),
});
export type UpdateFormData = z.infer<typeof updateUserSchema>;
