
import React, { useState, useEffect } from "react";
import { Prayer } from "@/shared/schema";

import { PlusIcon } from "lucide-react";

import { useUser } from "@/contexts/UserContext";
import { useApi } from "@/hooks/use-api";

import { Button } from "@/components/ui/button";

import { useIsMobile } from "@/hooks/use-mobile";
import { PrayerItem } from "@/components/PrayerItem";
import { MobileHeader } from "@/components/MobileHeader";
import { PrayerFormDialog } from "@/components/PrayerFormDialog";
import {
  ResponsiveTabs,
  ResponsiveTabsList,
  ResponsiveTabsTrigger,
  ResponsiveTabsContent,
} from "@/components/ui/tabs-responsive";

export default function Dashboard() {
  const { user } = useUser();
  const api = useApi();
  const isMobile = useIsMobile();
  const [prayers, setPrayers] = useState<Prayer[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    if (user) {
      fetchPrayers();
    }
  }, [user]);

  const fetchPrayers = async () => {
    try {
      const response = await api.get("/prayers");
      setPrayers(response.data);
    } catch (error) {
      console.error("Error fetching prayers:", error);
    }
  };

  const handleToggle = async (id: number) => {
    try {
      const prayer = prayers.find((p) => p.id === id);
      if (!prayer) return;

      await api.patch(`/prayers/${id}`, {
        isResolved: !prayer.answered,
      });
      
      await fetchPrayers();
    } catch (error) {
      console.error("Error toggling prayer:", error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/prayers/${id}`);
      await fetchPrayers();
    } catch (error) {
      console.error("Error deleting prayer:", error);
    }
  };

  const filteredPrayers = () => {
    if (activeTab === "unanswered") {
      return prayers.filter((prayer) => !prayer.answered);
    } else if (activeTab === "answered") {
      return prayers.filter((prayer) => prayer.answered);
    } else {
      return prayers;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <MobileHeader onAddPrayer={() => setIsFormOpen(true)} />
      
      <div className="flex-1 container max-w-3xl py-2 px-4">
        <div className="md:hidden mb-4">
          <Button 
            className="w-full bg-[hsl(220_16%_22%)] hover:bg-[hsl(220_16%_18%)] text-white"
            onClick={() => setIsFormOpen(true)}
          >
            <PlusIcon className="h-4 w-4 mr-1" />
            Add Prayer
          </Button>
        </div>
        
        <ResponsiveTabs value={activeTab} onValueChange={setActiveTab}>
          <ResponsiveTabsList>
            <ResponsiveTabsTrigger value="all">
              All Prayers
            </ResponsiveTabsTrigger>
            <ResponsiveTabsTrigger value="unanswered">
              Unanswered
            </ResponsiveTabsTrigger>
            <ResponsiveTabsTrigger value="answered">
              Answered
            </ResponsiveTabsTrigger>
          </ResponsiveTabsList>
          
          <ResponsiveTabsContent value={activeTab} className="mt-4">
            {filteredPrayers().length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No prayers found. Click "Add Prayer" to get started.
              </div>
            ) : (
              <div>
                {filteredPrayers().map((prayer) => (
                  <PrayerItem
                    key={prayer.id}
                    prayer={prayer}
                    onToggle={handleToggle}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            )}
          </ResponsiveTabsContent>
        </ResponsiveTabs>
      </div>

      <PrayerFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSuccess={fetchPrayers}
      />
    </div>
  );
}
