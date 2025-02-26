"use client";
import Image from "next/image";
import { Button } from "~/components/ui/button";
import { SignInButton, SignUpButton, useAuth } from "@clerk/nextjs";
import Link from "next/link";
import MobileMenu from "./MobileMenu";
import { UserMenu } from "~/components/ui/user-menu";

export function HeaderTopBar() {
  const { isSignedIn } = useAuth();

  return (
    <header className="w-full border-b">
      <div className="flex h-20 flex-row items-center px-4 md:px-6">
        <div className="flex md:hidden">
          <MobileMenu />
        </div>

        <Link href="/" className="absolute left-1/2 -translate-x-1/2">
          <div className="flex items-center gap-2 self-center">
            <Image
              src="/logo.png"
              alt="Rethinking Economics Logo"
              width={50}
              height={50}
              className="object-contain"
            />
            <div className="text-xs font-semibold md:text-2xl">
              Rethinking Economics
            </div>
          </div>
        </Link>

        <div className="hidden flex-1 justify-end md:flex">
          {!isSignedIn ? (
            <div className="flex gap-2">
              <SignInButton>
                <Button variant="secondary">Sign In</Button>
              </SignInButton>
              <SignUpButton>
                <Button>Sign Up</Button>
              </SignUpButton>
            </div>
          ) : (
            <UserMenu />
          )}
        </div>
      </div>
    </header>
  );
}
