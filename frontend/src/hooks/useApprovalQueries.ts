import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';

// Super user Principal IDs
const SUPER_USER_PRINCIPALS = [
  '56mut-kmgj4-vw3kg-4wrap-bxuiu-tbewj-3iovp-pe6ra-ejg2n-f6oyu-hae',
  '2cho5-wjr5v-rmr6c-ltfkb-g4a6w-c7j26-ya2lp-46pn2-n2air-wbjnw-cae'
];

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

export function useApproveArticle() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const { identity } = useInternetIdentity();

  return useMutation({
    mutationFn: async (articleId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      if (!identity) throw new Error('User not authenticated');
      
      const currentPrincipal = identity.getPrincipal().toString();
      if (!SUPER_USER_PRINCIPALS.includes(currentPrincipal)) {
        throw new Error('Unauthorized: Only super users can approve articles');
      }

      await conditionalLog(actor, '正在通过文章审核:', articleId.toString());
      await conditionalLog(actor, '当前用户主体ID:', currentPrincipal);
      
      await conditionalLog(actor, '调用后端 approveArticle 方法');
      await actor.approveArticle(articleId);
      await conditionalLog(actor, '后端 approveArticle 方法调用成功');
      
      return Promise.resolve();
    },
    onSuccess: (_, articleId) => {
      queryClient.invalidateQueries({ queryKey: ['allArticles'] });
      queryClient.invalidateQueries({ queryKey: ['pendingArticles'] });
      queryClient.invalidateQueries({ queryKey: ['myArticles'] });
      queryClient.invalidateQueries({ queryKey: ['articlesByCategory'] });
      
      queryClient.refetchQueries({ queryKey: ['allArticles'] });
      queryClient.refetchQueries({ queryKey: ['pendingArticles'] });
      queryClient.refetchQueries({ queryKey: ['articlesByCategory'] });
    },
    onError: (error) => {
      console.error('文章审核通过失败:', error);
    },
  });
}

export function useRejectArticle() {
  const { actor } = useActor();
  const { identity } = useInternetIdentity();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (articleId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      if (!identity) throw new Error('User not authenticated');
      
      const currentPrincipal = identity.getPrincipal().toString();
      if (!SUPER_USER_PRINCIPALS.includes(currentPrincipal)) {
        throw new Error('Unauthorized: Only super users can reject articles');
      }

      await conditionalLog(actor, '正在拒绝文章审核:', articleId.toString());
      await conditionalLog(actor, '当前用户主体ID:', currentPrincipal);
      
      await conditionalLog(actor, '调用后端 rejectArticle 方法');
      await actor.rejectArticle(articleId);
      await conditionalLog(actor, '后端 rejectArticle 方法调用成功，文章已标记为审核不通过');
      
      return Promise.resolve();
    },
    onSuccess: (_, articleId) => {
      queryClient.invalidateQueries({ queryKey: ['allArticles'] });
      queryClient.invalidateQueries({ queryKey: ['pendingArticles'] });
      queryClient.invalidateQueries({ queryKey: ['myArticles'] });
      queryClient.invalidateQueries({ queryKey: ['articlesByCategory'] });
      
      queryClient.refetchQueries({ queryKey: ['allArticles'] });
      queryClient.refetchQueries({ queryKey: ['pendingArticles'] });
      queryClient.refetchQueries({ queryKey: ['articlesByCategory'] });
    },
    onError: (error) => {
      console.error('文章审核拒绝失败:', error);
    },
  });
}
