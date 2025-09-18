export type TransactionFormData = {
  description: string;
  value: number;
  type: "income" | "expense";
  date: Date;
  categoryId: string;
};
