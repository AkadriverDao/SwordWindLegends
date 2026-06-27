import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useActor } from "./useActor";
import { useInternetIdentity } from "./useInternetIdentity";

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

export function useLikeArticle() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (articleId: string) => {
      if (!actor) throw new Error("Actor not available");
      const id = BigInt(articleId);
      await conditionalLog(actor, "点赞文章:", articleId);
      return actor.likeArticle(id);
    },
    onSuccess: (_, articleId) => {
      queryClient.invalidateQueries({ queryKey: ["articleLikes", articleId] });
      queryClient.invalidateQueries({ queryKey: ["singleArticle", articleId] });
      queryClient.invalidateQueries({ queryKey: ["allArticles"] });

      queryClient.refetchQueries({ queryKey: ["articleLikes", articleId] });
      queryClient.refetchQueries({ queryKey: ["allArticles"] });
    },
    onError: (error) => {
      console.error("点赞失败:", error);
    },
  });
}

export function useUnlikeArticle() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (articleId: string) => {
      if (!actor) throw new Error("Actor not available");
      const id = BigInt(articleId);
      await conditionalLog(actor, "取消点赞文章:", articleId);
      return actor.unlikeArticle(id);
    },
    onSuccess: (_, articleId) => {
      queryClient.invalidateQueries({ queryKey: ["articleLikes", articleId] });
      queryClient.invalidateQueries({ queryKey: ["singleArticle", articleId] });
      queryClient.invalidateQueries({ queryKey: ["allArticles"] });

      queryClient.refetchQueries({ queryKey: ["articleLikes", articleId] });
      queryClient.refetchQueries({ queryKey: ["allArticles"] });
    },
    onError: (error) => {
      console.error("取消点赞失败:", error);
    },
  });
}

export function useGetArticleLikes(articleId: string | undefined) {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<{ count: number; userHasLiked: boolean }>({
    queryKey: ["articleLikes", articleId],
    queryFn: async () => {
      if (!actor || !articleId) return { count: 0, userHasLiked: false };
      try {
        const id = BigInt(articleId);
        await conditionalLog(actor, "获取文章点赞数据:", articleId);
        const [likeCount, userHasLiked] = await Promise.all([
          actor.getArticleLikeCount(id),
          identity ? actor.hasLikedArticle(id) : Promise.resolve(false),
        ]);
        return {
          count: Number(likeCount),
          userHasLiked: userHasLiked,
        };
      } catch (error) {
        await conditionalLog(actor, "获取点赞数据时出错:", error);
        return { count: 0, userHasLiked: false };
      }
    },
    enabled: !!actor && !isFetching && !!articleId,
    staleTime: 30 * 1000,
    refetchInterval: 30 * 1000,
  });
}
