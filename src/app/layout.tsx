import "~/styles/globals.css";

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
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";
import { ourFileRouter } from "~/app/api/uploadthing/core";

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
      <html lang="en" className={`pencraft-dark ${lora.className}`}>
        <body>
          <TRPCReactProvider>
            <NextSSRPlugin
              /**
               * The `extractRouterConfig` will extract only the route configs
               * from the router to prevent additional information from being
               * leaked to the client. The data passed to the client is the same
               * as if you were to fetch `/api/uploadthing` directly.
               */
              routerConfig={extractRouterConfig(ourFileRouter)}
            />
            <MainHeader />
            {children}
          </TRPCReactProvider>
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}
