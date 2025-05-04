"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

import { api } from "~/trpc/react";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { LoadingSpinner } from "~/components/ui/loading-spinner";
import { toast } from "sonner";
import { Separator } from "~/components/ui/separator";
import { Badge } from "~/components/ui/badge";
import {
  MarkdownEditor,
  MarkdownEditorSkeleton,
} from "~/components/ui/markdown-editor";
import { ThumbnailUploader } from "~/components/thumbnail-uploader";

// Publication types
const PUBLICATION_TYPES = [
  { value: "research_paper", label: "Research Paper" },
  { value: "policy_brief", label: "Policy Brief" },
  { value: "opinion", label: "Opinion" },
  { value: "blog_post", label: "Blog Post" },
] as const;

type PublicationType = (typeof PUBLICATION_TYPES)[number]["value"];

// Publication statuses
const PUBLICATION_STATUSES = [
  { value: "draft", label: "Draft" },
  { value: "pending_review", label: "Pending Review" },
  { value: "published", label: "Published" },
  { value: "rejected", label: "Rejected" },
] as const;

type PublicationStatus = (typeof PUBLICATION_STATUSES)[number]["value"];

// Form data type
interface FormData {
  authorId: string;
  title: string;
  abstract: string;
  content: string;
  type: PublicationType;
  status: PublicationStatus;
  tags: string;
  categories: string;
  thumbnailUrl: string | null;
}

