export type Wallets = {
  id: string;
  name: string;
  relationship: string[];
  balance: number;
  number: number;
  lastTransaction: {
    amount: number;
    date: string;
    type: "income" | "expense";
  };
  totalIncome: number;
  totalExpense: number;
};
