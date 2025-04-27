"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { format } from "date-fns";

import { api } from "~/trpc/react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Checkbox } from "~/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { LoadingSpinner } from "~/components/ui/loading-spinner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";
import { toast } from "sonner";

import { PublicationTableSkeleton } from "./components/publication-table-skeleton";

// Map status to badge variants
const statusVariants = {
  draft: "secondary",
  pending_review: "warning",
  published: "default",
  rejected: "destructive",
} as const;

export default function AdminPublicationsPage() {
  const router = useRouter();

  // State for filters
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedPublications, setSelectedPublications] = useState<number[]>(
    [],
  );
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);

  // Fetch publications
  const {
    data: publications,
    isLoading,
    refetch,
  } = api.admin.getPublications.useQuery({
    status: statusFilter as
      | "all"
      | "draft"
      | "pending_review"
      | "published"
      | "rejected",
    search: searchQuery,
  });

  // Delete publication mutation
  const deletePublicationMutation = api.admin.deletePublication.useMutation({
    onSuccess: () => {
      toast.success("Publication deleted successfully");
      void refetch();
      setDeletingId(null);
      setIsDeleting(false);
    },
    onError: (error) => {
      toast.error(`Error deleting publication: ${error.message}`);
      setIsDeleting(false);
    },
  });

  // Bulk delete mutation
  const bulkDeleteMutation = api.admin.bulkDeletePublications.useMutation({
    onSuccess: () => {
      toast.success("Selected publications deleted successfully");
      void refetch();
      setSelectedPublications([]);
      setIsBulkDeleting(false);
    },
    onError: (error) => {
      toast.error(`Error deleting publications: ${error.message}`);
      setIsBulkDeleting(false);
    },
  });

  // Handle search input
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Handle delete publication
  const handleDelete = (id: number) => {
    setIsDeleting(true);
    deletePublicationMutation.mutate({ id });
  };

  // Handle bulk delete
  const handleBulkDelete = () => {
    setIsBulkDeleting(true);
    bulkDeleteMutation.mutate({ ids: selectedPublications });
  };

  const toggleSelectAll = () => {
    if (publications) {
      if (selectedPublications.length === publications.length) {
        setSelectedPublications([]);
      } else {
        setSelectedPublications(publications.map((pub) => pub.id));
      }
    }
  };

  const togglePublicationSelection = (id: number) => {
    setSelectedPublications((prev) =>
      prev.includes(id) ? prev.filter((pubId) => pubId !== id) : [...prev, id],
    );
  };

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Publications Management</CardTitle>
          <CardDescription>
            Review, approve, reject, or modify user publications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-x-4 sm:space-y-0">
            <div className="flex flex-col space-y-2 sm:flex-row sm:space-x-2 sm:space-y-0">
              <Input
                placeholder="Search publications..."
                className="w-full sm:w-80"
                value={searchQuery}
                onChange={handleSearch}
              />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="pending_review">Pending Review</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex space-x-2">
              {selectedPublications.length > 0 && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive">
                      Delete Selected ({selectedPublications.length})
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Delete Selected Publications
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete{" "}
                        {selectedPublications.length} selected publications?
                        This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={(e) => {
                          e.preventDefault();
                          handleBulkDelete();
                        }}
                        disabled={isBulkDeleting}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        {isBulkDeleting ? (
                          <>
                            <LoadingSpinner size="sm" className="mr-2" />
                            Deleting...
                          </>
                        ) : (
                          "Delete Selected"
                        )}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
              <Button onClick={() => router.push("/admin/publications/create")}>
                Create New Publication
              </Button>
            </div>
          </div>

          {isLoading ? (
            <PublicationTableSkeleton />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">
                    <Checkbox
                      checked={
                        (publications?.length ?? 0) > 0 &&
                        publications?.length === selectedPublications.length
                      }
                      onCheckedChange={toggleSelectAll}
                    />
                  </TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {publications && publications.length > 0 ? (
                  publications.map((publication) => (
                    <TableRow key={publication.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedPublications.includes(
                            publication.id,
                          )}
                          onCheckedChange={() =>
                            togglePublicationSelection(publication.id)
                          }
                        />
                      </TableCell>
                      <TableCell className="font-medium">
                        <Link
                          href={`/admin/publications/${publication.id}/review`}
                          className="text-primary hover:underline"
                        >
                          {publication.title}
                        </Link>
                      </TableCell>
                      <TableCell>
                        {publication.author?.name ?? "Unknown"}
                      </TableCell>
                      <TableCell className="capitalize">
                        {publication.type.replace(/_/g, " ")}
                      </TableCell>
                      <TableCell>
                        {publication.status && (
                          <Badge
                            variant={
                              statusVariants[publication.status] ?? "secondary"
                            }
                          >
                            {publication.status.replace(/_/g, " ")}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {publication.createdAt
                          ? format(
                              new Date(publication.createdAt),
                              "MMM d, yyyy",
                            )
                          : "N/A"}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              router.push(
                                `/admin/publications/${publication.id}/review`,
                              )
                            }
                          >
                            View
                          </Button>

                          <Button
                            variant="default"
                            size="sm"
                            onClick={() =>
                              router.push(
                                `/admin/publications/${publication.id}/edit`,
                              )
                            }
                          >
                            Edit
                          </Button>

                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => setDeletingId(publication.id)}
                              >
                                Delete
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Delete Publication
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete &quot;
                                  {publication.title}&quot;? This action cannot
                                  be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={(e) => {
                                    e.preventDefault();
                                    handleDelete(publication.id);
                                  }}
                                  disabled={isDeleting}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  {isDeleting &&
                                  deletingId === publication.id ? (
                                    <>
                                      <LoadingSpinner
                                        size="sm"
                                        className="mr-2"
                                      />
                                      Deleting...
                                    </>
                                  ) : (
                                    "Delete"
                                  )}
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="py-6 text-center">
                      No publications found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
