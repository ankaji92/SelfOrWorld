"""WorldTree API router."""
from fastapi import APIRouter, Depends, HTTPException
from neo4j import Session

from app.database.neo4j_db import get_db, Neo4jDatabase
from app.models.worldtree import (
    GetTreeResponse,
    CreateNodeRequest,
    CreateNodeResponse,
    UpdateNodeRequest,
    UpdateNodeResponse,
    DeleteNodeResponse,
    ReorderNodeRequest,
    ReorderNodeResponse,
    MoveNodeRequest,
    MoveNodeResponse,
)
from app.services.worldtree_service import WorldTreeService

router = APIRouter(prefix="/api/worldtree", tags=["worldtree"])


def get_neo4j_session(db: Neo4jDatabase = Depends(get_db)) -> Session:
    """Get Neo4j session."""
    return db.get_driver().session()


def get_current_user_id() -> str:
    """Get current user ID (mock implementation)."""
    # TODO: Implement actual authentication
    return "user-1"


@router.get("", response_model=GetTreeResponse)
def get_tree(
    session: Session = Depends(get_neo4j_session),
    user_id: str = Depends(get_current_user_id)
):
    """ツリー全体を取得."""
    try:
        service = WorldTreeService(session)
        root = service.get_tree(user_id)

        if not root:
            raise HTTPException(status_code=404, detail="Tree not found")

        return GetTreeResponse(root=root)
    finally:
        session.close()


@router.post("/nodes", response_model=CreateNodeResponse, status_code=201)
def create_node(
    request: CreateNodeRequest,
    session: Session = Depends(get_neo4j_session),
    user_id: str = Depends(get_current_user_id)
):
    """ノードを作成."""
    try:
        service = WorldTreeService(session)
        return service.create_node(user_id, request)
    finally:
        session.close()


@router.put("/nodes/{node_id}", response_model=UpdateNodeResponse)
def update_node(
    node_id: str,
    request: UpdateNodeRequest,
    session: Session = Depends(get_neo4j_session),
    user_id: str = Depends(get_current_user_id)
):
    """ノードを更新."""
    try:
        service = WorldTreeService(session)
        return service.update_node(user_id, node_id, request)
    finally:
        session.close()


@router.delete("/nodes/{node_id}", response_model=DeleteNodeResponse)
def delete_node(
    node_id: str,
    session: Session = Depends(get_neo4j_session),
    user_id: str = Depends(get_current_user_id)
):
    """ノードを削除."""
    try:
        service = WorldTreeService(session)
        return service.delete_node(user_id, node_id)
    finally:
        session.close()


@router.put("/nodes/{node_id}/reorder", response_model=ReorderNodeResponse)
def reorder_node(
    node_id: str,
    request: ReorderNodeRequest,
    session: Session = Depends(get_neo4j_session),
    user_id: str = Depends(get_current_user_id)
):
    """ノードを並び替え."""
    try:
        service = WorldTreeService(session)
        return service.reorder_node(user_id, node_id, request)
    finally:
        session.close()


@router.put("/nodes/{node_id}/move", response_model=MoveNodeResponse)
def move_node(
    node_id: str,
    request: MoveNodeRequest,
    session: Session = Depends(get_neo4j_session),
    user_id: str = Depends(get_current_user_id)
):
    """ノードを移動（親変更）."""
    try:
        service = WorldTreeService(session)
        return service.move_node(user_id, node_id, request)
    finally:
        session.close()
