import { Principal } from "@icp-sdk/core/principal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Comment, UserProfile } from "../types/backend";
import { useActor } from "./useActor";
import { useInternetIdentity } from "./useInternetIdentity";

// Extended Comment interface for hierarchical structure with username context
export interface CommentWithReplies extends Comment {
  replies: CommentWithReplies[];
  isReply: boolean;
  parentId?: bigint;
  level: number;
  authorName?: string;
  repliedToUsername?: string;
}

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

// Enhanced helper function to build hierarchical comment structure with username context
async function buildCommentHierarchy(
  comments: Comment[],
  actor: any,
): Promise<CommentWithReplies[]> {
  const userProfileMap = new Map<string, UserProfile | null>();

  const uniqueAuthors = [
    ...new Set(comments.map((comment) => comment.author.toString())),
  ];

  await Promise.all(
    uniqueAuthors.map(async (authorPrincipal) => {
      try {
        const profile = await actor.getUserProfile(
          Principal.fromText(authorPrincipal),
        );
        userProfileMap.set(authorPrincipal, profile);
      } catch (error) {
        await conditionalLog(
          actor,
          "Error fetching user profile for",
          authorPrincipal,
          error,
        );
        userProfileMap.set(authorPrincipal, null);
      }
    }),
  );

  const processedComments: CommentWithReplies[] = comments.map((comment) => {
    const authorPrincipal = comment.author.toString();
    const authorProfile = userProfileMap.get(authorPrincipal);
    const authorName = authorProfile?.name || "匿名用户";

    const replyMatch = comment.content.match(/^回复@([^:：]+)[：:](.*)$/);
    const isReply = !!replyMatch;
    const repliedToUsername = replyMatch ? replyMatch[1].trim() : undefined;
    const actualContent = replyMatch ? replyMatch[2].trim() : comment.content;

    return {
      ...comment,
      content: actualContent,
      replies: [],
      isReply,
      level: 0,
      authorName,
      repliedToUsername,
    };
  });

  return processedComments;
}

export function useGetComments(articleId: string | undefined) {
  const { actor, isFetching } = useActor();

  return useQuery<CommentWithReplies[]>({
    queryKey: ["comments", articleId],
    queryFn: async () => {
      if (!actor || !articleId) return [];
      try {
        const id = BigInt(articleId);
        await conditionalLog(actor, "获取评论:", articleId);
        const comments = await actor.getCommentsForArticle(id);
        const hierarchicalComments = await buildCommentHierarchy(
          comments,
          actor,
        );
        return hierarchicalComments.sort((a, b) =>
          Number(b.createdAt - a.createdAt),
        );
      } catch (error) {
        await conditionalLog(actor, "获取评论时出错:", error);
        return [];
      }
    },
    enabled: !!actor && !isFetching && !!articleId,
    staleTime: 30 * 1000,
    refetchInterval: 30 * 1000,
  });
}

export function useCreateComment() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      articleId,
      content,
    }: { articleId: string; content: string }) => {
      if (!actor) throw new Error("Actor not available");
      const id = BigInt(articleId);
      await conditionalLog(actor, "创建评论:", articleId, content);
      return actor.addComment(id, content);
    },
    onSuccess: (_, { articleId }) => {
      queryClient.invalidateQueries({ queryKey: ["comments", articleId] });
      queryClient.refetchQueries({ queryKey: ["comments", articleId] });
    },
    onError: (error) => {
      console.error("创建评论失败:", error);
    },
  });
}

export function useCreateReply() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      articleId,
      parentComment,
      content,
    }: {
      articleId: string;
      parentComment: CommentWithReplies;
      content: string;
    }) => {
      if (!actor) throw new Error("Actor not available");

      const repliedToUsername = parentComment.authorName || "匿名用户";
      const replyContent = `回复@${repliedToUsername}: ${content}`;

      const id = BigInt(articleId);
      await conditionalLog(actor, "创建回复:", articleId, replyContent);
      return actor.addComment(id, replyContent);
    },
    onSuccess: (_, { articleId }) => {
      queryClient.invalidateQueries({ queryKey: ["comments", articleId] });
      queryClient.refetchQueries({ queryKey: ["comments", articleId] });
    },
    onError: (error) => {
      console.error("创建回复失败:", error);
    },
  });
}

export function useDeleteComment() {
  const { actor } = useActor();
  const { identity } = useInternetIdentity();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (commentId: bigint) => {
      if (!actor) throw new Error("Actor not available");
      if (!identity) throw new Error("User not authenticated");

      await conditionalLog(actor, "正在删除评论，ID:", commentId.toString());
      await conditionalLog(
        actor,
        "当前用户主体ID:",
        identity.getPrincipal().toString(),
      );

      try {
        await actor.deleteComment(commentId);
        await conditionalLog(actor, "后端 deleteComment 方法调用成功");
      } catch (error) {
        await conditionalLog(actor, "删除评论时出错:", error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments"] });
      queryClient.refetchQueries({ queryKey: ["comments"] });
      queryClient.invalidateQueries({ queryKey: ["cryptoTrendsComments"] });
      queryClient.refetchQueries({ queryKey: ["cryptoTrendsComments"] });
    },
    onError: (error) => {
      console.error("删除评论失败:", error);
    },
  });
}

// Crypto Trends Community Comment hooks
const CRYPTO_TRENDS_ARTICLE_ID = BigInt(999999);

export function useGetCryptoTrendsComments() {
  const { actor, isFetching } = useActor();

  return useQuery<Comment[]>({
    queryKey: ["cryptoTrendsComments"],
    queryFn: async () => {
      if (!actor) return [];
      try {
        await conditionalLog(actor, "获取加密趋势评论");
        const comments = await actor.getCommentsForArticle(
          CRYPTO_TRENDS_ARTICLE_ID,
        );
        return comments.sort((a, b) => Number(b.createdAt - a.createdAt));
      } catch (error) {
        await conditionalLog(actor, "获取加密趋势评论时出错:", error);
        return [];
      }
    },
    enabled: !!actor && !isFetching,
    staleTime: 30 * 1000,
    refetchInterval: 30 * 1000,
  });
}

export function useCreateCryptoTrendsComment() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ content }: { content: string }) => {
      if (!actor) throw new Error("Actor not available");
      await conditionalLog(actor, "创建加密趋势评论:", content);
      return actor.addComment(CRYPTO_TRENDS_ARTICLE_ID, content);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cryptoTrendsComments"] });
      queryClient.refetchQueries({ queryKey: ["cryptoTrendsComments"] });
    },
    onError: (error) => {
      console.error("创建加密趋势评论失败:", error);
    },
  });
}

export function useDeleteCryptoTrendsComment() {
  const { actor } = useActor();
  const { identity } = useInternetIdentity();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (commentId: bigint) => {
      if (!actor) throw new Error("Actor not available");
      if (!identity) throw new Error("User not authenticated");

      await conditionalLog(
        actor,
        "正在删除加密趋势评论，ID:",
        commentId.toString(),
      );
      await conditionalLog(
        actor,
        "当前用户主体ID:",
        identity.getPrincipal().toString(),
      );

      try {
        await actor.deleteComment(commentId);
        await conditionalLog(actor, "后端 deleteComment 方法调用成功");
      } catch (error) {
        await conditionalLog(actor, "删除加密趋势评论时出错:", error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cryptoTrendsComments"] });
      queryClient.refetchQueries({ queryKey: ["cryptoTrendsComments"] });
    },
    onError: (error) => {
      console.error("删除加密趋势评论失败:", error);
    },
  });
}
