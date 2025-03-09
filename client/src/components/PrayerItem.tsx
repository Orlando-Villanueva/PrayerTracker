
import React from "react";
import { Prayer } from "@/shared/schema";
import { Button } from "@/components/ui/button";
import { Check, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface PrayerItemProps {
  prayer: Prayer;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
}

export function PrayerItem({ prayer, onToggle, onDelete }: PrayerItemProps) {
  return (
    <div className={cn(
      "p-4 mb-3 rounded-lg border flex items-center justify-between",
      prayer.answered && "bg-muted/50"
    )}>
      <div className="flex-1">
        <div className={cn(
          "font-medium",
          prayer.answered && "text-muted-foreground line-through"
        )}>
          {prayer.name}
        </div>
        {prayer.description && (
          <div className="text-sm text-muted-foreground mt-1">
            {prayer.description}
          </div>
        )}
      </div>
      
      <div className="flex space-x-2 ml-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onToggle(prayer.id)}
          className={cn(
            "h-8 w-8",
            prayer.answered && "text-green-600"
          )}
        >
          <Check className="h-4 w-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(prayer.id)}
          className="h-8 w-8 text-destructive"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
