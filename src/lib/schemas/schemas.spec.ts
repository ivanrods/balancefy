import { transactionSchema } from "@/lib/schemas/transaction-schema";
import { categoriesSchema } from "@/lib/schemas/categories-schema";
import { walletSchema } from "@/lib/schemas/wallet-schema";
import { loginSchema, registerSchema } from "@/lib/schemas/auth-schema";
import { updateUserSchema } from "@/lib/schemas/update-user-schema";

describe("transactionSchema", () => {
  const valid = {
    description: "Compra mercado",
    value: 100,
    categoryId: "cat-1",
    walletId: "wallet-1",
    type: "expense" as const,
    date: new Date("2024-06-15"),
  };

  it("aceita dados válidos", () => {
    expect(transactionSchema.parse(valid)).toEqual(valid);
  });

  it("rejeita description com menos de 3 caracteres", () => {
    expect(() => transactionSchema.parse({ ...valid, description: "ab" })).toThrow();
    expect(() => transactionSchema.parse({ ...valid, description: "   " })).toThrow();
  });

  it("aceita description com exatamente 100 caracteres", () => {
    const long = "a".repeat(100);
    expect(transactionSchema.parse({ ...valid, description: long }).description).toBe(long);
  });

  it("rejeita value zero ou negativo", () => {
    expect(() => transactionSchema.parse({ ...valid, value: 0 })).toThrow();
    expect(() => transactionSchema.parse({ ...valid, value: -1 })).toThrow();
  });

  it("rejeita type inválido", () => {
    expect(() => transactionSchema.parse({ ...valid, type: "invalid" })).toThrow();
  });

  it("rejeita date como string", () => {
    expect(() => transactionSchema.parse({ ...valid, date: "2024-06-15" })).toThrow();
  });
});

describe("categoriesSchema", () => {
  it("aceita dados válidos", () => {
    expect(categoriesSchema.parse({ name: "Alimentação", color: "#ff0000" })).toEqual({
      name: "Alimentação",
      color: "#ff0000",
    });
  });

  it("rejeita name com menos de 3 caracteres", () => {
    expect(() => categoriesSchema.parse({ name: "ab", color: "#000" })).toThrow();
  });

  it("rejeita color vazio", () => {
    expect(() => categoriesSchema.parse({ name: "Teste", color: "" })).toThrow();
  });
});

describe("walletSchema", () => {
  it("aceita dados válidos", () => {
    expect(walletSchema.parse({ name: "Minha Carteira" })).toEqual({ name: "Minha Carteira" });
  });

  it("rejeita name com menos de 3 caracteres", () => {
    expect(() => walletSchema.parse({ name: "ab" })).toThrow();
  });

  it("rejeita name com mais de 100 caracteres", () => {
    expect(() => walletSchema.parse({ name: "a".repeat(101) })).toThrow();
  });
});

describe("loginSchema", () => {
  it("aceita email e password válidos", () => {
    expect(loginSchema.parse({ email: "user@test.com", password: "123456" })).toEqual({
      email: "user@test.com",
      password: "123456",
    });
  });

  it("rejeita email inválido", () => {
    expect(() => loginSchema.parse({ email: "invalido", password: "123456" })).toThrow();
  });

  it("rejeita password com menos de 6 caracteres", () => {
    expect(() => loginSchema.parse({ email: "a@b.com", password: "12345" })).toThrow();
  });
});

describe("registerSchema", () => {
  it("aceita dados válidos", () => {
    expect(
      registerSchema.parse({ name: "João", email: "joao@test.com", password: "123456" }),
    ).toEqual({
      name: "João",
      email: "joao@test.com",
      password: "123456",
    });
  });

  it("rejeita name com 1 caractere", () => {
    expect(() =>
      registerSchema.parse({ name: "J", email: "a@b.com", password: "123456" }),
    ).toThrow();
  });
});

describe("updateUserSchema", () => {
  it("aceita apenas name e email (sem password e image)", () => {
    expect(updateUserSchema.parse({ name: "João", email: "joao@test.com" })).toEqual({
      name: "João",
      email: "joao@test.com",
    });
  });

  it("aceita password com 6+ caracteres ou vazio", () => {
    expect(
      updateUserSchema.parse({ name: "João", email: "a@b.com", password: "123456" }).password,
    ).toBe("123456");
    expect(updateUserSchema.parse({ name: "João", email: "a@b.com", password: "" }).password).toBe(
      "",
    );
  });

  it("rejeita password com 5 caracteres", () => {
    expect(() =>
      updateUserSchema.parse({ name: "João", email: "a@b.com", password: "12345" }),
    ).toThrow();
  });

  it("aceita image como null ou string", () => {
    expect(
      updateUserSchema.parse({ name: "João", email: "a@b.com", image: null }).image,
    ).toBeNull();
    expect(updateUserSchema.parse({ name: "João", email: "a@b.com", image: "url" }).image).toBe(
      "url",
    );
  });
});
