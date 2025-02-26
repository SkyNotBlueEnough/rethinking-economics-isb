"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "~/components/ui/navigation-menu";
import { cn } from "~/lib/utils";
import { navigationLinks } from "./navigationLinks";

export function HeaderNavTabs() {
  const pathname = usePathname();

  return (
    <div className="flex w-full justify-center">
      <NavigationMenu className="max-w-full">
        <NavigationMenuList className="gap-2">
          {navigationLinks.map((link) => (
            <NavigationMenuItem key={link.title}>
              {link.children ? (
                <>
                  <NavigationMenuTrigger
                    className={cn(
                      pathname.startsWith(link.href) ? "text-primary" : "",
                      "rounded-none",
                    )}
                  >
                    {link.title}
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2">
                      {link.children.map((child) => (
                        <li key={child.title}>
                          <NavigationMenuLink asChild className="rounded-none">
                            <Link
                              href={child.href}
                              className={cn(
                                "block select-none space-y-1 rounded-none p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                                pathname === child.href
                                  ? "bg-accent text-accent-foreground"
                                  : "",
                              )}
                            >
                              <div className="text-sm font-medium leading-none">
                                {child.title}
                              </div>
                              {child.description && (
                                <div className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                  {child.description}
                                </div>
                              )}
                            </Link>
                          </NavigationMenuLink>
                        </li>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </>
              ) : (
                <Link href={link.href} legacyBehavior passHref>
                  <NavigationMenuLink
                    className={cn(
                      navigationMenuTriggerStyle(),
                      "rounded-none",
                      pathname === link.href ? "text-primary" : "",
                    )}
                  >
                    {link.title}
                  </NavigationMenuLink>
                </Link>
              )}
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
}

export default HeaderNavTabs;
