import { NextResponse } from "next/server";
import { withAuth, apiError } from "@/lib/api-handler";
import { getTransactionChart } from "@/lib/services/transaction-service";

export async function GET(req: Request) {
  try {
    const user = await withAuth();
    const { searchParams } = new URL(req.url);
    const period = searchParams.get("period") || "month";
    const month = searchParams.get("month");
    const year = searchParams.get("year");

    const result = await getTransactionChart(
      user.id,
      period,
      month ? Number(month) : null,
      year ? Number(year) : null,
    );
    return NextResponse.json(result);
  } catch (error) {
    return apiError(error);
  }
}
