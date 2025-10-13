import { z } from "zod";

export const updateUserSchema = z
  .object({
    name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
    email: z.string().email("E-mail inválido"),
    currentPassword: z.string().optional(),
    newPassword: z.string().optional(),
    confirmPassword: z.string().optional(),
  })
  .refine(
    (data) => {
      // Se algum campo foi preenchido, todos devem estar
      if (data.currentPassword || data.newPassword || data.confirmPassword) {
        return (
          !!data.currentPassword && !!data.newPassword && !!data.confirmPassword
        );
      }
      return true; // nenhum campo preenchido → tudo certo
    },
    {
      message: "Todos os campos de senha devem ser preenchidos",
      path: ["currentPassword"],
    }
  )
  .refine(
    (data) =>
      // Se nova senha foi preenchida, deve coincidir com confirmação
      !data.newPassword || data.newPassword === data.confirmPassword,
    {
      message: "As senhas não coincidem",
      path: ["confirmPassword"],
    }
  );
export type UpdateFormData = z.infer<typeof updateUserSchema>;
