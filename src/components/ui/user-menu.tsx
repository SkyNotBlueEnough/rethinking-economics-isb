"use client";

import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { useAuth, useUser, SignOutButton } from "@clerk/nextjs";
import { useUserProfile } from "~/hooks/useUserProfile";
import { EditIcon, LogOutIcon, UserIcon, Settings } from "lucide-react";
import { useRouter } from "next/navigation";

export function UserMenu() {
  const { isSignedIn } = useAuth();
  const { user } = useUser();
  const { profile } = useUserProfile();
  const router = useRouter();

  if (!isSignedIn || !user) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="flex items-center gap-2 rounded-full p-1 transition-all hover:bg-accent"
        >
          <Avatar className="h-9 w-9 cursor-pointer">
            <AvatarImage
              src={profile?.avatar || user.imageUrl}
              alt={profile?.name || user.fullName || "User"}
            />
            <AvatarFallback>
              {user.firstName?.[0] ||
                user.emailAddresses[0]?.emailAddress?.[0] ||
                "U"}
            </AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <div className="text-sm font-medium">
              {profile?.name || user.fullName || "User"}
            </div>
            <div className="text-xs text-muted-foreground">
              {user.primaryEmailAddress?.emailAddress}
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => router.push("/profile")}>
          <UserIcon className="mr-2 h-4 w-4" />
          <span>My Profile</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push("/profile/edit")}>
          <EditIcon className="mr-2 h-4 w-4" />
          <span>Edit Profile</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push("/account/settings")}>
          <Settings className="mr-2 h-4 w-4" />
          <span>Account Settings</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <SignOutButton>
            <div className="flex items-center">
              <LogOutIcon className="mr-2 h-4 w-4" />
              <span>Sign Out</span>
            </div>
          </SignOutButton>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
