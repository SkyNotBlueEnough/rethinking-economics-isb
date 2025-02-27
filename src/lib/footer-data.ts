import type { FooterSection, SocialLink } from "~/lib/types/footer";

export const footerSections: FooterSection[] = [
  {
    title: "About Us",
    links: [
      { label: "Our Mission", href: "/about/mission" },
      { label: "Our Team", href: "/about/team" },
      { label: "Partners", href: "/about/partners" },
      { label: "Contact Us", href: "/contact" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Publications", href: "/publications" },
      { label: "Research", href: "/research" },
      { label: "Events", href: "/events" },
      { label: "Blog", href: "/blog" },
    ],
  },
  {
    title: "Get Involved",
    links: [
      { label: "Join Us", href: "/join" },
      { label: "Volunteer", href: "/volunteer" },
      { label: "Donate", href: "/donate" },
      { label: "Newsletter", href: "/newsletter" },
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
