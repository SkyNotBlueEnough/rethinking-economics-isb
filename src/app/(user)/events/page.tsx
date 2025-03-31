"use client";

import { useState } from "react";
import { format } from "date-fns";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "~/components/ui/breadcrumb";
import { api } from "~/trpc/react";
import type { Event, Initiative } from "~/lib/types/events";

// Import modular components
import { EventCard } from "~/app/(user)/events/components/EventCard";
import { InitiativeCard } from "~/app/(user)/events/components/InitiativeCard";
import { EventDetailsDialog } from "~/app/(user)/events/components/EventDetailsDialog";
import {
  EventsSkeleton,
  InitiativesSkeleton,
} from "~/app/(user)/events/components/EventsSkeleton";

export default function EventsPage() {
  // Fetch events from API
  const { data: events, isLoading: eventsLoading } =
    api.events.getAllEventsSorted.useQuery();
  const { data: initiatives, isLoading: initiativesLoading } =
    api.events.getAllInitiatives.useQuery();

  // State for event details dialog
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);

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

  // Open event details dialog
  const openEventDetails = (event: Event) => {
    setSelectedEvent(event);
    setIsDetailsDialogOpen(true);
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
                  onViewDetails={openEventDetails}
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

      {/* Event Details Dialog */}
      <EventDetailsDialog
        event={selectedEvent}
        isOpen={isDetailsDialogOpen}
        onOpenChange={setIsDetailsDialogOpen}
        getBadgeVariant={getBadgeVariant}
      />
    </div>
  );
}
