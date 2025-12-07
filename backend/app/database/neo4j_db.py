"""Neo4j database connection."""
from neo4j import GraphDatabase, Driver
from app.core.config import settings


class Neo4jDatabase:
    """Neo4j database connection manager."""

    def __init__(self):
        """Initialize database connection."""
        self._driver: Driver | None = None

    def connect(self):
        """Connect to Neo4j database."""
        self._driver = GraphDatabase.driver(
            settings.neo4j_uri,
            auth=(settings.neo4j_user, settings.neo4j_password)
        )

    def close(self):
        """Close database connection."""
        if self._driver:
            self._driver.close()

    def get_driver(self) -> Driver:
        """Get database driver."""
        if not self._driver:
            self.connect()
        return self._driver

    def verify_connectivity(self):
        """Verify database connectivity."""
        self._driver.verify_connectivity()

    def create_constraints(self):
        """Create database constraints and indexes."""
        with self._driver.session() as session:
            # ノードIDのユニーク制約
            session.run("""
                CREATE CONSTRAINT value_node_id IF NOT EXISTS
                FOR (n:ValueNode) REQUIRE n.id IS UNIQUE
            """)

            # ユーザーIDのインデックス
            session.run("""
                CREATE INDEX value_node_user_id IF NOT EXISTS
                FOR (n:ValueNode) ON (n.userId)
            """)

            # ルートノードの複合ユニーク制約
            session.run("""
                CREATE CONSTRAINT value_node_root IF NOT EXISTS
                FOR (n:ValueNode) REQUIRE (n.userId, n.isRoot) IS NODE KEY
            """)


# Global database instance
db = Neo4jDatabase()


def get_db() -> Neo4jDatabase:
    """Get database instance."""
    return db
