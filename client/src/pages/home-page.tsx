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
import { PRAYERS_QUERY_KEY } from "@/lib/queries";

export default function HomePage() {
  const { user, logoutMutation } = useAuth();
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState<"unbelievers" | "brethren">(
    "unbelievers",
  );

  const { data: prayerEntries = [], isLoading } = useQuery({
    queryKey: [PRAYERS_QUERY_KEY],
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
    <div className="flex min-h-screen flex-col bg-white">
      <header className="sticky top-0 z-10 border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
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
              <TabsList className="grid grid-cols-2 w-full rounded-lg shadow-sm">
                <TabsTrigger value="unbelievers">Unbelievers</TabsTrigger>
                <TabsTrigger value="brethren">Brethren in Hardship</TabsTrigger>
              </TabsList>
            </div>
            <div className="mb-4">
              <AddPrayerDialog category={activeTab}>
                <Button
                  variant="outline"
                  className={`w-full flex items-center justify-center rounded-lg shadow-sm
                    ${
                      activeTab === "unbelievers"
                        ? "bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 hover:text-red-800"
                        : "bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 hover:text-blue-800"
                    }`}
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  <span>Add Person</span>
                </Button>
              </AddPrayerDialog>
            </div>
            <TabsContent value="unbelievers">
              <Card className="bg-red-50/30 border border-red-200 rounded-lg shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-red-700 mb-4 text-xl">
                    Unbelievers
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-3 py-2">
                  <PrayerList
                    prayers={unbelieversPrayers}
                    isLoading={isLoading}
                    category="unbelievers"
                  />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="brethren">
              <Card className="bg-blue-50/30 border border-blue-200 rounded-lg shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-blue-700 mb-4 text-xl">
                    Brethren in Hardship
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-3 py-2">
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
            <Card className="flex-1 border-2 border-red-200 bg-red-50/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-red-700 flex items-center gap-2">
                  Unbelievers
                </CardTitle>
              </CardHeader>
              <CardContent className="px-3 py-2">
                <div className="mb-3 flex justify-end">
                  <AddPrayerDialog category="unbelievers">
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-red-700 border-red-200 hover:bg-red-100 hover:text-red-800"
                    >
                      <PlusCircle className="h-4 w-4 mr-1" />
                      Add Person
                    </Button>
                  </AddPrayerDialog>
                </div>
                <PrayerList
                  prayers={unbelieversPrayers}
                  isLoading={isLoading}
                  category="unbelievers"
                />
              </CardContent>
            </Card>

            {/* Brethren Section - Blue-ish Theme */}
            <Card className="flex-1 border-2 border-blue-200 bg-blue-50/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-blue-700 flex items-center gap-2">
                  Brethren in Hardship
                </CardTitle>
              </CardHeader>
              <CardContent className="px-3 py-2">
                <div className="mb-3 flex justify-end">
                  <AddPrayerDialog category="brethren">
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-blue-700 border-blue-200 hover:bg-blue-100 hover:text-blue-800"
                    >
                      <PlusCircle className="h-4 w-4 mr-1" />
                      Add Person
                    </Button>
                  </AddPrayerDialog>
                </div>
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
