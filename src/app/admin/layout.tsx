import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { checkUserIsAdmin } from "~/lib/auth-utils";

import { Tabs, TabsList, TabsTrigger } from "~/components/ui/tabs";

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
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <div className="mb-2 text-3xl font-bold">Admin Dashboard</div>
        <div className="text-muted-foreground">
          Manage website content and users
        </div>
      </div>

      <Tabs defaultValue="publications" className="w-full">
        <TabsList className="mb-8 flex flex-wrap">
          <Link href="/admin/publications" passHref>
            <TabsTrigger value="publications">Publications</TabsTrigger>
          </Link>
          <Link href="/admin/users" passHref>
            <TabsTrigger value="users">Users</TabsTrigger>
          </Link>
          <Link href="/admin/events" passHref>
            <TabsTrigger value="events">Events</TabsTrigger>
          </Link>
          <Link href="/admin/events/initiatives" passHref>
            <TabsTrigger value="initiatives">Initiatives</TabsTrigger>
          </Link>
          <Link href="/admin/policy" passHref>
            <TabsTrigger value="policy">Policy & Advocacy</TabsTrigger>
          </Link>
          <Link href="/admin/memberships" passHref>
            <TabsTrigger value="memberships">Memberships</TabsTrigger>
          </Link>
          <Link href="/admin/contact" passHref>
            <TabsTrigger value="contact">Contact Submissions</TabsTrigger>
          </Link>
          <Link href="/admin/about/overview" passHref>
            <TabsTrigger value="about-overview">About: Overview</TabsTrigger>
          </Link>
          <Link href="/admin/about/team" passHref>
            <TabsTrigger value="about-team">About: Team</TabsTrigger>
          </Link>
          <Link href="/admin/about/partners" passHref>
            <TabsTrigger value="about-partners">About: Partners</TabsTrigger>
          </Link>
        </TabsList>
      </Tabs>

      <div className="mt-4">{children}</div>
    </div>
  );
}
