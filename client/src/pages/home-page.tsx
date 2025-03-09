import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { PrayerList } from "@/components/prayer-list";
import { AddPrayerDialog } from "@/components/add-prayer-dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Cross, LogOut } from "lucide-react";
import type { PrayerEntry } from "@shared/schema";

export default function HomePage() {
  const { user, logoutMutation } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<"unbelievers" | "brethren">("unbelievers");

  const { data: prayers = [], isLoading } = useQuery<PrayerEntry[]>({
    queryKey: ["/api/prayers"],
  });

  const filteredPrayers = prayers.filter((prayer) => prayer.category === selectedCategory);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b py-3 md:py-0">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:h-16 md:items-center justify-between gap-4 md:gap-0">
            <div className="flex items-center gap-3">
              <Cross className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-semibold">Prayer Tracker</h1>
            </div>
            <div className="flex items-center justify-between md:gap-4">
              <span className="text-muted-foreground">Welcome, {user?.username}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => logoutMutation.mutate()}
                disabled={logoutMutation.isPending}
                className="ml-4"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 md:py-8">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <Tabs 
              value={selectedCategory} 
              onValueChange={(v: "unbelievers" | "brethren") => setSelectedCategory(v)}
              className="w-full md:w-auto"
            >
              <TabsList className="w-full md:w-auto grid grid-cols-2">
                <TabsTrigger value="unbelievers" className="px-6">Unbelievers</TabsTrigger>
                <TabsTrigger value="brethren" className="px-6">Brethren in Hardship</TabsTrigger>
              </TabsList>
            </Tabs>
            <AddPrayerDialog category={selectedCategory} />
          </div>

          <div className="grid gap-6">
            <PrayerList
              prayers={filteredPrayers}
              isLoading={isLoading}
              category={selectedCategory}
            />
          </div>
        </div>
      </main>
    </div>
  );
}