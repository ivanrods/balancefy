/**
 * @jest-environment node
 */

import bcrypt from "bcryptjs";

const mockFindUnique = jest.fn();
const mockWalletCreate = jest.fn();
const mockCategoryCreateMany = jest.fn();

jest.mock("@/lib/prisma", () => ({
  prisma: {
    user: { findUnique: (...args: unknown[]) => mockFindUnique(...args) },
    wallet: { create: (...args: unknown[]) => mockWalletCreate(...args) },
    category: { createMany: (...args: unknown[]) => mockCategoryCreateMany(...args) },
  },
}));

jest.mock("bcryptjs", () => ({
  compare: jest.fn(),
}));

jest.mock("next-auth/providers/google", () =>
  jest.fn(() => ({ id: "google", name: "Google" })),
);

jest.mock("@next-auth/prisma-adapter", () => ({
  PrismaAdapter: jest.fn(() => ({ adapter: true })),
}));

import { authOptions } from "./auth-options";

const mockedBcryptCompare = jest.mocked(bcrypt.compare);
const credentialsProvider = authOptions.providers[1] as { options: { authorize: (credentials: { email?: string; password?: string }) => Promise<unknown> } };
const authorize = credentialsProvider.options.authorize;

beforeEach(() => {
  jest.clearAllMocks();
});

describe("authOptions", () => {
  it("usa estratégia JWT", () => {
    expect(authOptions.session?.strategy).toBe("jwt");
  });

  it("usa PrismaAdapter", () => {
    expect(authOptions.adapter).toEqual({ adapter: true });
  });

  it("possui Google e Credentials providers", () => {
    const ids = authOptions.providers.map((p) => p.id);
    expect(ids).toContain("google");
    expect(ids).toContain("credentials");
  });
});

describe("CredentialsProvider authorize", () => {
  it("retorna null quando credenciais estão ausentes", async () => {
    const result = await authorize({} as { email?: string; password?: string });
    expect(result).toBeNull();
  });

  it("lança erro quando usuário não é encontrado", async () => {
    mockFindUnique.mockResolvedValue(null);

    await expect(
      authorize({ email: "x@y.com", password: "123" }),
    ).rejects.toThrow("E-mail não encontrado");
  });

  it("lança erro quando usuário não tem password", async () => {
    mockFindUnique.mockResolvedValue({ id: "u1", password: null });

    await expect(
      authorize({ email: "x@y.com", password: "123" }),
    ).rejects.toThrow("E-mail não encontrado");
  });

  it("lança erro quando senha não confere", async () => {
    mockFindUnique.mockResolvedValue({
      id: "u1",
      email: "x@y.com",
      password: "$2a$10$hashed",
    });
    mockedBcryptCompare.mockResolvedValue(false as never);

    await expect(
      authorize({ email: "x@y.com", password: "wrong" }),
    ).rejects.toThrow("E-mail ou Senha incorreta");
  });

  it("retorna usuário quando credenciais são válidas", async () => {
    const dbUser = {
      id: "u1",
      name: "John",
      email: "john@test.com",
      image: "https://example.com/avatar.jpg",
      password: "$2a$10$hashed",
    };
    mockFindUnique.mockResolvedValue(dbUser);
    mockedBcryptCompare.mockResolvedValue(true as never);

    const result = await authorize({ email: "john@test.com", password: "correct" });

    expect(result).toEqual({
      id: "u1",
      name: "John",
      email: "john@test.com",
      image: "https://example.com/avatar.jpg",
    });
  });
});

describe("jwt callback", () => {
  const jwtCallback = authOptions.callbacks!.jwt!;

  it("enriquece o token com dados do banco ao logar", async () => {
    const dbUser = {
      id: "u1",
      name: "John Doe",
      email: "john@test.com",
      image: "https://example.com/pic.jpg",
    };
    mockFindUnique.mockResolvedValue(dbUser);

    const token = await jwtCallback({
      token: { email: "john@test.com" },
      user: { id: "u1", email: "john@test.com" },
      trigger: "signIn",
      session: undefined as unknown as never,
      account: undefined as unknown as never,
      profile: undefined as unknown as never,
      isNewUser: undefined as unknown as never,
    });

    expect(token).toMatchObject({
      id: "u1",
      name: "John Doe",
      email: "john@test.com",
      picture: "https://example.com/pic.jpg",
    });
  });

  it("atualiza token quando trigger é update", async () => {
    const dbUser = {
      id: "u1",
      name: "Updated Name",
      email: "john@test.com",
      image: "https://example.com/new.jpg",
    };
    mockFindUnique.mockResolvedValue(dbUser);

    const token = await jwtCallback({
      token: { email: "john@test.com", name: "Old Name", id: "u1" } as never,
      trigger: "update",
      user: undefined as unknown as never,
      session: undefined as unknown as never,
      account: undefined as unknown as never,
      profile: undefined as unknown as never,
      isNewUser: undefined as unknown as never,
    });

    expect(token).toMatchObject({
      id: "u1",
      name: "Updated Name",
      picture: "https://example.com/new.jpg",
    });
  });

  it("retorna token inalterado se não houver email nem user", async () => {
    const token = await jwtCallback({
      token: { name: "Ghost" },
      trigger: "signIn",
      user: undefined as unknown as never,
      session: undefined as unknown as never,
      account: undefined as unknown as never,
      profile: undefined as unknown as never,
      isNewUser: undefined as unknown as never,
    });

    expect(token).toEqual({ name: "Ghost" });
    expect(mockFindUnique).not.toHaveBeenCalled();
  });
});

describe("session callback", () => {
  const sessionCallback = authOptions.callbacks!.session!;

  it("preenche session.user com dados do token", async () => {
    const session = await sessionCallback({
      session: {
        user: { id: "", name: "", email: "", image: "" },
        expires: "2025-01-01",
      },
      token: {
        id: "u1",
        name: "John",
        email: "john@test.com",
        picture: "https://example.com/pic.jpg",
        sub: "u1",
        iat: 0,
        exp: 0,
        jti: "",
      },
      user: undefined,
      newSession: undefined,
      trigger: undefined,
    } as never);

    expect(session.user).toMatchObject({
      id: "u1",
      name: "John",
      email: "john@test.com",
      image: "https://example.com/pic.jpg",
    });
  });
});

describe("createUser event", () => {
  const createUser = authOptions.events!.createUser!;

  it("cria carteira padrão e categorias para novo usuário", async () => {
    await createUser({ user: { id: "u1" } });

    expect(mockWalletCreate).toHaveBeenCalledWith({
      data: { name: "Carteira Padrão", userId: "u1" },
    });

    expect(mockCategoryCreateMany).toHaveBeenCalledWith({
      data: expect.arrayContaining([
        expect.objectContaining({ name: "Alimentação", userId: "u1" }),
        expect.objectContaining({ name: "Transporte", userId: "u1" }),
        expect.objectContaining({ name: "Moradia", userId: "u1" }),
        expect.objectContaining({ name: "Lazer", userId: "u1" }),
        expect.objectContaining({ name: "Outros", userId: "u1" }),
      ]),
    });
  });

  it("não cria nada se usuário não tem ID", async () => {
    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    await createUser({ user: {} as never });

    expect(mockWalletCreate).not.toHaveBeenCalled();
    expect(mockCategoryCreateMany).not.toHaveBeenCalled();
    expect(consoleSpy).toHaveBeenCalledWith(
      "Usuário sem ID, não é possível criar categorias e carteira",
    );
    consoleSpy.mockRestore();
  });
});
