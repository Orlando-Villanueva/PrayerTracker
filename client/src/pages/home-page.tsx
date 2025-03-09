import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { PrayerList } from "@/components/prayer-list";
import { AddPrayerDialog } from "@/components/add-prayer-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useIsMobile } from "@/hooks/use-mobile";
import type { PrayerEntry } from "@shared/schema";

export default function HomePage() {
  const { user, logoutMutation } = useAuth();
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState("unbelievers");

  const { data: prayerEntries = [], isLoading } = useQuery({
    queryKey: ["prayers"],
    queryFn: async () => {
      const response = await fetch("/api/prayers");
      if (!response.ok) {
        throw new Error("Failed to fetch prayers");
      }
      return response.json() as Promise<PrayerEntry[]>;
    },
    enabled: !!user,
  });

  const unbelieversPrayers = prayerEntries.filter(
    (prayer) => prayer.category === "unbelievers",
  );

  const brethrenPrayers = prayerEntries.filter(
    (prayer) => prayer.category === "brethren",
  );

  if (!user) {
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 max-w-screen-2xl items-center px-4">
          <div className="mr-4 flex items-center md:mr-6">
            <strong className="font-semibold tracking-tight">
              Prayer Tracker
            </strong>
          </div>
          <div className="flex flex-1 items-center justify-end space-x-2">
            {user && (
              <>
                <span className="text-sm text-muted-foreground mr-2">
                  Welcome, {user.username}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => logoutMutation.mutate()}
                >
                  Logout
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 md:py-8 flex-1">
        {isMobile ? (
          <Tabs
            defaultValue="unbelievers"
            value={activeTab}
            onValueChange={setActiveTab}
          >
            <div className="mb-4">
              <TabsList className="w-full">
                <TabsTrigger value="unbelievers">Unbelievers</TabsTrigger>
                <TabsTrigger value="brethren">Brethren in Hardship</TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value="unbelievers">
              <Card className="bg-red-50/30 dark:bg-red-950/10">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-red-700 dark:text-red-400">
                      Unbelievers
                    </CardTitle>
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
                    <CardTitle className="text-blue-700 dark:text-blue-400">
                      Brethren in Hardship
                    </CardTitle>
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
        ) : (
          <div className="flex flex-col md:flex-row gap-6">
            {/* Unbelievers Section - Red-ish Theme */}
            <Card className="flex-1 border-2 border-red-200 bg-red-50/30 dark:bg-red-950/10">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-red-700 dark:text-red-400">
                    Unbelievers
                  </CardTitle>
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

            {/* Brethren Section - Blue-ish Theme */}
            <Card className="flex-1 border-2 border-blue-200 bg-blue-50/30 dark:bg-blue-950/10">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-blue-700 dark:text-blue-400">
                    Brethren in Hardship
                  </CardTitle>
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
          </div>
        )}
      </main>
    </div>
  );
}
