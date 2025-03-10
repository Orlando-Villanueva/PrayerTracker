
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

  // Use React Query to fetch prayers
  const { data: prayers = [], isLoading } = useQuery({
    queryKey: ['prayers'],
    queryFn: async () => {
      const response = await api.get("/prayers");
      return response.data;
    },
    enabled: !!user,
  });

  // Mutation for toggling prayer status
  const togglePrayer = useMutation({
    mutationFn: async ({ id, answered }: { id: number, answered: boolean }) => {
      await api.patch(`/prayers/${id}`, {
        isResolved: !answered,
      });
    },
    // Optimistically update UI
    onMutate: async ({ id, answered }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['prayers'] });
      
      // Snapshot the previous value
      const previousPrayers = queryClient.getQueryData(['prayers']);
      
      // Optimistically update to the new value
      queryClient.setQueryData(['prayers'], (old: Prayer[] = []) => 
        old.map(prayer => 
          prayer.id === id ? { ...prayer, answered: !answered } : prayer
        )
      );
      
      // Return a context object with the snapshotted value
      return { previousPrayers };
    },
    // If the mutation fails, use the context returned from onMutate to roll back
    onError: (err, variables, context) => {
      queryClient.setQueryData(['prayers'], context?.previousPrayers);
    },
    // Always refetch after error or success
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['prayers'] });
    },
  });

  // Mutation for deleting prayers
  const deletePrayer = useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/prayers/${id}`);
    },
    // Optimistically update UI
    onMutate: async (id) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['prayers'] });
      
      // Snapshot the previous value
      const previousPrayers = queryClient.getQueryData(['prayers']);
      
      // Optimistically update to the new value
      queryClient.setQueryData(['prayers'], (old: Prayer[] = []) => 
        old.filter(prayer => prayer.id !== id)
      );
      
      // Return a context object with the snapshotted value
      return { previousPrayers };
    },
    // If the mutation fails, use the context returned from onMutate to roll back
    onError: (err, variables, context) => {
      queryClient.setQueryData(['prayers'], context?.previousPrayers);
    },
    // Always refetch after error or success
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['prayers'] });
    },
  });

  const handleToggle = (id: number) => {
    const prayer = prayers.find(p => p.id === id);
    if (prayer) {
      togglePrayer.mutate({ id, answered: prayer.answered });
    }
  };

  const handleDelete = (id: number) => {
    deletePrayer.mutate(id);
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
