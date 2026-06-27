import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Article } from "../types/backend";
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

export function useGetMyArticles() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<Array<[bigint, Article]>>({
    queryKey: ["myArticles", identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor || !identity) return [];

      try {
        const backendArticles = await actor.getArticlesByAuthor(
          identity.getPrincipal(),
        );
        await conditionalLog(actor, "获取到的后端文章数据:", backendArticles);

        const allArticles = [...backendArticles];
        allArticles.sort((a, b) => Number(b[1].createdAt - a[1].createdAt));

        await conditionalLog(actor, "处理后的文章总数:", allArticles.length);
        return allArticles;
      } catch (error) {
        await conditionalLog(actor, "获取文章时出错:", error);
        return [];
      }
    },
    enabled: !!actor && !isFetching && !!identity,
    staleTime: 2 * 60 * 1000,
  });
}

export function useGetSingleArticle(articleId: string | undefined) {
  const { actor, isFetching } = useActor();

  return useQuery<Article | null>({
    queryKey: ["singleArticle", articleId],
    queryFn: async () => {
      if (!actor || !articleId) return null;
      try {
        const id = BigInt(articleId);
        await conditionalLog(actor, "获取单篇文章，ID:", id.toString());
        const article = await actor.getArticle(id);
        await conditionalLog(actor, "获取到的文章:", article);
        return article;
      } catch (error) {
        await conditionalLog(actor, "获取单篇文章时出错:", error);
        return null;
      }
    },
    enabled: !!actor && !isFetching && !!articleId,
    staleTime: 5 * 60 * 1000,
  });
}

export function useGetAllArticles() {
  const { actor, isFetching } = useActor();

  return useQuery<Array<[bigint, Article]>>({
    queryKey: ["allArticles"],
    queryFn: async () => {
      if (!actor) return [];
      await conditionalLog(actor, "获取所有文章");
      return actor.getAllArticles();
    },
    enabled: !!actor && !isFetching,
    staleTime: 30 * 1000,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    refetchInterval: 30 * 1000,
  });
}

export function useGetArticlesByCategory(category: string) {
  const { actor, isFetching } = useActor();

  return useQuery<Array<[bigint, Article]>>({
    queryKey: ["articlesByCategory", category],
    queryFn: async () => {
      if (!actor || !category) return [];
      try {
        await conditionalLog(actor, "获取分类文章:", category);
        return actor.getArticlesByCategory(category);
      } catch (error) {
        await conditionalLog(actor, "获取分类文章时出错:", error);
        return [];
      }
    },
    enabled: !!actor && !isFetching && !!category,
    staleTime: 2 * 60 * 1000,
  });
}

export function useCreateArticle() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      title,
      content,
      categories,
    }: {
      title: string;
      content: string;
      categories: string[];
    }) => {
      if (!actor) throw new Error("Actor not available");
      await conditionalLog(actor, "创建文章:", title);
      return actor.createArticle(title, content, categories);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myArticles"] });
      queryClient.invalidateQueries({ queryKey: ["allArticles"] });
      queryClient.invalidateQueries({ queryKey: ["currentUserProfile"] });
      queryClient.invalidateQueries({ queryKey: ["leaderboard"] });
      queryClient.invalidateQueries({ queryKey: ["leaderboardByArticles"] });
      queryClient.invalidateQueries({ queryKey: ["articlesByCategory"] });

      queryClient.refetchQueries({ queryKey: ["allArticles"] });
      queryClient.refetchQueries({ queryKey: ["articlesByCategory"] });
    },
  });
}

export function useUpdateArticle() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      articleId,
      title,
      content,
      categories,
    }: {
      articleId: bigint;
      title: string;
      content: string;
      categories: string[];
    }) => {
      if (!actor) throw new Error("Actor not available");
      await conditionalLog(actor, "更新文章:", articleId.toString());
      return actor.updateArticle(articleId, title, content, categories);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myArticles"] });
      queryClient.invalidateQueries({ queryKey: ["allArticles"] });
      queryClient.invalidateQueries({ queryKey: ["singleArticle"] });
      queryClient.invalidateQueries({ queryKey: ["articlesByCategory"] });

      queryClient.refetchQueries({ queryKey: ["allArticles"] });
      queryClient.refetchQueries({ queryKey: ["articlesByCategory"] });
    },
  });
}

export function useDeleteArticle() {
  const { actor } = useActor();
  const { identity } = useInternetIdentity();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (articleId: bigint) => {
      if (!actor) throw new Error("Actor not available");
      if (!identity) throw new Error("User not authenticated");

      await conditionalLog(actor, "删除文章:", articleId.toString());
      return actor.deleteArticle(articleId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myArticles"] });
      queryClient.invalidateQueries({ queryKey: ["allArticles"] });
      queryClient.invalidateQueries({ queryKey: ["singleArticle"] });
      queryClient.invalidateQueries({ queryKey: ["leaderboard"] });
      queryClient.invalidateQueries({ queryKey: ["leaderboardByArticles"] });
      queryClient.invalidateQueries({ queryKey: ["articlesByCategory"] });

      queryClient.refetchQueries({ queryKey: ["allArticles"] });
      queryClient.refetchQueries({ queryKey: ["articlesByCategory"] });
    },
  });
}

// Super-admin only: pin/unpin an article
export function useSetArticlePinned() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      articleId,
      pinned,
    }: {
      articleId: bigint;
      pinned: boolean;
    }) => {
      if (!actor) throw new Error("Actor not available");
      await conditionalLog(
        actor,
        "设置文章置顶:",
        articleId.toString(),
        pinned,
      );
      return actor.setArticlePinned(articleId, pinned);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allArticles"] });
      queryClient.invalidateQueries({ queryKey: ["articlesByCategory"] });
      queryClient.invalidateQueries({ queryKey: ["myArticles"] });
      queryClient.invalidateQueries({ queryKey: ["singleArticle"] });

      queryClient.refetchQueries({ queryKey: ["allArticles"] });
      queryClient.refetchQueries({ queryKey: ["articlesByCategory"] });
    },
  });
}

// Super-admin only: hide/show an article with optional hide reason
export function useSetArticleVisible() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      articleId,
      visible,
      hideReason,
    }: {
      articleId: bigint;
      visible: boolean;
      hideReason: string;
    }) => {
      if (!actor) throw new Error("Actor not available");
      await conditionalLog(
        actor,
        "设置文章可见性:",
        articleId.toString(),
        visible,
        hideReason,
      );
      return actor.setArticleVisible(articleId, visible, hideReason);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allArticles"] });
      queryClient.invalidateQueries({ queryKey: ["articlesByCategory"] });
      queryClient.invalidateQueries({ queryKey: ["myArticles"] });
      queryClient.invalidateQueries({ queryKey: ["singleArticle"] });

      queryClient.refetchQueries({ queryKey: ["allArticles"] });
      queryClient.refetchQueries({ queryKey: ["articlesByCategory"] });
    },
  });
}
