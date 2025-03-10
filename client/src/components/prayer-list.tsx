import { PrayerEntryCard } from "./prayer-entry";
import { Skeleton } from "@/components/ui/skeleton";
import type { PrayerEntry } from "@shared/schema";

interface PrayerListProps {
  prayers: PrayerEntry[];
  isLoading: boolean;
  category: "unbelievers" | "brethren";
}

export function PrayerList({ prayers, isLoading, category }: PrayerListProps) {
  const containerStyles = {
    unbelievers: "border-2 border-red-200 bg-red-50/30 dark:bg-red-950/10",
    brethren: "border-2 border-blue-200 bg-blue-50/30 dark:bg-blue-950/10",
  }[category];

  if (isLoading) {
    return (
      <div className={`grid gap-4 rounded-lg p-4 ${containerStyles}`}>
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-32" />
        ))}
      </div>
    );
  }

  if (prayers.length === 0) {
    return (
      <div className={`text-center py-12 rounded-lg ${containerStyles}`}>
        <p className="text-muted-foreground">
          No prayers added for {category === "unbelievers" ? "unbelievers" : "brethren"} yet.
        </p>
      </div>
    );
  }

  return (
    <div className={`grid gap-4 rounded-lg p-4 ${containerStyles}`}>
      {prayers.map((entry) => (
        <PrayerEntryCard key={entry.id} entry={entry} />
      ))}
    </div>
  );
}