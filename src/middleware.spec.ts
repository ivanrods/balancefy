import { getToken } from "next-auth/jwt";
import { middleware } from "./middleware";

jest.mock("next-auth/jwt", () => ({
  getToken: jest.fn(),
}));

const mockRedirect = jest.fn();
const mockNext = jest.fn();

jest.mock("next/server", () => ({
  NextResponse: {
    redirect: (...args: unknown[]) => mockRedirect(...args),
    next: (...args: unknown[]) => mockNext(...args),
  },
}));

function createRequest(pathname: string) {
  return {
    nextUrl: {
      pathname,
      href: `http://localhost:3000${pathname}`,
    },
    url: `http://localhost:3000${pathname}`,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any;
}

beforeEach(() => {
  jest.clearAllMocks();
  mockRedirect.mockReturnValue({ status: 307 });
  mockNext.mockReturnValue({ status: 200 });
});

describe("middleware", () => {
  describe("rotas estaticas", () => {
    it("passa direto em /_next/static", async () => {
      (getToken as jest.Mock).mockResolvedValue(null);
      const req = createRequest("/_next/static/chunk.js");

      await middleware(req);

      expect(mockNext).toHaveBeenCalled();
      expect(mockRedirect).not.toHaveBeenCalled();
    });

    it("passa direto em /favicon.ico", async () => {
      (getToken as jest.Mock).mockResolvedValue(null);
      const req = createRequest("/favicon.ico");

      await middleware(req);

      expect(mockNext).toHaveBeenCalled();
      expect(mockRedirect).not.toHaveBeenCalled();
    });
  });

  describe("rotas publicas", () => {
    it("passa direto em /login sem token", async () => {
      (getToken as jest.Mock).mockResolvedValue(null);
      const req = createRequest("/login");

      await middleware(req);

      expect(mockNext).toHaveBeenCalled();
      expect(mockRedirect).not.toHaveBeenCalled();
    });

    it("redireciona de /login para /dashboard quando tem token", async () => {
      (getToken as jest.Mock).mockResolvedValue({ sub: "u1" });
      const req = createRequest("/login");

      await middleware(req);

      expect(mockRedirect).toHaveBeenCalledWith(
        expect.objectContaining({
          pathname: "/dashboard",
        }),
      );
    });

    it("passa direto em /register sem token", async () => {
      (getToken as jest.Mock).mockResolvedValue(null);
      const req = createRequest("/register");

      await middleware(req);

      expect(mockNext).toHaveBeenCalled();
      expect(mockRedirect).not.toHaveBeenCalled();
    });

    it("passa direto em /register com token", async () => {
      (getToken as jest.Mock).mockResolvedValue({ sub: "u1" });
      const req = createRequest("/register");

      await middleware(req);

      expect(mockNext).toHaveBeenCalled();
      expect(mockRedirect).not.toHaveBeenCalled();
    });

    it("passa direto em /api/auth", async () => {
      (getToken as jest.Mock).mockResolvedValue(null);
      const req = createRequest("/api/auth/session");

      await middleware(req);

      expect(mockNext).toHaveBeenCalled();
      expect(mockRedirect).not.toHaveBeenCalled();
    });

    it("passa direto em /api/auth com token", async () => {
      (getToken as jest.Mock).mockResolvedValue({ sub: "u1" });
      const req = createRequest("/api/auth/session");

      await middleware(req);

      expect(mockNext).toHaveBeenCalled();
      expect(mockRedirect).not.toHaveBeenCalled();
    });
  });

  describe("rotas protegidas", () => {
    it("redireciona para /login quando nao tem token", async () => {
      (getToken as jest.Mock).mockResolvedValue(null);
      const req = createRequest("/dashboard");

      await middleware(req);

      expect(mockRedirect).toHaveBeenCalledWith(
        expect.objectContaining({
          pathname: "/login",
        }),
      );
    });

    it("passa direto em /dashboard quando tem token", async () => {
      (getToken as jest.Mock).mockResolvedValue({ sub: "u1" });
      const req = createRequest("/dashboard");

      await middleware(req);

      expect(mockNext).toHaveBeenCalled();
      expect(mockRedirect).not.toHaveBeenCalled();
    });

    it("passa direto em /wallet quando tem token", async () => {
      (getToken as jest.Mock).mockResolvedValue({ sub: "u1" });
      const req = createRequest("/wallet");

      await middleware(req);

      expect(mockNext).toHaveBeenCalled();
      expect(mockRedirect).not.toHaveBeenCalled();
    });

    it("redireciona para /login em /wallet sem token", async () => {
      (getToken as jest.Mock).mockResolvedValue(null);
      const req = createRequest("/wallet");

      await middleware(req);

      expect(mockRedirect).toHaveBeenCalledWith(
        expect.objectContaining({
          pathname: "/login",
        }),
      );
    });
  });

  describe("rota raiz", () => {
    it("redireciona de / para /dashboard quando tem token", async () => {
      (getToken as jest.Mock).mockResolvedValue({ sub: "u1" });
      const req = createRequest("/");

      await middleware(req);

      expect(mockRedirect).toHaveBeenCalledWith(
        expect.objectContaining({
          pathname: "/dashboard",
        }),
      );
    });

    it("redireciona de / para /login quando nao tem token", async () => {
      (getToken as jest.Mock).mockResolvedValue(null);
      const req = createRequest("/");

      await middleware(req);

      expect(mockRedirect).toHaveBeenCalledWith(
        expect.objectContaining({
          pathname: "/login",
        }),
      );
    });
  });
});
