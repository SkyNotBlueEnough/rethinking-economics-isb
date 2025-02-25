"use client";
import Image from "next/image";
import { Button } from "~/components/ui/button";
import { SignInButton, SignUpButton, useAuth, UserButton } from "@clerk/nextjs";
import Link from "next/link";

export function Header() {
  const { isSignedIn } = useAuth();

  return (
    <header className="w-full border-b">
      <div className="flex h-16 flex-row items-center px-4 md:px-6">
        <div className="flex-1" />

        <Link href="/" className="absolute left-1/2 -translate-x-1/2">
          <div className="flex items-center gap-2 self-center">
            <Image
              src="/logo.png"
              alt="Rethinking Economics Logo"
              width={50}
              height={50}
              className="object-contain"
            />
            <div className="text-2xl font-semibold">Rethinking Economics</div>
          </div>
        </Link>

        <div className="flex flex-1 justify-end">
          {!isSignedIn ? (
            <div className="flex gap-2">
              <SignInButton>
                <Button variant="ghost">Sign In</Button>
              </SignInButton>
              <SignUpButton>
                <Button>Sign Up</Button>
              </SignUpButton>
            </div>
          ) : (
            <UserButton />
          )}
        </div>
      </div>
    </header>
  );
}
