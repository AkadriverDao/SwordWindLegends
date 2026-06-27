// This file previously hosted useApproveArticle / useRejectArticle hooks.
// The backend approveArticle / rejectArticle methods have been removed in
// favor of the publish-without-review flow (setArticleVisible / setArticlePinned).
// The hooks are intentionally left empty so existing barrel re-exports in
// useQueries.ts remain valid without referencing deleted symbols.
export {};
