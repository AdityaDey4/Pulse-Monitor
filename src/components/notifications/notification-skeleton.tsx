import { Skeleton } from "@/components/ui/skeleton";

export function NotificationSkeleton() {
  return (
    <div className="space-y-2">
      {Array.from({ length: 5 }).map((_, index) => (
        <div key={index} className="flex items-start gap-3 rounded-xl border border-border p-4">
          <Skeleton className="h-8 w-8 rounded-lg shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-3 w-16 rounded" />
            <Skeleton className="h-3.5 w-full rounded" />
            <Skeleton className="h-3 w-24 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}