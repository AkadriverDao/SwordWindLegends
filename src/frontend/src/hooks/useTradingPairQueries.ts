import { useQuery } from "@tanstack/react-query";
import type { TradingPair } from "../types/backend";
import { useActor } from "./useActor";

// Conditional logging helper
async function conditionalLog(actor: any, message: string, ...args: any[]) {
  try {
    if (actor) {
      const logEnabled = await actor.getLogEnabled();
      if (logEnabled) {
        console.log(message, ...args);
      }
    }
  } catch (_error) {
    // If we can't check log status, don't log anything
  }
}

export function useGetAllTradingPairs() {
  const { actor, isFetching } = useActor();

  return useQuery<Array<[string, TradingPair]>>({
    queryKey: ["allTradingPairs"],
    queryFn: async () => {
      if (!actor) return [];
      try {
        const result = await actor.getAllTradingPairs();
        await conditionalLog(actor, "Backend trading pairs retrieved:", result);
        return result;
      } catch (error) {
        await conditionalLog(
          actor,
          "Error fetching trading pairs from backend:",
          error,
        );
        return [];
      }
    },
    enabled: !!actor && !isFetching,
    staleTime: 2 * 60 * 1000,
    refetchOnWindowFocus: true,
  });
}
