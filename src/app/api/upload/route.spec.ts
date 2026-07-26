/**
 * @jest-environment node
 */

import { POST } from "./route";

jest.mock("cloudinary", () => ({
  v2: {
    config: jest.fn(),
    uploader: {
      upload: jest.fn(),
    },
  },
}));

import { v2 as cloudinary } from "cloudinary";
const mockUpload = cloudinary.uploader.upload as jest.Mock;

function createRequest(file: File | null) {
  const formData = new FormData();
  if (file) formData.append("file", file);
  const req = new Request("http://localhost:3000/api/upload", { method: "POST" });
  jest.spyOn(req, "formData").mockResolvedValue(formData);
  return req;
}

beforeEach(() => {
  jest.clearAllMocks();
});

describe("POST /api/upload", () => {
  it("retorna 400 quando nenhum arquivo é enviado", async () => {
    const req = createRequest(null);
    const res = await POST(req);

    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body).toEqual({ error: "Nenhum arquivo enviado" });
  });

  it("retorna 200 e a url quando o upload é bem-sucedido", async () => {
    const fakeUrl = "https://res.cloudinary.com/.../image.jpg";
    mockUpload.mockResolvedValue({ secure_url: fakeUrl });

    const file = new File(["fake-content"], "avatar.jpg", { type: "image/jpeg" });
    const req = createRequest(file);
    const res = await POST(req);

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toEqual({ url: fakeUrl });

    expect(mockUpload).toHaveBeenCalledTimes(1);
    const [base64String, options] = mockUpload.mock.calls[0];
    expect(base64String).toMatch(/^data:image\/jpeg;base64,/);
    expect(options).toEqual({ folder: "user-profiles" });
  });

  it("retorna 500 quando o cloudinary lança erro", async () => {
    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    mockUpload.mockRejectedValue(new Error("Upload failed"));

    const file = new File(["fake-content"], "avatar.jpg", { type: "image/jpeg" });
    const req = createRequest(file);
    const res = await POST(req);

    expect(res.status).toBe(500);
    const body = await res.json();
    expect(body).toEqual({ error: "Erro no upload" });
    expect(consoleSpy).toHaveBeenCalledWith("Erro no upload:", expect.any(Error));
    consoleSpy.mockRestore();
  });
});
