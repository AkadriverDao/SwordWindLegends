import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { GameMod } from '../backend';

export function useGetAllGameMods() {
  const { actor, isFetching } = useActor();

  return useQuery<Array<[bigint, GameMod]>>({
    queryKey: ['gameMods'],
    queryFn: async () => {
      if (!actor) return [];
      try {
        const result = await actor.getAllGameMods();
        return result || [];
      } catch (error) {
        console.error('Error fetching game mods:', error);
        return [];
      }
    },
    enabled: !!actor && !isFetching,
    staleTime: 5 * 60 * 1000,
  });
}

export function useGetGameModById(gameId?: bigint) {
  const { actor, isFetching } = useActor();

  return useQuery<GameMod | null>({
    queryKey: ['gameMod', gameId?.toString()],
    queryFn: async () => {
      if (!actor || !gameId) return null;
      try {
        const result = await actor.getGameModById(gameId);
        return result || null;
      } catch (error) {
        console.error('Error fetching game mod by id:', error);
        return null;
      }
    },
    enabled: !!actor && !isFetching && !!gameId,
    staleTime: 5 * 60 * 1000,
  });
}

export function useAddGameMod() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      title,
      description,
      imageUrl,
      link,
    }: {
      title: string;
      description: string;
      imageUrl: string;
      link: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addGameMod(title, description, imageUrl, link);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gameMods'] });
    },
    onError: (error) => {
      console.error('Failed to add game mod:', error);
    },
  });
}

export function useUpdateGameMod() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      gameId,
      title,
      description,
      imageUrl,
      link,
    }: {
      gameId: bigint;
      title: string;
      description: string;
      imageUrl: string;
      link: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateGameMod(gameId, title, description, imageUrl, link);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['gameMods'] });
      queryClient.invalidateQueries({ queryKey: ['gameMod', variables.gameId.toString()] });
    },
    onError: (error) => {
      console.error('Failed to update game mod:', error);
    },
  });
}
