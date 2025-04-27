"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { LoadingSpinner } from "~/components/ui/loading-spinner";
import { toast } from "sonner";
import { MarkdownEditor } from "~/components/ui/markdown-editor";

// Publication types
const PUBLICATION_TYPES = [
  { value: "research_paper", label: "Research Paper" },
  { value: "policy_brief", label: "Policy Brief" },
  { value: "opinion", label: "Opinion" },
  { value: "blog_post", label: "Blog Post" },
] as const;

type PublicationType = (typeof PUBLICATION_TYPES)[number]["value"];

// Form data type
interface FormData {
  title: string;
  abstract: string;
  content: string;
  type: PublicationType;
}

export default function CreateSubmissionPage() {
  const router = useRouter();

  const [formData, setFormData] = useState<FormData>({
    title: "",
    abstract: "",
    content: "",
    type: "blog_post",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Create publication mutation
  const createSubmission = api.publications.createSubmission.useMutation({
    onSuccess: () => {
      toast.success("Submission created successfully");
      router.push("/submissions");
    },
    onError: (error) => {
      toast.error(`Error creating submission: ${error.message}`);
      setIsSubmitting(false);
    },
  });

  // Handle form input change
  function handleInputChange<K extends keyof FormData>(
    field: K,
    value: FormData[K],
  ): void {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Form validation
    if (!formData.title.trim()) {
      toast.error("Please enter a title");
      return;
    }

    if (!formData.content.trim()) {
      toast.error("Please enter content");
      return;
    }

    setIsSubmitting(true);

    // Submit the form
    createSubmission.mutate({
      title: formData.title,
      abstract: formData.abstract,
      content: formData.content,
      type: formData.type,
    });
  };

  return (
    <div className="container mx-auto px-4 py-6 sm:py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <div className="text-3xl font-bold">Create Submission</div>
          <div className="text-muted-foreground">
            Submit your article for review
          </div>
        </div>
        <Button variant="outline" onClick={() => router.push("/submissions")}>
          Cancel
        </Button>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Article Details</CardTitle>
            <CardDescription>
              Enter the details for your article submission
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Publication Type */}
            <div className="space-y-2">
              <Label htmlFor="type">Article Type</Label>
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

            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                placeholder="Enter article title"
              />
            </div>

            {/* Abstract */}
            <div className="space-y-2">
              <Label htmlFor="abstract">
                Abstract{" "}
                <span className="text-muted-foreground">(Optional)</span>
              </Label>
              <Input
                id="abstract"
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
                placeholder="Write your article content here using markdown formatting..."
                className="min-h-[400px]"
              />
              <div className="text-xs text-muted-foreground">
                Use the toolbar to format your content with headings, lists,
                links, and more.
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  Submitting...
                </>
              ) : (
                "Submit for Review"
              )}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
