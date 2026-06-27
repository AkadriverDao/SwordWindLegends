import { createActor } from "@/backend";
import { useActor as useCoreActor } from "@caffeineai/core-infrastructure";

export function useActor() {
  const result = useCoreActor(createActor);
  return {
    actor: result.actor as any,
    isFetching: result.isFetching,
  };
}
