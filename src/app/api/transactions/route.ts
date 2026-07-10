import { NextResponse } from "next/server";
import { withAuth, apiError } from "@/lib/api-handler";
import {
  getTransactions,
  createTransaction,
} from "@/lib/services/transaction-service";

export async function GET(req: Request) {
  try {
    const user = await withAuth();
    const { searchParams } = new URL(req.url);
    const monthParam = searchParams.get("month");
    const yearParam = searchParams.get("year");

    const transactions = await getTransactions(user.id, {
      month: monthParam ? Number(monthParam) : null,
      year: yearParam ? Number(yearParam) : null,
    });

    return NextResponse.json(transactions);
  } catch (error) {
    return apiError(error);
  }
}

export async function POST(req: Request) {
  try {
    const user = await withAuth();
    const body = await req.json();
    const transaction = await createTransaction(user.id, body);
    return NextResponse.json(transaction, { status: 201 });
  } catch (error) {
    return apiError(error);
  }
}
