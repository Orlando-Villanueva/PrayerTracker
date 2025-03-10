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
import { PRAYERS_QUERY_KEY, prayersQueryOptions } from "@/lib/queries";

export default function Dashboard() {
  const { user } = useUser();
  const api = useApi();
  const queryClient = useQueryClient();
  const isMobile = useIsMobile();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all");

  const { data: prayers = [], isLoading } = useQuery({
    ...prayersQueryOptions,
    enabled: !!user,
  });

  const togglePrayer = useMutation({
    mutationFn: async (id: number) => {
      const prayer = prayers.find((p: Prayer) => p.id === id);
      if (!prayer) throw new Error('Prayer not found');
      const response = await api.patch(`/prayers/${id}`, {
        isResolved: !prayer.answered,
      });
      return response.data;
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: [PRAYERS_QUERY_KEY] });
      const previousPrayers = queryClient.getQueryData<Prayer[]>([PRAYERS_QUERY_KEY]);

      queryClient.setQueryData<Prayer[]>([PRAYERS_QUERY_KEY], (old = []) => 
        old.map(prayer => 
          prayer.id === id ? { ...prayer, answered: !prayer.answered } : prayer
        )
      );

      return { previousPrayers };
    },
    onError: (err, id, context) => {
      if (context?.previousPrayers) {
        queryClient.setQueryData([PRAYERS_QUERY_KEY], context.previousPrayers);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [PRAYERS_QUERY_KEY] });
    },
  });

  const deletePrayer = useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/prayers/${id}`);
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: [PRAYERS_QUERY_KEY] });
      const previousPrayers = queryClient.getQueryData<Prayer[]>([PRAYERS_QUERY_KEY]);

      queryClient.setQueryData<Prayer[]>([PRAYERS_QUERY_KEY], (old = []) => 
        old.filter(prayer => prayer.id !== id)
      );

      return { previousPrayers };
    },
    onError: (err, id, context) => {
      if (context?.previousPrayers) {
        queryClient.setQueryData([PRAYERS_QUERY_KEY], context.previousPrayers);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [PRAYERS_QUERY_KEY] });
    },
  });

  const handleToggle = (id: number) => {
    togglePrayer.mutate(id);
  };

  const handleDelete = (id: number) => {
    deletePrayer.mutate(id);
  };

  const filteredPrayers = React.useMemo(() => {
    if (activeTab === "unanswered") {
      return prayers.filter((prayer: Prayer) => !prayer.answered);
    } else if (activeTab === "answered") {
      return prayers.filter((prayer: Prayer) => prayer.answered);
    }
    return prayers;
  }, [prayers, activeTab]);

  if (isLoading) {
    return (
      <div className="flex-1 container max-w-3xl py-2 px-4">
        <div className="text-center py-8">Loading prayers...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <MobileHeader onAddPrayer={() => setIsFormOpen(true)} />

      <div className="flex-1 container max-w-3xl py-2 px-4">
        <div className="md:hidden mb-4">
          <Button 
            className="w-full bg-gray-800 hover:bg-gray-700 text-white"
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
            {filteredPrayers.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No prayers found. Click "Add Prayer" to get started.
              </div>
            ) : (
              <div>
                {filteredPrayers.map((prayer: Prayer) => (
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