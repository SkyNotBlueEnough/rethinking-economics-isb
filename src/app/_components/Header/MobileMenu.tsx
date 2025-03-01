"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { SignInButton, SignUpButton, useAuth } from "@clerk/nextjs";
import { Button } from "~/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "~/components/ui/sheet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";
import { cn } from "~/lib/utils";
import { navigationLinks } from "./navigationLinks";
import { MobileUserMenu } from "~/components/ui/mobile-user-menu";
import { Separator } from "~/components/ui/separator";
import { ThemeToggle } from "~/components/ui/theme-toggle";
import { useThemeContext } from "~/lib/theme-context";

export function MobileMenu() {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);
  const { isSignedIn } = useAuth();
  const { theme, setTheme } = useThemeContext();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[400px]">
        <SheetHeader>
          <SheetTitle>Rethinking Economics</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col gap-4 py-4">
          {/* Theme toggle */}
          <div className="flex items-center justify-between px-2">
            <div className="text-sm font-medium">Toggle Theme</div>
            <ThemeToggle theme={theme} setTheme={setTheme} />
          </div>
          <Separator className="my-1" />

          {/* User menu at the top when signed in */}
          {isSignedIn && (
            <>
              <MobileUserMenu onItemClick={() => setOpen(false)} />
              <Separator className="my-2" />
            </>
          )}

          <nav className="flex flex-col gap-2">
            {navigationLinks.map((link) => (
              <React.Fragment key={link.title}>
                {link.children ? (
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value={link.title} className="border-b-0">
                      <AccordionTrigger
                        className={cn(
                          "hover:no-underlin px-2 py-1 text-base",
                          pathname.startsWith(link.href)
                            ? "font-medium text-primary"
                            : "",
                        )}
                      >
                        {link.title}
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="flex flex-col gap-1 pl-4">
                          {link.children.map((child) => (
                            <Link
                              key={child.title}
                              href={child.href}
                              className={cn(
                                "rounded-md px-2 py-1 hover:bg-accent",
                                pathname === child.href
                                  ? "bg-accent text-accent-foreground"
                                  : "",
                              )}
                              onClick={() => setOpen(false)}
                            >
                              <div className="font-medium">{child.title}</div>
                              {child.description && (
                                <div className="text-sm text-muted-foreground">
                                  {child.description}
                                </div>
                              )}
                            </Link>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                ) : (
                  <Link
                    href={link.href}
                    className={cn(
                      "rounded-md px-2 py-1 hover:bg-accent",
                      pathname === link.href
                        ? "bg-accent text-accent-foreground"
                        : "",
                    )}
                    onClick={() => setOpen(false)}
                  >
                    {link.title}
                  </Link>
                )}
              </React.Fragment>
            ))}
          </nav>

          {/* Sign in/up buttons when not signed in */}
          {!isSignedIn && (
            <div className="mt-4 flex flex-col gap-2">
              <SignInButton>
                <Button variant="secondary" className="w-full">
                  Sign In
                </Button>
              </SignInButton>
              <SignUpButton>
                <Button className="w-full">Sign Up</Button>
              </SignUpButton>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default MobileMenu;
