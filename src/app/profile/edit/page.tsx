"use client";

import { useState, useEffect } from "react";
import { useUserProfile } from "~/hooks/useUserProfile";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Skeleton } from "~/components/ui/skeleton";
import { useUser } from "@clerk/nextjs";
import { ArrowLeftIcon, SaveIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { toast } from "sonner";
import { AvatarUploader } from "~/components/avatar-uploader";

export default function EditProfilePage() {
  const { profile, isLoading, updateProfile, isUpdating } = useUserProfile();
  const { user } = useUser();
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    position: "",
    bio: "",
    avatar: "",
  });

  // Initialize form data when profile is loaded
  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name ?? "",
        position: profile.position ?? "",
        bio: profile.bio ?? "",
        avatar: profile.avatar ?? "",
      });
    }
  }, [profile]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Optimistic update
    const previousProfile = { ...profile };

    // Update locally first
    updateProfile(formData, {
      onSuccess: () => {
        toast.success("Profile updated successfully");
        router.push("/profile");
      },
      onError: (error) => {
        toast.error("Failed to update profile");
        console.error(error);
      },
    });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-3xl py-10">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Edit Profile</CardTitle>
            <Skeleton className="h-10 w-24" />
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-6">
              <div className="flex justify-center">
                <Skeleton className="h-24 w-24 rounded-full" />
              </div>
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-3xl py-10">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Edit Profile</CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push("/profile")}
          >
            <ArrowLeftIcon className="mr-2 h-4 w-4" />
            Back to Profile
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <AvatarUploader
              initialAvatarUrl={profile?.avatar ?? undefined}
              onUploadComplete={(url) => {
                setFormData((prev) => ({ ...prev, avatar: url }));
              }}
            />

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="position">Position</Label>
                <Input
                  id="position"
                  name="position"
                  value={formData.position}
                  onChange={handleChange}
                  placeholder="Your position or title"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  placeholder="Tell us about yourself"
                  rows={5}
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={isUpdating}
                className="flex items-center gap-2"
              >
                <SaveIcon className="h-4 w-4" />
                {isUpdating ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
