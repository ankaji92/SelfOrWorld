"""WorldTree Pydantic models."""
from datetime import datetime
from pydantic import BaseModel, Field


class ValueNode(BaseModel):
    """価値観ツリーのノード."""

    id: str = Field(..., description="ノードID (UUID)")
    content: str = Field(..., description="ノードの内容", min_length=1, max_length=500)
    is_root: bool = Field(..., description="ルートノードかどうか")
    order: int = Field(default=0, description="同一親配下での表示順序")
    created_at: datetime = Field(..., description="作成日時")
    updated_at: datetime = Field(..., description="更新日時")
    children: list["ValueNode"] = Field(default_factory=list, description="子ノードの配列")


class CreateNodeRequest(BaseModel):
    """ノード作成リクエスト."""

    content: str = Field(..., description="ノードの内容", min_length=1, max_length=500)
    parent_id: str | None = Field(None, description="親ノードのID (nullの場合はルートノード作成)")
    order: int = Field(default=0, description="表示順序")


class UpdateNodeRequest(BaseModel):
    """ノード更新リクエスト."""

    content: str = Field(..., description="更新後の内容", min_length=1, max_length=500)


class ReorderNodeRequest(BaseModel):
    """ノード並び替えリクエスト."""

    new_order: int = Field(..., description="新しい表示順序", ge=0)


class MoveNodeRequest(BaseModel):
    """ノード移動リクエスト."""

    new_parent_id: str = Field(..., description="新しい親ノードのID")
    new_order: int = Field(default=0, description="新しい表示順序", ge=0)


class GetTreeResponse(BaseModel):
    """ツリー全体取得レスポンス."""

    root: ValueNode


class CreateNodeResponse(BaseModel):
    """ノード作成レスポンス."""

    id: str
    content: str
    is_root: bool
    order: int
    created_at: datetime
    updated_at: datetime


class UpdateNodeResponse(BaseModel):
    """ノード更新レスポンス."""

    id: str
    content: str
    is_root: bool
    order: int
    created_at: datetime
    updated_at: datetime


class DeleteNodeResponse(BaseModel):
    """ノード削除レスポンス."""

    deleted: bool
    deleted_count: int


class ReorderNodeResponse(BaseModel):
    """ノード並び替えレスポンス."""

    id: str
    order: int
    updated_at: datetime


class MoveNodeResponse(BaseModel):
    """ノード移動レスポンス."""

    id: str
    order: int
    updated_at: datetime


class ErrorDetail(BaseModel):
    """エラー詳細."""

    code: str
    message: str
    details: dict | None = None


class ErrorResponse(BaseModel):
    """エラーレスポンス."""

    error: ErrorDetail
