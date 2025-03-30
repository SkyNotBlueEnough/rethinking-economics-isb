"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Textarea } from "~/components/ui/textarea";
import { toast } from "sonner";
import { api } from "~/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { PlusCircle, Edit, Trash2, Image } from "lucide-react";
import type { TeamMember, TeamMemberCategory } from "~/lib/types/about";
import { Skeleton } from "~/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";

// Form schema for team member
const teamMemberFormSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(2, "Name must be at least 2 characters"),
  role: z.string().min(2, "Role must be at least 2 characters"),
  bio: z.string().min(10, "Bio must be at least 10 characters"),
  imageUrl: z.string().optional(),
  category: z.enum(["leadership", "faculty", "students"]),
  displayOrder: z.coerce.number().int().default(0),
});

export default function AdminAboutTeamPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TeamMemberCategory>("leadership");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);

  // Queries
  const {
    data: allTeamMembers,
    isLoading,
    refetch,
  } = api.about.getAllTeamMembers.useQuery();

  // Filter team members by category
  const leadershipTeam =
    allTeamMembers?.filter((member) => member.category === "leadership") ?? [];
  const facultyTeam =
    allTeamMembers?.filter((member) => member.category === "faculty") ?? [];
  const studentTeam =
    allTeamMembers?.filter((member) => member.category === "students") ?? [];

  // Mutations
  const createTeamMember = api.about.createTeamMember.useMutation({
    onSuccess: () => {
      toast.success("Team member added successfully");
      refetch();
      setIsDialogOpen(false);
    },
  });

  const updateTeamMember = api.about.updateTeamMember.useMutation({
    onSuccess: () => {
      toast.success("Team member updated successfully");
      refetch();
      setIsDialogOpen(false);
      setEditingMember(null);
    },
  });

  const deleteTeamMember = api.about.deleteTeamMember.useMutation({
    onSuccess: () => {
      toast.success("Team member deleted successfully");
      refetch();
    },
  });

  // Form
  const form = useForm<z.infer<typeof teamMemberFormSchema>>({
    resolver: zodResolver(teamMemberFormSchema),
    defaultValues: {
      name: "",
      role: "",
      bio: "",
      imageUrl: "",
      category: activeTab,
      displayOrder: 0,
    },
  });

  const handleAddMember = () => {
    setEditingMember(null);
    form.reset({
      name: "",
      role: "",
      bio: "",
      imageUrl: "",
      category: activeTab,
      displayOrder: 0,
    });
    setIsDialogOpen(true);
  };

  const handleEditMember = (member: TeamMember) => {
    setEditingMember(member);
    form.reset({
      id: member.id,
      name: member.name,
      role: member.role,
      bio: member.bio || "",
      imageUrl: member.imageUrl || "",
      category: member.category as TeamMemberCategory,
      displayOrder: member.displayOrder || 0,
    });
    setIsDialogOpen(true);
  };

  const handleDeleteMember = (id: number) => {
    if (confirm("Are you sure you want to delete this team member?")) {
      deleteTeamMember.mutate(id);
    }
  };

  const onSubmit = (data: z.infer<typeof teamMemberFormSchema>) => {
    if (data.id) {
      updateTeamMember.mutate({
        ...data,
        id: data.id as number,
      });
    } else {
      createTeamMember.mutate(data);
    }
  };

  // Get current active team based on tab
  const getActiveTeam = () => {
    switch (activeTab) {
      case "leadership":
        return leadershipTeam;
      case "faculty":
        return facultyTeam;
      case "students":
        return studentTeam;
      default:
        return [];
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-2xl font-bold">About Us: Team</div>
          <div className="text-muted-foreground">
            Manage team members displayed on the website
          </div>
        </div>
        <Button onClick={handleAddMember}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Team Member
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-64 w-full" />
            ))}
          </div>
        </div>
      ) : (
        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as TeamMemberCategory)}
          className="w-full"
        >
          <TabsList>
            <TabsTrigger value="leadership">Leadership</TabsTrigger>
            <TabsTrigger value="faculty">Faculty</TabsTrigger>
            <TabsTrigger value="students">Students & Fellows</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-6">
            {getActiveTeam().length === 0 ? (
              <div className="rounded-lg border p-6 text-center">
                <div className="mb-2 text-lg font-medium">
                  No team members yet
                </div>
                <div className="mb-4 text-sm text-muted-foreground">
                  Add team members to display in this section.
                </div>
                <Button onClick={handleAddMember}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Team Member
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {getActiveTeam().map((member) => (
                  <Card key={member.id} className="overflow-hidden">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage
                            src={member.imageUrl ?? ""}
                            alt={`${member.name}'s avatar`}
                          />
                          <AvatarFallback>
                            {member.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <span>{member.name}</span>
                      </CardTitle>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEditMember(member)}
                        >
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-destructive"
                          onClick={() => handleDeleteMember(member.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-2 font-medium text-primary">
                        {member.role}
                      </div>
                      <div className="line-clamp-3 text-sm text-muted-foreground">
                        {member.bio}
                      </div>
                      <div className="mt-3 text-xs text-muted-foreground">
                        Display order: {member.displayOrder || 0}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {editingMember ? "Edit Team Member" : "Add New Team Member"}
            </DialogTitle>
            <DialogDescription>
              Fill in the details for the team member.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Dr. Jane Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <FormControl>
                      <Input placeholder="Research Director" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bio</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter a brief biography..."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image URL</FormLabel>
                    <FormControl>
                      <div className="flex items-center gap-2">
                        <Input
                          placeholder="https://example.com/image.jpg"
                          {...field}
                        />
                        {field.value && (
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={field.value} alt="Preview" />
                            <AvatarFallback>
                              <Image className="h-4 w-4" />
                            </AvatarFallback>
                          </Avatar>
                        )}
                      </div>
                    </FormControl>
                    <FormDescription>
                      Provide a URL to the team member&apos;s photo
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      <select
                        className="w-full rounded-md border border-input bg-background px-3 py-2"
                        {...field}
                      >
                        <option value="leadership">Leadership</option>
                        <option value="faculty">Faculty</option>
                        <option value="students">Students & Fellows</option>
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="displayOrder"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Display Order</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormDescription>
                      Controls the order in which team members appear (lower
                      numbers first)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={
                    createTeamMember.isPending || updateTeamMember.isPending
                  }
                >
                  {createTeamMember.isPending || updateTeamMember.isPending
                    ? "Saving..."
                    : "Save"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
