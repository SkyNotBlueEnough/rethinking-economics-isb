"use client";

import React from "react";
import { Footer } from "~/components/Footer";
import { footerSections, socialLinks, copyright } from "~/lib/footer-data";

export function FooterWrapper() {
  return (
    <Footer
      sections={footerSections}
      socialLinks={socialLinks}
      copyright={copyright}
    />
  );
}
