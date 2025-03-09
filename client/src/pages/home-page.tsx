import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { PrayerList } from "@/components/prayer-list";
import { AddPrayerDialog } from "@/components/add-prayer-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { PlusCircle } from "lucide-react";
import type { PrayerEntry } from "@shared/schema";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export default function HomePage() {
  const { user, logoutMutation } = useAuth();

  const { data: prayers = [], isLoading } = useQuery<PrayerEntry[]>({
    queryKey: ["/api/prayers"],
  });

  const unbelieversPrayers = prayers.filter((prayer) => prayer.category === "unbelievers");
  const brethrenPrayers = prayers.filter((prayer) => prayer.category === "brethren");

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="border-b py-4">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <h1 className="text-xl font-bold">Prayer Tracker</h1>
          {user && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => logoutMutation.mutate()}
            >
              Logout
            </Button>
          )}
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 md:py-8 flex-1">
        <Tabs defaultValue="unbelievers" className="md:flex md:flex-row md:gap-6">
          <TabsList>
            <TabsTrigger value="unbelievers">Unbelievers</TabsTrigger>
            <TabsTrigger value="brethren">Brethren in Hardship</TabsTrigger>
          </TabsList>
          <TabsContent value="unbelievers">
            <Card className="border-2 border-red-200 bg-red-50/30 dark:bg-red-950/10">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-red-700 dark:text-red-400">Unbelievers</CardTitle>
                  <AddPrayerDialog category="unbelievers">
                    <Button 
                      size="sm" 
                      className="bg-emerald-600 hover:bg-emerald-700 text-white"
                    >
                      <PlusCircle className="h-4 w-4 mr-1" />
                      Add Person
                    </Button>
                  </AddPrayerDialog>
                </div>
              </CardHeader>
              <CardContent>
                <PrayerList
                  prayers={unbelieversPrayers}
                  isLoading={isLoading}
                  category="unbelievers"
                />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="brethren">
            <Card className="border-2 border-blue-200 bg-blue-50/30 dark:bg-blue-950/10">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-blue-700 dark:text-blue-400">Brethren in Hardship</CardTitle>
                  <AddPrayerDialog category="brethren">
                    <Button 
                      size="sm" 
                      className="bg-emerald-600 hover:bg-emerald-700 text-white"
                    >
                      <PlusCircle className="h-4 w-4 mr-1" />
                      Add Person
                    </Button>
                  </AddPrayerDialog>
                </div>
              </CardHeader>
              <CardContent>
                <PrayerList
                  prayers={brethrenPrayers}
                  isLoading={isLoading}
                  category="brethren"
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}