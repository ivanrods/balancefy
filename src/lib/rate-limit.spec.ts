/**
 * @jest-environment node
 */

import { checkRateLimit, resetRateLimit } from "./rate-limit";

describe("checkRateLimit", () => {
  const limit = 2;
  const windowMs = 1_000;
  const key = "test-key";

  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(0);
    resetRateLimit(key);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("permite requisições até atingir o limite", () => {
    expect(checkRateLimit(key, limit, windowMs)).toEqual({
      allowed: true,
      remaining: 1,
      resetAt: windowMs,
    });

    expect(checkRateLimit(key, limit, windowMs)).toEqual({
      allowed: true,
      remaining: 0,
      resetAt: windowMs,
    });

    expect(checkRateLimit(key, limit, windowMs)).toEqual({
      allowed: false,
      remaining: 0,
      resetAt: windowMs,
    });
  });

  it("permite uma nova requisição depois que a janela expira", () => {
    checkRateLimit(key, limit, windowMs);

    jest.advanceTimersByTime(windowMs + 1);

    expect(checkRateLimit(key, limit, windowMs)).toEqual({
      allowed: true,
      remaining: 1,
      resetAt: windowMs * 2 + 1,
    });
  });

  it("mantém limites separados para chaves diferentes", () => {
    checkRateLimit(key, limit, windowMs);

    expect(checkRateLimit("other-key", limit, windowMs)).toEqual({
      allowed: true,
      remaining: 1,
      resetAt: windowMs,
    });
  });

  it("remove o limite quando resetRateLimit é chamado", () => {
    checkRateLimit(key, limit, windowMs);
    checkRateLimit(key, limit, windowMs);

    resetRateLimit(key);

    expect(checkRateLimit(key, limit, windowMs)).toEqual({
      allowed: true,
      remaining: 1,
      resetAt: windowMs,
    });
  });
});
