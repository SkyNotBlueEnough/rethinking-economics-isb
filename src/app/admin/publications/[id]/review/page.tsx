"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { format } from "date-fns";

import { api } from "~/trpc/react";
import { Button } from "~/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";
import { Textarea } from "~/components/ui/textarea";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { LoadingSpinner } from "~/components/ui/loading-spinner";
import { Separator } from "~/components/ui/separator";
import { toast } from "sonner";
import { MarkdownEditor } from "~/components/ui/markdown-editor";

// Content renderer component that safely handles HTML content from trusted sources
const ContentRenderer = ({ content }: { content: string }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div
      className="prose-custom prose prose-sm dark:prose-invert sm:prose-base lg:prose-lg max-w-none"
      // biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
};

// Publication review page component
export default function PublicationReviewPage() {
  const router = useRouter();
  const params = useParams();
  const id = Number.parseInt(params.id as string, 10);

  const [activeTab, setActiveTab] = useState<"preview" | "edit" | "reject">(
    "preview",
  );
  const [rejectionReason, setRejectionReason] = useState("");
  const [rejectionDetails, setRejectionDetails] = useState("");
  const [modifications, setModifications] = useState({
    title: "",
    abstract: "",
    content: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch publication data
  const { data: publication, isLoading } =
    api.admin.getPublicationById.useQuery({ id });

  useEffect(() => {
    if (publication) {
      setModifications({
        title: publication.title ?? "",
        abstract: publication.abstract ?? "",
        content: publication.content ?? "",
      });
    }
  }, [publication]);

  // API mutations
  const approvePublicationMutation = api.admin.approvePublication.useMutation({
    onSuccess: () => {
      toast.success("Publication approved successfully");
      router.push("/admin/publications");
    },
    onError: (error) => {
      toast.error(`Error approving publication: ${error.message}`);
      setIsSubmitting(false);
    },
  });

  const rejectPublicationMutation = api.admin.rejectPublication.useMutation({
    onSuccess: () => {
      toast.success("Publication rejected successfully");
      router.push("/admin/publications");
    },
    onError: (error) => {
      toast.error(`Error rejecting publication: ${error.message}`);
      setIsSubmitting(false);
    },
  });

  // Handle approve action
  const handleApprove = () => {
    setIsSubmitting(true);
    // Check if any modifications were made
    const hasModifications =
      modifications.title !== (publication?.title ?? "") ||
      modifications.abstract !== (publication?.abstract ?? "") ||
      modifications.content !== (publication?.content ?? "");

    approvePublicationMutation.mutate({
      id,
      ...(hasModifications && {
        modifications: {
          title:
            modifications.title !== (publication?.title ?? "")
              ? modifications.title
              : undefined,
          abstract:
            modifications.abstract !== (publication?.abstract ?? "")
              ? modifications.abstract
              : undefined,
          content:
            modifications.content !== (publication?.content ?? "")
              ? modifications.content
              : undefined,
        },
      }),
    });
  };

  // Handle reject action
  const handleReject = () => {
    if (!rejectionReason.trim()) {
      toast.error("Please provide a rejection reason");
      return;
    }

    setIsSubmitting(true);
    rejectPublicationMutation.mutate({
      id,
      rejectionReason: {
        reason: rejectionReason,
        details: rejectionDetails ?? undefined,
      },
    });
  };

  // Handle changes to modification fields
  const handleModificationChange = (
    field: keyof typeof modifications,
    value: string,
  ) => {
    setModifications((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  if (isLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!publication) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Publication Not Found</CardTitle>
          <CardDescription>
            The publication you are looking for could not be found.
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Button onClick={() => router.push("/admin/publications")}>
            Back to Publications
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-3xl font-bold">Review Publication</div>
          <div className="text-muted-foreground">
            Approve, reject, or modify this publication
          </div>
        </div>
        <Button
          variant="outline"
          onClick={() => router.push("/admin/publications")}
        >
          Back to List
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <CardTitle>{publication.title}</CardTitle>
            <Badge variant="warning" className="mt-2 md:mt-0">
              {publication?.status?.replace(/_/g, " ")}
            </Badge>
          </div>
          <CardDescription>
            By {publication.authorId ?? "Unknown"} •
            {publication.createdAt && (
              <span>
                {" "}
                Created on{" "}
                {format(new Date(publication.createdAt), "MMM d, yyyy")}
              </span>
            )}
          </CardDescription>
        </CardHeader>
        <Separator />
        <CardContent className="pt-6">
          <Tabs
            value={activeTab}
            onValueChange={(v) =>
              setActiveTab(v as "preview" | "edit" | "reject")
            }
          >
            <TabsList className="mb-6">
              <TabsTrigger value="preview">Preview</TabsTrigger>
              <TabsTrigger value="edit">Edit</TabsTrigger>
              <TabsTrigger value="reject">Reject</TabsTrigger>
            </TabsList>

            {/* Preview Tab */}
            <TabsContent value="preview" className="space-y-6">
              <div>
                <div className="mb-2 text-lg font-medium">Abstract</div>
                <div className="rounded-md bg-muted p-4">
                  {publication.abstract ?? "No abstract provided"}
                </div>
              </div>

              <div>
                <div className="mb-2 text-lg font-medium">Content</div>
                <div className="rounded-md bg-muted/30 p-4">
                  {publication.content ? (
                    <ContentRenderer content={publication.content} />
                  ) : (
                    "No content provided"
                  )}
                </div>
              </div>

              {publication.categories?.length > 0 && (
                <div>
                  <div className="mb-2 text-lg font-medium">Categories</div>
                  <div className="flex flex-wrap gap-2">
                    {publication.categories.map((category) => (
                      <Badge key={category.id} variant="secondary">
                        {category.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {publication.tags?.length > 0 && (
                <div>
                  <div className="mb-2 text-lg font-medium">Tags</div>
                  <div className="flex flex-wrap gap-2">
                    {publication.tags.map((tag) => (
                      <Badge key={tag.id} variant="outline">
                        {tag.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-4">
                <Button onClick={handleApprove} disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <LoadingSpinner size="sm" className="mr-2" />
                      Approving...
                    </>
                  ) : (
                    "Approve Publication"
                  )}
                </Button>
              </div>
            </TabsContent>

            {/* Edit Tab */}
            <TabsContent value="edit" className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={modifications.title}
                    onChange={(e) =>
                      handleModificationChange("title", e.target.value)
                    }
                  />
                </div>

                <div>
                  <Label htmlFor="abstract">Abstract</Label>
                  <Textarea
                    id="abstract"
                    rows={4}
                    value={modifications.abstract}
                    onChange={(e) =>
                      handleModificationChange("abstract", e.target.value)
                    }
                  />
                </div>

                <div>
                  <Label htmlFor="content">Content</Label>
                  <MarkdownEditor
                    content={modifications.content}
                    onChange={(value) =>
                      handleModificationChange("content", value)
                    }
                    className="min-h-[400px]"
                  />
                  <div className="mt-2 text-xs text-muted-foreground">
                    Use the toolbar to format the content with headings, lists,
                    links, and more.
                  </div>
                </div>

                <div className="pt-4">
                  <Button onClick={handleApprove} disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <LoadingSpinner size="sm" className="mr-2" />
                        Approving with Changes...
                      </>
                    ) : (
                      "Approve with Changes"
                    )}
                  </Button>
                </div>
              </div>
            </TabsContent>

            {/* Reject Tab */}
            <TabsContent value="reject" className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="rejectionReason" className="text-destructive">
                    Rejection Reason *
                  </Label>
                  <Input
                    id="rejectionReason"
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    className="border-destructive/50"
                    placeholder="Provide a concise reason for rejection"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="rejectionDetails">
                    Additional Details (Optional)
                  </Label>
                  <Textarea
                    id="rejectionDetails"
                    rows={6}
                    value={rejectionDetails}
                    onChange={(e) => setRejectionDetails(e.target.value)}
                    placeholder="Provide more details or feedback for the author"
                  />
                </div>

                <div className="pt-4">
                  <Button
                    variant="destructive"
                    onClick={handleReject}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <LoadingSpinner size="sm" className="mr-2" />
                        Rejecting...
                      </>
                    ) : (
                      "Reject Publication"
                    )}
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
