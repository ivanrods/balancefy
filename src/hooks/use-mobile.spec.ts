import { act, renderHook } from "@testing-library/react";
import { useIsMobile } from "./use-mobile";

let matchMediaListener: ((e: MediaQueryListEvent) => void) | null = null;

function createMatchMedia(matches: boolean) {
  return (query: string) => ({
    matches,
    media: query,
    onchange: null,
    addEventListener: (_event: string, listener: (e: MediaQueryListEvent) => void) => {
      matchMediaListener = listener;
    },
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
    addListener: jest.fn(),
    removeListener: jest.fn(),
  });
}

beforeEach(() => {
  matchMediaListener = null;
});

describe("useIsMobile", () => {
  it("retorna false quando a largura é >= 768", () => {
    window.innerWidth = 1024;
    window.matchMedia = createMatchMedia(false) as typeof window.matchMedia;

    const { result } = renderHook(() => useIsMobile());

    expect(result.current).toBe(false);
  });

  it("retorna true quando a largura é < 768", () => {
    window.innerWidth = 375;
    window.matchMedia = createMatchMedia(true) as unknown as typeof window.matchMedia;

    const { result } = renderHook(() => useIsMobile());

    expect(result.current).toBe(true);
  });

  it("atualiza quando a viewport muda de >= 768 para < 768", () => {
    window.innerWidth = 1024;
    window.matchMedia = createMatchMedia(false) as unknown as typeof window.matchMedia;

    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(false);

    window.innerWidth = 500;

    act(() => {
      matchMediaListener?.({ matches: true } as MediaQueryListEvent);
    });

    expect(result.current).toBe(true);
  });

  it("atualiza quando a viewport muda de < 768 para >= 768", () => {
    window.innerWidth = 500;
    window.matchMedia = createMatchMedia(true) as unknown as typeof window.matchMedia;

    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(true);

    window.innerWidth = 1024;

    act(() => {
      matchMediaListener?.({ matches: false } as MediaQueryListEvent);
    });

    expect(result.current).toBe(false);
  });

  it("remove o event listener no unmount", () => {
    const removeEventListener = jest.fn();
    window.matchMedia = ((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: jest.fn(),
      removeEventListener,
      dispatchEvent: jest.fn(),
      addListener: jest.fn(),
      removeListener: jest.fn(),
    })) as unknown as typeof window.matchMedia;

    const { unmount } = renderHook(() => useIsMobile());
    unmount();

    expect(removeEventListener).toHaveBeenCalledWith("change", expect.any(Function));
  });
});
