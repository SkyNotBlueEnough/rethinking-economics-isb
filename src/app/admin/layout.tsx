import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { checkUserIsAdmin } from "~/lib/auth-utils";
import { SidebarProvider, SidebarTrigger } from "~/components/ui/sidebar";
import { AdminSidebar } from "./_components/AdminSidebar";
import { ThemeProvider } from "~/lib/theme-context";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Check if the user is an admin
  const user = await currentUser();

  if (!user || (user && !(await checkUserIsAdmin(user.id)))) {
    redirect("/"); // Redirect non-admins to home page
  }

  return (
    <ThemeProvider>
      <SidebarProvider>
        <div className="flex min-h-screen w-full overflow-hidden">
          <AdminSidebar />
          <main className="w-full flex-1 overflow-y-auto">
            <div className="flex h-full w-full flex-col">
              <div className="p-6">
                <SidebarTrigger className="mb-6 md:hidden" />
                <div className="w-full">{children}</div>
              </div>
            </div>
          </main>
        </div>
      </SidebarProvider>
    </ThemeProvider>
  );
}
