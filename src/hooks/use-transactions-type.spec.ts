import { renderHook } from "@testing-library/react";
import { useTransactionsType } from "./use-transactions-type";
import { useQuery } from "@tanstack/react-query";

jest.mock("@tanstack/react-query", () => ({
  useQuery: jest.fn(),
}));

const mockedUseQuery = jest.mocked(useQuery);

beforeEach(() => {
  jest.resetAllMocks();

  mockedUseQuery.mockReturnValue({
    data: [],
    isLoading: false,
    error: null,
  } as unknown as ReturnType<typeof useQuery>);
});

describe("useTransactionsType", () => {
  it("returns empty array by default", () => {
    const { result } = renderHook(() => useTransactionsType());
    expect(result.current.transactionsType).toEqual([]);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it("passes correct queryKey with defaults", () => {
    renderHook(() => useTransactionsType());
    expect(mockedUseQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        queryKey: ["transactions-type", { month: undefined, year: undefined, period: "month" }],
      }),
    );
  });

  it("passes correct queryKey with month and year", () => {
    renderHook(() => useTransactionsType({ month: 5, year: 2025 }));
    expect(mockedUseQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        queryKey: ["transactions-type", { month: 5, year: 2025, period: "month" }],
      }),
    );
  });

  it("passes correct queryKey with period week", () => {
    renderHook(() => useTransactionsType({ period: "week" }));
    expect(mockedUseQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        queryKey: ["transactions-type", { month: undefined, year: undefined, period: "week" }],
      }),
    );
  });

  it("returns isLoading true", () => {
    mockedUseQuery.mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
    } as unknown as ReturnType<typeof useQuery>);

    const { result } = renderHook(() => useTransactionsType());
    expect(result.current.isLoading).toBe(true);
  });

  it("returns error", () => {
    const error = new Error("fail");
    mockedUseQuery.mockReturnValue({
      data: undefined,
      isLoading: false,
      error,
    } as unknown as ReturnType<typeof useQuery>);

    const { result } = renderHook(() => useTransactionsType());
    expect(result.current.error).toEqual(error);
  });

  it("returns transactions data", () => {
    const mockData = [
      { month: "2025-03", income: 1000, expense: 500 },
      { month: "2025-04", income: 2000, expense: 800 },
    ];
    mockedUseQuery.mockReturnValue({
      data: mockData,
      isLoading: false,
      error: null,
    } as unknown as ReturnType<typeof useQuery>);

    const { result } = renderHook(() => useTransactionsType());
    expect(result.current.transactionsType).toEqual(mockData);
  });
});
