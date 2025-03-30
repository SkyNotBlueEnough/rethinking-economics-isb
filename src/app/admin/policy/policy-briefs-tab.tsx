"use client";

import { useState } from "react";
import { format } from "date-fns";
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
import { Textarea } from "~/components/ui/textarea";
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { Calendar } from "~/components/ui/calendar";
import { toast } from "sonner";
import { api } from "~/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { CalendarIcon, Edit, Plus, Trash2 } from "lucide-react";
import type { Policy, PolicyCategory, PolicyStatus } from "~/lib/types/policy";

// Form schema for policy brief
const policyFormSchema = z.object({
  id: z.number().optional(),
  title: z.string().min(2, "Title must be at least 2 characters"),
  slug: z.string().optional(),
  summary: z.string().optional(),
  content: z.string().min(10, "Content must be at least 10 characters"),
  category: z.enum(["economic", "social", "environmental"]),
  thumbnailUrl: z.string().optional(),
  status: z.enum(["draft", "published"]),
  publishedAt: z.date().optional(),
});

export default function PolicyBriefsTab() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPolicy, setEditingPolicy] = useState<Policy | null>(null);

  // Fetch data from API
  const {
    data: policies,
    isLoading,
    refetch: refetchPolicies,
  } = api.policy.getAllPolicies.useQuery();

  // Mutations
  const createPolicy = api.policy.createPolicy.useMutation({
    onSuccess: () => {
      toast.success("Policy brief created successfully");
      refetchPolicies();
      setIsDialogOpen(false);
    },
    onError: (error) => {
      toast.error(`Error creating policy brief: ${error.message}`);
    },
  });

  const updatePolicy = api.policy.updatePolicy.useMutation({
    onSuccess: () => {
      toast.success("Policy brief updated successfully");
      refetchPolicies();
      setIsDialogOpen(false);
      setEditingPolicy(null);
    },
    onError: (error) => {
      toast.error(`Error updating policy brief: ${error.message}`);
    },
  });

  const deletePolicy = api.policy.deletePolicy.useMutation({
    onSuccess: () => {
      toast.success("Policy brief deleted successfully");
      refetchPolicies();
    },
    onError: (error) => {
      toast.error(`Error deleting policy brief: ${error.message}`);
    },
  });

  // Policy form
  const policyForm = useForm<z.infer<typeof policyFormSchema>>({
    resolver: zodResolver(policyFormSchema),
    defaultValues: {
      title: "",
      slug: "",
      summary: "",
      content: "",
      category: "economic",
      thumbnailUrl: "",
      status: "draft",
    },
  });

  const handleAddPolicy = () => {
    setEditingPolicy(null);
    policyForm.reset({
      title: "",
      slug: "",
      summary: "",
      content: "",
      category: "economic",
      thumbnailUrl: "",
      status: "draft",
    });
    setIsDialogOpen(true);
  };

  const handleEditPolicy = (policy: Policy) => {
    setEditingPolicy(policy);
    policyForm.reset({
      id: policy.id,
      title: policy.title,
      slug: policy.slug,
      summary: policy.summary || "",
      content: policy.content,
      category: policy.category as PolicyCategory,
      thumbnailUrl: policy.thumbnailUrl || "",
      status: policy.status as PolicyStatus,
      publishedAt: policy.publishedAt
        ? new Date(policy.publishedAt)
        : undefined,
    });
    setIsDialogOpen(true);
  };

  const handleDeletePolicy = (id: number) => {
    if (window.confirm("Are you sure you want to delete this policy brief?")) {
      deletePolicy.mutate(id);
    }
  };

  const onPolicySubmit = (data: z.infer<typeof policyFormSchema>) => {
    if (data.id) {
      updatePolicy.mutate({ ...data, id: data.id });
    } else {
      createPolicy.mutate(data);
    }
  };

  // Format date
  const formatDate = (date: Date | null | undefined) => {
    if (!date) return "-";
    return format(date, "MMMM d, yyyy");
  };

  // Generate category label
  const generateCategoryLabel = (category: string): string => {
    return category.charAt(0).toUpperCase() + category.slice(1);
  };

  // Generate status label
  const generateStatusLabel = (status: string): string => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Policy Briefs</CardTitle>
        <Button onClick={handleAddPolicy}>
          <Plus className="mr-2 h-4 w-4" />
          Add Policy Brief
        </Button>
      </CardHeader>
      <CardContent>
        {!policies || policies.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="text-lg font-medium">No policy briefs found</div>
            <div className="text-muted-foreground">
              Add your first policy brief using the button above.
            </div>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Published Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {policies.map((policy) => (
                <TableRow key={policy.id}>
                  <TableCell className="font-medium">{policy.title}</TableCell>
                  <TableCell>
                    {generateCategoryLabel(policy.category)}
                  </TableCell>
                  <TableCell>
                    {generateStatusLabel(policy.status ?? "")}
                  </TableCell>
                  <TableCell>{formatDate(policy.publishedAt)}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEditPolicy(policy)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeletePolicy(policy.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>

      {/* Add/Edit Policy Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {editingPolicy ? "Edit Policy Brief" : "Add New Policy Brief"}
            </DialogTitle>
            <DialogDescription>
              {editingPolicy
                ? "Update the details of your policy brief."
                : "Add a new policy brief to your website."}
            </DialogDescription>
          </DialogHeader>

          <Form {...policyForm}>
            <form
              onSubmit={policyForm.handleSubmit(onPolicySubmit)}
              className="space-y-4"
            >
              <FormField
                control={policyForm.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Policy Brief Title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={policyForm.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Slug (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="policy-brief-slug"
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormDescription>
                      Leave blank to auto-generate from title
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={policyForm.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="economic">Economic</SelectItem>
                        <SelectItem value="social">Social</SelectItem>
                        <SelectItem value="environmental">
                          Environmental
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={policyForm.control}
                name="summary"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Summary</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Brief summary of the policy brief"
                        className="h-20"
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={policyForm.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Full content of the policy brief"
                        className="h-32"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={policyForm.control}
                name="thumbnailUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Thumbnail URL</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://example.com/image.jpg"
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={policyForm.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="published">Published</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={policyForm.control}
                name="publishedAt"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Publication Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={`w-full pl-3 text-left font-normal ${
                              !field.value ? "text-muted-foreground" : ""
                            }`}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormDescription>
                      Date when the policy brief was or will be published
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
                <Button type="submit">
                  {editingPolicy
                    ? "Update Policy Brief"
                    : "Create Policy Brief"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
