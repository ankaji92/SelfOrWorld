# WorldTree API 仕様

## 概要

WorldTreeは、ユーザーの価値観を樹形図として管理する機能です。
単一のルートノード(理想状態)から始まり、それを具体化・鮮明化するための子ノードを階層的に持ちます。

## データモデル (Neo4j)

### ノードラベル

#### `ValueNode`
価値観ツリーのノードを表します。

**プロパティ:**
```json
{
  "id": "string (UUID)",
  "userId": "string (ユーザーID)",
  "content": "string (ノードの内容)",
  "order": "integer (同一親配下での表示順序)",
  "createdAt": "datetime (作成日時)",
  "updatedAt": "datetime (更新日時)",
  "isRoot": "boolean (ルートノードかどうか)"
}
```

### リレーションシップ

#### `CHILD_OF`
親子関係を表します。

**方向:** 子ノード -> 親ノード

**プロパティ:**
```json
{
  "createdAt": "datetime (関係作成日時)"
}
```

### グラフ構造の例

```
(root:ValueNode {isRoot: true, content: "私は調和のとれた状態にある"})
  ^
  |
  +-- CHILD_OF -- (child1:ValueNode {content: "困難に直面しても冷静に対処できている"})
  |                 ^
  |                 |
  |                 +-- CHILD_OF -- (grandchild1:ValueNode {content: "失敗を恐れず、学びとして受け入れる"})
  |                 +-- CHILD_OF -- (grandchild2:ValueNode {content: "感情に振り回されず、客観的に状況を見る"})
  |
  +-- CHILD_OF -- (child2:ValueNode {content: "他者に思いやりを持って接している"})
                    ^
                    |
                    +-- CHILD_OF -- (grandchild3:ValueNode {content: "家族の話に耳を傾ける"})
```

## API エンドポイント

### 1. ツリー全体の取得

**エンドポイント:** `GET /api/worldtree`

**レスポンス:**
```json
{
  "root": {
    "id": "uuid-1",
    "content": "私は調和のとれた状態にある",
    "isRoot": true,
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z",
    "children": [
      {
        "id": "uuid-2",
        "content": "困難に直面しても冷静に対処できている",
        "isRoot": false,
        "order": 0,
        "createdAt": "2024-01-01T00:00:00Z",
        "updatedAt": "2024-01-01T00:00:00Z",
        "children": [
          {
            "id": "uuid-3",
            "content": "失敗を恐れず、学びとして受け入れる",
            "isRoot": false,
            "order": 0,
            "createdAt": "2024-01-01T00:00:00Z",
            "updatedAt": "2024-01-01T00:00:00Z",
            "children": []
          }
        ]
      }
    ]
  }
}
```

**Neo4j Cypher クエリ例:**
```cypher
MATCH (root:ValueNode {userId: $userId, isRoot: true})
OPTIONAL MATCH path = (root)<-[:CHILD_OF*]-(descendant:ValueNode)
RETURN root, collect(distinct descendant) as descendants,
       collect(distinct relationships(path)) as relationships
```

### 2. ノードの作成

**エンドポイント:** `POST /api/worldtree/nodes`

**リクエストボディ:**
```json
{
  "content": "新しい価値観の内容",
  "parentId": "uuid-1", // nullの場合はルートノード作成
  "order": 0
}
```

**レスポンス:**
```json
{
  "id": "uuid-new",
  "content": "新しい価値観の内容",
  "isRoot": false,
  "order": 0,
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z"
}
```

**Neo4j Cypher クエリ例:**
```cypher
// ルートノード作成の場合
CREATE (n:ValueNode {
  id: $id,
  userId: $userId,
  content: $content,
  order: 0,
  isRoot: true,
  createdAt: datetime(),
  updatedAt: datetime()
})
RETURN n

// 子ノード作成の場合
MATCH (parent:ValueNode {id: $parentId, userId: $userId})
CREATE (child:ValueNode {
  id: $id,
  userId: $userId,
  content: $content,
  order: $order,
  isRoot: false,
  createdAt: datetime(),
  updatedAt: datetime()
})
CREATE (child)-[:CHILD_OF {createdAt: datetime()}]->(parent)
RETURN child
```

### 3. ノードの更新

**エンドポイント:** `PUT /api/worldtree/nodes/:nodeId`

**リクエストボディ:**
```json
{
  "content": "更新された内容"
}
```

