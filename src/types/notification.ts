export type Notification = {
  id: string;
  userId: string;
  transactionId: string | null;
  message: string;
  read: boolean;
  createdAt: string;
  transaction: {
    id: string;
    description: string;
    value: number;
    type: "income" | "expense";
    date: string;
  } | null;
};
