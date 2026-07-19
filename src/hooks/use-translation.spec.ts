import { renderHook } from "@testing-library/react";
import { useTranslation } from "./use-translation";
import { useLocale } from "@/context/locale-context";
import { getTranslations } from "@/i18n";

jest.mock("@/context/locale-context");
jest.mock("@/i18n");

const mockedUseLocale = jest.mocked(useLocale);
const mockedGetTranslations = jest.mocked(getTranslations);

beforeEach(() => {
  jest.resetAllMocks();

  mockedUseLocale.mockReturnValue({
    locale: "pt-BR",
    setLocale: jest.fn(),
  });

  mockedGetTranslations.mockImplementation((locale: string) => {
    const tFn = (key: string) => `translated[${locale}]:${key}`;
    return tFn;
  });
});

describe("useTranslation", () => {
  it("returns locale from useLocale", () => {
    const { result } = renderHook(() => useTranslation());
    expect(result.current.locale).toBe("pt-BR");
  });

  it("returns setLocale from useLocale", () => {
    const setLocale = jest.fn();
    mockedUseLocale.mockReturnValue({ locale: "en", setLocale });

    const { result } = renderHook(() => useTranslation());
    expect(result.current.setLocale).toBe(setLocale);
  });

  it("returns a t function that delegates to getTranslations", () => {
    const { result } = renderHook(() => useTranslation());
    expect(result.current.t("common.save")).toBe("translated[pt-BR]:common.save");
    expect(mockedGetTranslations).toHaveBeenCalledWith("pt-BR");
  });

  it("calls getTranslations with en locale", () => {
    mockedUseLocale.mockReturnValue({
      locale: "en",
      setLocale: jest.fn(),
    });

    renderHook(() => useTranslation());
    expect(mockedGetTranslations).toHaveBeenCalledWith("en");
  });

  it("memoizes t when locale does not change", () => {
    const { result, rerender } = renderHook(() => useTranslation());
    const t1 = result.current.t;

    rerender();
    expect(result.current.t).toBe(t1);
  });

  it("creates new t when locale changes", () => {
    const { result, rerender } = renderHook(() => useTranslation());

    const t1 = result.current.t;

    mockedUseLocale.mockReturnValue({
      locale: "en",
      setLocale: jest.fn(),
    });

    rerender();
    expect(result.current.t).not.toBe(t1);
  });
});
