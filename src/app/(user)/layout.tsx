"use client";

import { useState, useEffect } from "react";
import { Toaster } from "sonner";
import { FooterWrapper } from "~/components/FooterWrapper";
import MainHeader from "~/app/_components/Header/MainHeader";
import { ThemeProvider } from "~/lib/theme-context";

export default function UserLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <ThemeProvider>
      <div className="flex min-h-screen flex-col">
        <MainHeader />
        <main className="flex w-full flex-1">{children}</main>
        <FooterWrapper />
      </div>
      <Toaster />
    </ThemeProvider>
  );
}
