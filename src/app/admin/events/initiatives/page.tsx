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
  DialogTrigger,
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
import { Textarea } from "~/components/ui/textarea";
import { toast } from "sonner";
import { api } from "~/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Plus, Edit, Trash2, FileText, Layers } from "lucide-react";
import type { Initiative, InitiativeCategory } from "~/lib/types/events";
import { Skeleton } from "~/components/ui/skeleton";

// Form schema for initiative
const initiativeFormSchema = z.object({
  id: z.number().optional(),
  title: z.string().min(2, "Title must be at least 2 characters"),
  description: z.string().optional(),
  category: z.enum(["education", "policy", "community", "research"]),
  iconName: z.string().optional(),
  displayOrder: z.coerce.number().int().default(0),
});

export default function AdminInitiativesPage() {
  const router = useRouter();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingInitiative, setEditingInitiative] = useState<Initiative | null>(
    null,
  );

  // Queries
  const {
    data: initiatives,
    isLoading,
    refetch: refetchInitiatives,
  } = api.events.getAllInitiatives.useQuery();

  // Mutations
  const createInitiative = api.events.createInitiative.useMutation({
    onSuccess: () => {
      toast.success("Initiative created successfully");
      refetchInitiatives();
      setIsAddDialogOpen(false);
    },
  });

  const updateInitiative = api.events.updateInitiative.useMutation({
    onSuccess: () => {
      toast.success("Initiative updated successfully");
      refetchInitiatives();
      setIsAddDialogOpen(false);
      setEditingInitiative(null);
    },
  });

  const deleteInitiative = api.events.deleteInitiative.useMutation({
    onSuccess: () => {
      toast.success("Initiative deleted successfully");
      refetchInitiatives();
    },
  });

  // Initiative form
  const initiativeForm = useForm<z.infer<typeof initiativeFormSchema>>({
    resolver: zodResolver(initiativeFormSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "education",
      iconName: "",
      displayOrder: 0,
    },
  });

  const handleEditInitiative = (initiative: Initiative) => {
    setEditingInitiative(initiative);
    initiativeForm.reset({
      id: initiative.id,
      title: initiative.title,
      description: initiative.description ?? "",
      category: initiative.category as InitiativeCategory,
      iconName: initiative.iconName ?? "",
      displayOrder: initiative.displayOrder ?? 0,
    });
    setIsAddDialogOpen(true);
  };

  const handleDeleteInitiative = (id: number) => {
    if (window.confirm("Are you sure you want to delete this initiative?")) {
      deleteInitiative.mutate(id);
    }
  };

  const onInitiativeSubmit = (data: z.infer<typeof initiativeFormSchema>) => {
    if (data.id) {
      updateInitiative.mutate({ ...data, id: data.id });
    } else {
      createInitiative.mutate(data);
    }
  };

  const handleAddInitiative = () => {
    setEditingInitiative(null);
    initiativeForm.reset({
      title: "",
      description: "",
      category: "education",
      iconName: "",
      displayOrder: 0,
    });
    setIsAddDialogOpen(true);
  };

  const generateCategoryLabel = (category: string): string => {
    return category
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <div className="text-2xl font-bold">Initiatives Management</div>
          <div className="text-muted-foreground">
            Manage ongoing initiatives and programs
          </div>
        </div>
        <Button onClick={handleAddInitiative}>
          <Plus className="mr-2 h-4 w-4" />
          Add Initiative
        </Button>
      </div>

      {isLoading ? (
        <InitiativesTableSkeleton />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Initiatives</CardTitle>
          </CardHeader>
          <CardContent>
            {!initiatives || initiatives.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="text-lg font-medium">No initiatives found</div>
                <div className="text-muted-foreground">
                  Add your first initiative using the button above.
                </div>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Display Order</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {initiatives.map((initiative) => (
                    <TableRow key={initiative.id}>
                      <TableCell className="font-medium">
                        {initiative.title}
                      </TableCell>
                      <TableCell>
                        {generateCategoryLabel(initiative.category)}
                      </TableCell>
                      <TableCell>{initiative.displayOrder}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditInitiative(initiative)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteInitiative(initiative.id)}
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
        </Card>
      )}

      {/* Add/Edit Initiative Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editingInitiative ? "Edit Initiative" : "Add New Initiative"}
            </DialogTitle>
            <DialogDescription>
              {editingInitiative
                ? "Update the details of your initiative."
                : "Add a new initiative to your website."}
            </DialogDescription>
          </DialogHeader>

          <Form {...initiativeForm}>
            <form
              onSubmit={initiativeForm.handleSubmit(onInitiativeSubmit)}
              className="space-y-4"
            >
              <FormField
                control={initiativeForm.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Initiative title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={initiativeForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe your initiative"
                        className="h-24"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={initiativeForm.control}
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
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="education">Education</SelectItem>
                        <SelectItem value="policy">Policy</SelectItem>
                        <SelectItem value="community">Community</SelectItem>
                        <SelectItem value="research">Research</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={initiativeForm.control}
                name="iconName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Icon Name (optional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. book, people, globe"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Enter a Lucide icon name (see lucide.dev for options)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={initiativeForm.control}
                name="displayOrder"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Display Order</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="0"
                        {...field}
                        onChange={(e) => {
                          field.onChange(Number.parseInt(e.target.value, 10));
                        }}
                      />
                    </FormControl>
                    <FormDescription>
                      Lower numbers appear first
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsAddDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {editingInitiative
                    ? "Update Initiative"
                    : "Create Initiative"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function InitiativesTableSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <Skeleton className="h-6 w-24" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b pb-4">
            <div className="flex space-x-4">
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-6 w-20" />
            </div>
            <Skeleton className="h-6 w-20" />
          </div>

          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={`skeleton-row-${i + 1}`}
              className="flex items-center justify-between border-b pb-4"
            >
              <div className="flex space-x-4">
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-6 w-20" />
              </div>
              <div className="flex space-x-2">
                <Skeleton className="h-8 w-8" />
                <Skeleton className="h-8 w-8" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
