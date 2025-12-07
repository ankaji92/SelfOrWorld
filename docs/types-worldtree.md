# WorldTree フロントエンド型定義

## TypeScript型定義

### ValueNode (値ノード)

```typescript
/**
 * 価値観ツリーのノード
 */
export interface ValueNode {
  /** ノードID (UUID) */
  id: string;

  /** ノードの内容 */
  content: string;

  /** ルートノードかどうか */
  isRoot: boolean;

  /** 同一親配下での表示順序 */
  order: number;

  /** 作成日時 (ISO 8601形式) */
  createdAt: string;

  /** 更新日時 (ISO 8601形式) */
  updatedAt: string;

  /** 子ノードの配列 */
  children: ValueNode[];
}
```

### API リクエスト型

```typescript
/**
 * ノード作成リクエスト
 */
export interface CreateNodeRequest {
  /** ノードの内容 */
  content: string;

  /** 親ノードのID (nullの場合はルートノード作成) */
  parentId: string | null;

  /** 表示順序 */
  order: number;
}

/**
 * ノード更新リクエスト
 */
export interface UpdateNodeRequest {
  /** 更新後の内容 */
  content: string;
}

/**
 * ノード並び替えリクエスト
 */
export interface ReorderNodeRequest {
  /** 新しい表示順序 */
  newOrder: number;
}

/**
 * ノード移動リクエスト
 */
export interface MoveNodeRequest {
  /** 新しい親ノードのID */
  newParentId: string;

  /** 新しい表示順序 */
  newOrder: number;
}
```

### API レスポンス型

```typescript
/**
 * ツリー全体取得レスポンス
 */
export interface GetTreeResponse {
  /** ルートノード */
  root: ValueNode;
}

/**
 * ノード作成レスポンス
 */
export interface CreateNodeResponse {
  /** 作成されたノードのID */
  id: string;

  /** ノードの内容 */
  content: string;

  /** ルートノードかどうか */
  isRoot: boolean;

  /** 表示順序 */
  order: number;

  /** 作成日時 */
  createdAt: string;

  /** 更新日時 */
  updatedAt: string;
}

/**
 * ノード更新レスポンス
 */
export interface UpdateNodeResponse {
  /** ノードID */
  id: string;

  /** 更新後の内容 */
  content: string;

  /** ルートノードかどうか */
  isRoot: boolean;

  /** 表示順序 */
  order: number;

  /** 作成日時 */
  createdAt: string;

  /** 更新日時 */
  updatedAt: string;
}

/**
 * ノード削除レスポンス
 */
export interface DeleteNodeResponse {
  /** 削除成功フラグ */
  deleted: boolean;

  /** 削除されたノード数（子孫を含む） */
  deletedCount: number;
}

/**
 * ノード並び替えレスポンス
 */
export interface ReorderNodeResponse {
  /** ノードID */
  id: string;

  /** 新しい表示順序 */
  order: number;

  /** 更新日時 */
  updatedAt: string;
}

/**
 * ノード移動レスポンス
 */
export interface MoveNodeResponse {
  /** ノードID */
  id: string;

  /** 新しい表示順序 */
  order: number;

  /** 更新日時 */
  updatedAt: string;
}
```

### エラーレスポンス型

```typescript
/**
 * エラーレスポンス
 */
export interface ErrorResponse {
  error: {
    /** エラーコード */
    code: ErrorCode;

    /** エラーメッセージ */
    message: string;

    /** 追加の詳細情報 */
    details?: Record<string, unknown>;
  };
}

/**
 * エラーコード
 */
export type ErrorCode =
  | 'VALIDATION_ERROR'       // バリデーションエラー
  | 'NOT_FOUND'              // ノードが見つからない
  | 'UNAUTHORIZED'           // 認証エラー
  | 'FORBIDDEN'              // 権限エラー
  | 'DUPLICATE_ROOT'         // ルートノードが既に存在
  | 'CIRCULAR_REFERENCE'     // 循環参照エラー
  | 'MAX_DEPTH_EXCEEDED'     // 最大深度超過
  | 'MAX_CHILDREN_EXCEEDED'; // 子ノード数超過
```

## フロントエンド用ユーティリティ型

