"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Skeleton } from "~/components/ui/skeleton";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "~/components/ui/breadcrumb";
import Image from "next/image";

// Define event type
interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  imageUrl?: string;
  registrationUrl?: string;
  type: "conference" | "workshop" | "seminar" | "webinar";
  isPast: boolean;
}

export default function EventsPage() {
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Mock events data
  const events: Event[] = [
    {
      id: "1",
      title: "Annual Conference on Pluralist Economics",
      description:
        "Join us for our flagship conference bringing together economists, policymakers, and students to explore diverse approaches to economic theory and policy.",
      date: "2023-11-15",
      location: "Lahore University of Management Sciences, Lahore",
      imageUrl:
        "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=600&auto=format&fit=crop",
      registrationUrl: "https://example.com/register",
      type: "conference",
      isPast: false,
    },
    {
      id: "2",
      title: "Workshop: Ecological Economics in Practice",
      description:
        "A hands-on workshop exploring how ecological economics can inform policy decisions in Pakistan's context, with a focus on natural resource management.",
      date: "2023-10-20",
      location: "Institute of Business Administration, Karachi",
      imageUrl:
        "https://images.unsplash.com/photo-1552581234-26160f608093?q=80&w=600&auto=format&fit=crop",
      registrationUrl: "https://example.com/register",
      type: "workshop",
      isPast: false,
    },
    {
      id: "3",
      title: "Webinar: Feminist Economics and Care Work",
      description:
        "An online discussion on feminist economic perspectives and their implications for understanding and valuing care work in Pakistan's economy.",
      date: "2023-09-28",
      location: "Online (Zoom)",
      imageUrl:
        "https://images.unsplash.com/photo-1609921212029-bb5a28e60960?q=80&w=600&auto=format&fit=crop",
      registrationUrl: "https://example.com/register",
      type: "webinar",
      isPast: false,
    },
    {
      id: "4",
      title: "Policy Seminar: Rethinking Monetary Policy",
      description:
        "A seminar examining alternative approaches to monetary policy and their potential applications in Pakistan's economic context.",
      date: "2023-09-15",
      location: "Pakistan Institute of Development Economics, Islamabad",
      imageUrl:
        "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=600&auto=format&fit=crop",
      registrationUrl: "https://example.com/register",
      type: "seminar",
      isPast: true,
    },
    {
      id: "5",
      title: "Student Workshop: Introduction to Heterodox Economics",
      description:
        "A workshop designed for students to explore economic theories beyond the mainstream, including Post-Keynesian, Institutional, and Marxian approaches.",
      date: "2023-08-10",
      location: "University of Karachi, Karachi",
      imageUrl:
        "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=600&auto=format&fit=crop",
      registrationUrl: "https://example.com/register",
      type: "workshop",
      isPast: true,
    },
    {
      id: "6",
      title: "Webinar: Economics of Climate Change in South Asia",
      description:
        "An online discussion on the economic impacts of climate change in South Asia and policy approaches to mitigation and adaptation.",
      date: "2023-07-22",
      location: "Online (Zoom)",
      imageUrl:
        "https://images.unsplash.com/photo-1618044733300-9472054094ee?q=80&w=600&auto=format&fit=crop",
      registrationUrl: "https://example.com/register",
      type: "webinar",
      isPast: true,
    },
  ];

  // Filter events
  const upcomingEvents = events.filter((event) => !event.isPast);
  const pastEvents = events.filter((event) => event.isPast);

  // Format date
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  // Get badge color based on event type
  const getBadgeVariant = (
    type: Event["type"],
  ): "default" | "secondary" | "destructive" | "outline" => {
    switch (type) {
      case "conference":
        return "default";
      case "workshop":
        return "secondary";
      case "seminar":
        return "destructive";
      case "webinar":
        return "outline";
      default:
        return "default";
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 sm:py-8">
      {/* Breadcrumb Navigation */}
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Events & Initiatives</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="mb-8">
        <div className="text-3xl font-bold md:text-4xl">
          Events & Initiatives
        </div>
        <div className="mt-2 text-muted-foreground">
          Join us for conferences, workshops, seminars, and webinars exploring
          pluralist approaches to economics.
        </div>
      </div>

      {isLoading ? (
        <EventsSkeleton />
      ) : (
        <Tabs defaultValue="upcoming" className="w-full">
          <TabsList className="mb-6 grid w-full grid-cols-2 md:w-[400px]">
            <TabsTrigger value="upcoming">Upcoming Events</TabsTrigger>
            <TabsTrigger value="past">Past Events</TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="space-y-8">
            {upcomingEvents.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {upcomingEvents.map((event) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    formatDate={formatDate}
                    getBadgeVariant={getBadgeVariant}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="text-lg font-medium">No upcoming events</div>
                <div className="text-muted-foreground">
                  Check back later for new events or subscribe to our
                  newsletter.
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="past" className="space-y-8">
            {pastEvents.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {pastEvents.map((event) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    formatDate={formatDate}
                    getBadgeVariant={getBadgeVariant}
                    isPast
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="text-lg font-medium">No past events</div>
                <div className="text-muted-foreground">
                  Our event history will appear here.
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      )}

      {/* Initiatives Section */}
      <div className="mt-16 space-y-6">
        <div className="text-2xl font-bold">Our Initiatives</div>
        <div className="text-muted-foreground">
          Beyond events, we run several ongoing initiatives to transform
          economic discourse in Pakistan.
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Curriculum Reform</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-muted-foreground">
                We work with universities to develop and implement pluralist
                economics curricula that incorporate diverse theoretical
                perspectives, historical context, and interdisciplinary
                approaches.
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Student Chapters</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-muted-foreground">
                We support student-led chapters at universities across Pakistan,
                providing resources, mentorship, and networking opportunities
                for students interested in pluralist economics.
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Policy Working Groups</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-muted-foreground">
                Our working groups bring together economists, policymakers, and
                civil society representatives to develop alternative policy
                approaches to Pakistan&apos;s economic challenges.
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Public Education</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-muted-foreground">
                Through media engagement, public lectures, and accessible
                publications, we work to broaden public understanding of
                economic issues and promote informed civic participation in
                economic discourse.
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

interface EventCardProps {
  event: Event;
  formatDate: (date: string) => string;
  getBadgeVariant: (
    type: Event["type"],
  ) => "default" | "secondary" | "destructive" | "outline";
  isPast?: boolean;
}

function EventCard({
  event,
  formatDate,
  getBadgeVariant,
  isPast = false,
}: EventCardProps) {
  return (
    <Card className="overflow-hidden">
      <div className="relative aspect-video w-full overflow-hidden">
        <Image
          src={
            event.imageUrl ??
            "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=600&auto=format&fit=crop"
          }
          alt={event.title}
          fill
          className="object-cover transition-transform hover:scale-105"
          onError={(e) => {
            // Fallback if image doesn't exist
            e.currentTarget.src =
              "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=600&auto=format&fit=crop";
          }}
        />
        <div className="absolute left-3 top-3">
          <Badge variant={getBadgeVariant(event.type)}>
            {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
          </Badge>
        </div>
      </div>
      <CardHeader>
        <CardTitle className="line-clamp-2">{event.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-center text-sm text-muted-foreground">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-2"
            aria-hidden="true"
          >
            <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
            <line x1="16" x2="16" y1="2" y2="6" />
            <line x1="8" x2="8" y1="2" y2="6" />
            <line x1="3" x2="21" y1="10" y2="10" />
          </svg>
          <span>{formatDate(event.date)}</span>
        </div>
        <div className="flex items-center text-sm text-muted-foreground">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-2"
            aria-hidden="true"
          >
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          <span className="line-clamp-1">{event.location}</span>
        </div>
        <div className="mt-2 line-clamp-3 text-sm text-muted-foreground">
          {event.description}
        </div>
      </CardContent>
      <CardFooter>
        {!isPast && event.registrationUrl && (
          <Button className="w-full">Register Now</Button>
        )}
        {isPast && (
          <Button variant="outline" className="w-full">
            View Details
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

function EventsSkeleton() {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 gap-4 md:w-[400px]">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="aspect-video w-full rounded-lg" />
            <Skeleton className="h-6 w-3/4" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
            <Skeleton className="h-10 w-full" />
          </div>
        ))}
      </div>

      <div className="space-y-4">
        <Skeleton className="h-8 w-1/4" />
        <Skeleton className="h-4 w-2/3" />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Skeleton className="h-40 w-full rounded-lg" />
          <Skeleton className="h-40 w-full rounded-lg" />
          <Skeleton className="h-40 w-full rounded-lg" />
          <Skeleton className="h-40 w-full rounded-lg" />
        </div>
      </div>
    </div>
  );
}
