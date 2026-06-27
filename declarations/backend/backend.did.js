export const idlFactory = ({ IDL }) => {
  const UserRole = IDL.Variant({
    'admin' : IDL.Null,
    'user' : IDL.Null,
    'guest' : IDL.Null,
  });
  const Time = IDL.Int;
  const Article = IDL.Record({
    'categories' : IDL.Vec(IDL.Text),
    'title' : IDL.Text,
    'likeCount' : IDL.Nat,
    'content' : IDL.Text,
    'submittedForReview' : IDL.Bool,
    'createdAt' : Time,
    'author' : IDL.Principal,
    'approvalStatus' : IDL.Int,
    'updatedAt' : Time,
  });
  const Land = IDL.Record({ 'x' : IDL.Nat, 'y' : IDL.Nat, 'id' : IDL.Nat });
  const TradingPair = IDL.Record({
    'enabled' : IDL.Bool,
    'coinId' : IDL.Text,
    'symbol' : IDL.Text,
  });
  const UserProfile = IDL.Record({ 'name' : IDL.Text });
  const Comment = IDL.Record({
    'content' : IDL.Text,
    'commentId' : IDL.Nat,
    'createdAt' : Time,
    'author' : IDL.Principal,
    'articleId' : IDL.Nat,
  });
  const FileReference = IDL.Record({ 'hash' : IDL.Text, 'path' : IDL.Text });
  const MiningResult = IDL.Variant({
    'gold' : IDL.Nat,
    'nothing' : IDL.Null,
    'death' : IDL.Null,
  });
  const MiningHistory = IDL.Record({
    'result' : MiningResult,
    'landId' : IDL.Nat,
    'timestamp' : Time,
  });
  const MiningLeaderboardEntry = IDL.Record({
    'principal' : IDL.Principal,
    'gold' : IDL.Nat,
  });
  const PlayerStatus = IDL.Variant({ 'alive' : IDL.Null, 'dead' : IDL.Null });
  const ApprovalStatus = IDL.Variant({
    'pending' : IDL.Null,
    'approved' : IDL.Null,
    'rejected' : IDL.Null,
  });
  const UserApprovalInfo = IDL.Record({
    'status' : ApprovalStatus,
    'principal' : IDL.Principal,
  });
  return IDL.Service({
    'addComment' : IDL.Func([IDL.Nat, IDL.Text], [IDL.Nat], []),
    'addTradingPair' : IDL.Func([IDL.Text, IDL.Text, IDL.Bool], [], []),
    'approveArticle' : IDL.Func([IDL.Nat], [], []),
    'assignCallerUserRole' : IDL.Func([IDL.Principal, UserRole], [], []),
    'createArticle' : IDL.Func(
        [IDL.Text, IDL.Text, IDL.Bool, IDL.Vec(IDL.Text)],
        [IDL.Nat],
        [],
      ),
    'deleteArticle' : IDL.Func([IDL.Nat], [], []),
    'deleteComment' : IDL.Func([IDL.Nat], [], []),
    'deleteTradingPair' : IDL.Func([IDL.Text], [], []),
    'dropFileReference' : IDL.Func([IDL.Text], [], []),
    'getAllArticles' : IDL.Func(
        [],
        [IDL.Vec(IDL.Tuple(IDL.Nat, Article))],
        ['query'],
      ),
    'getAllLands' : IDL.Func([], [IDL.Vec(Land)], ['query']),
    'getAllTradingPairs' : IDL.Func(
        [],
        [IDL.Vec(IDL.Tuple(IDL.Text, TradingPair))],
        ['query'],
      ),
    'getArticle' : IDL.Func([IDL.Nat], [IDL.Opt(Article)], ['query']),
    'getArticleLikeCount' : IDL.Func([IDL.Nat], [IDL.Nat], ['query']),
    'getArticlesByAuthor' : IDL.Func(
        [IDL.Principal],
        [IDL.Vec(IDL.Tuple(IDL.Nat, Article))],
        ['query'],
      ),
    'getArticlesByCategory' : IDL.Func(
        [IDL.Text],
        [IDL.Vec(IDL.Tuple(IDL.Nat, Article))],
        ['query'],
      ),
    'getCallerUserProfile' : IDL.Func([], [IDL.Opt(UserProfile)], ['query']),
    'getCallerUserRole' : IDL.Func([], [UserRole], ['query']),
    'getCommentsForArticle' : IDL.Func(
        [IDL.Nat],
        [IDL.Vec(Comment)],
        ['query'],
      ),
    'getFileReference' : IDL.Func([IDL.Text], [FileReference], ['query']),
    'getLand' : IDL.Func([IDL.Nat], [IDL.Opt(Land)], ['query']),
    'getLogEnabled' : IDL.Func([], [IDL.Bool], ['query']),
    'getMiningHistory' : IDL.Func([], [IDL.Vec(MiningHistory)], ['query']),
    'getMiningLeaderboard' : IDL.Func(
        [],
        [IDL.Vec(MiningLeaderboardEntry)],
        ['query'],
      ),
    'getMiningProbability' : IDL.Func([], [IDL.Nat, IDL.Nat], ['query']),
    'getPlayerGold' : IDL.Func([], [IDL.Nat], ['query']),
    'getPlayerStatus' : IDL.Func([], [PlayerStatus], ['query']),
    'getTokenBalance' : IDL.Func([], [IDL.Nat], ['query']),
    'getTotalGoldMined' : IDL.Func([], [IDL.Nat], ['query']),
    'getTotalMiningOperations' : IDL.Func([], [IDL.Nat], ['query']),
    'getTotalPlayers' : IDL.Func([], [IDL.Nat], ['query']),
    'getTradingPair' : IDL.Func([IDL.Text], [IDL.Opt(TradingPair)], ['query']),
    'getUserProfile' : IDL.Func(
        [IDL.Principal],
        [IDL.Opt(UserProfile)],
        ['query'],
      ),
    'hasLikedArticle' : IDL.Func([IDL.Nat], [IDL.Bool], ['query']),
    'initializeAccessControl' : IDL.Func([], [], []),
    'initializeLands' : IDL.Func([], [], []),
    'isCallerAdmin' : IDL.Func([], [IDL.Bool], ['query']),
    'isCallerApproved' : IDL.Func([], [IDL.Bool], ['query']),
    'likeArticle' : IDL.Func([IDL.Nat], [], []),
    'listApprovals' : IDL.Func([], [IDL.Vec(UserApprovalInfo)], ['query']),
    'listFileReferences' : IDL.Func([], [IDL.Vec(FileReference)], ['query']),
    'mineLand' : IDL.Func([IDL.Nat], [MiningResult], []),
    'registerFileReference' : IDL.Func([IDL.Text, IDL.Text], [], []),
    'rejectArticle' : IDL.Func([IDL.Nat], [], []),
    'requestApproval' : IDL.Func([], [], []),
    'revive' : IDL.Func([], [], []),
    'saveCallerUserProfile' : IDL.Func([UserProfile], [], []),
    'setApproval' : IDL.Func([IDL.Principal, ApprovalStatus], [], []),
    'setLogEnabled' : IDL.Func([IDL.Bool], [], []),
    'setMiningProbability' : IDL.Func([IDL.Nat, IDL.Nat], [], []),
    'transferTokens' : IDL.Func([IDL.Principal, IDL.Nat], [], []),
    'unlikeArticle' : IDL.Func([IDL.Nat], [], []),
    'updateArticle' : IDL.Func(
        [IDL.Nat, IDL.Text, IDL.Text, IDL.Bool, IDL.Vec(IDL.Text)],
        [],
        [],
      ),
    'updateTradingPair' : IDL.Func([IDL.Text, IDL.Bool], [], []),
  });
};
export const init = ({ IDL }) => { return []; };
