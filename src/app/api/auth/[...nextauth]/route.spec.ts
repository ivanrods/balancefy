jest.mock("next-auth", () => ({
  __esModule: true,
  default: jest.fn(() => jest.fn()),
}));

jest.mock("@/lib/auth-options", () => ({
  authOptions: { providers: [], session: { strategy: "jwt" } },
}));

import NextAuth from "next-auth";
import { GET, POST } from "./route";

describe("auth/[...nextauth]/route", () => {
  it("exporta GET como function", () => {
    expect(typeof GET).toBe("function");
  });

  it("exporta POST como function", () => {
    expect(typeof POST).toBe("function");
  });

  it("GET e POST sao a mesma referencia", () => {
    expect(GET).toBe(POST);
  });

  it("chama NextAuth com authOptions", () => {
    expect(NextAuth).toHaveBeenCalledWith({
      providers: [],
      session: { strategy: "jwt" },
    });
  });
});
