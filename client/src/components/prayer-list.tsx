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
      <div className="grid gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-32" />
        ))}
      </div>
    );
  }

  if (prayers.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">
          No prayers added for {category === "unbelievers" ? "unbelievers" : "brethren"} yet.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {prayers.map((entry) => (
        <PrayerEntryCard key={entry.id} entry={entry} />
      ))}
    </div>
  );
}