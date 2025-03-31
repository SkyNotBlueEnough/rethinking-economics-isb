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
import { Checkbox } from "~/components/ui/checkbox";
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
import { Plus, Edit, Trash2 } from "lucide-react";
import { Skeleton } from "~/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import type {
  MembershipType,
  FAQ,
  CollaborationCard,
} from "~/lib/types/memberships";

// Form schema for membership type
const membershipTypeFormSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().optional(),
  benefits: z.string().optional(),
  requiresApproval: z.boolean().default(true),
});

// Form schema for FAQ
const faqFormSchema = z.object({
  id: z.number().optional(),
  question: z.string().min(10, "Question must be at least 10 characters"),
  answer: z.string().min(20, "Answer must be at least 20 characters"),
  category: z.enum(["collaboration", "membership"]),
  displayOrder: z.coerce.number().int().default(0),
});

// Form schema for collaboration card
const collaborationCardFormSchema = z.object({
  id: z.number().optional(),
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().max(1000).optional(),
  iconName: z.string().max(100).optional(),
  bulletPoints: z.string().max(1000).optional(),
  displayOrder: z.coerce.number().int().default(0),
});

export default function AdminMembershipsPage() {
  const router = useRouter();
  const [isAddTypeDialogOpen, setIsAddTypeDialogOpen] = useState(false);
  const [isAddFaqDialogOpen, setIsAddFaqDialogOpen] = useState(false);
  const [isAddCardDialogOpen, setIsAddCardDialogOpen] = useState(false);
  const [editingMembershipType, setEditingMembershipType] =
    useState<MembershipType | null>(null);
  const [editingFaq, setEditingFaq] = useState<FAQ | null>(null);
  const [editingCard, setEditingCard] = useState<CollaborationCard | null>(
    null,
  );
  const [activeTab, setActiveTab] = useState("types");

  // Queries
  const {
    data: membershipTypes,
    isLoading: isLoadingTypes,
    refetch: refetchMembershipTypes,
  } = api.memberships.getAllMembershipTypes.useQuery();

  const {
    data: allFaqs,
    isLoading: isLoadingFaqs,
    refetch: refetchFaqs,
  } = api.memberships.getAllFAQs.useQuery();

  const {
    data: collaborationCards,
    isLoading: isLoadingCards,
    refetch: refetchCards,
  } = api.memberships.getAllCollaborationCards.useQuery();

  // Mutations
  const createMembershipType = api.memberships.createMembershipType.useMutation(
    {
      onSuccess: () => {
        toast.success("Membership type created successfully");
        refetchMembershipTypes();
        setIsAddTypeDialogOpen(false);
      },
    },
  );

  const updateMembershipType = api.memberships.updateMembershipType.useMutation(
    {
      onSuccess: () => {
        toast.success("Membership type updated successfully");
        refetchMembershipTypes();
        setIsAddTypeDialogOpen(false);
        setEditingMembershipType(null);
      },
    },
  );

  const deleteMembershipType = api.memberships.deleteMembershipType.useMutation(
    {
      onSuccess: () => {
        toast.success("Membership type deleted successfully");
        refetchMembershipTypes();
      },
      onError: (error) => {
        toast.error(error.message);
      },
    },
  );

  const createFaq = api.memberships.createFAQ.useMutation({
    onSuccess: () => {
      toast.success("FAQ created successfully");
      refetchFaqs();
      setIsAddFaqDialogOpen(false);
    },
  });

  const updateFaq = api.memberships.updateFAQ.useMutation({
    onSuccess: () => {
      toast.success("FAQ updated successfully");
      refetchFaqs();
      setIsAddFaqDialogOpen(false);
      setEditingFaq(null);
    },
  });

  const deleteFaq = api.memberships.deleteFAQ.useMutation({
    onSuccess: () => {
      toast.success("FAQ deleted successfully");
      refetchFaqs();
    },
  });

  const createCard = api.memberships.createCollaborationCard.useMutation({
    onSuccess: () => {
      toast.success("Collaboration card created successfully");
      refetchCards();
      setIsAddCardDialogOpen(false);
    },
  });

  const updateCard = api.memberships.updateCollaborationCard.useMutation({
    onSuccess: () => {
      toast.success("Collaboration card updated successfully");
      refetchCards();
      setIsAddCardDialogOpen(false);
      setEditingCard(null);
    },
  });

  const deleteCard = api.memberships.deleteCollaborationCard.useMutation({
    onSuccess: () => {
      toast.success("Collaboration card deleted successfully");
      refetchCards();
    },
  });

  // Membership type form
  const membershipTypeForm = useForm<z.infer<typeof membershipTypeFormSchema>>({
    resolver: zodResolver(membershipTypeFormSchema),
    defaultValues: {
      name: "",
      description: "",
      benefits: "",
      requiresApproval: true,
    },
  });

  // FAQ form
  const faqForm = useForm<z.infer<typeof faqFormSchema>>({
    resolver: zodResolver(faqFormSchema),
    defaultValues: {
      question: "",
      answer: "",
      category: "collaboration",
      displayOrder: 0,
    },
  });

  // Collaboration card form
  const cardForm = useForm<z.infer<typeof collaborationCardFormSchema>>({
    resolver: zodResolver(collaborationCardFormSchema),
    defaultValues: {
      title: "",
      description: "",
      iconName: "",
      bulletPoints: "",
      displayOrder: 0,
    },
  });

  // Edit membership type handler
  const handleEditMembershipType = (membershipType: MembershipType) => {
    setEditingMembershipType(membershipType);
    membershipTypeForm.reset({
      id: membershipType.id,
      name: membershipType.name,
      description: membershipType.description ?? "",
      benefits: membershipType.benefits ?? "",
      requiresApproval: !!membershipType.requiresApproval,
    });
    setIsAddTypeDialogOpen(true);
  };

  // Delete membership type handler
  const handleDeleteMembershipType = (id: number) => {
    if (
      window.confirm(
        "Are you sure you want to delete this membership type? This cannot be undone.",
      )
    ) {
      deleteMembershipType.mutate(id);
    }
  };

  // Edit FAQ handler
  const handleEditFaq = (faq: FAQ) => {
    setEditingFaq(faq);
    faqForm.reset({
      id: faq.id,
      question: faq.question,
      answer: faq.answer,
      category: faq.category,
      displayOrder: faq.displayOrder ?? 0,
    });
    setIsAddFaqDialogOpen(true);
  };

  // Delete FAQ handler
  const handleDeleteFaq = (id: number) => {
    if (window.confirm("Are you sure you want to delete this FAQ?")) {
      deleteFaq.mutate(id);
    }
  };

  // Edit collaboration card handler
  const handleEditCard = (card: CollaborationCard) => {
    setEditingCard(card);
    cardForm.reset({
      id: card.id,
      title: card.title,
      description: card.description ?? "",
      iconName: card.iconName ?? "",
      bulletPoints: card.bulletPoints ?? "",
      displayOrder: card.displayOrder ?? 0,
    });
    setIsAddCardDialogOpen(true);
  };

  // Delete collaboration card handler
  const handleDeleteCard = (id: number) => {
    if (
      window.confirm("Are you sure you want to delete this collaboration card?")
    ) {
      deleteCard.mutate(id);
    }
  };

  // Form submit handlers
  const onMembershipTypeSubmit = (
    data: z.infer<typeof membershipTypeFormSchema>,
  ) => {
    if (data.id) {
      updateMembershipType.mutate({ ...data, id: data.id });
    } else {
      createMembershipType.mutate(data);
    }
  };

  const onFaqSubmit = (data: z.infer<typeof faqFormSchema>) => {
    if (data.id) {
      updateFaq.mutate({ ...data, id: data.id });
    } else {
      createFaq.mutate(data);
    }
  };

  const onCardSubmit = (data: z.infer<typeof collaborationCardFormSchema>) => {
    if (data.id) {
      updateCard.mutate({ ...data, id: data.id });
    } else {
      createCard.mutate(data);
    }
  };

  // Add new item handlers
  const handleAddMembershipType = () => {
    setEditingMembershipType(null);
    membershipTypeForm.reset({
      name: "",
      description: "",
      benefits: "",
      requiresApproval: true,
    });
    setIsAddTypeDialogOpen(true);
  };

  const handleAddFaq = () => {
    setEditingFaq(null);
    faqForm.reset({
      question: "",
      answer: "",
      category: "collaboration",
      displayOrder: 0,
    });
    setIsAddFaqDialogOpen(true);
  };

  const handleAddCard = () => {
    setEditingCard(null);
    cardForm.reset({
      title: "",
      description: "",
      iconName: "",
      bulletPoints: "",
      displayOrder: 0,
    });
    setIsAddCardDialogOpen(true);
  };

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <div className="text-2xl font-bold">Memberships Management</div>
          <div className="text-muted-foreground">
            Manage membership types and FAQs
          </div>
        </div>
      </div>

      <Tabs defaultValue="types" onValueChange={setActiveTab} className="mb-8">
        <TabsList>
          <TabsTrigger value="types">Membership Types</TabsTrigger>
          <TabsTrigger value="faqs">FAQs</TabsTrigger>
          <TabsTrigger value="cards">Collaboration Cards</TabsTrigger>
        </TabsList>

        <TabsContent value="types">
          <div className="mb-4 flex justify-end">
            <Button onClick={handleAddMembershipType}>
              <Plus className="mr-2 h-4 w-4" />
              Add Membership Type
            </Button>
          </div>

          {isLoadingTypes ? (
            <MembershipTypesTableSkeleton />
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Membership Types</CardTitle>
              </CardHeader>
              <CardContent>
                {!membershipTypes || membershipTypes.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <div className="text-lg font-medium">
                      No membership types found
                    </div>
                    <div className="text-muted-foreground">
                      Add your first membership type using the button above.
                    </div>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Requires Approval</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {membershipTypes.map((type) => (
                        <TableRow key={type.id}>
                          <TableCell className="font-medium">
                            {type.name}
                          </TableCell>
                          <TableCell className="max-w-md truncate">
                            {type.description || "—"}
                          </TableCell>
                          <TableCell>
                            {type.requiresApproval ? "Yes" : "No"}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEditMembershipType(type)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() =>
                                handleDeleteMembershipType(type.id)
                              }
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
        </TabsContent>

        <TabsContent value="faqs">
          <div className="mb-4 flex justify-end">
            <Button onClick={handleAddFaq}>
              <Plus className="mr-2 h-4 w-4" />
              Add FAQ
            </Button>
          </div>

          {isLoadingFaqs ? (
            <FAQsTableSkeleton />
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Frequently Asked Questions</CardTitle>
              </CardHeader>
              <CardContent>
                {!allFaqs || allFaqs.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <div className="text-lg font-medium">No FAQs found</div>
                    <div className="text-muted-foreground">
                      Add your first FAQ using the button above.
                    </div>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Question</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Display Order</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {allFaqs.map((faq) => (
                        <TableRow key={faq.id}>
                          <TableCell className="max-w-md truncate font-medium">
                            {faq.question}
                          </TableCell>
                          <TableCell className="capitalize">
                            {faq.category === "collaboration" ||
                            faq.category === "membership"
                              ? faq.category
                              : "unknown"}
                          </TableCell>
                          <TableCell>{faq.displayOrder}</TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() =>
                                handleEditFaq({
                                  ...faq,
                                  category: faq.category as
                                    | "collaboration"
                                    | "membership",
                                  displayOrder: faq.displayOrder ?? 0,
                                })
                              }
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteFaq(faq.id ?? 0)}
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
        </TabsContent>

        <TabsContent value="cards">
          <div className="mb-4 flex justify-end">
            <Button onClick={handleAddCard}>
              <Plus className="mr-2 h-4 w-4" />
              Add Collaboration Card
            </Button>
          </div>

          {isLoadingCards ? (
            <CollaborationCardsTableSkeleton />
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Collaboration Cards</CardTitle>
              </CardHeader>
              <CardContent>
                {!collaborationCards || collaborationCards.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <div className="text-lg font-medium">
                      No collaboration cards found
                    </div>
                    <div className="text-muted-foreground">
                      Add your first collaboration card using the button above.
                    </div>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Icon Name</TableHead>
                        <TableHead>Bullet Points</TableHead>
                        <TableHead>Display Order</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {collaborationCards.map((card) => (
                        <TableRow key={card.id}>
                          <TableCell className="font-medium">
                            {card.title}
                          </TableCell>
                          <TableCell className="max-w-md truncate">
                            {card.description || "—"}
                          </TableCell>
                          <TableCell>{card.iconName || "—"}</TableCell>
                          <TableCell>
                            {card.bulletPoints ? (
                              <>
                                {card.bulletPoints.includes(": ") &&
                                card.bulletPoints.indexOf(": ") <
                                  card.bulletPoints.indexOf("\n") ? (
                                  <span className="flex items-center gap-1 text-sm">
                                    <span className="font-medium">
                                      {card.bulletPoints.substring(
                                        0,
                                        card.bulletPoints.indexOf(": ") + 1,
                                      )}
                                    </span>
                                    <span className="text-muted-foreground">
                                      +{" "}
                                      {(card.bulletPoints.match(/\n/g) || [])
                                        .length + 1}{" "}
                                      bullet points
                                    </span>
                                  </span>
                                ) : (
                                  <span className="text-sm text-muted-foreground">
                                    {(card.bulletPoints.match(/\n/g) || [])
                                      .length + 1}{" "}
                                    bullet points
                                  </span>
                                )}
                              </>
                            ) : (
                              "—"
                            )}
                          </TableCell>
                          <TableCell>{card.displayOrder}</TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEditCard(card)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteCard(card.id ?? 0)}
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
        </TabsContent>
      </Tabs>

      {/* Add/Edit Membership Type Dialog */}
      <Dialog open={isAddTypeDialogOpen} onOpenChange={setIsAddTypeDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editingMembershipType
                ? "Edit Membership Type"
                : "Add Membership Type"}
            </DialogTitle>
            <DialogDescription>
              {editingMembershipType
                ? "Update membership type details."
                : "Add a new membership type."}
            </DialogDescription>
          </DialogHeader>

          <Form {...membershipTypeForm}>
            <form
              onSubmit={membershipTypeForm.handleSubmit(onMembershipTypeSubmit)}
              className="space-y-4"
            >
              <FormField
                control={membershipTypeForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Membership type name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={membershipTypeForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe the membership type"
                        className="h-24"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={membershipTypeForm.control}
                name="benefits"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Benefits</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="List the benefits of this membership"
                        className="h-24"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={membershipTypeForm.control}
                name="requiresApproval"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Requires Approval</FormLabel>
                      <FormDescription>
                        If checked, membership applications will require admin
                        approval
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsAddTypeDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {editingMembershipType ? "Update" : "Create"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Add/Edit FAQ Dialog */}
      <Dialog open={isAddFaqDialogOpen} onOpenChange={setIsAddFaqDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingFaq ? "Edit FAQ" : "Add FAQ"}</DialogTitle>
            <DialogDescription>
              {editingFaq
                ? "Update FAQ details."
                : "Add a new frequently asked question."}
            </DialogDescription>
          </DialogHeader>

          <Form {...faqForm}>
            <form
              onSubmit={faqForm.handleSubmit(onFaqSubmit)}
              className="space-y-4"
            >
              <FormField
                control={faqForm.control}
                name="question"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Question</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter the question" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={faqForm.control}
                name="answer"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Answer</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter the answer"
                        className="h-24"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={faqForm.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <div className="flex flex-col space-y-2">
                      <div className="flex items-center space-x-2">
                        <input
                          type="radio"
                          id="collaboration"
                          value="collaboration"
                          checked={field.value === "collaboration"}
                          onChange={() => field.onChange("collaboration")}
                        />
                        <label htmlFor="collaboration">Collaboration</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="radio"
                          id="membership"
                          value="membership"
                          checked={field.value === "membership"}
                          onChange={() => field.onChange("membership")}
                        />
                        <label htmlFor="membership">Membership</label>
                      </div>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={faqForm.control}
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
                  onClick={() => setIsAddFaqDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {editingFaq ? "Update" : "Create"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Add/Edit Collaboration Card Dialog */}
      <Dialog open={isAddCardDialogOpen} onOpenChange={setIsAddCardDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editingCard
                ? "Edit Collaboration Card"
                : "Add Collaboration Card"}
            </DialogTitle>
            <DialogDescription>
              {editingCard
                ? "Update collaboration card details."
                : "Add a new collaboration card."}
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
                      <Input placeholder="Enter the title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={cardForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter the description"
                        className="h-24"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={cardForm.control}
                name="iconName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Icon Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter the icon name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={cardForm.control}
                name="bulletPoints"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bullet Points</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Research Areas: Monetary policy
Economic inequality
Environmental economics
Labor markets"
                        className="h-32"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription className="text-sm">
                      <div className="mb-2">
                        To add a custom heading for bullet points:
                      </div>
                      <ol className="ml-5 list-decimal space-y-1">
                        <li>
                          Start with your heading followed by a colon and space
                          on the first line (e.g.,{" "}
                          <span className="font-mono">
                            &quot;Research Areas: &quot;
                          </span>
                          )
                        </li>
                        <li>Add each bullet point on a new line below</li>
                      </ol>
                      <div className="mt-2">
                        This will show as{" "}
                        <span className="font-medium">
                          &quot;Research Areas:&quot;
                        </span>{" "}
                        as the heading and the rest as bullet points.
                      </div>
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
                  onClick={() => setIsAddCardDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {editingCard ? "Update" : "Create"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function MembershipTypesTableSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <Skeleton className="h-6 w-36" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b pb-4">
            <div className="flex space-x-8">
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-6 w-20" />
            </div>
            <Skeleton className="h-6 w-16" />
          </div>

          <div className="flex items-center justify-between border-b pb-4">
            <div className="flex space-x-8">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-6 w-60" />
              <Skeleton className="h-6 w-12" />
            </div>
            <div className="flex space-x-2">
              <Skeleton className="h-8 w-8" />
              <Skeleton className="h-8 w-8" />
            </div>
          </div>
          <div className="flex items-center justify-between border-b pb-4">
            <div className="flex space-x-8">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-6 w-60" />
              <Skeleton className="h-6 w-12" />
            </div>
            <div className="flex space-x-2">
              <Skeleton className="h-8 w-8" />
              <Skeleton className="h-8 w-8" />
            </div>
          </div>
          <div className="flex items-center justify-between border-b pb-4">
            <div className="flex space-x-8">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-6 w-60" />
              <Skeleton className="h-6 w-12" />
            </div>
            <div className="flex space-x-2">
              <Skeleton className="h-8 w-8" />
              <Skeleton className="h-8 w-8" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function FAQsTableSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <Skeleton className="h-6 w-36" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b pb-4">
            <div className="flex space-x-8">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-6 w-16" />
            </div>
            <Skeleton className="h-6 w-16" />
          </div>

          <div className="flex items-center justify-between border-b pb-4">
            <div className="flex space-x-8">
              <Skeleton className="h-6 w-64" />
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-6 w-12" />
            </div>
            <div className="flex space-x-2">
              <Skeleton className="h-8 w-8" />
              <Skeleton className="h-8 w-8" />
            </div>
          </div>
          <div className="flex items-center justify-between border-b pb-4">
            <div className="flex space-x-8">
              <Skeleton className="h-6 w-64" />
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-6 w-12" />
            </div>
            <div className="flex space-x-2">
              <Skeleton className="h-8 w-8" />
              <Skeleton className="h-8 w-8" />
            </div>
          </div>
          <div className="flex items-center justify-between border-b pb-4">
            <div className="flex space-x-8">
              <Skeleton className="h-6 w-64" />
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-6 w-12" />
            </div>
            <div className="flex space-x-2">
              <Skeleton className="h-8 w-8" />
              <Skeleton className="h-8 w-8" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function CollaborationCardsTableSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <Skeleton className="h-6 w-36" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b pb-4">
            <div className="flex space-x-8">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-6 w-16" />
            </div>
            <Skeleton className="h-6 w-16" />
          </div>

          <div className="flex items-center justify-between border-b pb-4">
            <div className="flex space-x-8">
              <Skeleton className="h-6 w-64" />
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-6 w-12" />
            </div>
            <div className="flex space-x-2">
              <Skeleton className="h-8 w-8" />
              <Skeleton className="h-8 w-8" />
            </div>
          </div>
          <div className="flex items-center justify-between border-b pb-4">
            <div className="flex space-x-8">
              <Skeleton className="h-6 w-64" />
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-6 w-12" />
            </div>
            <div className="flex space-x-2">
              <Skeleton className="h-8 w-8" />
              <Skeleton className="h-8 w-8" />
            </div>
          </div>
          <div className="flex items-center justify-between border-b pb-4">
            <div className="flex space-x-8">
              <Skeleton className="h-6 w-64" />
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-6 w-12" />
            </div>
            <div className="flex space-x-2">
              <Skeleton className="h-8 w-8" />
              <Skeleton className="h-8 w-8" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
