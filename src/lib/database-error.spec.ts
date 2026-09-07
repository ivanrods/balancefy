import { DATABASE_UNAVAILABLE_MESSAGE, isDatabaseUnavailableError } from "./database-error";

describe("isDatabaseUnavailableError", () => {
  it("identifica erro de inicialização do Prisma pelo nome", () => {
    const error = new Error("database unavailable");
    error.name = "PrismaClientInitializationError";

    expect(isDatabaseUnavailableError(error)).toBe(true);
  });

  it.each(["P1001", "P1002", "P1017"])("identifica o código Prisma %s", (code) => {
    const error = Object.assign(new Error("database unavailable"), { code });

    expect(isDatabaseUnavailableError(error)).toBe(true);
  });

  it("retorna false para erro com código desconhecido", () => {
    const error = Object.assign(new Error("database error"), { code: "P2002" });

    expect(isDatabaseUnavailableError(error)).toBe(false);
  });

  it.each([null, undefined, "error", { code: "P1001" }])(
    "retorna false para valores que não são Error: %p",
    (value) => {
      expect(isDatabaseUnavailableError(value)).toBe(false);
    },
  );
});

it("expõe a mensagem de indisponibilidade do banco", () => {
  expect(DATABASE_UNAVAILABLE_MESSAGE).toBe(
    "Não foi possível conectar ao banco de dados. Verifique se o serviço está ativo e tente novamente.",
  );
});
