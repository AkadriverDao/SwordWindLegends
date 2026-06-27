import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';
import type { Article } from '../backend';

// Enhanced interface for articles with status tracking
export interface ArticleWithStatus {
  id: bigint;
  article: Article;
  status: 'private' | 'pending' | 'approved' | 'rejected';
  title: string;
  createdAt: bigint;
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
  } catch (error) {
    // If we can't check log status, don't log anything
  }
}

export function useGetMyArticles() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<ArticleWithStatus[]>({
    queryKey: ['myArticles', identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor || !identity) return [];
      
      try {
        const backendArticles = await actor.getArticlesByAuthor(identity.getPrincipal());
        await conditionalLog(actor, '获取到的后端文章数据:', backendArticles);
        
        const allArticles: ArticleWithStatus[] = backendArticles.map(([id, article]) => {
          let status: 'private' | 'pending' | 'approved' | 'rejected';
          
          if (!article.submittedForReview) {
            status = 'private';
          } else {
            switch (Number(article.approvalStatus)) {
              case 0:
                status = 'pending';
                break;
              case 1:
                status = 'approved';
                break;
              case 2:
                status = 'rejected';
                break;
              default:
                status = 'pending';
            }
          }
          
          return {
            id,
            article,
            status,
            title: article.title,
            createdAt: article.createdAt,
          };
        });
        
        allArticles.sort((a, b) => Number(b.createdAt - a.createdAt));
        
        await conditionalLog(actor, '处理后的文章总数:', allArticles.length);
        return allArticles;
      } catch (error) {
        await conditionalLog(actor, '获取文章时出错:', error);
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
    queryKey: ['singleArticle', articleId],
    queryFn: async () => {
      if (!actor || !articleId) return null;
      try {
        const id = BigInt(articleId);
        await conditionalLog(actor, '获取单篇文章，ID:', id.toString());
        const article = await actor.getArticle(id);
        await conditionalLog(actor, '获取到的文章:', article);
        return article;
      } catch (error) {
        await conditionalLog(actor, '获取单篇文章时出错:', error);
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
    queryKey: ['allArticles'],
    queryFn: async () => {
      if (!actor) return [];
      await conditionalLog(actor, '获取所有文章');
      return actor.getAllArticles();
    },
    enabled: !!actor && !isFetching,
    staleTime: 30 * 1000,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    refetchInterval: 30 * 1000,
  });
}

export function useGetPendingArticles() {
  const { actor, isFetching } = useActor();

  return useQuery<Array<[bigint, Article]>>({
    queryKey: ['pendingArticles'],
    queryFn: async () => {
      if (!actor) return [];
      const allArticles = await actor.getAllArticles();
      await conditionalLog(actor, '获取待审核文章');
      return allArticles.filter(([_, article]) => article.submittedForReview && Number(article.approvalStatus) === 0);
    },
    enabled: !!actor && !isFetching,
    staleTime: 10 * 1000,
    refetchInterval: 10 * 1000,
  });
}

export function useGetArticlesByCategory(category: string) {
  const { actor, isFetching } = useActor();

  return useQuery<Array<[bigint, Article]>>({
    queryKey: ['articlesByCategory', category],
    queryFn: async () => {
      if (!actor || !category) return [];
      try {
        await conditionalLog(actor, '获取分类文章:', category);
        return actor.getArticlesByCategory(category);
      } catch (error) {
        await conditionalLog(actor, '获取分类文章时出错:', error);
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
    mutationFn: async ({ title, content, submittedForReview, categories }: { title: string; content: string; submittedForReview: boolean; categories: string[] }) => {
      if (!actor) throw new Error('Actor not available');
      await conditionalLog(actor, '创建文章:', title);
      return actor.createArticle(title, content, submittedForReview, categories);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myArticles'] });
      queryClient.invalidateQueries({ queryKey: ['allArticles'] });
      queryClient.invalidateQueries({ queryKey: ['pendingArticles'] });
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
      queryClient.invalidateQueries({ queryKey: ['leaderboard'] });
      queryClient.invalidateQueries({ queryKey: ['leaderboardByArticles'] });
      queryClient.invalidateQueries({ queryKey: ['articlesByCategory'] });
      
      queryClient.refetchQueries({ queryKey: ['allArticles'] });
      queryClient.refetchQueries({ queryKey: ['pendingArticles'] });
      queryClient.refetchQueries({ queryKey: ['articlesByCategory'] });
    },
  });
}

export function useUpdateArticle() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ articleId, title, content, submittedForReview, categories }: { articleId: bigint; title: string; content: string; submittedForReview: boolean; categories: string[] }) => {
      if (!actor) throw new Error('Actor not available');
      await conditionalLog(actor, '更新文章:', articleId.toString());
      return actor.updateArticle(articleId, title, content, submittedForReview, categories);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myArticles'] });
      queryClient.invalidateQueries({ queryKey: ['allArticles'] });
      queryClient.invalidateQueries({ queryKey: ['pendingArticles'] });
      queryClient.invalidateQueries({ queryKey: ['singleArticle'] });
      queryClient.invalidateQueries({ queryKey: ['articlesByCategory'] });
      
      queryClient.refetchQueries({ queryKey: ['allArticles'] });
      queryClient.refetchQueries({ queryKey: ['pendingArticles'] });
      queryClient.refetchQueries({ queryKey: ['articlesByCategory'] });
    },
  });
}

export function useDeleteArticle() {
  const { actor } = useActor();
  const { identity } = useInternetIdentity();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (articleId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      if (!identity) throw new Error('User not authenticated');
      
      await conditionalLog(actor, '删除文章:', articleId.toString());
      return actor.deleteArticle(articleId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myArticles'] });
      queryClient.invalidateQueries({ queryKey: ['allArticles'] });
      queryClient.invalidateQueries({ queryKey: ['pendingArticles'] });
      queryClient.invalidateQueries({ queryKey: ['singleArticle'] });
      queryClient.invalidateQueries({ queryKey: ['leaderboard'] });
      queryClient.invalidateQueries({ queryKey: ['leaderboardByArticles'] });
      queryClient.invalidateQueries({ queryKey: ['articlesByCategory'] });
      
      queryClient.refetchQueries({ queryKey: ['allArticles'] });
      queryClient.refetchQueries({ queryKey: ['pendingArticles'] });
      queryClient.refetchQueries({ queryKey: ['articlesByCategory'] });
    },
  });
}

// Helper function to get approval status from ArticleWithStatus
export function getArticleApprovalStatus(articleWithStatus: ArticleWithStatus): 'private' | 'pending' | 'approved' | 'rejected' {
  return articleWithStatus.status;
}

// Legacy helper function for backward compatibility with Article type
export function getArticleApprovalStatusLegacy(article: Article): 'private' | 'pending' | 'approved' | 'rejected' {
  if (!article.submittedForReview) {
    return 'private';
  } else {
    switch (Number(article.approvalStatus)) {
      case 0:
        return 'pending';
      case 1:
        return 'approved';
      case 2:
        return 'rejected';
      default:
        return 'pending';
    }
  }
}
