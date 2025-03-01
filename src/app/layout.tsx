import "~/styles/globals.css";
import "remixicon/fonts/remixicon.css";

import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import type { Metadata } from "next";
import { Lora } from "next/font/google";
import { Toaster } from "sonner";
import { TRPCReactProvider } from "~/trpc/react";
import MainHeader from "./_components/Header/MainHeader";
import { FooterWrapper } from "~/components/FooterWrapper";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";
import { ourFileRouter } from "~/app/api/uploadthing/core";
import { ThemeProvider } from "~/lib/theme-context";

const lora = Lora({ subsets: ["latin"] });
export const metadata: Metadata = {
  title: "Rethinking Economics Islamabad",
  description: "A community of economists in Islamabad.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider afterSignOutUrl="/">
      <html lang="en" className={lora.className}>
        <body>
          <TRPCReactProvider>
            <ThemeProvider>
              <NextSSRPlugin
                /**
                 * The `extractRouterConfig` will extract only the route configs
                 * from the router to prevent additional information from being
                 * leaked to the client. The data passed to the client is the same
                 * as if you were to fetch `/api/uploadthing` directly.
                 */
                routerConfig={extractRouterConfig(ourFileRouter)}
              />
              <div className="flex min-h-screen flex-col">
                <MainHeader />
                <main className="flex-1">{children}</main>
                <FooterWrapper />
              </div>
            </ThemeProvider>
          </TRPCReactProvider>
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}
