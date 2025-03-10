import { Prayer } from "@/shared/schema";

export const PRAYERS_QUERY_KEY = "/api/prayers" as const;

export type PrayersResponse = Prayer[];

export const prayersQueryOptions = {
  queryKey: [PRAYERS_QUERY_KEY],
  queryFn: async (): Promise<PrayersResponse> => {
    const response = await fetch(PRAYERS_QUERY_KEY);
    if (!response.ok) {
      throw new Error('Failed to fetch prayers');
    }
    return response.json();
  },
};