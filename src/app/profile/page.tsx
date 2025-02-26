"use client";

import { useUserProfile } from "~/hooks/useUserProfile";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Skeleton } from "~/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { useUser } from "@clerk/nextjs";
import { PenIcon } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const { profile, isLoading } = useUserProfile();
  const { user } = useUser();
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-3xl py-10">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Profile</CardTitle>
            <Skeleton className="h-10 w-24" />
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center space-y-6">
              <Skeleton className="h-24 w-24 rounded-full" />
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-24 w-full" />
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
          <CardTitle>Profile</CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push("/profile/edit")}
          >
            <PenIcon className="mr-2 h-4 w-4" />
            Edit Profile
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center space-y-6">
            <Avatar className="h-24 w-24">
              <AvatarImage
                src={profile?.avatar || user?.imageUrl}
                alt={profile?.name || user?.fullName || "User"}
              />
              <AvatarFallback>
                {user?.firstName?.[0] ||
                  user?.emailAddresses[0]?.emailAddress?.[0] ||
                  "U"}
              </AvatarFallback>
            </Avatar>
            <div className="text-2xl font-bold">{profile?.name}</div>
            <div className="text-muted-foreground">{profile?.position}</div>
            <div className="w-full rounded-lg bg-muted p-4">
              <div className="text-sm">
                {profile?.bio || "No bio information provided."}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
