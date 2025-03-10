
import { PrayerEntryCard } from "./prayer-entry";
import { Skeleton } from "@/components/ui/skeleton";
import type { PrayerEntry } from "@shared/schema";

interface PrayerListProps {
  prayers: PrayerEntry[];
  isLoading: boolean;
  category: "unbelievers" | "brethren";
}

export function PrayerList({ prayers, isLoading, category }: PrayerListProps) {
  if (isLoading) {
    return (
      <div className="space-y-1.5">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-8 w-full" />
        ))}
      </div>
    );
  }

  if (prayers.length === 0) {
    return (
      <div className="text-center py-2">
        <p className="text-sm text-muted-foreground">
          No prayers added for {category === "unbelievers" ? "unbelievers" : "brethren"} yet.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-1.5">
      {prayers.map((entry) => (
        <PrayerEntryCard key={entry.id} entry={entry} />
      ))}
    </div>
  );
}
