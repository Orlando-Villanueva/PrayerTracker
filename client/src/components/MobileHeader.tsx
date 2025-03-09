
import React from "react";
import { useUser } from "@/contexts/UserContext";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { PlusCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export function MobileHeader({ onAddPrayer }: { onAddPrayer?: () => void }) {
  const { user } = useUser();
  const { logout } = useAuth();

  return (
    <div className="flex flex-col w-full">
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center space-x-2">
          <span className="font-semibold text-lg">Prayer Tracker</span>
        </div>
        
        <div className="flex items-center space-x-3">
          {user && (
            <span className="text-sm text-muted-foreground hidden sm:inline-block">
              Welcome, {user.username}
            </span>
          )}
          {user && (
            <Button variant="outline" size="sm" onClick={logout}>
              Logout
            </Button>
          )}
        </div>
      </div>
      
      {onAddPrayer && (
        <div className="p-3 flex justify-end border-b">
          <Button 
            onClick={onAddPrayer} 
            size="sm"
            className="gap-1"
          >
            <PlusCircle className="h-4 w-4" />
            <span>Add Prayer</span>
          </Button>
        </div>
      )}
    </div>
  );
}
