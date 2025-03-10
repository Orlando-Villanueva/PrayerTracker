
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Trash2 } from "lucide-react";
import type { PrayerEntry } from "@shared/schema";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { PRAYERS_QUERY_KEY } from "@/lib/queries";

interface PrayerEntryCardProps {
  entry: PrayerEntry;
}

export function PrayerEntryCard({ entry }: PrayerEntryCardProps) {
  const [open, setOpen] = useState(false);

  const togglePrayer = useMutation({
    mutationFn: async () => {
      await apiRequest("PATCH", `/api/prayers/${entry.id}`, {
        isAnswered: !entry.isAnswered,
      });
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: [PRAYERS_QUERY_KEY] });
      const previousPrayers = queryClient.getQueryData([PRAYERS_QUERY_KEY]);
      
      queryClient.setQueryData([PRAYERS_QUERY_KEY], (old: any) => {
        return old.map((prayer: PrayerEntry) =>
          prayer.id === entry.id
            ? { ...prayer, isAnswered: !prayer.isAnswered }
            : prayer
        );
      });
      
      return { previousPrayers };
    },
    onError: (err, _, context) => {
      if (context?.previousPrayers) {
        queryClient.setQueryData([PRAYERS_QUERY_KEY], context.previousPrayers);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [PRAYERS_QUERY_KEY] });
    },
  });

  const deletePrayer = useMutation({
    mutationFn: async () => {
      await apiRequest("DELETE", `/api/prayers/${entry.id}`);
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: [PRAYERS_QUERY_KEY] });
      const previousPrayers = queryClient.getQueryData([PRAYERS_QUERY_KEY]);
      
      queryClient.setQueryData([PRAYERS_QUERY_KEY], (old: any) => {
        return old.filter((prayer: PrayerEntry) => prayer.id !== entry.id);
      });
      
      return { previousPrayers };
    },
    onError: (err, _, context) => {
      if (context?.previousPrayers) {
        queryClient.setQueryData([PRAYERS_QUERY_KEY], context.previousPrayers);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [PRAYERS_QUERY_KEY] });
    },
  });

  const iconColor = entry.category === "unbelievers" 
    ? "text-red-600 dark:text-red-400" 
    : "text-blue-600 dark:text-blue-400";

  return (
    <div className="flex items-center justify-between py-3 px-4 border rounded-lg bg-background hover:bg-muted/30 transition-colors shadow-sm mb-2">
      <div className="flex-1 min-w-0">
        <h4 className="font-medium truncate">{entry.name}</h4>
        {entry.description && (
          <p className="text-xs text-muted-foreground truncate">{entry.description}</p>
        )}
      </div>
      
      <div className="flex items-center gap-1 ml-2 shrink-0">
        <Button
          variant="ghost"
          size="icon"
          className={`h-7 w-7 ${iconColor}`}
          onClick={() => togglePrayer.mutate()}
          disabled={togglePrayer.isPending}
        >
          <CheckCircle className="h-4 w-4" />
        </Button>
        
        <AlertDialog open={open} onOpenChange={setOpen}>
          <AlertDialogTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Prayer Entry</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this prayer entry? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => deletePrayer.mutate()}
                disabled={deletePrayer.isPending}
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
