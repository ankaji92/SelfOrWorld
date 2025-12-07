"""WorldTree service."""
import uuid
from datetime import datetime
from fastapi import HTTPException
from neo4j import Session

from app.models.worldtree import (
    ValueNode,
    CreateNodeRequest,
    UpdateNodeRequest,
    ReorderNodeRequest,
    MoveNodeRequest,
    CreateNodeResponse,
    UpdateNodeResponse,
    DeleteNodeResponse,
    ReorderNodeResponse,
    MoveNodeResponse,
)


class WorldTreeService:
    """WorldTree business logic service."""

    def __init__(self, session: Session):
        """Initialize service with Neo4j session."""
        self.session = session

    def get_tree(self, user_id: str) -> ValueNode | None:
        """ツリー全体を取得."""
        # ルートノードを取得
        result = self.session.run("""
            MATCH (root:ValueNode {userId: $userId, isRoot: true})
            RETURN root
        """, userId=user_id)

        record = result.single()
        if not record:
            return None

        root_data = record["root"]
        root_node = self._build_tree(root_data["id"], user_id)
        return root_node

    def _build_tree(self, node_id: str, user_id: str) -> ValueNode:
        """ノードとその子孫を再帰的に構築."""
        # ノードと直接の子を取得
        result = self.session.run("""
            MATCH (node:ValueNode {id: $nodeId, userId: $userId})
            OPTIONAL MATCH (child:ValueNode)-[:CHILD_OF]->(node)
            RETURN node, collect(child) as children
            ORDER BY child.order
        """, nodeId=node_id, userId=user_id)

        record = result.single()
        if not record:
            raise HTTPException(status_code=404, detail="Node not found")

        node_data = record["node"]
        children_data = record["children"]

        # 子ノードを再帰的に構築
        children = []
        for child_data in children_data:
            if child_data:  # Noneチェック
                child_node = self._build_tree(child_data["id"], user_id)
                children.append(child_node)

        # 順序でソート
        children.sort(key=lambda x: x.order)

        return ValueNode(
            id=node_data["id"],
            content=node_data["content"],
            is_root=node_data["isRoot"],
            order=node_data["order"],
            created_at=node_data["createdAt"],
            updated_at=node_data["updatedAt"],
            children=children
        )

    def create_node(self, user_id: str, request: CreateNodeRequest) -> CreateNodeResponse:
        """ノードを作成."""
        node_id = str(uuid.uuid4())
        now = datetime.now()

        if request.parent_id is None:
            # ルートノード作成
            # 既存のルートノードがないか確認
            existing = self.session.run("""
                MATCH (root:ValueNode {userId: $userId, isRoot: true})
                RETURN root
            """, userId=user_id).single()

            if existing:
                raise HTTPException(
                    status_code=400,
                    detail="Root node already exists for this user"
                )

            result = self.session.run("""
                CREATE (n:ValueNode {
                    id: $id,
                    userId: $userId,
                    content: $content,
                    order: 0,
                    isRoot: true,
                    createdAt: datetime($now),
                    updatedAt: datetime($now)
                })
                RETURN n
            """, id=node_id, userId=user_id, content=request.content, now=now.isoformat())
        else:
            # 子ノード作成
            # 親ノードの存在確認
            parent_exists = self.session.run("""
                MATCH (parent:ValueNode {id: $parentId, userId: $userId})
                RETURN parent
            """, parentId=request.parent_id, userId=user_id).single()

            if not parent_exists:
                raise HTTPException(status_code=404, detail="Parent node not found")

            # 深さチェック
            depth = self._get_node_depth(request.parent_id, user_id)
            if depth >= 9:  # 親が深さ9なら、子は深さ10になるのでNG
                raise HTTPException(
                    status_code=400,
                    detail="Maximum depth (10) exceeded"
                )

            # 子ノード数チェック
            child_count = self._get_children_count(request.parent_id, user_id)
            if child_count >= 20:
                raise HTTPException(
                    status_code=400,
                    detail="Maximum children per node (20) exceeded"
                )

            result = self.session.run("""
                MATCH (parent:ValueNode {id: $parentId, userId: $userId})
                CREATE (child:ValueNode {
                    id: $id,
                    userId: $userId,
                    content: $content,
                    order: $order,
                    isRoot: false,
                    createdAt: datetime($now),
                    updatedAt: datetime($now)
                })
                CREATE (child)-[:CHILD_OF {createdAt: datetime($now)}]->(parent)
                RETURN child
            """, parentId=request.parent_id, id=node_id, userId=user_id,
                content=request.content, order=request.order, now=now.isoformat())

        node = result.single()["n" if request.parent_id is None else "child"]

        return CreateNodeResponse(
            id=node["id"],
            content=node["content"],
            is_root=node["isRoot"],
            order=node["order"],
            created_at=node["createdAt"],
            updated_at=node["updatedAt"]
        )

    def update_node(self, user_id: str, node_id: str, request: UpdateNodeRequest) -> UpdateNodeResponse:
        """ノードを更新."""
        now = datetime.now()

        result = self.session.run("""
            MATCH (n:ValueNode {id: $nodeId, userId: $userId})
            SET n.content = $content,
                n.updatedAt = datetime($now)
            RETURN n
        """, nodeId=node_id, userId=user_id, content=request.content, now=now.isoformat())

        node = result.single()
        if not node:
            raise HTTPException(status_code=404, detail="Node not found")

        n = node["n"]
        return UpdateNodeResponse(
            id=n["id"],
            content=n["content"],
            is_root=n["isRoot"],
            order=n["order"],
            created_at=n["createdAt"],
            updated_at=n["updatedAt"]
        )

    def delete_node(self, user_id: str, node_id: str) -> DeleteNodeResponse:
        """ノードとその子孫を削除."""
        # ルートノードの削除を防ぐ
        is_root = self.session.run("""
            MATCH (n:ValueNode {id: $nodeId, userId: $userId})
            RETURN n.isRoot as isRoot
        """, nodeId=node_id, userId=user_id).single()

        if not is_root:
            raise HTTPException(status_code=404, detail="Node not found")

        if is_root["isRoot"]:
            raise HTTPException(status_code=400, detail="Cannot delete root node")

        # ノードとその子孫を削除
        result = self.session.run("""
            MATCH (n:ValueNode {id: $nodeId, userId: $userId})
            OPTIONAL MATCH (n)<-[:CHILD_OF*]-(descendant:ValueNode)
            WITH n, collect(descendant) as descendants
            DETACH DELETE n
            FOREACH (d IN descendants | DETACH DELETE d)
            RETURN 1 + size(descendants) as deletedCount
        """, nodeId=node_id, userId=user_id)

        record = result.single()
        deleted_count = record["deletedCount"] if record else 0

        return DeleteNodeResponse(
            deleted=True,
            deleted_count=deleted_count
        )

    def reorder_node(self, user_id: str, node_id: str, request: ReorderNodeRequest) -> ReorderNodeResponse:
        """ノードを並び替え."""
        now = datetime.now()

        result = self.session.run("""
            MATCH (n:ValueNode {id: $nodeId, userId: $userId})
            SET n.order = $newOrder,
                n.updatedAt = datetime($now)
            RETURN n
        """, nodeId=node_id, userId=user_id, newOrder=request.new_order, now=now.isoformat())

        node = result.single()
        if not node:
            raise HTTPException(status_code=404, detail="Node not found")

        n = node["n"]
        return ReorderNodeResponse(
            id=n["id"],
            order=n["order"],
            updated_at=n["updatedAt"]
        )

    def move_node(self, user_id: str, node_id: str, request: MoveNodeRequest) -> MoveNodeResponse:
        """ノードを移動（親変更）."""
        # 循環参照チェック
        if self._would_create_cycle(node_id, request.new_parent_id, user_id):
            raise HTTPException(
                status_code=400,
                detail="Circular reference detected"
            )

        # 深さチェック
        new_parent_depth = self._get_node_depth(request.new_parent_id, user_id)
        node_height = self._get_subtree_height(node_id, user_id)

        if new_parent_depth + node_height >= 10:
            raise HTTPException(
                status_code=400,
                detail="Maximum depth (10) would be exceeded"
            )

        # 子ノード数チェック
        child_count = self._get_children_count(request.new_parent_id, user_id)
        if child_count >= 20:
            raise HTTPException(
                status_code=400,
                detail="Maximum children per node (20) exceeded"
            )

        now = datetime.now()

        # 既存の親子関係を削除し、新しい親子関係を作成
        result = self.session.run("""
            MATCH (child:ValueNode {id: $nodeId, userId: $userId})
            MATCH (newParent:ValueNode {id: $newParentId, userId: $userId})
            OPTIONAL MATCH (child)-[oldRel:CHILD_OF]->()
            DELETE oldRel
            CREATE (child)-[:CHILD_OF {createdAt: datetime($now)}]->(newParent)
            SET child.order = $newOrder,
                child.updatedAt = datetime($now)
            RETURN child
        """, nodeId=node_id, newParentId=request.new_parent_id,
            userId=user_id, newOrder=request.new_order, now=now.isoformat())

        node = result.single()
        if not node:
            raise HTTPException(status_code=404, detail="Node not found")

        n = node["child"]
        return MoveNodeResponse(
            id=n["id"],
            order=n["order"],
            updated_at=n["updatedAt"]
        )

    def _get_node_depth(self, node_id: str, user_id: str) -> int:
        """ノードの深さを取得（ルートから数えて）."""
        result = self.session.run("""
            MATCH path = (n:ValueNode {id: $nodeId, userId: $userId})-[:CHILD_OF*]->(root:ValueNode {isRoot: true})
            RETURN length(path) as depth
        """, nodeId=node_id, userId=user_id)

        record = result.single()
        return record["depth"] if record else 0

    def _get_subtree_height(self, node_id: str, user_id: str) -> int:
        """サブツリーの高さを取得."""
        result = self.session.run("""
            MATCH (n:ValueNode {id: $nodeId, userId: $userId})
            OPTIONAL MATCH path = (n)<-[:CHILD_OF*]-(descendant:ValueNode)
            RETURN coalesce(max(length(path)), 0) as height
        """, nodeId=node_id, userId=user_id)

        record = result.single()
        return record["height"] if record else 0

    def _get_children_count(self, node_id: str, user_id: str) -> int:
        """直接の子ノード数を取得."""
        result = self.session.run("""
            MATCH (parent:ValueNode {id: $nodeId, userId: $userId})
            OPTIONAL MATCH (child:ValueNode)-[:CHILD_OF]->(parent)
            RETURN count(child) as count
        """, nodeId=node_id, userId=user_id)

        record = result.single()
        return record["count"] if record else 0

    def _would_create_cycle(self, node_id: str, target_parent_id: str, user_id: str) -> bool:
        """移動が循環参照を引き起こすかチェック."""
        # target_parent が node の子孫であれば循環参照
        result = self.session.run("""
            MATCH (node:ValueNode {id: $nodeId, userId: $userId})
            MATCH (target:ValueNode {id: $targetId, userId: $userId})
            OPTIONAL MATCH path = (target)-[:CHILD_OF*]->(node)
            RETURN path IS NOT NULL as wouldCycle
        """, nodeId=node_id, targetId=target_parent_id, userId=user_id)

        record = result.single()
        return record["wouldCycle"] if record else False
