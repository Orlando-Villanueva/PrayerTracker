import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

interface PrayerEntryProps {
  entry: PrayerEntry;
}

export function PrayerEntryCard({ entry }: PrayerEntryProps) {
  const [showDelete, setShowDelete] = useState(false);

  const toggleResolved = useMutation({
    mutationFn: async () => {
      await apiRequest("PATCH", `/api/prayers/${entry.id}`, {
        isResolved: !entry.isResolved,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/prayers"] });
    },
  });

  const deletePrayer = useMutation({
    mutationFn: async () => {
      await apiRequest("DELETE", `/api/prayers/${entry.id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/prayers"] });
    },
  });

  return (
    <Card className={entry.isResolved ? "opacity-75" : ""}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className={`text-xl ${entry.isResolved ? "line-through" : ""}`}>
          {entry.name}
        </CardTitle>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => toggleResolved.mutate()}
            disabled={toggleResolved.isPending}
          >
            {entry.isResolved ? (
              <XCircle className="h-5 w-5 text-muted-foreground" />
            ) : (
              <CheckCircle className="h-5 w-5 text-success" />
            )}
          </Button>
          <AlertDialog open={showDelete} onOpenChange={setShowDelete}>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="icon">
                <Trash2 className="h-5 w-5 text-destructive" />
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
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{entry.description}</p>
      </CardContent>
    </Card>
  );
}
