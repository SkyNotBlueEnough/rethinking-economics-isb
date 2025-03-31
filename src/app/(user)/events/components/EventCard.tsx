import Image from "next/image";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import type { Event } from "~/lib/types/events";

interface EventCardProps {
  event: Event;
  formatDate: (date: Date) => string;
  getBadgeVariant: (
    type: string,
  ) => "default" | "secondary" | "destructive" | "outline";
  isPast?: boolean;
  onViewDetails: (event: Event) => void;
}

export function EventCard({
  event,
  formatDate,
  getBadgeVariant,
  isPast = false,
  onViewDetails,
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
          <Button
            variant="outline"
            className="w-full"
            onClick={() => onViewDetails(event)}
          >
            View Details
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
