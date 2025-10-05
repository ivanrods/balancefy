export type Category = {
  id: string;
  name: string;
  color: string;
  userId: string | null;
};

export type Wallet = {
  id: string;
  name: string;
  userId: string | null;
};

export type Transaction = {
  id: string;
  description: string;
  value: number;
  type: "income" | "expense";
  date: Date;
  categoryId: string;
  category: Category;
  walletId: string;
  wallet: Wallet;
};
