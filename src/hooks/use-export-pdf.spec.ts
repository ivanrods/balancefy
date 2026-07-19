import { renderHook } from "@testing-library/react";
import { useExportPDF } from "./use-export-pdf";
import { useCurrency } from "@/context/currency-context";
import jsPDF from "jspdf";

jest.mock("@/context/currency-context");
jest.mock("jspdf", () => ({
  __esModule: true,
  default: jest.fn(),
}));
jest.mock("jspdf-autotable", () => jest.fn());

beforeAll(() => {
  jest.spyOn(console, "error").mockImplementation(() => {});
});

const mockedUseCurrency = jest.mocked(useCurrency);
const mockedJsPDF = jest.mocked(jsPDF);

let mockDoc: Record<string, jest.Mock>;

const mockTransactions = [
  {
    id: "1",
    description: "Freelance",
    value: 5000,
    type: "income" as const,
    date: new Date("2025-03-10"),
    categoryId: "cat1",
    category: { id: "cat1", name: "Trabalho", color: "#000", userId: null },
    walletId: "wallet1",
    wallet: { id: "wallet1", name: "Principal", userId: null },
  },
  {
    id: "2",
    description: "Supermercado",
    value: 200,
    type: "expense" as const,
    date: new Date("2025-03-12"),
    categoryId: "cat2",
    category: { id: "cat2", name: "Alimentação", color: "#fff", userId: null },
    walletId: "wallet1",
    wallet: { id: "wallet1", name: "Principal", userId: null },
  },
];

beforeEach(() => {
  jest.resetAllMocks();

  mockedUseCurrency.mockReturnValue({
    currency: "BRL",
    setCurrency: jest.fn(),
  });

  mockDoc = {
    setFontSize: jest.fn(),
    setTextColor: jest.fn(),
    text: jest.fn(),
    setFont: jest.fn(),
    save: jest.fn(),
  };
  (mockedJsPDF as unknown as jest.Mock).mockReturnValue(mockDoc);
});

describe("useExportPDF", () => {
  it("returns success on generate", async () => {
    const { result } = renderHook(() => useExportPDF());

    const res = await result.current.generateTransactionsPDF(
      mockTransactions,
      "Março 2025",
      "pt-BR",
      (key) => key,
    );

    expect(res).toEqual({
      success: true,
      message: "exportPdf.pdfGeneratedSuccess",
    });
  });

  it("calls doc.save with a filename", async () => {
    const { result } = renderHook(() => useExportPDF());

    await result.current.generateTransactionsPDF(
      mockTransactions,
      "Março 2025",
      "pt-BR",
      (key) => key,
    );

    expect(mockDoc.save).toHaveBeenCalledWith(
      expect.stringMatching(/^transactions_\d+\.pdf$/),
    );
  });

  it("uses currency from context", async () => {
    mockedUseCurrency.mockReturnValue({
      currency: "USD",
      setCurrency: jest.fn(),
    });

    const { result } = renderHook(() => useExportPDF());

    const res = await result.current.generateTransactionsPDF(
      mockTransactions,
      "March 2025",
      "en",
      (key) => key,
    );

    expect(res).toEqual({
      success: true,
      message: "exportPdf.pdfGeneratedSuccess",
    });
  });

  it("returns error when jsPDF throws", async () => {
    (mockedJsPDF as unknown as jest.Mock).mockImplementation(() => {
      throw new Error("PDF error");
    });

    const { result } = renderHook(() => useExportPDF());

    const res = await result.current.generateTransactionsPDF(
      mockTransactions,
      "Março 2025",
      "pt-BR",
      (key) => key,
    );

    expect(res).toEqual({
      success: false,
      message: "exportPdf.pdfGeneratedError",
    });
  });

  it("uses default t function when none provided", async () => {
    const { result } = renderHook(() => useExportPDF());

    const res = await result.current.generateTransactionsPDF(
      [],
      "Período",
      "pt-BR",
    );

    expect(res).toEqual({
      success: true,
      message: "exportPdf.pdfGeneratedSuccess",
    });
  });

  it("renders financial summary with correct values", async () => {
    const { result } = renderHook(() => useExportPDF());

    await result.current.generateTransactionsPDF(
      mockTransactions,
      "Março 2025",
      "pt-BR",
      (key) => key,
    );

    expect(mockDoc.text).toHaveBeenCalledWith(
      "exportPdf.totalIncome: R$ 5.000,00",
      expect.any(Number),
      expect.any(Number),
    );
    expect(mockDoc.text).toHaveBeenCalledWith(
      "exportPdf.totalExpenses: R$ 200,00",
      expect.any(Number),
      expect.any(Number),
    );
    expect(mockDoc.text).toHaveBeenCalledWith(
      "exportPdf.balance: R$ 4.800,00",
      expect.any(Number),
      expect.any(Number),
    );
  });

  it("renders financial summary with USD currency", async () => {
    mockedUseCurrency.mockReturnValue({
      currency: "USD",
      setCurrency: jest.fn(),
    });

    const { result } = renderHook(() => useExportPDF());

    await result.current.generateTransactionsPDF(
      [
        { ...mockTransactions[0], value: 1000 },
        { ...mockTransactions[1], value: 250 },
      ],
      "March 2025",
      "en",
      (key) => key,
    );

    expect(mockDoc.text).toHaveBeenCalledWith(
      "exportPdf.totalIncome: $1,000.00",
      expect.any(Number),
      expect.any(Number),
    );
    expect(mockDoc.text).toHaveBeenCalledWith(
      "exportPdf.totalExpenses: $250.00",
      expect.any(Number),
      expect.any(Number),
    );
    expect(mockDoc.text).toHaveBeenCalledWith(
      "exportPdf.balance: $750.00",
      expect.any(Number),
      expect.any(Number),
    );
  });
});
