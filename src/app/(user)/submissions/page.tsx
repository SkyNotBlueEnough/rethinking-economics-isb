"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";

import { api } from "~/trpc/react";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Badge } from "~/components/ui/badge";
import { LoadingSpinner } from "~/components/ui/loading-spinner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { GuidelinesContent } from "~/components/GuidelinesContent";

// Map status to badge variants
const statusVariants = {
  draft: "secondary",
  pending_review: "warning",
  published: "default",
  rejected: "destructive",
} as const;

function SubmissionsTable() {
  const router = useRouter();
  const { data: publications, isLoading } =
    api.publications.getUserPublications.useQuery();

  if (isLoading) {
    return (
      <div className="flex h-[200px] items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Submitted</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {publications && publications.length > 0 ? (
          publications.map((publication) => (
            <TableRow key={publication.id}>
              <TableCell className="font-medium">{publication.title}</TableCell>
              <TableCell className="capitalize">
                {publication.type?.replace(/_/g, " ")}
              </TableCell>
              <TableCell>
                {publication.status && (
                  <Badge
                    variant={
                      statusVariants[
                        publication.status as keyof typeof statusVariants
                      ] ?? "secondary"
                    }
                  >
                    {publication.status.replace(/_/g, " ")}
                  </Badge>
                )}
              </TableCell>
              <TableCell>
                {publication.createdAt
                  ? format(new Date(publication.createdAt), "MMM d, yyyy")
                  : "N/A"}
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      router.push(`/submissions/${publication.id}`)
                    }
                  >
                    View
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={5} className="py-6 text-center">
              No submissions found. Create your first submission!
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}

export default function SubmissionsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("submissions");

  return (
    <div className="container mx-auto px-4 py-6 sm:py-8">
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="submissions">Submissions</TabsTrigger>
            <TabsTrigger value="guidelines">Guidelines</TabsTrigger>
          </TabsList>
          {activeTab === "submissions" && (
            <Button onClick={() => router.push("/submissions/create")}>
              Create New Submission
            </Button>
          )}
        </div>

        <TabsContent value="submissions" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>My Submissions</CardTitle>
              <CardDescription>
                Create and manage your article submissions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SubmissionsTable />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="guidelines" className="mt-0">
          <GuidelinesContent />
        </TabsContent>
      </Tabs>
    </div>
  );
}
