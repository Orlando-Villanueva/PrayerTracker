import { Prayer } from "@/shared/schema";

export const PRAYERS_QUERY_KEY = "/api/prayers" as const;

export type PrayersResponse = Prayer[];

export const prayersQueryOptions = {
  queryKey: [PRAYERS_QUERY_KEY],
  queryFn: async ({ queryKey }): Promise<PrayersResponse> => {
    const response = await fetch(queryKey[0]);
    if (!response.ok) {
      throw new Error('Failed to fetch prayers');
    }
    return response.json();
  },
};
