"use client";
import Image from "next/image";
import { Button } from "~/components/ui/button";
import { SignInButton, SignUpButton, useAuth } from "@clerk/nextjs";
import Link from "next/link";
import MobileMenu from "./MobileMenu";
import { UserMenu } from "~/components/ui/user-menu";
import { ThemeToggle } from "~/components/ui/theme-toggle";
import { useThemeContext } from "~/lib/theme-context";
import { useEffect, useState } from "react";

export function HeaderTopBar() {
  const { isSignedIn, userId } = useAuth();
  const { theme, setTheme } = useThemeContext();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        if (!userId) {
          setIsAdmin(false);
          setIsLoading(false);
          return;
        }

        const response = await fetch("/api/admin/check");
        const data = await response.json();
        setIsAdmin(data.isAdmin);
      } catch (error) {
        console.error("Error checking admin status:", error);
        setIsAdmin(false);
      } finally {
        setIsLoading(false);
      }
    };

    void checkAdmin();
  }, [userId]);

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
          <div className="flex items-center gap-4">
            <ThemeToggle theme={theme} setTheme={setTheme} />
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
              <>
                {isLoading ? (
                  <div className="h-10 w-24 animate-pulse rounded-md bg-muted" />
                ) : isAdmin ? (
                  <Link href="/admin">
                    <Button variant="outline">Admin Portal</Button>
                  </Link>
                ) : (
                  <Link href="/submissions">
                    <Button variant="outline">Get Involved</Button>
                  </Link>
                )}
                <UserMenu />
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
