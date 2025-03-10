import React, { useState } from "react";
import { Prayer } from "@/shared/schema";
import { PlusIcon } from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import { useApi } from "@/hooks/use-api";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { PrayerItem } from "@/components/PrayerItem";
import { MobileHeader } from "@/components/MobileHeader";
import { PrayerFormDialog } from "@/components/PrayerFormDialog";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ResponsiveTabs,
  ResponsiveTabsList,
  ResponsiveTabsTrigger,
  ResponsiveTabsContent,
} from "@/components/ui/tabs-responsive";

export default function Dashboard() {
  const { user } = useUser();
  const api = useApi();
  const queryClient = useQueryClient();
  const isMobile = useIsMobile();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all");

  // Use React Query to fetch prayers with consistent query key
  const { data: prayers = [], isLoading } = useQuery({
    queryKey: ['/api/prayers'],
    queryFn: async () => {
      const response = await api.get("/prayers");
      return response.data;
    },
    enabled: !!user,
  });

  // Mutation for toggling prayer status
  const togglePrayer = useMutation({
    mutationFn: async (id: number) => {
      const prayer = prayers.find((p: Prayer) => p.id === id);
      await api.patch(`/prayers/${id}`, {
        isResolved: !prayer?.answered,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/prayers'] });
    },
  });

  // Mutation for deleting prayers
  const deletePrayer = useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/prayers/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/prayers'] });
    },
  });

  const handleToggle = (id: number) => {
    togglePrayer.mutate(id);
  };

  const handleDelete = (id: number) => {
    deletePrayer.mutate(id);
  };

  const filteredPrayers = () => {
    if (activeTab === "unanswered") {
      return prayers.filter((prayer: Prayer) => !prayer.answered);
    } else if (activeTab === "answered") {
      return prayers.filter((prayer: Prayer) => prayer.answered);
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
                {filteredPrayers().map((prayer: Prayer) => (
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
      />
    </div>
  );
}