export default function EditPublicationPage() {
  const router = useRouter();
  const params = useParams();
  const id = Number.parseInt(params.id as string, 10);

  const [formData, setFormData] = useState<FormData>({
    authorId: "",
    title: "",
    abstract: "",
    content: "",
    type: "blog_post",
    status: "published",
    tags: "",
    categories: "",
    thumbnailUrl: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  // Fetch publication data
  const { data: publication, isLoading: isLoadingPublication } =
    api.admin.getPublicationById.useQuery({ id });

  // Fetch users for author selection
  const { data: users, isLoading: isLoadingUsers } =
    api.admin.getUsers.useQuery({
      search: "",
    });

  // Set initial form data when publication loads
  useEffect(() => {
    if (publication) {
      setFormData({
        authorId: publication.authorId ?? "",
        title: publication.title ?? "",
        abstract: publication.abstract ?? "",
        content: publication.content ?? "",
        type: publication.type ?? "blog_post",
        status: publication.status ?? "published",
        tags: publication.tags?.map((tag) => tag.name).join(", ") ?? "",
        categories:
          publication.categories?.map((category) => category.name).join(", ") ??
          "",
        thumbnailUrl: publication.thumbnailUrl ?? null,
      });
      setInitialLoading(false);
    }
  }, [publication]);

  // Update publication mutation
  const updatePublication = api.admin.updatePublication.useMutation({
    onSuccess: () => {
      toast.success("Publication updated successfully");
      router.push("/admin/publications");
    },
    onError: (error) => {
      toast.error(`Error updating publication: ${error.message}`);
      setIsSubmitting(false);
    },
  });

  // Handle form input change with appropriate type handling
  function handleInputChange<K extends keyof FormData>(
    field: K,
    value: FormData[K],
  ): void {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }

  // Handle thumbnail upload
  const handleThumbnailUpload = (url: string) => {
    handleInputChange("thumbnailUrl", url);
  };

  // Handle thumbnail removal
  const handleThumbnailRemove = () => {
    handleInputChange("thumbnailUrl", null);
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Form validation
    if (!formData.authorId) {
      toast.error("Please select an author");
      return;
    }

    if (!formData.title.trim()) {
      toast.error("Please enter a title");
      return;
    }

    if (!formData.content.trim()) {
      toast.error("Please enter content");
      return;
    }

    setIsSubmitting(true);

    // Process tags and categories from comma-separated strings to arrays
    const tags = formData.tags
      ? formData.tags.split(",").map((tag) => tag.trim())
      : [];

    const categories = formData.categories
      ? formData.categories.split(",").map((category) => category.trim())
      : [];

    // Submit the form
    updatePublication.mutate({
      id,
      authorId: formData.authorId,
      title: formData.title,
      abstract: formData.abstract,
      content: formData.content,
      type: formData.type,
      status: formData.status,
      tags: tags.length > 0 ? tags : undefined,
      categories: categories.length > 0 ? categories : undefined,
      thumbnailUrl: formData.thumbnailUrl,
    });
  };

  if (isLoadingPublication ?? isLoadingUsers ?? initialLoading) {
    return (
      <div className="flex flex-col space-y-4">
        <div className="h-10 w-48 animate-pulse rounded-md bg-muted/60" />
        <Card>
          <CardHeader>
            <div className="h-7 w-40 animate-pulse rounded-md bg-muted/60" />
            <div className="h-5 w-72 animate-pulse rounded-md bg-muted/40" />
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Thumbnail loading skeleton */}
            <div className="space-y-2">
              <div className="h-5 w-28 animate-pulse rounded-md bg-muted/60" />
              <div className="h-40 max-w-md animate-pulse rounded-md bg-muted/40" />
            </div>
            <Separator />
            <div className="space-y-2">
              <div className="h-5 w-20 animate-pulse rounded-md bg-muted/60" />
              <div className="h-10 w-full animate-pulse rounded-md bg-muted/40" />
            </div>
            <Separator />
            <div className="space-y-2">
              <div className="h-5 w-32 animate-pulse rounded-md bg-muted/60" />
              <div className="h-10 w-full animate-pulse rounded-md bg-muted/40" />
            </div>
            <div className="space-y-2">
              <div className="h-5 w-24 animate-pulse rounded-md bg-muted/60" />
              <div className="h-10 w-full animate-pulse rounded-md bg-muted/40" />
            </div>
            <div className="space-y-2">
              <div className="h-5 w-20 animate-pulse rounded-md bg-muted/60" />
              <div className="h-24 w-full animate-pulse rounded-md bg-muted/40" />
            </div>
            <div className="space-y-2">
              <div className="h-5 w-20 animate-pulse rounded-md bg-muted/60" />
              <MarkdownEditorSkeleton className="min-h-[400px]" />
            </div>
          </CardContent>
          <CardFooter>
            <div className="h-10 w-24 animate-pulse rounded-md bg-muted/40" />
          </CardFooter>
        </Card>
      </div>
    );
  }

  if (!publication) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Publication Not Found</CardTitle>
          <CardDescription>
            The publication you are trying to edit could not be found.
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
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <div className="text-3xl font-bold">Edit Publication</div>
          <div className="text-muted-foreground">
            Modify the publication details
          </div>
        </div>
        <Button
          variant="outline"
          onClick={() => router.push("/admin/publications")}
        >
          Cancel
        </Button>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Publication Details</CardTitle>
            <CardDescription>
              Update the details for this publication
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Thumbnail Uploader */}
            <div className="space-y-2">
              <Label htmlFor="thumbnail">
                Thumbnail{" "}
                <span className="text-muted-foreground">(Optional)</span>
              </Label>
              <ThumbnailUploader
                initialThumbnailUrl={formData.thumbnailUrl}
                onUploadComplete={handleThumbnailUpload}
                onRemove={handleThumbnailRemove}
                thumbnailClassName="max-w-full h-auto max-h-64 w-full"
              />
              <div className="text-xs text-muted-foreground">
                Upload a thumbnail image for this publication. Recommended size:
                1200x630 pixels.
              </div>
            </div>

            <Separator />

            {/* Author Selection */}
            <div className="space-y-2">
              <Label htmlFor="authorId">Author</Label>
              <Select
                value={formData.authorId}
                onValueChange={(value) => handleInputChange("authorId", value)}
              >
                <SelectTrigger id="authorId">
                  <SelectValue placeholder="Select author" />
                </SelectTrigger>
                <SelectContent>
                  {users && users.length > 0 ? (
                    users.map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.name ?? user.id}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="" disabled>
                      No users available
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            <Separator />

            {/* Publication Type */}
            <div className="space-y-2">
              <Label htmlFor="type">Publication Type</Label>
              <Select
                value={formData.type}
                onValueChange={(value: PublicationType) =>
                  handleInputChange("type", value)
                }
              >
                <SelectTrigger id="type">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {PUBLICATION_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Publication Status */}
            <div className="space-y-2">
              <Label htmlFor="status">Publication Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value: PublicationStatus) =>
                  handleInputChange("status", value)
                }
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {PUBLICATION_STATUSES.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="text-sm text-muted-foreground">
                Note: If changing to published, the publication will be
                immediately visible to users
              </div>
            </div>

            <Separator />

            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                placeholder="Enter publication title"
              />
            </div>

            {/* Abstract */}
            <div className="space-y-2">
              <Label htmlFor="abstract">
                Abstract{" "}
                <span className="text-muted-foreground">(Optional)</span>
              </Label>
              <Textarea
                id="abstract"
                rows={3}
                value={formData.abstract}
                onChange={(e) => handleInputChange("abstract", e.target.value)}
                placeholder="Enter a brief abstract"
              />
            </div>

            {/* Content */}
            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              <MarkdownEditor
                content={formData.content}
                onChange={(value) => handleInputChange("content", value)}
                placeholder="Write your publication content here using markdown formatting..."
                className="min-h-[400px]"
              />
              <div className="text-xs text-muted-foreground">
                Use the toolbar to format your content with headings, lists,
                links, and more.
              </div>
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <Label htmlFor="tags">
                Tags{" "}
                <span className="text-muted-foreground">
                  (Optional, comma-separated)
                </span>
              </Label>
              <Input
                id="tags"
                value={formData.tags}
                onChange={(e) => handleInputChange("tags", e.target.value)}
                placeholder="economics, research, policy"
              />
            </div>

            {/* Categories */}
            <div className="space-y-2">
              <Label htmlFor="categories">
                Categories{" "}
                <span className="text-muted-foreground">
                  (Optional, comma-separated)
                </span>
              </Label>
              <Input
                id="categories"
                value={formData.categories}
                onChange={(e) =>
                  handleInputChange("categories", e.target.value)
                }
                placeholder="Economy, Finance, Policy"
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/admin/publications")}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  Updating...
                </>
              ) : (
                "Update Publication"
              )}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
