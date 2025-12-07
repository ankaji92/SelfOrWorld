"""Application configuration."""
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Application settings."""

    # Neo4j Database
    neo4j_uri: str
    neo4j_user: str
    neo4j_password: str

    # Application
    app_name: str = "SelfOrWorld API"
    app_version: str = "1.0.0"
    debug: bool = False

    # CORS
    cors_origins: str = "http://localhost:5173"

    # Security
    secret_key: str
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30

    class Config:
        """Pydantic config."""
        env_file = ".env"
        case_sensitive = False

    @property
    def cors_origins_list(self) -> list[str]:
        """Get CORS origins as a list."""
        return [origin.strip() for origin in self.cors_origins.split(",")]


settings = Settings()
