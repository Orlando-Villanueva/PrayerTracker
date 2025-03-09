import React from "react";
import { useUser } from "@/contexts/UserContext";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { PlusIcon } from "lucide-react";

interface MobileHeaderProps {
  onAddPrayer: () => void;
}

export function MobileHeader({ onAddPrayer }: MobileHeaderProps) {
  return (
    <div className="bg-background border-b md:hidden sticky top-0 z-10">
      <div className="container py-3 px-4 flex justify-between items-center">
        <h1 className="text-xl font-semibold">Prayer Journal</h1>
        <Button 
          size="sm" 
          onClick={onAddPrayer}
          className="bg-[hsl(220_16%_22%)] hover:bg-[hsl(220_16%_18%)] text-white w-full max-w-none mt-2"
        >
          <PlusIcon className="h-4 w-4 mr-1" />
          Add Prayer
        </Button>
      </div>
    </div>
  );
}