```typescript
/**
 * フラット化されたノード（ツリー操作用）
 */
export interface FlatValueNode {
  /** ノードID */
  id: string;

  /** 親ノードのID */
  parentId: string | null;

  /** ノードの内容 */
  content: string;

  /** ルートノードかどうか */
  isRoot: boolean;

  /** 表示順序 */
  order: number;

  /** ツリー内の深さ */
  depth: number;

  /** 作成日時 */
  createdAt: string;

  /** 更新日時 */
  updatedAt: string;
}

/**
 * ノード選択状態
 */
export interface NodeSelection {
  /** 選択されたノードのID */
  nodeId: string | null;

  /** 編集モードかどうか */
  isEditing: boolean;
}

/**
 * ツリー表示設定
 */
export interface TreeViewSettings {
  /** 展開されたノードのIDセット */
  expandedNodes: Set<string>;

  /** 表示形式 */
  viewMode: 'tree' | 'list';

  /** 最大表示深度 */
  maxDepth: number | null;
}

/**
 * D3.js用ノードデータ
 */
export interface D3NodeData {
  /** ノードID */
  id: string;

  /** ノードの内容 */
  content: string;

  /** 親ノードのID */
  parentId: string | null;

  /** ルートノードかどうか */
  isRoot: boolean;

  /** X座標（D3計算後） */
  x?: number;

  /** Y座標（D3計算後） */
  y?: number;

  /** 深さ */
  depth: number;
}

/**
 * D3.js用リンクデータ
 */
export interface D3LinkData {
  /** リンクのソースノードID */
  source: string;

  /** リンクのターゲットノードID */
  target: string;
}
```

## 定数定義

```typescript
/**
 * WorldTree関連の定数
 */
export const WORLDTREE_CONSTANTS = {
  /** ツリーの最大深度 */
  MAX_DEPTH: 10,

  /** 1ノードあたりの最大子ノード数 */
  MAX_CHILDREN_PER_NODE: 20,

  /** ノード内容の最大文字数 */
  MAX_CONTENT_LENGTH: 500,

  /** ノード内容の最小文字数 */
  MIN_CONTENT_LENGTH: 1,

  /** デフォルトの表示順序 */
  DEFAULT_ORDER: 0,
} as const;
```

## バリデーション関数の型

```typescript
/**
 * ノード内容のバリデーション
 */
export type ValidateContentFn = (content: string) => {
  valid: boolean;
  error?: string;
};

/**
 * 循環参照チェック
 */
export type CheckCircularReferenceFn = (
  nodeId: string,
  targetParentId: string,
  tree: ValueNode
) => boolean;

/**
 * 深度チェック
 */
export type CheckMaxDepthFn = (
  parentId: string,
  tree: ValueNode,
  maxDepth: number
) => boolean;

/**
 * 子ノード数チェック
 */
export type CheckMaxChildrenFn = (
  parentId: string,
  tree: ValueNode,
  maxChildren: number
) => boolean;
```

## React Hook用の型

```typescript
/**
 * WorldTreeのState
 */
export interface WorldTreeState {
  /** ツリーデータ */
  tree: ValueNode | null;

  /** ローディング状態 */
  isLoading: boolean;

  /** エラー */
  error: ErrorResponse | null;

  /** 選択されたノード */
  selectedNode: NodeSelection;

  /** 表示設定 */
  viewSettings: TreeViewSettings;
}

/**
 * WorldTreeのActions
 */
export interface WorldTreeActions {
  /** ツリー全体を取得 */
  fetchTree: () => Promise<void>;

  /** ノードを作成 */
  createNode: (request: CreateNodeRequest) => Promise<CreateNodeResponse>;

  /** ノードを更新 */
  updateNode: (nodeId: string, request: UpdateNodeRequest) => Promise<UpdateNodeResponse>;

  /** ノードを削除 */
  deleteNode: (nodeId: string) => Promise<DeleteNodeResponse>;

  /** ノードを並び替え */
  reorderNode: (nodeId: string, request: ReorderNodeRequest) => Promise<ReorderNodeResponse>;

  /** ノードを移動 */
  moveNode: (nodeId: string, request: MoveNodeRequest) => Promise<MoveNodeResponse>;

  /** ノードを選択 */
  selectNode: (nodeId: string | null) => void;

  /** 編集モード切り替え */
  toggleEditMode: (nodeId: string) => void;

  /** ノードの展開/折りたたみ */
  toggleNodeExpanded: (nodeId: string) => void;
}

/**
 * useWorldTree Hookの返り値
 */
export type UseWorldTreeReturn = WorldTreeState & WorldTreeActions;
```
