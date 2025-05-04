"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";

import { api } from "~/trpc/react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
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
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { LoadingSpinner } from "~/components/ui/loading-spinner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { CreateUserForm } from "~/app/admin/_components/CreateUserForm";
import { toast } from "sonner";

// UserTable Loading Skeleton
function UserTableSkeleton() {
  const skeletonRows = Array.from({ length: 6 }, (_, i) => i);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>User</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Registered</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {skeletonRows.map((index) => (
          <TableRow key={index}>
            <TableCell>
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 animate-pulse rounded-full bg-muted" />
                <div className="space-y-1">
                  <div className="h-4 w-24 animate-pulse rounded bg-muted" />
                  <div className="h-3 w-32 animate-pulse rounded bg-muted" />
                </div>
              </div>
            </TableCell>
            <TableCell>
              <div className="h-5 w-20 animate-pulse rounded bg-muted" />
            </TableCell>
            <TableCell>
              <div className="h-5 w-24 animate-pulse rounded bg-muted" />
            </TableCell>
            <TableCell>
              <div className="flex space-x-2">
                <div className="h-8 w-24 animate-pulse rounded bg-muted" />
                <div className="h-8 w-32 animate-pulse rounded bg-muted" />
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

// Main component
export default function AdminUsersPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [createUserDialogOpen, setCreateUserDialogOpen] = useState(false);

  // Fetch users
  const {
    data: users,
    isLoading,
    refetch,
  } = api.admin.getUsers.useQuery({
    search: searchQuery,
  });

  // Toggle admin access mutation
  const toggleAdminAccess = api.admin.toggleUserAdminAccess.useMutation({
    onSuccess: (data) => {
      toast.success(
        `${data?.name || "User"} ${data?.isTeamMember ? "granted" : "revoked"} admin access`,
      );
      void refetch();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update admin access");
    },
  });

  // Handle search input
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Handle toggling admin access
  const handleToggleAdminAccess = (
    userId: string,
    isCurrentlyAdmin: boolean,
  ) => {
    toggleAdminAccess.mutate({ userId });
  };

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
          <CardDescription>
            View and manage all registered users
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-x-4 sm:space-y-0">
            <Input
              placeholder="Search users..."
              className="w-full sm:w-80"
              value={searchQuery}
              onChange={handleSearch}
            />

            <Dialog
              open={createUserDialogOpen}
              onOpenChange={setCreateUserDialogOpen}
            >
              <DialogTrigger asChild>
                <Button variant="default">Add New User</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Create New User Profile</DialogTitle>
                  <DialogDescription>
                    Add a new user profile for publishing articles
                  </DialogDescription>
                </DialogHeader>
                <CreateUserForm
                  onSuccess={() => {
                    setCreateUserDialogOpen(false);
                    void refetch();
                  }}
                />
              </DialogContent>
            </Dialog>
          </div>

          {isLoading ? (
            <UserTableSkeleton />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Registered</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users && users.length > 0 ? (
                  users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar>
                            <AvatarImage
                              src={user.avatar ?? ""}
                              alt={user.name ?? ""}
                            />
                            <AvatarFallback>
                              {user.name
                                ? user.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")
                                    .toUpperCase()
                                : "U"}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">
                              {user.name ?? "Unnamed User"}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {user.id}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {user.isTeamMember ? (
                          <Badge variant="info">Team Member</Badge>
                        ) : (
                          <Badge variant="secondary">Member</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {user.createdAt
                          ? format(new Date(user.createdAt), "MMM d, yyyy")
                          : "N/A"}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() =>
                              router.push(
                                `/admin/publications/create?authorId=${user.id}`,
                              )
                            }
                          >
                            Create Article
                          </Button>
                          <Button
                            variant={
                              user.isTeamMember ? "destructive" : "secondary"
                            }
                            size="sm"
                            onClick={() =>
                              handleToggleAdminAccess(
                                user.id,
                                !!user.isTeamMember,
                              )
                            }
                            disabled={
                              toggleAdminAccess.isPending &&
                              toggleAdminAccess.variables?.userId === user.id
                            }
                          >
                            {toggleAdminAccess.isPending &&
                            toggleAdminAccess.variables?.userId === user.id ? (
                              <LoadingSpinner className="mr-2 h-4 w-4 stroke-current" />
                            ) : null}
                            {user.isTeamMember
                              ? "Revoke Admin"
                              : "Give Admin Access"}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="py-6 text-center">
                      No users found
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
