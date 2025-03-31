import { Skeleton } from "~/components/ui/skeleton";

export function EventsSkeleton() {
  return (
    <div className="space-y-8">
      <Skeleton className="h-8 w-24" /> {/* Events heading skeleton */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((key) => (
          <div key={key} className="space-y-3">
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
    </div>
  );
}

export function InitiativesSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      {[1, 2, 3, 4].map((key) => (
        <Skeleton key={key} className="h-40 w-full rounded-lg" />
      ))}
    </div>
  );
}
