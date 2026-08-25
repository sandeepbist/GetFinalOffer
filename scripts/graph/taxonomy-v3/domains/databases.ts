import { s, type SkillDef } from "../types";

export const DATABASES: SkillDef[] = [
  // Relational / SQL Databases (RDBMS)
  s("postgresql", "PostgreSQL", "database-rdbms", ["postgres", "pg", "psql", "postgresql database", "postgre sql", "postgres 15", "postgres 16", "postgres 17", "postgresql administration"], ["high-demand", "core"]),
  s("mysql", "MySQL", "database-rdbms", ["my sql", "mysql database", "mysql server", "mysql 8", "innodb", "mysql replication"], ["high-demand", "core"]),
  s("mariadb", "MariaDB", "database-rdbms", ["maria db", "mariadb database", "mariadb server", "mariadb columnar"]),
  s("sqlite", "SQLite", "database-rdbms", ["sqlite3", "sqlite database", "embedded sqlite", "sqlite wal"]),
  s("oracle-db", "Oracle Database", "database-rdbms", ["oracle", "oracle db", "oracle sql", "oracle database", "oracle 19c", "oracle 23c", "oracle rac", "pl/sql database"]),
  s("sql-server", "Microsoft SQL Server", "database-rdbms", ["mssql", "ms sql", "microsoft sql server", "ms sql server", "sql server 2022", "ssms", "t-sql database"], ["high-demand", "core"]),
  s("ibm-db2", "IBM Db2", "database-rdbms", ["db2", "ibm db2 database", "db2 luw"]),

  // Distributed SQL & NewSQL Databases
  s("cockroachdb", "CockroachDB", "database-newsql", ["cockroach db", "crdb", "distributed postgres", "cloud native sql", "cockroachcloud"], ["trending", "high-demand"]),
  s("yugabytedb", "YugabyteDB", "database-newsql", ["yugabyte", "yugabyte db", "distributed acid postgres"]),
  s("tidb", "TiDB", "database-newsql", ["ti db", "pingcap tidb", "htap database", "distributed mysql"]),
  s("vitess", "Vitess", "database-newsql", ["vitess mysql", "youtube vitess", "cloud native mysql sharding"]),
  s("google-spanner-db", "Google Cloud Spanner", "database-newsql", ["cloud spanner", "google spanner", "globally distributed sql"]),

  // Document & NoSQL Databases
  s("mongodb", "MongoDB", "database-nosql", ["mongo", "mongo db", "mongodb database", "mongodb atlas", "mongodb aggregation pipeline", "bson", "document database", "mongodb replica set", "mongodb sharding"], ["high-demand", "core"]),
  s("couchbase", "Couchbase", "database-nosql", ["couch base", "couchbase database", "couchbase n1ql", "couchbase capella"]),
  s("couchdb", "Apache CouchDB", "database-nosql", ["couch db", "couchdb mapreduce"]),
  s("raven-db", "RavenDB", "database-nosql", ["raven db", "ravendb .net document database"]),
  s("rethinkdb", "RethinkDB", "database-nosql", ["rethink db", "realtime document database"]),

  // Wide-Column & Distributed Key-Value
  s("cassandra", "Apache Cassandra", "database-nosql", ["cassandra", "cassandra database", "cql", "datastax cassandra", "cassandra peer-to-peer"], ["high-demand"]),
  s("scylladb", "ScyllaDB", "database-nosql", ["scylla", "scylla db", "c++ cassandra alternative"]),
  s("dynamodb", "Amazon DynamoDB", "database-nosql", ["dynamo db", "aws dynamodb", "amazon dynamodb", "dynamodb single table design", "dynamodb streams", "global tables dynamodb"], ["high-demand", "core"]),
  s("cosmos-db", "Azure Cosmos DB", "database-nosql", ["cosmosdb", "cosmos db", "azure cosmosdb", "multi-model cosmos db"]),
  s("hbase", "Apache HBase", "database-nosql", ["hbase", "hadoop hbase", "columnar hbase"]),

  // In-Memory & Key-Value Stores
  s("redis", "Redis", "database-cache", ["redis cache", "redis db", "redis database", "redis server", "redis cluster", "redis pub/sub", "redis json", "redis hashes", "valkey"], ["high-demand", "core"]),
  s("valkey", "Valkey", "database-cache", ["valkey db", "linux foundation valkey", "redis fork valkey"]),
  s("dragonflydb", "Dragonfly", "database-cache", ["dragonfly db", "modern redis replacement", "multi-threaded redis"]),
  s("memcached", "Memcached", "database-cache", ["memcache", "memcached key-value store", "distributed caching"]),
  s("hazelcast", "Hazelcast", "in-memory-data-grid", ["hazelcast imdg", "hazelcast in-memory computing"]),
  s("apache-ignite", "Apache Ignite", "in-memory-data-grid", ["ignite", "apache ignite in-memory"]),
  s("aerospike", "Aerospike", "database-nosql", ["aerospike db", "high performance key-value"]),

  // Search Engines & Information Retrieval
  s("elasticsearch", "Elasticsearch", "search-engine", ["elastic search", "elastic", "es", "elasticsearch 8", "inverted index", "elasticsearch cluster", "elasticsearch mapping"], ["high-demand", "core"]),
  s("opensearch", "OpenSearch", "search-engine", ["open search", "aws opensearch", "opensearch dashboards", "opensearch cluster"]),
  s("apache-solr", "Apache Solr", "search-engine", ["solr", "solr search", "lucene solr"]),
  s("apache-lucene", "Apache Lucene", "search-engine", ["lucene", "lucene search library"]),
  s("algolia", "Algolia", "search-engine", ["algolia search", "algolia api", "hosted search algolia"]),
  s("meilisearch", "Meilisearch", "search-engine", ["meili search", "meilisearch instant search", "rust search engine"]),
  s("typesense", "Typesense", "search-engine", ["type sense", "typesense search", "open source algolia alternative"]),

  // Graph Databases & Knowledge Graphs
  s("neo4j", "Neo4j", "database-graph", ["neo 4j", "neo4j graph", "neo4j database", "neo4j cypher", "neo4j auradb", "graph data science", "gds library"], ["high-demand", "core"]),
  s("arangodb", "ArangoDB", "database-graph", ["arango db", "multi-model arangodb", "aql query language"]),
  s("amazon-neptune", "Amazon Neptune", "database-graph", ["neptune graph", "aws neptune", "rdf graph aws"]),
  s("tigergraph", "TigerGraph", "database-graph", ["tiger graph", "gsql tigergraph"]),
  s("janusgraph", "JanusGraph", "database-graph", ["janus graph", "distributed graph database"]),
  s("dgraph", "Dgraph", "database-graph", ["dgraph graphql", "dgraph distributed graph"]),

  // Vector Databases & Vector Search
  s("pgvector", "pgvector (PostgreSQL Vector)", "database-vector", ["pg vector", "pgvector extension", "postgres vector search", "hnsw pgvector", "ivfflat"], ["trending", "high-demand"]),
  s("pinecone", "Pinecone", "database-vector", ["pinecone vector", "pinecone db", "pinecone serverless vector database"], ["trending", "high-demand"]),
  s("weaviate", "Weaviate", "database-vector", ["weaviate vector", "weaviate db", "weaviate hybrid search"], ["trending"]),
  s("milvus", "Milvus", "database-vector", ["milvus vector", "milvus db", "zilliz milvus", "distributed vector search"]),
  s("qdrant", "Qdrant", "database-vector", ["qdrant vector", "qdrant db", "rust vector database"], ["trending"]),
  s("chromadb", "ChromaDB", "database-vector", ["chroma", "chroma db", "chroma vector database", "embedded vector database"], ["trending", "high-demand"]),
  s("faiss", "FAISS", "database-vector", ["facebook faiss", "faiss similarity search", "faiss gpu", "meta faiss"]),
  s("vespa", "Vespa.ai", "database-vector", ["vespa search", "vespa vector engine"]),

  // Time-Series Databases
  s("influxdb", "InfluxDB", "database-timeseries", ["influx db", "influxdb timeseries", "flux query language", "influxdb 3.0", "influxdb ioxt"]),
  s("timescaledb", "TimescaleDB", "database-timeseries", ["timescale", "timescale db", "postgresql timeseries", "hypertables timescaledb"]),
  s("questdb", "QuestDB", "database-timeseries", ["quest db", "fast sql timeseries"]),
  s("victoriametrics", "VictoriaMetrics", "database-timeseries", ["victoria metrics", "prometheus timeseries replacement"]),
  s("graphite", "Graphite", "database-timeseries", ["graphite time series", "carbon whisper"]),

  // Analytics, Columnar & OLAP Databases
  s("clickhouse", "ClickHouse", "database-olap", ["click house", "clickhouse analytics", "real-time olap clickhouse", "clickhouse sql"], ["trending", "high-demand"]),
  s("apache-druid", "Apache Druid", "database-olap", ["druid", "druid analytics", "real-time analytics druid"]),
  s("apache-pinot", "Apache Pinot", "database-olap", ["pinot", "pinot analytics", "real-time olap pinot"]),
  s("duckdb", "DuckDB", "database-olap", ["duck db", "duckdb in-process sql", "embedded olap", "duckdb analytical sql"], ["trending", "high-demand"]),

  // Modern Cloud Native & Serverless Database Platforms
  s("supabase-db", "Supabase (PostgreSQL Platform)", "database-platform", ["supabase", "supa base", "supabase postgres", "supabase backend as a service", "supabase rls"], ["trending", "high-demand"]),
  s("planetscale", "PlanetScale (Serverless MySQL)", "database-platform", ["planet scale", "planetscale mysql", "vitess planetscale", "database branching"]),
  s("neon-db", "Neon (Serverless Postgres)", "database-platform", ["neon database", "neon postgres", "neon serverless", "neon branching"], ["trending"]),
  s("faunadb", "Fauna", "database-platform", ["fauna db", "faunadb serverless", "fql query language"]),
  s("surrealdb", "SurrealDB", "database-platform", ["surreal db", "multi-model surrealdb", "surrealql"]),
  s("firebase-firestore", "Cloud Firestore", "database-platform", ["firestore", "firebase firestore", "nosql firestore"]),

  // ORMs, ODMs & Query Builders
  s("prisma", "Prisma ORM", "database-orm", ["prisma", "prisma orm", "prisma client", "prisma schema", "prisma migrations", "prisma accelerate"], ["high-demand", "core"]),
  s("drizzle-orm", "Drizzle ORM", "database-orm", ["drizzle", "drizzle database", "drizzle typescript orm", "drizzle kit"], ["trending", "high-demand"]),
  s("sqlalchemy", "SQLAlchemy", "database-orm", ["sql alchemy", "sqlalchemy python", "sqlalchemy 2.0", "sqlalchemy core", "sqlalchemy orm"], ["high-demand", "core"]),
  s("typeorm", "TypeORM", "database-orm", ["type orm", "typeorm typescript", "typeorm entity", "typeorm migrations"]),
  s("hibernate", "Hibernate ORM / JPA", "database-orm", ["hibernate", "hibernate java", "jpa", "jakarta persistence", "hibernate entities", "hql"]),
  s("entity-framework", "Entity Framework Core (EF Core)", "database-orm", ["entity framework", "ef core", "efcore", "entity framework .net", "linq to entities"], ["high-demand"]),
  s("activerecord", "Active Record (Rails)", "database-orm", ["active record orm", "rails active record", "activerecord migrations"]),
  s("eloquent-orm", "Eloquent ORM (Laravel)", "database-orm", ["eloquent", "laravel eloquent", "eloquent relationships"]),
  s("gorm", "GORM (Go ORM)", "database-orm", ["gorm golang", "gorm orm"]),
  s("sqlx", "sqlx", "database-query-builder", ["sqlx rust", "sqlx go", "async raw sql queries"]),
  s("diesel-orm", "Diesel (Rust ORM)", "database-orm", ["diesel rust", "diesel safe extensible orm"]),
  s("sea-orm", "SeaORM (Rust)", "database-orm", ["sea orm", "async dynamic orm rust"]),
  s("peewee", "Peewee ORM", "database-orm", ["peewee python", "peewee lightweight orm"]),
  s("tortoise-orm", "Tortoise ORM", "database-orm", ["tortoise async python orm"]),
  s("knex", "Knex.js", "database-query-builder", ["knex", "knexjs", "knex query builder", "knex migrations"]),
  s("kysely", "Kysely", "database-query-builder", ["kysely typescript", "typesafe sql query builder"]),
  s("sequelize", "Sequelize", "database-orm", ["sequelize orm", "sequelize js", "sequelize node"]),
  s("mongoose", "Mongoose (MongoDB ODM)", "database-odm", ["mongoose", "mongoose odm", "mongoose schemas", "mongoose models"], ["high-demand"]),

  // Core Concepts, Architecture & Tuning
  s("database-design", "Database Design & Normalization", "database-concept", ["db design", "database modeling", "data modeling", "er diagram", "schema design", "1nf 2nf 3nf normalization", "denormalization"], ["core"]),
  s("query-optimization", "SQL Query Optimization & Tuning", "database-concept", ["sql optimization", "query tuning", "query performance", "explain plan", "explain analyze", "slow query analysis", "query execution plan"], ["high-demand", "core"]),
  s("database-indexing", "Database Indexing Strategies", "database-concept", ["db indexing", "b-tree index", "hash index", "gin index", "gist index", "composite index", "covering index", "partial index"], ["high-demand", "core"]),
  s("acid-transactions", "ACID Transactions & Concurrency", "database-concept", ["acid properties", "transaction isolation levels", "read committed", "repeatable read", "serializable", "two phase commit", "distributed transactions"], ["core"]),
  s("database-replication", "Database Replication & High Availability", "database-concept", ["db replication", "master-slave replication", "primary-replica", "streaming replication", "logical replication", "wal archiving"]),
  s("database-migrations", "Database Schema Migrations", "database-concept", ["schema migrations", "flyway", "liquibase", "zero downtime migrations", "blue green database migrations"]),
  s("vacuum-maintenance", "Database Vacuuming & Maintenance", "database-concept", ["autovacuum postgres", "vacuum analyze", "table bloat", "database statistics"]),
];
