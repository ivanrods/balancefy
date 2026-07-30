import { getToken } from "next-auth/jwt";
import { middleware } from "./middleware";

jest.mock("next-auth/jwt", () => ({
  getToken: jest.fn(),
}));

const mockRedirect = jest.fn();
const mockNext = jest.fn();
const mockJson = jest.fn();

jest.mock("next/server", () => ({
  NextResponse: {
    redirect: (...args: unknown[]) => mockRedirect(...args),
    next: (...args: unknown[]) => mockNext(...args),
    json: (...args: unknown[]) => mockJson(...args),
  },
}));

function createRequest(pathname: string) {
  return {
    nextUrl: {
      pathname,
      href: `http://localhost:3000${pathname}`,
    },
    url: `http://localhost:3000${pathname}`,
    headers: new Map([["x-forwarded-for", "127.0.0.1"]]),
    method: "GET",
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any;
}

beforeEach(() => {
  jest.clearAllMocks();
  mockRedirect.mockReturnValue({ status: 307 });
  mockNext.mockReturnValue({ status: 200 });
  mockJson.mockReturnValue({ status: 429 });
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

  describe("rate limit", () => {
  it("bloqueia login apos 5 tentativas em 15 minutos", async () => {
    (getToken as jest.Mock).mockResolvedValue(null);
    const req = createRequest("/api/auth/callback/credentials");
    req.method = "POST";

    for (let i = 0; i < 5; i++) {
      await middleware(req);
    }

    expect(mockNext).toHaveBeenCalledTimes(5);
    expect(mockJson).not.toHaveBeenCalled();

    await middleware(req);
    expect(mockJson).toHaveBeenCalledWith(
      expect.objectContaining({ error: expect.any(String) }),
      expect.objectContaining({ status: 429 }),
    );
  });

  it("bloqueia register apos 3 tentativas em 1 hora", async () => {
    (getToken as jest.Mock).mockResolvedValue(null);
    const req = createRequest("/api/register");
    req.method = "POST";

    for (let i = 0; i < 3; i++) {
      await middleware(req);
    }

    expect(mockNext).toHaveBeenCalledTimes(3);
    expect(mockJson).not.toHaveBeenCalled();

    await middleware(req);
    expect(mockJson).toHaveBeenCalledWith(
      expect.objectContaining({ error: expect.any(String) }),
      expect.objectContaining({ status: 429 }),
    );
  });

  it("nao bloqueia GET em /api/auth/callback/credentials", async () => {
    (getToken as jest.Mock).mockResolvedValue(null);
    const req = createRequest("/api/auth/callback/credentials");
    req.method = "GET";

    for (let i = 0; i < 10; i++) {
      await middleware(req);
    }

    expect(mockNext).toHaveBeenCalledTimes(10);
    expect(mockJson).not.toHaveBeenCalled();
  });

  it("nao bloqueia outras rotas /api/auth", async () => {
    (getToken as jest.Mock).mockResolvedValue(null);
    const req = createRequest("/api/auth/session");

    for (let i = 0; i < 100; i++) {
      await middleware(req);
    }

    expect(mockNext).toHaveBeenCalledTimes(100);
    expect(mockJson).not.toHaveBeenCalled();
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
