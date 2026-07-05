export type Wallets = {
  id: string;
  name: string;
  balance: number;
  lastTransaction: {
    amount: number;
    date: string;
    type: "income" | "expense";
  } | null;
  totalIncome: number;
  totalExpense: number;
};
