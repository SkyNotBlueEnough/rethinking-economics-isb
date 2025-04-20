"use client";

import React from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { createLowlight } from "lowlight";
import { cn } from "~/lib/utils";

// Import icons
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Heading2,
  Link as LinkIcon,
  Image as ImageIcon,
  Code,
  Quote,
  Undo,
  Redo,
  Upload,
  Type,
  Loader2,
} from "lucide-react";

// Import UI components
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import { Input } from "~/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { UploadButton } from "~/utils/uploadthing";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { toast } from "sonner";

interface MarkdownEditorProps {
  content: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

// Create a lowlight instance with no languages
const lowlight = createLowlight();

export const MarkdownEditorSkeleton: React.FC<{ className?: string }> = ({
  className,
}) => {
  return (
    <div
      className={cn(
        "flex animate-pulse flex-col overflow-hidden rounded-md border border-input bg-background",
        className,
      )}
    >
      <div className="flex h-11 flex-wrap gap-1 border-b border-input p-2">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item) => (
          <div
            key={`editor-skeleton-button-${item}`}
            className="h-8 w-8 rounded-md bg-muted/60"
          />
        ))}
      </div>
      <div className="min-h-[300px] bg-muted/20 p-4">
        <div className="mb-4 h-4 w-3/4 rounded bg-muted/60" />
        <div className="mb-4 h-4 w-1/2 rounded bg-muted/60" />
        <div className="mb-4 h-4 w-5/6 rounded bg-muted/60" />
        <div className="mb-4 h-4 w-2/3 rounded bg-muted/60" />
        <div className="mb-4 h-4 w-4/5 rounded bg-muted/60" />
      </div>
    </div>
  );
};

