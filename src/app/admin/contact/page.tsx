"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "~/trpc/react";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

export default function AdminContactPage() {
  const router = useRouter();
  const [selectedSubmission, setSelectedSubmission] = useState<number | null>(
    null,
  );
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // Fetch contact submissions
  const {
    data: submissions,
    isLoading,
    refetch: refetchSubmissions,
  } = api.contact.getSubmissions.useQuery(undefined, {
    refetchOnWindowFocus: false,
  });

  // Update status mutation
  const updateStatus = api.contact.updateSubmissionStatus.useMutation({
    onSuccess: () => {
      toast.success("Status updated successfully");
      refetchSubmissions();
    },
    onError: (error) => {
      toast.error(`Failed to update status: ${error.message}`);
    },
  });

  // Handle status update
  const handleStatusUpdate = (
    id: number,
    status: "new" | "in_progress" | "resolved",
  ) => {
    updateStatus.mutate({ id, status });
  };

  // Get selected submission details
  const selectedSubmissionData = submissions?.find(
    (submission) => submission.id === selectedSubmission,
  );

  // Handle view details
  const handleViewDetails = (id: number) => {
    setSelectedSubmission(id);
    setIsDetailsOpen(true);
  };

  // Get status badge color
  const getStatusBadge = (status: string | null) => {
    if (!status) return <Badge variant="destructive">New</Badge>;
    switch (status) {
      case "new":
        return <Badge variant="destructive">New</Badge>;
      case "in_progress":
        return <Badge variant="warning">In Progress</Badge>;
      case "resolved":
        return <Badge variant="success">Resolved</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  // Get inquiry type formatted
  const formatInquiryType = (type: string) => {
    return type
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <div className="container space-y-6 px-4 py-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Contact Submissions</CardTitle>
          <Button
            variant="outline"
            onClick={() => refetchSubmissions()}
            disabled={isLoading}
          >
            Refresh
          </Button>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <ContactSubmissionsTableSkeleton />
          ) : (
            <>
              {submissions && submissions.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead>Inquiry Type</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="w-[80px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {submissions.map((submission) => (
                      <TableRow key={submission.id}>
                        <TableCell>{submission.name}</TableCell>
                        <TableCell>{submission.email}</TableCell>
                        <TableCell className="max-w-[200px] truncate">
                          {submission.subject}
                        </TableCell>
                        <TableCell>
                          {formatInquiryType(submission.inquiryType)}
                        </TableCell>
                        <TableCell>
                          {formatDistanceToNow(new Date(submission.createdAt), {
                            addSuffix: true,
                          })}
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(submission.status)}
                        </TableCell>
                        <TableCell>
                          <div className="flex justify-end">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <span className="sr-only">Open menu</span>
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="h-4 w-4"
                                    aria-hidden="true"
                                  >
                                    <circle cx="12" cy="12" r="1" />
                                    <circle cx="12" cy="5" r="1" />
                                    <circle cx="12" cy="19" r="1" />
                                  </svg>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleViewDetails(submission.id)
                                  }
                                >
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleStatusUpdate(submission.id, "new")
                                  }
                                  disabled={submission.status === "new"}
                                >
                                  Mark as New
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleStatusUpdate(
                                      submission.id,
                                      "in_progress",
                                    )
                                  }
                                  disabled={submission.status === "in_progress"}
                                >
                                  Mark as In Progress
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleStatusUpdate(
                                      submission.id,
                                      "resolved",
                                    )
                                  }
                                  disabled={submission.status === "resolved"}
                                >
                                  Mark as Resolved
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="flex min-h-[200px] flex-col items-center justify-center rounded-md border border-dashed p-8 text-center">
                  <div className="text-muted-foreground">
                    No contact submissions yet
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Submission Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Submission Details</DialogTitle>
            <DialogDescription>
              Contact form submission from{" "}
              {selectedSubmissionData?.name || "Unknown"}
            </DialogDescription>
          </DialogHeader>

          {selectedSubmissionData && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-medium text-muted-foreground">
                    Name
                  </div>
                  <div>{selectedSubmissionData.name}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">
                    Email
                  </div>
                  <div>{selectedSubmissionData.email}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">
                    Inquiry Type
                  </div>
                  <div>
                    {formatInquiryType(selectedSubmissionData.inquiryType)}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">
                    Status
                  </div>
                  <div>{getStatusBadge(selectedSubmissionData.status)}</div>
                </div>
                <div className="col-span-2">
                  <div className="text-sm font-medium text-muted-foreground">
                    Subject
                  </div>
                  <div>{selectedSubmissionData.subject}</div>
                </div>
                <div className="col-span-2">
                  <div className="text-sm font-medium text-muted-foreground">
                    Message
                  </div>
                  <div className="whitespace-pre-wrap rounded-md bg-muted p-4">
                    {selectedSubmissionData.message}
                  </div>
                </div>
                <div className="col-span-2">
                  <div className="text-sm font-medium text-muted-foreground">
                    Submitted
                  </div>
                  <div>
                    {new Date(
                      selectedSubmissionData.createdAt,
                    ).toLocaleString()}
                  </div>
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <Button
                  variant="outline"
                  onClick={() => setIsDetailsOpen(false)}
                >
                  Close
                </Button>
                <div className="space-x-2">
                  <Button
                    variant="secondary"
                    onClick={() =>
                      handleStatusUpdate(
                        selectedSubmissionData.id,
                        "in_progress",
                      )
                    }
                    disabled={
                      selectedSubmissionData.status === "in_progress" ||
                      updateStatus.isPending
                    }
                  >
                    Mark as In Progress
                  </Button>
                  <Button
                    onClick={() =>
                      handleStatusUpdate(selectedSubmissionData.id, "resolved")
                    }
                    disabled={
                      selectedSubmissionData.status === "resolved" ||
                      updateStatus.isPending
                    }
                  >
                    Mark as Resolved
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ContactSubmissionsTableSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <div className="h-6 w-1/4 animate-pulse rounded bg-muted" />
        <div className="h-6 w-1/4 animate-pulse rounded bg-muted" />
        <div className="h-6 w-1/4 animate-pulse rounded bg-muted" />
        <div className="h-6 w-1/4 animate-pulse rounded bg-muted" />
      </div>
      {Array(5)
        .fill(0)
        .map((_, index) => (
          <div key={`${index + 1}`} className="flex items-center space-x-4">
            <div className="h-10 w-1/4 animate-pulse rounded bg-muted" />
            <div className="h-10 w-1/4 animate-pulse rounded bg-muted" />
            <div className="h-10 w-1/4 animate-pulse rounded bg-muted" />
            <div className="h-10 w-1/4 animate-pulse rounded bg-muted" />
          </div>
        ))}
    </div>
  );
}
