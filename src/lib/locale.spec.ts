/**
 * @jest-environment node
 */

const mockCookieGet = jest.fn();

jest.mock("next/headers", () => ({
  cookies: jest.fn(() => Promise.resolve({ get: mockCookieGet })),
}));

const mockGetTranslations = jest.fn();

jest.mock("@/i18n", () => ({
  getTranslations: (...args: unknown[]) => mockGetTranslations(...args),
}));

import { getServerLocale, getServerTranslations } from "./locale";

beforeEach(() => {
  jest.clearAllMocks();
});

describe("getServerLocale", () => {
  it("retorna o valor do cookie quando é pt-BR", async () => {
    mockCookieGet.mockReturnValue({ value: "pt-BR" });

    const locale = await getServerLocale();

    expect(locale).toBe("pt-BR");
  });

  it("retorna o valor do cookie quando é en", async () => {
    mockCookieGet.mockReturnValue({ value: "en" });

    const locale = await getServerLocale();

    expect(locale).toBe("en");
  });

  it("retorna pt-BR quando o cookie tem valor inválido", async () => {
    mockCookieGet.mockReturnValue({ value: "fr" });

    const locale = await getServerLocale();

    expect(locale).toBe("pt-BR");
  });

  it("retorna pt-BR quando o cookie não existe", async () => {
    mockCookieGet.mockReturnValue(undefined);

    const locale = await getServerLocale();

    expect(locale).toBe("pt-BR");
  });
});

describe("getServerTranslations", () => {
  it("chama getTranslations com o locale do cookie", async () => {
    mockCookieGet.mockReturnValue({ value: "en" });

    await getServerTranslations();

    expect(mockGetTranslations).toHaveBeenCalledWith("en");
  });

  it("chama getTranslations com pt-BR quando não há cookie", async () => {
    mockCookieGet.mockReturnValue(undefined);

    await getServerTranslations();

    expect(mockGetTranslations).toHaveBeenCalledWith("pt-BR");
  });
});