export const MarkdownEditor = ({
  content,
  onChange,
  placeholder = "Write your content here...",
  className,
}: MarkdownEditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Link.configure({
        openOnClick: false,
      }),
      Placeholder.configure({
        placeholder,
      }),
      CodeBlockLowlight.configure({
        lowlight,
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  const [linkUrl, setLinkUrl] = React.useState("");
  const [imageUrl, setImageUrl] = React.useState("");
  const [imageUploadLoading, setImageUploadLoading] = React.useState(false);
  const [imagePopoverOpen, setImagePopoverOpen] = React.useState(false);

  if (!editor) {
    return <MarkdownEditorSkeleton className={className} />;
  }

  // Link handling
  const setLink = () => {
    if (!linkUrl) return;

    // Empty link
    if (linkUrl === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    // Update link
    editor
      .chain()
      .focus()
      .extendMarkRange("link")
      .setLink({ href: linkUrl })
      .run();
  };

  // Image handling
  const addImage = () => {
    if (!imageUrl) return;

    editor.chain().focus().setImage({ src: imageUrl }).run();
    setImageUrl("");
    setImagePopoverOpen(false);
  };

  return (
    <div
      className={cn(
        "flex flex-col overflow-hidden rounded-md border border-input bg-background",
        className,
      )}
    >
      <div className="flex flex-wrap gap-1 border-b border-input p-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={cn(
            "h-8 w-8",
            editor.isActive("bold") ? "bg-muted text-foreground" : "",
          )}
          title="Bold"
          type="button"
        >
          <Bold className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={cn(
            "h-8 w-8",
            editor.isActive("italic") ? "bg-muted text-foreground" : "",
          )}
          title="Italic"
          type="button"
        >
          <Italic className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className={cn(
            "h-8 w-8",
            editor.isActive("heading", { level: 2 })
              ? "bg-muted text-foreground"
              : "",
          )}
          title="Heading"
          type="button"
        >
          <Heading2 className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={cn(
            "h-8 w-8",
            editor.isActive("bulletList") ? "bg-muted text-foreground" : "",
          )}
          title="Bullet List"
          type="button"
        >
          <List className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={cn(
            "h-8 w-8",
            editor.isActive("orderedList") ? "bg-muted text-foreground" : "",
          )}
          title="Ordered List"
          type="button"
        >
          <ListOrdered className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={cn(
            "h-8 w-8",
            editor.isActive("codeBlock") ? "bg-muted text-foreground" : "",
          )}
          title="Code Block"
          type="button"
        >
          <Code className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={cn(
            "h-8 w-8",
            editor.isActive("blockquote") ? "bg-muted text-foreground" : "",
          )}
          title="Quote"
          type="button"
        >
          <Quote className="h-4 w-4" />
        </Button>

        <Separator orientation="vertical" className="mx-1 h-8" />

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "h-8 w-8",
                editor.isActive("link") ? "bg-muted text-foreground" : "",
              )}
              title="Link"
              type="button"
            >
              <LinkIcon className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-3">
            <div className="space-y-2">
              <div className="text-sm font-medium">Insert Link</div>
              <Input
                type="url"
                placeholder="https://example.com"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                className="h-8 text-sm"
              />
              <div className="flex justify-end">
                <Button
                  size="sm"
                  onClick={() => {
                    setLink();
                    setLinkUrl("");
                  }}
                  className="h-7 text-xs"
                  type="button"
                >
                  Add Link
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        <Popover
          open={imagePopoverOpen || imageUploadLoading}
          onOpenChange={setImagePopoverOpen}
        >
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              title="Image"
              type="button"
            >
              <ImageIcon className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-3">
            <Tabs defaultValue="url" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="url">
                  <Type className="mr-2 h-4 w-4" />
                  URL
                </TabsTrigger>
                <TabsTrigger value="upload">
                  <Upload className="mr-2 h-4 w-4" />
                  Upload
                </TabsTrigger>
              </TabsList>

              <TabsContent value="url" className="space-y-2 pt-2">
                <div className="text-sm font-medium">Insert Image URL</div>
                <Input
                  type="url"
                  placeholder="https://example.com/image.jpg"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="h-8 text-sm"
                />
                <div className="flex justify-end">
                  <Button
                    size="sm"
                    onClick={() => {
                      addImage();
                      setImageUrl("");
                    }}
                    className="h-7 text-xs"
                    type="button"
                  >
                    Add Image
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="upload" className="space-y-2 pt-2">
                <div className="text-sm font-medium">Upload Image</div>
                <div className="flex flex-col items-center py-2">
                  {imageUploadLoading && (
                    <div className="mb-2 flex items-center justify-center text-sm text-muted-foreground">
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Uploading image...
                    </div>
                  )}
                  <UploadButton
                    endpoint="markdownImageUploader"
                    onUploadBegin={() => {
                      setImageUploadLoading(true);
                    }}
                    onClientUploadComplete={(res) => {
                      setImageUploadLoading(false);
                      const url = res?.[0]?.url;
                      if (url) {
                        editor.chain().focus().setImage({ src: url }).run();
                        toast.success("Image uploaded successfully");
                        setImagePopoverOpen(false);
                      }
                    }}
                    onUploadError={(error: Error) => {
                      setImageUploadLoading(false);
                      toast.error(`Error uploading image: ${error.message}`);
                    }}
                    content={{
                      button({ ready, isUploading }) {
                        if (isUploading) return "Uploading...";
                        if (ready) return "Upload Image";
                        return "Loading...";
                      },
                    }}
                    appearance={{
                      container: "flex",
                      button:
                        "rounded-md bg-primary text-primary-foreground hover:bg-primary/90 flex items-center justify-center gap-2 h-9 px-4 py-2 text-sm",
                    }}
                  />
                </div>
              </TabsContent>
            </Tabs>
          </PopoverContent>
        </Popover>

        <Separator orientation="vertical" className="mx-1 h-8" />

        <Button
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className="h-8 w-8"
          title="Undo"
          type="button"
        >
          <Undo className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className="h-8 w-8"
          title="Redo"
          type="button"
        >
          <Redo className="h-4 w-4" />
        </Button>
      </div>

      <EditorContent
        editor={editor}
        className="prose-headings:font-heading prose prose-sm prose-custom min-h-[300px] p-4 dark:prose-invert prose-headings:font-bold prose-strong:font-bold"
      />
    </div>
  );
};
