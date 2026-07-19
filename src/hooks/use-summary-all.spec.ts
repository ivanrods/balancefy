import { renderHook } from "@testing-library/react";
import { useSummaryAll } from "./use-summary-all";
import { useTransactionsQuery } from "./use-transactions";

jest.mock("./use-transactions");

const mockedUseTransactionsQuery = jest.mocked(useTransactionsQuery);

beforeEach(() => {
  jest.resetAllMocks();

  mockedUseTransactionsQuery.mockReturnValue({
    data: [],
    isLoading: false,
  } as unknown as ReturnType<typeof useTransactionsQuery>);
});

describe("useSummaryAll", () => {
  it("returns zero values when there are no transactions", () => {
    const { result } = renderHook(() => useSummaryAll());
    expect(result.current.incomeAll).toBe(0);
    expect(result.current.expenseAll).toBe(0);
    expect(result.current.balanceAll).toBe(0);
    expect(result.current.economyAll).toBe(0);
    expect(result.current.isLoading).toBe(false);
  });

  it("calculates incomeAll and expenseAll correctly", () => {
    mockedUseTransactionsQuery.mockReturnValue({
      data: [
        { type: "income", value: 2000 },
        { type: "income", value: 800 },
        { type: "expense", value: 500 },
        { type: "expense", value: 300 },
      ],
      isLoading: false,
    } as unknown as ReturnType<typeof useTransactionsQuery>);

    const { result } = renderHook(() => useSummaryAll());
    expect(result.current.incomeAll).toBe(2800);
    expect(result.current.expenseAll).toBe(800);
    expect(result.current.balanceAll).toBe(2000);
  });

  it("returns economy as balance when balance is positive", () => {
    mockedUseTransactionsQuery.mockReturnValue({
      data: [
        { type: "income", value: 3000 },
        { type: "expense", value: 1000 },
      ],
      isLoading: false,
    } as unknown as ReturnType<typeof useTransactionsQuery>);

    const { result } = renderHook(() => useSummaryAll());
    expect(result.current.balanceAll).toBe(2000);
    expect(result.current.economyAll).toBe(2000);
  });

  it("returns zero economy when balance is negative", () => {
    mockedUseTransactionsQuery.mockReturnValue({
      data: [
        { type: "income", value: 500 },
        { type: "expense", value: 2000 },
      ],
      isLoading: false,
    } as unknown as ReturnType<typeof useTransactionsQuery>);

    const { result } = renderHook(() => useSummaryAll());
    expect(result.current.balanceAll).toBe(-1500);
    expect(result.current.economyAll).toBe(0);
  });

  it("returns isLoading from query", () => {
    mockedUseTransactionsQuery.mockReturnValue({
      data: undefined,
      isLoading: true,
    } as unknown as ReturnType<typeof useTransactionsQuery>);

    const { result } = renderHook(() => useSummaryAll());
    expect(result.current.isLoading).toBe(true);
  });

  it("handles undefined data", () => {
    mockedUseTransactionsQuery.mockReturnValue({
      data: undefined,
      isLoading: false,
    } as unknown as ReturnType<typeof useTransactionsQuery>);

    const { result } = renderHook(() => useSummaryAll());
    expect(result.current.incomeAll).toBe(0);
    expect(result.current.expenseAll).toBe(0);
    expect(result.current.balanceAll).toBe(0);
    expect(result.current.economyAll).toBe(0);
  });
});
