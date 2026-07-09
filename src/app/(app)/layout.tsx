import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/sidebar/app-sidebar";

import { AppHeader } from "@/components/header/app-header";
import { PeriodProvider } from "@/context/period-context";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { getNotifications } from "@/lib/services/notification-service";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);

  let initialNotifications = undefined;
  if (session?.user?.id) {
    const notifications = await getNotifications(session.user.id);
    initialNotifications = JSON.parse(JSON.stringify(notifications));
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full bg-sidebar md:p-3">
        <div className="w-full h-full flex flex-col gap-4 px-4 bg-background md:rounded-xl">
          <AppHeader initialNotifications={initialNotifications} />
          <PeriodProvider>{children}</PeriodProvider>
        </div>
      </main>
    </SidebarProvider>
  );
}
