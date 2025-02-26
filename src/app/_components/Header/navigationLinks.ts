export interface NavLink {
  title: string;
  href: string;
  description?: string;
  children?: NavLink[];
}

export const navigationLinks: NavLink[] = [
  {
    title: "Home",
    href: "/",
  },
  {
    title: "About Us",
    href: "/about",
    children: [
      {
        title: "Overview",
        href: "/about/overview",
        description: "Learn about our mission and vision",
      },
      {
        title: "Team",
        href: "/about/team",
        description: "Meet our dedicated team members",
      },
      {
        title: "Partnerships",
        href: "/about/partnerships",
        description: "Discover our strategic partnerships",
      },
    ],
  },
  {
    title: "Publications & Research",
    href: "/publications",
  },
  {
    title: "Events & Initiatives",
    href: "/events",
  },
  {
    title: "Policy and Advocacy",
    href: "/policy",
  },
  {
    title: "Memberships and Collaboration",
    href: "/memberships",
  },
  {
    title: "Media and Press",
    href: "/media",
  },
  {
    title: "Contact Us",
    href: "/contact",
  },
];
