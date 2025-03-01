"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Separator } from "~/components/ui/separator";
import { Button } from "~/components/ui/button";
import { Skeleton } from "~/components/ui/skeleton";
import type {
  FooterProps,
  FooterSection,
  SocialLink,
} from "~/lib/types/footer";

const FooterSectionSkeleton = () => {
  return (
    <div className="flex flex-col space-y-3">
      <Skeleton className="h-6 w-24" />
      <div className="space-y-2">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-5 w-28" />
        <Skeleton className="h-5 w-36" />
      </div>
    </div>
  );
};

const FooterSectionComponent = ({ title, links }: FooterSection) => {
  return (
    <div className="flex flex-col space-y-3">
      <div className="text-sm font-medium text-foreground">{title}</div>
      <div className="flex flex-col space-y-2">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            {link.label}
          </Link>
        ))}
      </div>
    </div>
  );
};

const SocialLinks = ({ socialLinks }: { socialLinks: SocialLink[] }) => {
  return (
    <div className="flex space-x-4">
      {socialLinks.map((social) => (
        <Link
          key={social.platform}
          href={social.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={social.platform}
        >
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-full text-muted-foreground hover:text-foreground"
          >
            <span className="sr-only">{social.platform}</span>
            <i className={social.icon} />
          </Button>
        </Link>
      ))}
    </div>
  );
};

const SocialLinksSkeleton = () => {
  return (
    <div className="flex space-x-4">
      {[1, 2, 3, 4].map((i) => (
        <Skeleton key={i} className="h-9 w-9 rounded-full" />
      ))}
    </div>
  );
};

export function Footer({ sections, socialLinks, copyright }: FooterProps) {
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <footer className="w-full border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-10 md:px-6">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="flex flex-col space-y-4">
            <Link href="/" className="flex items-center gap-2">
              {isLoading ? (
                <Skeleton className="h-12 w-12 rounded" />
              ) : (
                <Image
                  src="/logo.png"
                  alt="Rethinking Economics Logo"
                  width={50}
                  height={50}
                  className="object-contain"
                />
              )}
              {isLoading ? (
                <Skeleton className="h-6 w-40" />
              ) : (
                <div className="text-lg font-semibold">
                  Rethinking Economics
                </div>
              )}
            </Link>
            <div className="text-sm text-muted-foreground">
              {isLoading ? (
                <>
                  <Skeleton className="mb-2 h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                </>
              ) : (
                "A community of economists and students working to transform economics education and practice."
              )}
            </div>
            {isLoading ? (
              <SocialLinksSkeleton />
            ) : (
              <SocialLinks socialLinks={socialLinks} />
            )}
          </div>

          {isLoading ? (
            <>
              <FooterSectionSkeleton />
              <FooterSectionSkeleton />
              <FooterSectionSkeleton />
            </>
          ) : (
            sections.map((section) => (
              <FooterSectionComponent key={section.title} {...section} />
            ))
          )}
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="text-sm text-muted-foreground">
            {isLoading ? <Skeleton className="h-4 w-64" /> : copyright}
          </div>
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            {isLoading ? (
              <>
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-24" />
              </>
            ) : (
              <>
                <Link
                  href="/privacy"
                  className="transition-colors hover:text-foreground"
                >
                  Privacy Policy
                </Link>
                <Link
                  href="/terms"
                  className="transition-colors hover:text-foreground"
                >
                  Terms of Service
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
