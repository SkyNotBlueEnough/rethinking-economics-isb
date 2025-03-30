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
import { PlusCircle, Edit, Trash2, Image, Link } from "lucide-react";
import type { Partner, PartnerCategory } from "~/lib/types/about";
import { Skeleton } from "~/components/ui/skeleton";

// Form schema for partner
const partnerFormSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  logoUrl: z.string().optional(),
  website: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  category: z.enum(["academic", "policy", "civil_society"]),
  displayOrder: z.coerce.number().int().default(0),
});

export default function AdminAboutPartnersPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<PartnerCategory>("academic");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null);

  // Queries
  const {
    data: allPartners,
    isLoading,
    refetch,
  } = api.about.getAllPartners.useQuery();

  // Filter partners by category
  const academicPartners =
    allPartners?.filter((partner) => partner.category === "academic") ?? [];
  const policyPartners =
    allPartners?.filter((partner) => partner.category === "policy") ?? [];
  const civilSocietyPartners =
    allPartners?.filter((partner) => partner.category === "civil_society") ??
    [];

  // Mutations
  const createPartner = api.about.createPartner.useMutation({
    onSuccess: () => {
      toast.success("Partner added successfully");
      refetch();
      setIsDialogOpen(false);
    },
  });

  const updatePartner = api.about.updatePartner.useMutation({
    onSuccess: () => {
      toast.success("Partner updated successfully");
      refetch();
      setIsDialogOpen(false);
      setEditingPartner(null);
    },
  });

  const deletePartner = api.about.deletePartner.useMutation({
    onSuccess: () => {
      toast.success("Partner deleted successfully");
      refetch();
    },
  });

  // Form
  const form = useForm<z.infer<typeof partnerFormSchema>>({
    resolver: zodResolver(partnerFormSchema),
    defaultValues: {
      name: "",
      description: "",
      logoUrl: "",
      website: "",
      category: activeTab,
      displayOrder: 0,
    },
  });

  const handleAddPartner = () => {
    setEditingPartner(null);
    form.reset({
      name: "",
      description: "",
      logoUrl: "",
      website: "",
      category: activeTab,
      displayOrder: 0,
    });
    setIsDialogOpen(true);
  };

  const handleEditPartner = (partner: Partner) => {
    setEditingPartner(partner);
    form.reset({
      id: partner.id,
      name: partner.name,
      description: partner.description || "",
      logoUrl: partner.logoUrl || "",
      website: partner.website || "",
      category: partner.category as PartnerCategory,
      displayOrder: partner.displayOrder || 0,
    });
    setIsDialogOpen(true);
  };

  const handleDeletePartner = (id: number) => {
    if (confirm("Are you sure you want to delete this partner?")) {
      deletePartner.mutate(id);
    }
  };

  const onSubmit = (data: z.infer<typeof partnerFormSchema>) => {
    if (data.id) {
      updatePartner.mutate({
        ...data,
        id: data.id as number,
      });
    } else {
      createPartner.mutate(data);
    }
  };

  // Get current active partners based on tab
  const getActivePartners = () => {
    switch (activeTab) {
      case "academic":
        return academicPartners;
      case "policy":
        return policyPartners;
      case "civil_society":
        return civilSocietyPartners;
      default:
        return [];
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-2xl font-bold">About Us: Partners</div>
          <div className="text-muted-foreground">
            Manage organizational partners displayed on the website
          </div>
        </div>
        <Button onClick={handleAddPartner}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Partner
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-48 w-full" />
            ))}
          </div>
        </div>
      ) : (
        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as PartnerCategory)}
          className="w-full"
        >
          <TabsList>
            <TabsTrigger value="academic">Academic Institutions</TabsTrigger>
            <TabsTrigger value="policy">Policy Organizations</TabsTrigger>
            <TabsTrigger value="civil_society">Civil Society</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-6">
            {getActivePartners().length === 0 ? (
              <div className="rounded-lg border p-6 text-center">
                <div className="mb-2 text-lg font-medium">No partners yet</div>
                <div className="mb-4 text-sm text-muted-foreground">
                  Add partners to display in this section.
                </div>
                <Button onClick={handleAddPartner}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Partner
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {getActivePartners().map((partner) => (
                  <Card key={partner.id} className="overflow-hidden">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle>{partner.name}</CardTitle>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEditPartner(partner)}
                        >
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-destructive"
                          onClick={() => handleDeletePartner(partner.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-3 flex h-12 items-center">
                        {partner.logoUrl ? (
                          <div className="text-xs text-muted-foreground">
                            Logo URL: {partner.logoUrl.substring(0, 30)}
                            {partner.logoUrl.length > 30 ? "..." : ""}
                          </div>
                        ) : (
                          <div className="rounded bg-muted px-2 py-1 text-xs">
                            No logo
                          </div>
                        )}
                      </div>
                      <div className="mb-2 line-clamp-2 text-sm text-muted-foreground">
                        {partner.description}
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        {partner.website ? (
                          <>
                            <Link className="h-3 w-3" />
                            <a
                              href={partner.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary hover:underline"
                            >
                              {partner.website.replace(/^https?:\/\//, "")}
                            </a>
                          </>
                        ) : (
                          <span className="text-muted-foreground">
                            No website
                          </span>
                        )}
                      </div>
                      <div className="mt-3 text-xs text-muted-foreground">
                        Display order: {partner.displayOrder || 0}
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
              {editingPartner ? "Edit Partner" : "Add New Partner"}
            </DialogTitle>
            <DialogDescription>
              Fill in the details for the partner organization.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Organization Name</FormLabel>
                    <FormControl>
                      <Input placeholder="University of Karachi" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe the partnership..."
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
                name="logoUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Logo URL</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://example.com/logo.png"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Provide a URL to the organization&apos;s logo
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="website"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Website</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com" {...field} />
                    </FormControl>
                    <FormDescription>
                      The organization&apos;s official website
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
                        <option value="academic">Academic Institution</option>
                        <option value="policy">Policy Organization</option>
                        <option value="civil_society">Civil Society</option>
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
                      Controls the order in which partners appear (lower numbers
                      first)
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
                  disabled={createPartner.isPending || updatePartner.isPending}
                >
                  {createPartner.isPending || updatePartner.isPending
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
