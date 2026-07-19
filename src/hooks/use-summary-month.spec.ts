import { renderHook } from "@testing-library/react";
import { useSummaryMonth } from "./use-summary-month";
import { usePeriod } from "@/context/period-context";
import { useTranslation } from "./use-translation";
import { useTransactionsQuery } from "./use-transactions";

jest.mock("@/context/period-context");
jest.mock("./use-translation");
jest.mock("./use-transactions");

const mockedUsePeriod = jest.mocked(usePeriod);
const mockedUseTranslation = jest.mocked(useTranslation);
const mockedUseTransactionsQuery = jest.mocked(useTransactionsQuery);

beforeEach(() => {
  jest.resetAllMocks();

  mockedUsePeriod.mockReturnValue({
    selectedMonth: new Date().getMonth() + 1,
    setMode: jest.fn(),
    mode: "month",
    setSelectedMonth: jest.fn(),
  });

  mockedUseTranslation.mockReturnValue({
    locale: "pt-BR",
    t: jest.fn(),
    setLocale: jest.fn(),
  });

  mockedUseTransactionsQuery.mockReturnValue({
    data: [],
    isLoading: false,
  } as unknown as ReturnType<typeof useTransactionsQuery>);
});

describe("useSummaryMonth", () => {
  it("returns zero values when there are no transactions", () => {
    const { result } = renderHook(() => useSummaryMonth());
    expect(result.current.incomeMonth).toBe(0);
    expect(result.current.expenseMonth).toBe(0);
    expect(result.current.balanceMonth).toBe(0);
    expect(result.current.economyMonth).toBe(0);
    expect(result.current.isLoading).toBe(false);
  });

  it("calculates incomeMonth correctly", () => {
    mockedUseTransactionsQuery.mockReturnValue({
      data: [
        { type: "income", value: 1000 },
        { type: "income", value: 500 },
        { type: "expense", value: 300 },
      ],
      isLoading: false,
    } as unknown as ReturnType<typeof useTransactionsQuery>);

    const { result } = renderHook(() => useSummaryMonth());
    expect(result.current.incomeMonth).toBe(1500);
    expect(result.current.expenseMonth).toBe(300);
    expect(result.current.balanceMonth).toBe(1200);
  });

  it("returns economy as balance when balance is positive", () => {
    mockedUseTransactionsQuery.mockReturnValue({
      data: [
        { type: "income", value: 2000 },
        { type: "expense", value: 500 },
      ],
      isLoading: false,
    } as unknown as ReturnType<typeof useTransactionsQuery>);

    const { result } = renderHook(() => useSummaryMonth());
    expect(result.current.balanceMonth).toBe(1500);
    expect(result.current.economyMonth).toBe(1500);
  });

  it("returns zero economy when balance is negative", () => {
    mockedUseTransactionsQuery.mockReturnValue({
      data: [
        { type: "income", value: 500 },
        { type: "expense", value: 2000 },
      ],
      isLoading: false,
    } as unknown as ReturnType<typeof useTransactionsQuery>);

    const { result } = renderHook(() => useSummaryMonth());
    expect(result.current.balanceMonth).toBe(-1500);
    expect(result.current.economyMonth).toBe(0);
  });

  it("returns isLoading from query", () => {
    mockedUseTransactionsQuery.mockReturnValue({
      data: undefined,
      isLoading: true,
    } as unknown as ReturnType<typeof useTransactionsQuery>);

    const { result } = renderHook(() => useSummaryMonth());
    expect(result.current.isLoading).toBe(true);
  });

  it("generates dateToday in pt-BR", () => {
    mockedUsePeriod.mockReturnValue({
      selectedMonth: 3,
      setMode: jest.fn(),
      mode: "month",
      setSelectedMonth: jest.fn(),
    });

    const { result } = renderHook(() => useSummaryMonth());
    expect(result.current.dateToday).toBe("março");
  });

  it("generates dateToday in en", () => {
    mockedUsePeriod.mockReturnValue({
      selectedMonth: 3,
      setMode: jest.fn(),
      mode: "month",
      setSelectedMonth: jest.fn(),
    });

    mockedUseTranslation.mockReturnValue({
      locale: "en",
      t: jest.fn(),
      setLocale: jest.fn(),
    });

    const { result } = renderHook(() => useSummaryMonth());
    expect(result.current.dateToday).toBe("March");
  });

  it("handles empty transactions (undefined data)", () => {
    mockedUseTransactionsQuery.mockReturnValue({
      data: undefined,
      isLoading: false,
    } as unknown as ReturnType<typeof useTransactionsQuery>);

    const { result } = renderHook(() => useSummaryMonth());
    expect(result.current.incomeMonth).toBe(0);
    expect(result.current.expenseMonth).toBe(0);
    expect(result.current.balanceMonth).toBe(0);
    expect(result.current.economyMonth).toBe(0);
  });
});
