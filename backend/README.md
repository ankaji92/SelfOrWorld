# SelfOrWorld Backend API

FastAPIとNeo4jを使用したバックエンドAPI

## 必要な環境

- Python 3.11以上
- Neo4j 5.0以上

## セットアップ

### 1. Neo4jのインストールと起動

#### Dockerを使用する場合（推奨）

```bash
docker run \
    --name neo4j-selforworld \
    -p 7474:7474 -p 7687:7687 \
    -e NEO4J_AUTH=neo4j/password \
    -v $HOME/neo4j/data:/data \
    neo4j:5.27.0
```

ブラウザで http://localhost:7474 にアクセスしてNeo4j Browserを開けます。

### 2. 仮想環境の作成と依存関係のインストール

```bash
cd backend

# 仮想環境を作成
python -m venv venv

# 仮想環境をアクティベート
# macOS/Linux:
source venv/bin/activate
# Windows:
# venv\Scripts\activate

# 依存関係をインストール
pip install -r requirements.txt
```

### 3. 環境変数の設定

```bash
# .env.exampleをコピー
cp .env.example .env

# .envを編集してNeo4jの接続情報を設定
# NEO4J_URI=bolt://localhost:7687
# NEO4J_USER=neo4j
# NEO4J_PASSWORD=password
```

### 4. サーバーの起動

```bash
# 開発サーバーを起動
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

サーバーが起動したら:
- API: http://localhost:8000
- APIドキュメント (Swagger UI): http://localhost:8000/docs
- APIドキュメント (ReDoc): http://localhost:8000/redoc

## APIエンドポイント

### WorldTree

- `GET /api/worldtree` - ツリー全体を取得
- `POST /api/worldtree/nodes` - ノードを作成
- `PUT /api/worldtree/nodes/{node_id}` - ノードを更新
- `DELETE /api/worldtree/nodes/{node_id}` - ノードを削除
- `PUT /api/worldtree/nodes/{node_id}/reorder` - ノードを並び替え
- `PUT /api/worldtree/nodes/{node_id}/move` - ノードを移動

詳細は `/docs` のSwagger UIを参照してください。

## ディレクトリ構成

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py              # FastAPIアプリケーションのエントリーポイント
│   ├── api/                 # APIルーター
│   │   ├── __init__.py
│   │   └── worldtree.py     # WorldTree APIエンドポイント
│   ├── core/                # コア設定
│   │   ├── __init__.py
│   │   └── config.py        # アプリケーション設定
│   ├── database/            # データベース接続
│   │   ├── __init__.py
│   │   └── neo4j_db.py      # Neo4j接続管理
│   ├── models/              # Pydanticモデル
│   │   ├── __init__.py
│   │   └── worldtree.py     # WorldTreeモデル
│   └── services/            # ビジネスロジック
│       ├── __init__.py
│       └── worldtree_service.py  # WorldTreeサービス
├── .env.example             # 環境変数のサンプル
├── requirements.txt         # Python依存関係
└── README.md               # このファイル
```

## 開発

### テストデータの作成

Neo4j Browserで以下のCypherクエリを実行してテストデータを作成できます:

```cypher
// ルートノードを作成
CREATE (root:ValueNode {
  id: 'root-1',
  userId: 'user-1',
  content: '私は調和のとれた状態にある',
  order: 0,
  isRoot: true,
  createdAt: datetime(),
  updatedAt: datetime()
})

// 子ノードを作成
CREATE (child1:ValueNode {
  id: 'child-1',
  userId: 'user-1',
  content: '困難に直面しても冷静に対処できている',
  order: 0,
  isRoot: false,
  createdAt: datetime(),
  updatedAt: datetime()
})

// 親子関係を作成
CREATE (child1)-[:CHILD_OF {createdAt: datetime()}]->(root)
```

### データベースのクリア

```cypher
// 全てのノードと関係を削除
MATCH (n) DETACH DELETE n
```

## トラブルシューティング

### Neo4jに接続できない

1. Neo4jが起動しているか確認
2. `.env`ファイルの接続情報が正しいか確認
3. ファイアウォールでポート7687がブロックされていないか確認

### 制約エラー

制約を再作成する場合:

```cypher
// 既存の制約を削除
DROP CONSTRAINT value_node_id IF EXISTS;
DROP CONSTRAINT value_node_root IF EXISTS;
DROP INDEX value_node_user_id IF EXISTS;

// サーバーを再起動すると制約が自動的に再作成されます
```

## 本番環境へのデプロイ

1. `.env`ファイルの`SECRET_KEY`を変更
2. `DEBUG=False`に設定
3. `CORS_ORIGINS`を本番環境のフロントエンドURLに設定
4. GUnicornなどのプロダクションサーバーを使用:

```bash
pip install gunicorn
gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```
