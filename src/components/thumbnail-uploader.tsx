"use client";

import { useState, useEffect } from "react";
import { Image, ImageIcon, Loader2, X } from "lucide-react";
import { Button } from "~/components/ui/button";
import { UploadButton } from "~/utils/uploadthing";
import { toast } from "sonner";
import { Card } from "~/components/ui/card";

interface ThumbnailUploaderProps {
  className?: string;
  thumbnailClassName?: string;
  onUploadComplete?: (url: string) => void;
  initialThumbnailUrl?: string | null;
  showRemoveButton?: boolean;
  onRemove?: () => void;
}

export function ThumbnailUploader({
  className = "",
  thumbnailClassName = "max-w-md max-h-64",
  onUploadComplete,
  initialThumbnailUrl,
  showRemoveButton = true,
  onRemove,
}: ThumbnailUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [thumbnailUrl, setThumbnailUrl] = useState<string | undefined>(
    initialThumbnailUrl || undefined,
  );

  // Update the thumbnail URL if the initialThumbnailUrl prop changes
  useEffect(() => {
    if (initialThumbnailUrl) {
      setThumbnailUrl(initialThumbnailUrl);
    }
  }, [initialThumbnailUrl]);

  const handleRemoveThumbnail = () => {
    setThumbnailUrl(undefined);
    if (onRemove) {
      onRemove();
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {thumbnailUrl ? (
        <div className="relative">
          <Card className="overflow-hidden">
            <img
              src={thumbnailUrl}
              alt="Publication Thumbnail"
              className={`object-cover ${thumbnailClassName}`}
            />
          </Card>
          {showRemoveButton && (
            <Button
              variant="destructive"
              size="sm"
              className="absolute right-2 top-2"
              onClick={handleRemoveThumbnail}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      ) : (
        <Card
          className={`flex items-center justify-center ${thumbnailClassName} bg-muted/30 text-muted-foreground`}
        >
          <div className="flex flex-col items-center justify-center p-6">
            <ImageIcon className="mb-2 h-10 w-10" />
            <div className="text-sm">No thumbnail uploaded</div>
          </div>
        </Card>
      )}

      <div className="flex items-center justify-start">
        <UploadButton
          endpoint="thumbnailUploader"
          onUploadBegin={() => {
            setIsUploading(true);
          }}
          onClientUploadComplete={(res) => {
            setIsUploading(false);
            const url = res?.[0]?.url;
            if (url) {
              // Update the local thumbnail URL immediately
              setThumbnailUrl(url);

              if (onUploadComplete) {
                onUploadComplete(url);
              }

              toast.success("Thumbnail uploaded successfully");
            }
          }}
          onUploadError={(error: Error) => {
            setIsUploading(false);
            toast.error(`Error uploading thumbnail: ${error.message}`);
          }}
          content={{
            button({ ready, isUploading }) {
              if (isUploading) return "Uploading...";
              if (ready) return thumbnailUrl ? "Replace" : "Upload";
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
    </div>
  );
}
