import { format } from "date-fns";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "~/components/ui/dialog";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import type { Event } from "~/lib/types/events";

interface EventDetailsDialogProps {
  event: Event | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  getBadgeVariant: (
    type: string,
  ) => "default" | "secondary" | "destructive" | "outline";
}

export function EventDetailsDialog({
  event,
  isOpen,
  onOpenChange,
  getBadgeVariant,
}: EventDetailsDialogProps) {
  // Format date
  const formatEventDate = (date: Date) => {
    return format(date, "MMMM d, yyyy");
  };

  if (!event) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <>
          <DialogHeader>
            <DialogTitle className="mb-2">{event.title}</DialogTitle>
            <div className="flex flex-col items-start gap-2">
              <Badge variant={getBadgeVariant(event.type ?? "")}>
                {(event.type?.charAt(0).toUpperCase() ?? "") +
                  (event.type?.slice(1) ?? "")}
              </Badge>
              <span className="text-sm text-muted-foreground">
                {event.status &&
                  event.status.charAt(0).toUpperCase() + event.status.slice(1)}
              </span>
            </div>
          </DialogHeader>

          {event.thumbnailUrl && (
            <div className="relative mx-auto aspect-video w-full max-w-lg overflow-hidden rounded-md">
              <Image
                src={event.thumbnailUrl}
                alt={event.title}
                fill
                className="object-cover"
                onError={(e) => {
                  e.currentTarget.src =
                    "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=600&auto=format&fit=crop";
                }}
              />
            </div>
          )}

          <div className="grid gap-4 py-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center text-sm">
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
                <span>{formatEventDate(event.startDate)}</span>
                {event.endDate && (
                  <span> - {formatEventDate(event.endDate)}</span>
                )}
              </div>
            </div>

            <div className="flex items-center text-sm">
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
              <span>{event.isVirtual ? "Virtual Event" : event.location}</span>
            </div>

            {event.virtualLink && event.isVirtual && (
              <div className="flex items-center text-sm">
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
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                </svg>
                <a
                  href={event.virtualLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  Virtual Event Link
                </a>
              </div>
            )}

            {event.description && (
              <div className="mt-4 text-sm">
                <div className="font-medium">About this event:</div>
                <div className="mt-1 whitespace-pre-wrap text-muted-foreground">
                  {event.description}
                </div>
              </div>
            )}

            {event.maxAttendees && (
              <div className="mt-2 text-sm">
                <span className="font-medium">Max Attendees:</span>{" "}
                {event.maxAttendees}
              </div>
            )}
          </div>

          <DialogFooter>
            {event.registrationUrl && (
              <Button asChild>
                <a
                  href={event.registrationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View Registration
                </a>
              </Button>
            )}
            <DialogClose asChild>
              <Button variant="outline">Close</Button>
            </DialogClose>
          </DialogFooter>
        </>
      </DialogContent>
    </Dialog>
  );
}
