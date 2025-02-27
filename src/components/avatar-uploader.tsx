"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { UploadButton } from "~/utils/uploadthing";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { ImageIcon, Loader2 } from "lucide-react";

interface AvatarUploaderProps {
  className?: string;
  avatarClassName?: string;
  onUploadComplete?: (url: string) => void;
  initialAvatarUrl?: string;
}

export function AvatarUploader({
  className = "",
  avatarClassName = "h-24 w-24",
  onUploadComplete,
  initialAvatarUrl,
}: AvatarUploaderProps) {
  const { user, isLoaded } = useUser();
  const [isUploading, setIsUploading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(
    initialAvatarUrl,
  );
  const queryClient = useQueryClient();

  // Update the avatar URL if the initialAvatarUrl prop changes
  useEffect(() => {
    if (initialAvatarUrl) {
      setAvatarUrl(initialAvatarUrl);
    }
  }, [initialAvatarUrl]);

  if (!isLoaded) {
    return (
      <div className={`flex flex-col items-center space-y-4 ${className}`}>
        <Avatar className={avatarClassName}>
          <AvatarFallback>
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </AvatarFallback>
        </Avatar>
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center space-y-4 ${className}`}>
      <Avatar className={avatarClassName}>
        <AvatarImage
          src={avatarUrl ?? user?.imageUrl}
          alt={user?.fullName ?? "User"}
        />
        <AvatarFallback>
          {user?.firstName?.[0] ??
            user?.emailAddresses[0]?.emailAddress?.[0] ??
            "U"}
        </AvatarFallback>
      </Avatar>

      <div className="flex items-center justify-center">
        <UploadButton
          endpoint="avatarUploader"
          onUploadBegin={() => {
            setIsUploading(true);
          }}
          onClientUploadComplete={(res) => {
            setIsUploading(false);
            const url = res?.[0]?.url;
            if (url) {
              // Update the local avatar URL immediately
              setAvatarUrl(url);

              // Invalidate the profile query to refresh the data
              void queryClient.invalidateQueries({ queryKey: ["profile"] });

              if (onUploadComplete) {
                onUploadComplete(url);
              }

              toast.success("Avatar updated successfully");
            }
          }}
          onUploadError={(error: Error) => {
            setIsUploading(false);
            toast.error(`Error uploading avatar: ${error.message}`);
          }}
          content={{
            button({ ready, isUploading }) {
              if (isUploading) return "Uploading...";
              if (ready) return "Upload Avatar";
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
