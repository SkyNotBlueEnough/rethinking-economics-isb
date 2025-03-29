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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Textarea } from "~/components/ui/textarea";
import { toast } from "sonner";
import { api } from "~/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { PlusCircle, Edit, Trash2, PlusSquare } from "lucide-react";
import type { SectionType, AboutOverviewWithCards } from "~/lib/types/about";
import { Skeleton } from "~/components/ui/skeleton";

// Form schema for overview section
const overviewFormSchema = z.object({
  id: z.number().optional(),
  section: z.enum(["mission", "vision", "values", "history"]),
  title: z.string().min(2, "Title must be at least 2 characters"),
  content: z.string().min(10, "Content must be at least 10 characters"),
  displayOrder: z.coerce.number().int().default(0),
});

// Form schema for card
const cardFormSchema = z.object({
  id: z.number().optional(),
  sectionId: z.number(),
  title: z.string().min(2, "Title must be at least 2 characters"),
  content: z.string().min(10, "Content must be at least 10 characters"),
  icon: z.string().optional(),
  displayOrder: z.coerce.number().int().default(0),
});

export default function AdminAboutOverviewPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<SectionType>("mission");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isCardDialogOpen, setIsCardDialogOpen] = useState(false);
  const [editingSection, setEditingSection] =
    useState<AboutOverviewWithCards | null>(null);
  const [editingCard, setEditingCard] = useState<{
    id: number;
    sectionId: number;
    title: string;
    content: string;
    icon?: string;
    displayOrder: number;
  } | null>(null);

  // Queries
  const {
    data: sections,
    isLoading,
    refetch,
  } = api.about.getOverviewSections.useQuery();

  // Mutations
  const upsertSection = api.about.upsertOverviewSection.useMutation({
    onSuccess: () => {
      toast.success("Section saved successfully");
      refetch();
      setIsAddDialogOpen(false);
      setEditingSection(null);
    },
  });

  const createCard = api.about.createCard.useMutation({
    onSuccess: () => {
      toast.success("Card created successfully");
      refetch();
      setIsCardDialogOpen(false);
    },
  });

  const updateCard = api.about.updateCard.useMutation({
    onSuccess: () => {
      toast.success("Card updated successfully");
      refetch();
      setIsCardDialogOpen(false);
      setEditingCard(null);
    },
  });

  const deleteCard = api.about.deleteCard.useMutation({
    onSuccess: () => {
      toast.success("Card deleted successfully");
      refetch();
    },
  });

  const deleteSection = api.about.deleteOverviewSection.useMutation({
    onSuccess: () => {
      toast.success("Section deleted successfully");
      refetch();
    },
  });

  // Section form
  const sectionForm = useForm<z.infer<typeof overviewFormSchema>>({
    resolver: zodResolver(overviewFormSchema),
    defaultValues: {
      section: activeTab,
      title: "",
      content: "",
      displayOrder: 0,
    },
  });

  // Card form
  const cardForm = useForm<z.infer<typeof cardFormSchema>>({
    resolver: zodResolver(cardFormSchema),
    defaultValues: {
      title: "",
      content: "",
      icon: "",
      displayOrder: 0,
    },
  });

  // Filter sections by active tab
  const activeSection = sections?.find(
    (section) => section.section === activeTab,
  );

  const handleEditSection = (section: AboutOverviewWithCards) => {
    setEditingSection(section);
    sectionForm.reset({
      id: section.id,
      section: section.section as SectionType,
      title: section.title,
      content: section.content || "",
      displayOrder: section.displayOrder || 0,
    });
    setIsAddDialogOpen(true);
  };

  const handleEditCard = (card: {
    id: number;
    sectionId: number;
    title: string;
    content: string;
    icon?: string;
    displayOrder: number;
  }) => {
    setEditingCard(card);
    cardForm.reset({
      id: card.id,
      sectionId: card.sectionId,
      title: card.title,
      content: card.content || "",
      icon: card.icon || "",
      displayOrder: card.displayOrder || 0,
    });
    setIsCardDialogOpen(true);
  };

  const handleAddCard = (sectionId: number) => {
    setEditingCard(null);
    cardForm.reset({
      sectionId,
      title: "",
      content: "",
      icon: "",
      displayOrder: 0,
    });
    setIsCardDialogOpen(true);
  };

  const handleDeleteCard = (id: number) => {
    if (confirm("Are you sure you want to delete this card?")) {
      deleteCard.mutate(id);
    }
  };

  const handleDeleteSection = (id: number) => {
    if (
      confirm(
        "Are you sure you want to delete this section? All associated cards will also be deleted.",
      )
    ) {
      deleteSection.mutate(id);
    }
  };

  const onSectionSubmit = (data: z.infer<typeof overviewFormSchema>) => {
    upsertSection.mutate(data);
  };

  const onCardSubmit = (data: z.infer<typeof cardFormSchema>) => {
    if (data.id) {
      updateCard.mutate({
        ...data,
        id: data.id as number,
      });
    } else {
      createCard.mutate(data);
    }
  };

  const handleAddSection = () => {
    setEditingSection(null);
    sectionForm.reset({
      section: activeTab,
      title: "",
      content: "",
      displayOrder: 0,
    });
    setIsAddDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-2xl font-bold">About Us: Overview</div>
          <div className="text-muted-foreground">
            Manage the content for the About Us overview sections
          </div>
        </div>
        <Button onClick={handleAddSection}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Section
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      ) : (
        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as SectionType)}
          className="w-full"
        >
          <TabsList>
            <TabsTrigger value="mission">Mission</TabsTrigger>
            <TabsTrigger value="vision">Vision</TabsTrigger>
            <TabsTrigger value="values">Values</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          <TabsContent value="mission" className="space-y-4">
            {renderSectionContent(
              activeSection,
              handleEditSection,
              handleDeleteSection,
              handleAddCard,
              handleEditCard,
              handleDeleteCard,
            )}
          </TabsContent>

          <TabsContent value="vision" className="space-y-4">
            {renderSectionContent(
              activeSection,
              handleEditSection,
              handleDeleteSection,
              handleAddCard,
              handleEditCard,
              handleDeleteCard,
            )}
          </TabsContent>

          <TabsContent value="values" className="space-y-4">
            {renderSectionContent(
              activeSection,
              handleEditSection,
              handleDeleteSection,
              handleAddCard,
              handleEditCard,
              handleDeleteCard,
            )}
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            {renderSectionContent(
              activeSection,
              handleEditSection,
              handleDeleteSection,
              handleAddCard,
              handleEditCard,
              handleDeleteCard,
            )}
          </TabsContent>
        </Tabs>
      )}

      {/* Add/Edit Section Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {editingSection ? "Edit Section" : "Add New Section"}
            </DialogTitle>
            <DialogDescription>
              Fill in the details for the {activeTab} section.
            </DialogDescription>
          </DialogHeader>
          <Form {...sectionForm}>
            <form
              onSubmit={sectionForm.handleSubmit(onSectionSubmit)}
              className="space-y-4"
            >
              <FormField
                control={sectionForm.control}
                name="section"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Section Type</FormLabel>
                    <FormControl>
                      <select
                        className="w-full rounded-md border border-input bg-background px-3 py-2"
                        {...field}
                      >
                        <option value="mission">Mission</option>
                        <option value="vision">Vision</option>
                        <option value="values">Values</option>
                        <option value="history">History</option>
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={sectionForm.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Our Mission" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={sectionForm.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter section content..."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={sectionForm.control}
                name="displayOrder"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Display Order</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormDescription>
                      Controls the order in which sections appear.
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
                <Button
                  type="submit"
                  disabled={upsertSection.isPending || updateCard.isPending}
                >
                  {upsertSection.isPending || updateCard.isPending
                    ? "Saving..."
                    : "Save"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Add/Edit Card Dialog */}
      <Dialog open={isCardDialogOpen} onOpenChange={setIsCardDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {editingCard ? "Edit Card" : "Add New Card"}
            </DialogTitle>
            <DialogDescription>
              Add a card to the {activeTab} section.
            </DialogDescription>
          </DialogHeader>
          <Form {...cardForm}>
            <form
              onSubmit={cardForm.handleSubmit(onCardSubmit)}
              className="space-y-4"
            >
              <FormField
                control={cardForm.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Card Title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={cardForm.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter card content..."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={cardForm.control}
                name="icon"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Icon (optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Icon name or class" {...field} />
                    </FormControl>
                    <FormDescription>
                      Enter an icon name (e.g., "check" for a checkmark)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={cardForm.control}
                name="displayOrder"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Display Order</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormDescription>
                      Controls the order in which cards appear.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsCardDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={createCard.isPending || updateCard.isPending}
                >
                  {createCard.isPending || updateCard.isPending
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

function renderSectionContent(
  section: AboutOverviewWithCards | undefined,
  onEdit: (section: AboutOverviewWithCards) => void,
  onDelete: (id: number) => void,
  onAddCard: (sectionId: number) => void,
  onEditCard: (card: {
    id: number;
    sectionId: number;
    title: string;
    content: string;
    icon?: string;
    displayOrder: number;
  }) => void,
  onDeleteCard: (id: number) => void,
) {
  if (!section) {
    return (
      <div className="rounded-lg border p-6 text-center">
        <div className="mb-2 text-lg font-medium">No content yet</div>
        <div className="mb-4 text-sm text-muted-foreground">
          Add content for this section to display on the website.
        </div>
      </div>
    );
  }

  return (
    <div>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle>{section.title}</CardTitle>
          <div className="flex gap-2">
            <Button size="sm" variant="ghost" onClick={() => onEdit(section)}>
              <Edit className="h-4 w-4" />
              <span className="sr-only">Edit</span>
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="text-destructive"
              onClick={() => onDelete(section.id)}
            >
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Delete</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-6 text-sm text-muted-foreground">
            {section.content}
          </div>

          <div className="mb-4 flex items-center justify-between">
            <div className="text-sm font-medium">Cards</div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onAddCard(section.id)}
            >
              <PlusCircle className="mr-2 h-3 w-3" />
              Add Card
            </Button>
          </div>

          {section.cards && section.cards.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {section.cards.map((card) => (
                <Card key={card.id} className="overflow-hidden">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-base">{card.title}</CardTitle>
                    <div className="flex gap-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() =>
                          onEditCard({
                            id: card.id,
                            sectionId: card.sectionId as number,
                            title: card.title,
                            content: card.content as string,
                            icon: card.icon as string,
                            displayOrder: card.displayOrder as number,
                          })
                        }
                      >
                        <Edit className="h-3 w-3" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="text-destructive"
                        onClick={() => onDeleteCard(card.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-xs text-muted-foreground">
                      {card.content}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="rounded-lg border p-4 text-center">
              <div className="text-sm text-muted-foreground">
                No cards added yet. Add cards to display in this section.
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
