export const DATABASE_UNAVAILABLE_MESSAGE =
  "Não foi possível conectar ao banco de dados. Verifique se o serviço está ativo e tente novamente.";

export function isDatabaseUnavailableError(error: unknown) {
  if (!(error instanceof Error)) return false;

  const errorCode = (error as Error & { code?: string }).code;
  return (
    error.name === "PrismaClientInitializationError" ||
    ["P1001", "P1002", "P1017"].includes(errorCode ?? "")
  );
}