**レスポンス:**
```json
{
  "id": "uuid-1",
  "content": "更新された内容",
  "isRoot": false,
  "order": 0,
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-02T00:00:00Z"
}
```

**Neo4j Cypher クエリ例:**
```cypher
MATCH (n:ValueNode {id: $nodeId, userId: $userId})
SET n.content = $content,
    n.updatedAt = datetime()
RETURN n
```

### 4. ノードの削除

**エンドポイント:** `DELETE /api/worldtree/nodes/:nodeId`

**レスポンス:**
```json
{
  "deleted": true,
  "deletedCount": 5  // 削除されたノード数（子孫ノードを含む）
}
```

**Neo4j Cypher クエリ例:**
```cypher
// ノードとその子孫を全て削除
MATCH (n:ValueNode {id: $nodeId, userId: $userId})
OPTIONAL MATCH (n)<-[:CHILD_OF*]-(descendant:ValueNode)
WITH n, collect(descendant) as descendants
DETACH DELETE n, descendants
RETURN count(n) + size(descendants) as deletedCount
```

### 5. ノードの並び替え

**エンドポイント:** `PUT /api/worldtree/nodes/:nodeId/reorder`

**リクエストボディ:**
```json
{
  "newOrder": 2
}
```

**レスポンス:**
```json
{
  "id": "uuid-1",
  "order": 2,
  "updatedAt": "2024-01-02T00:00:00Z"
}
```

**Neo4j Cypher クエリ例:**
```cypher
MATCH (n:ValueNode {id: $nodeId, userId: $userId})
SET n.order = $newOrder,
    n.updatedAt = datetime()
RETURN n
```

### 6. ノードの移動（親変更）

**エンドポイント:** `PUT /api/worldtree/nodes/:nodeId/move`

**リクエストボディ:**
```json
{
  "newParentId": "uuid-2",
  "newOrder": 0
}
```

**レスポンス:**
```json
{
  "id": "uuid-3",
  "order": 0,
  "updatedAt": "2024-01-02T00:00:00Z"
}
```

**Neo4j Cypher クエリ例:**
```cypher
// 既存の親子関係を削除
MATCH (child:ValueNode {id: $nodeId, userId: $userId})-[r:CHILD_OF]->()
DELETE r

// 新しい親子関係を作成
WITH child
MATCH (newParent:ValueNode {id: $newParentId, userId: $userId})
CREATE (child)-[:CHILD_OF {createdAt: datetime()}]->(newParent)
SET child.order = $newOrder,
    child.updatedAt = datetime()
RETURN child
```

## データ制約

### Neo4j制約定義

```cypher
// ノードIDのユニーク制約
CREATE CONSTRAINT value_node_id IF NOT EXISTS
FOR (n:ValueNode) REQUIRE n.id IS UNIQUE;

// ユーザーIDのインデックス
CREATE INDEX value_node_user_id IF NOT EXISTS
FOR (n:ValueNode) ON (n.userId);

// ルートノードの制約（1ユーザー1ルート）
CREATE CONSTRAINT value_node_root IF NOT EXISTS
FOR (n:ValueNode) REQUIRE (n.userId, n.isRoot) IS UNIQUE;
```

### ビジネスルール

1. **1ユーザー1ルート**: 各ユーザーはルートノード(`isRoot: true`)を1つのみ持つ
2. **ルートノード不変**: ルートノードの`isRoot`プロパティは変更不可
3. **親子関係の循環禁止**: ノードの移動時に循環参照が発生しないことを検証
4. **深さ制限**: ツリーの深さは最大10階層まで（推奨）
5. **子ノード数制限**: 1ノードあたりの直接の子ノードは最大20個まで（推奨）

## エラーレスポンス

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "循環参照が発生するため、この操作は実行できません",
    "details": {
      "nodeId": "uuid-1",
      "targetParentId": "uuid-3"
    }
  }
}
```

**エラーコード一覧:**
- `VALIDATION_ERROR`: バリデーションエラー
- `NOT_FOUND`: ノードが見つからない
- `UNAUTHORIZED`: 認証エラー
- `FORBIDDEN`: 権限エラー（他ユーザーのノードへのアクセス）
- `DUPLICATE_ROOT`: ルートノードが既に存在
- `CIRCULAR_REFERENCE`: 循環参照エラー
- `MAX_DEPTH_EXCEEDED`: 最大深度超過
- `MAX_CHILDREN_EXCEEDED`: 子ノード数超過
