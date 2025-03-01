import type { FooterSection, SocialLink } from "~/lib/types/footer";

export const footerSections: FooterSection[] = [
  {
    title: "Resources",
    links: [
      { label: "Publications & Research", href: "/publications" },
      { label: "Events & Initiatives", href: "/events" },
      { label: "Policy and Advocacy", href: "/policy" },
      { label: "Media and Press", href: "/media" },
    ],
  },
  {
    title: "About Us",
    links: [
      { label: "Overview", href: "/about/overview" },
      { label: "Team", href: "/about/team" },
      { label: "Partnerships", href: "/about/partnerships" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Memberships and Collaboration", href: "/memberships" },
      { label: "Contact Us", href: "/contact" },
    ],
  },
];

export const socialLinks: SocialLink[] = [
  {
    platform: "Twitter",
    href: "https://twitter.com/rethinking_econ",
    icon: "ri-twitter-x-fill",
  },
  {
    platform: "Facebook",
    href: "https://facebook.com/rethinkingeconomics",
    icon: "ri-facebook-fill",
  },
  {
    platform: "Instagram",
    href: "https://instagram.com/rethinking_economics",
    icon: "ri-instagram-fill",
  },
  {
    platform: "LinkedIn",
    href: "https://linkedin.com/company/rethinking-economics",
    icon: "ri-linkedin-fill",
  },
];

export const copyright = `© ${new Date().getFullYear()} Rethinking Economics Islamabad. All rights reserved.`;
