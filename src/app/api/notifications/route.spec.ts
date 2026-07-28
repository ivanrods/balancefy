import { GET } from "@/app/api/notifications/route";
import { PATCH as PATCH_BY_ID } from "@/app/api/notifications/[id]/route";
import { PATCH as PATCH_READ_ALL } from "@/app/api/notifications/read-all/route";

jest.mock("next/server", () => ({
  NextResponse: {
    json: jest.fn((body, init) => ({
      status: init?.status ?? 200,
      json: () => Promise.resolve(body),
    })),
  },
}));

jest.mock("next-auth/next", () => ({
  getServerSession: jest.fn(),
}));

jest.mock("@/lib/services/notification-service", () => ({
  getNotifications: jest.fn(),
}));

jest.mock("@/lib/prisma", () => ({
  prisma: {
    notification: { findUnique: jest.fn(), update: jest.fn(), updateMany: jest.fn() },
    user: { findUnique: jest.fn() },
  },
}));

import { getServerSession } from "next-auth/next";
import { getNotifications } from "@/lib/services/notification-service";
import { prisma } from "@/lib/prisma";

const mockSession = jest.mocked(getServerSession);
const mockGetNotifications = jest.mocked(getNotifications);
const mockFindUnique = prisma.notification.findUnique as jest.Mock;
const mockUpdate = prisma.notification.update as jest.Mock;
const mockUpdateMany = prisma.notification.updateMany as jest.Mock;
const mockUserFindUnique = prisma.user.findUnique as jest.Mock;

beforeEach(() => jest.clearAllMocks());

describe("GET /api/notifications", () => {
  it("retorna 401 sem sessão", async () => {
    mockSession.mockResolvedValue(null);
    const res = await GET();
    expect(res.status).toBe(401);
  });

  it("retorna lista de notificações", async () => {
    mockSession.mockResolvedValue({ user: { email: "a@b.com", id: "u1" } });
    mockGetNotifications.mockResolvedValue([
      {
        id: "n1",
        message: "teste",
        read: false,
        transaction: null,
        userId: "u1",
        transactionId: null,
        createdAt: new Date(),
      },
    ]);
    const res = await GET();
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toHaveLength(1);
    expect(body[0].message).toBe("teste");
  });
});

describe("PATCH /api/notifications/[id]", () => {
  const ctx = { params: Promise.resolve({ id: "n1" }) };

  it("retorna 401 sem sessão", async () => {
    mockSession.mockResolvedValue(null);
    const res = await PATCH_BY_ID({} as Request, ctx);
    expect(res.status).toBe(401);
  });

  it("retorna 404 se notificação não existe", async () => {
    mockSession.mockResolvedValue({ user: { email: "a@b.com" } });
    mockFindUnique.mockResolvedValue(null);
    const res = await PATCH_BY_ID({} as Request, ctx);
    expect(res.status).toBe(404);
  });

  it("retorna 403 se não é dono da notificação", async () => {
    mockSession.mockResolvedValue({ user: { email: "a@b.com" } });
    mockFindUnique.mockResolvedValue({ user: { email: "outro@email.com" } });
    const res = await PATCH_BY_ID({} as Request, ctx);
    expect(res.status).toBe(403);
  });

  it("marca notificação como lida", async () => {
    mockSession.mockResolvedValue({ user: { email: "a@b.com" } });
    mockFindUnique.mockResolvedValue({ user: { email: "a@b.com" } });
    mockUpdate.mockResolvedValue({ id: "n1", read: true });
    const res = await PATCH_BY_ID({} as Request, ctx);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.read).toBe(true);
  });
});

describe("PATCH /api/notifications/read-all", () => {
  it("retorna 401 sem sessão", async () => {
    mockSession.mockResolvedValue(null);
    const res = await PATCH_READ_ALL();
    expect(res.status).toBe(401);
  });

  it("retorna 404 se usuário não encontrado", async () => {
    mockSession.mockResolvedValue({ user: { email: "a@b.com" } });
    mockUserFindUnique.mockResolvedValue(null);
    const res = await PATCH_READ_ALL();
    expect(res.status).toBe(404);
  });

  it("marca todas como lidas", async () => {
    mockSession.mockResolvedValue({ user: { email: "a@b.com" } });
    mockUserFindUnique.mockResolvedValue({ id: "u1" });
    mockUpdateMany.mockResolvedValue({ count: 3 });
    const res = await PATCH_READ_ALL();
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.message).toContain("read");
  });
});
