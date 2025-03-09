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
      <header className="border-b">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Cross className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-semibold">Prayer Tracker</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-muted-foreground">Welcome, {user?.username}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => logoutMutation.mutate()}
              disabled={logoutMutation.isPending}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <Tabs value={selectedCategory} onValueChange={(v: "unbelievers" | "brethren") => setSelectedCategory(v)}>
            <TabsList>
              <TabsTrigger value="unbelievers">Unbelievers</TabsTrigger>
              <TabsTrigger value="brethren">Brethren in Hardship</TabsTrigger>
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
      </main>
    </div>
  );
}