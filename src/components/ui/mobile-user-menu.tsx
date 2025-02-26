"use client";

import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { useAuth, useUser, SignOutButton } from "@clerk/nextjs";
import { useUserProfile } from "~/hooks/useUserProfile";
import { EditIcon, LogOutIcon, UserIcon, Settings } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";

export function MobileUserMenu({ onItemClick }: { onItemClick?: () => void }) {
  const { isSignedIn } = useAuth();
  const { user } = useUser();
  const { profile } = useUserProfile();
  const router = useRouter();

  if (!isSignedIn || !user) return null;

  const handleNavigation = (path: string) => {
    router.push(path);
    if (onItemClick) onItemClick();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 px-2">
        <Avatar className="h-12 w-12">
          <AvatarImage src={user.imageUrl} alt={user.fullName || "User"} />
          <AvatarFallback>
            {user.firstName?.[0] ||
              user.emailAddresses[0]?.emailAddress?.[0] ||
              "U"}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <div className="font-medium">{user.fullName || "User"}</div>
          <div className="text-xs text-muted-foreground">
            {user.primaryEmailAddress?.emailAddress}
          </div>
        </div>
      </div>

      <Separator />

      <div className="grid grid-cols-2 gap-2">
        <Button
          variant="outline"
          size="sm"
          className="flex h-auto items-center justify-start gap-2 py-2"
          onClick={() => handleNavigation("/profile")}
        >
          <UserIcon className="h-4 w-4" />
          <span>My Profile</span>
        </Button>

        <Button
          variant="outline"
          size="sm"
          className="flex h-auto items-center justify-start gap-2 py-2"
          onClick={() => handleNavigation("/profile/edit")}
        >
          <EditIcon className="h-4 w-4" />
          <span>Edit Profile</span>
        </Button>

        <Button
          variant="outline"
          size="sm"
          className="flex h-auto items-center justify-start gap-2 py-2"
          onClick={() => handleNavigation("/account/settings")}
        >
          <Settings className="h-4 w-4" />
          <span>Settings</span>
        </Button>

        <SignOutButton>
          <Button
            variant="outline"
            size="sm"
            className="flex h-auto w-full items-center justify-start gap-2 py-2"
          >
            <LogOutIcon className="h-4 w-4" />
            <span>Sign Out</span>
          </Button>
        </SignOutButton>
      </div>
    </div>
  );
}
