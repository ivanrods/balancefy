export type Category = {
  id: string;
  name: string;
  color: string;
  userId: string;
};

export type Wallet = {
  id: string;
  name: string;
  userId: string;
};

export type Transaction = {
  id: string;
  description: string;
  value: number;
  type: "income" | "expense";
  date: Date;
  userId: string;
  categoryId: string;
  category: Category;
  walletId: string;
  wallet: Wallet;
};

export type TransactionType = {
  month?: string;
  week?: string;
  income: number;
  expense: number;
};
