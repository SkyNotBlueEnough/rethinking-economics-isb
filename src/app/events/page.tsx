"use client";

import { useState } from "react";
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
import { format } from "date-fns";
import { api } from "~/trpc/react";
import type { Event, Initiative } from "~/lib/types/events";

export default function EventsPage() {
  // Fetch events from API
  const { data: events, isLoading: eventsLoading } =
    api.events.getAllEventsSorted.useQuery();
  const { data: initiatives, isLoading: initiativesLoading } =
    api.events.getAllInitiatives.useQuery();

  const isLoading = eventsLoading || initiativesLoading;

  // Format date
  const formatEventDate = (date: Date) => {
    return format(date, "MMMM d, yyyy");
  };

  // Get badge color based on event type
  const getBadgeVariant = (
    type: string,
  ): "default" | "secondary" | "destructive" | "outline" => {
    switch (type) {
      case "conference":
        return "default";
      case "workshop":
        return "secondary";
      case "seminar":
        return "destructive";
      case "webinar":
        return "destructive";
      default:
        return "default";
    }
  };

  // Check if event is past
  const isEventPast = (date: Date): boolean => {
    const now = new Date();
    return date < now;
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

      {eventsLoading ? (
        <EventsSkeleton />
      ) : (
        <div className="space-y-8">
          <div className="text-2xl font-bold">Events</div>
          {events && events.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {events.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  formatDate={formatEventDate}
                  getBadgeVariant={getBadgeVariant}
                  isPast={isEventPast(event.startDate)}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="text-lg font-medium">No events found</div>
              <div className="text-muted-foreground">
                Check back later for new events or subscribe to our newsletter.
              </div>
            </div>
          )}
        </div>
      )}

      {/* Initiatives Section */}
      <div className="mt-16 space-y-6">
        <div className="text-2xl font-bold">Our Initiatives</div>
        <div className="text-muted-foreground">
          Beyond events, we run several ongoing initiatives to transform
          economic discourse in Pakistan.
        </div>

        {initiativesLoading ? (
          <InitiativesSkeleton />
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {initiatives && initiatives.length > 0 ? (
              initiatives.map((initiative) => (
                <InitiativeCard key={initiative.id} initiative={initiative} />
              ))
            ) : (
              <div className="col-span-2 flex flex-col items-center justify-center py-8 text-center">
                <div className="text-lg font-medium">No initiatives found</div>
                <div className="text-muted-foreground">
                  Check back later for our ongoing initiatives.
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

interface EventCardProps {
  event: Event;
  formatDate: (date: Date) => string;
  getBadgeVariant: (
    type: string,
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
            event.thumbnailUrl ??
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
          <Badge variant={getBadgeVariant(event.type ?? "")}>
            {(event.type?.charAt(0).toUpperCase() ?? "N") +
              (event.type?.slice(1) ?? "A")}
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
          <span>{formatDate(event.startDate)}</span>
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
          <span className="line-clamp-1">
            {event.isVirtual ? "Virtual Event" : event.location}
          </span>
        </div>
        <div className="mt-2 line-clamp-3 text-sm text-muted-foreground">
          {event.description}
        </div>
      </CardContent>
      <CardFooter>
        {!isPast && event.registrationUrl && (
          <Button className="w-full" asChild>
            <a
              href={event.registrationUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Register Now
            </a>
          </Button>
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

interface InitiativeCardProps {
  initiative: Initiative;
}

function InitiativeCard({ initiative }: InitiativeCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{initiative.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-muted-foreground">{initiative.description}</div>
      </CardContent>
    </Card>
  );
}

function EventsSkeleton() {
  return (
    <div className="space-y-8">
      <Skeleton className="h-8 w-24" /> {/* Events heading skeleton */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="space-y-3">
          <Skeleton className="aspect-video w-full rounded-lg" />
          <Skeleton className="h-6 w-3/4" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="space-y-3">
          <Skeleton className="aspect-video w-full rounded-lg" />
          <Skeleton className="h-6 w-3/4" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="space-y-3">
          <Skeleton className="aspect-video w-full rounded-lg" />
          <Skeleton className="h-6 w-3/4" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    </div>
  );
}

function InitiativesSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      <Skeleton className="h-40 w-full rounded-lg" />
      <Skeleton className="h-40 w-full rounded-lg" />
      <Skeleton className="h-40 w-full rounded-lg" />
      <Skeleton className="h-40 w-full rounded-lg" />
    </div>
  );
}
