import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth-options";
import { getServerSession } from "next-auth/next";
import { getNotifications } from "@/lib/services/notification-service";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const notifications = await getNotifications(session.user.id);
    return NextResponse.json(notifications);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
