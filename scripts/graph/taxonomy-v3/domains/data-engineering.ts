import { s, type SkillDef } from "../types";

export const DATA_ENGINEERING: SkillDef[] = [
  // ── Big Data Distributed Processing ──
  s("apache-spark", "Apache Spark", "data-processing", ["spark", "spark big data", "pyspark", "spark sql", "spark dataframe", "spark streaming", "spark structured streaming", "spark rdd", "spark optimization"], ["high-demand", "core"]),
  s("pyspark", "PySpark", "data-processing", ["pyspark dataframes", "pyspark rdd", "python spark", "pyspark ml"]),
  s("apache-flink", "Apache Flink", "stream-processing", ["flink", "flink streaming", "stateful stream processing flink", "flink sql", "flink cep"], ["high-demand"]),
  s("apache-beam", "Apache Beam", "data-processing", ["beam", "beam pipeline", "unified batch and stream processing"]),
  s("apache-hadoop", "Apache Hadoop", "big-data-platform", ["hadoop", "hdfs", "mapreduce", "yarn", "hadoop cluster"]),
  s("mapreduce", "MapReduce", "data-processing", ["hadoop mapreduce", "map reduce paradigm"]),
  s("apache-storm", "Apache Storm", "stream-processing", ["storm", "real-time stream processing storm"]),
  s("ray-data", "Ray (Distributed Computing)", "data-processing", ["ray.io", "ray core", "ray data", "distributed python ray"]),

  // ── Data Transformation & Modern Data Stack (MDS) ──
  s("dbt", "dbt (data build tool)", "data-transformation", ["data build tool", "dbt transform", "dbt core", "dbt cloud", "dbt models", "dbt jinja", "dbt semantic layer", "dbt tests"], ["trending", "high-demand", "core"]),
  s("sqlmesh", "SQLMesh", "data-transformation", ["sqlmesh transform", "dataops sqlmesh"]),
  s("fivetran", "Fivetran", "data-ingestion", ["fivetran etl", "fivetran automated data integration", "fivetran connectors"], ["high-demand"]),
  s("airbyte", "Airbyte", "data-ingestion", ["airbyte etl", "airbyte connector", "open source data integration", "airbyte cdk"], ["trending"]),
  s("stitch-data", "Stitch Data (Talend)", "data-ingestion", ["stitch etl", "stitch data pipeline"]),
  s("talend", "Talend Data Fabric", "data-ingestion", ["talend etl", "talend data integration", "talend studio", "qlik talend"]),
  s("informatica-powercenter", "Informatica PowerCenter / IDMC", "data-ingestion", ["informatica", "informatica etl", "informatica cloud idmc"]),
  s("apache-nifi", "Apache NiFi", "data-integration", ["nifi", "nifi dataflow", "apache nifi processor"]),
  s("singer-io", "Singer.io", "data-ingestion", ["singer taps", "singer targets", "open source etl singer"]),
  s("meltano", "Meltano", "data-ingestion", ["meltano elto", "singer meltano"]),

  // ── Table Formats & Storage Formats ──
  s("delta-lake", "Delta Lake", "table-format", ["delta lake databricks", "delta tables", "acid delta lake", "delta lake time travel"], ["high-demand", "core"]),
  s("apache-iceberg", "Apache Iceberg", "table-format", ["iceberg", "iceberg table format", "iceberg metadata", "open table format iceberg"], ["trending", "high-demand"]),
  s("apache-hudi", "Apache Hudi", "table-format", ["hudi", "apache hudi streamable data lake", "cow mor tables hudi"]),
  s("parquet", "Apache Parquet", "data-format", ["parquet", "parquet columnar format", "snappy parquet", "parquet files"]),
  s("avro", "Apache Avro", "data-format", ["avro", "avro schema", "avro binary format"]),
  s("orc", "Apache ORC", "data-format", ["orc format", "optimized row columnar"]),
  s("arrow", "Apache Arrow", "in-memory-format", ["arrow", "apache arrow in-memory columnar", "pyarrow", "arrow flight"]),

  // ── Python Data Engineering Libraries ──
  s("pandas", "Pandas", "data-library", ["pandas python", "pandas dataframe", "python pandas", "pandas series", "pd.dataframe"], ["high-demand", "core"]),
  s("polars", "Polars", "data-library", ["polars python", "polars dataframe", "rust-powered polars", "lazy evaluation polars"], ["trending", "high-demand"]),
  s("dask", "Dask", "data-library", ["dask python", "dask parallel computing", "dask dataframe", "dask distributed"]),
  s("modin", "Modin", "data-library", ["modin pandas", "speed up pandas modin"]),
  s("vaex", "Vaex", "data-library", ["vaex dataframe", "out of core dataframes"]),

  // ── Cloud Data Warehouses & Lakehouses ──
  s("snowflake", "Snowflake Data Cloud", "data-warehouse", ["snowflake data", "snowflake warehouse", "snowflake cloud", "snowpark", "snowpipe", "snowflake sql", "cortex snowflake"], ["high-demand", "core"]),
  s("bigquery", "Google BigQuery", "data-warehouse", ["big query", "google bigquery", "gcp bigquery", "bigquery sql", "bigquery slots", "bigquery partitions", "bigquery clustering"], ["high-demand", "core"]),
  s("amazon-redshift", "Amazon Redshift", "data-warehouse", ["redshift", "aws redshift", "redshift spectrum", "redshift serverless", "distkey sortkey"]),
  s("databricks-lakehouse", "Databricks Lakehouse Platform", "data-platform", ["databricks", "databricks workspace", "unity catalog", "databricks sql", "databricks workflows", "dbx"], ["high-demand", "core"]),
  s("apache-hive", "Apache Hive / Hive Metastore", "data-warehouse", ["hive", "hive sql", "hiveql", "hms", "hive metastore"]),
  s("trino", "Trino (formerly PrestoSQL)", "distributed-sql", ["trino", "trino sql query engine", "prestosql", "distributed sql trino"], ["high-demand"]),
  s("presto", "Presto", "distributed-sql", ["presto sql", "presto db", "facebook presto"]),
  s("dremio", "Dremio", "data-lake-engine", ["dremio data lake engine", "apache arrow dremio"]),

  // ── Data Quality, Governance, Catalogs & Lineage ──
  s("great-expectations", "Great Expectations", "data-quality", ["great expectations data", "gx", "data quality validation", "data assertions gx"]),
  s("soda-sql", "Soda Core / Soda Cloud", "data-quality", ["soda sql", "soda core data quality"]),
  s("datahub", "LinkedIn DataHub", "data-catalog", ["data hub", "linkedin datahub", "metadata platform datahub"]),
  s("amundsen", "Amundsen (Lyft)", "data-catalog", ["amundsen data catalog", "lyft amundsen"]),
  s("apache-atlas", "Apache Atlas", "data-governance", ["atlas", "apache atlas governance", "data lineage atlas"]),
  s("alation", "Alation Data Catalog", "data-catalog", ["alation catalog", "alation governance"]),
  s("collibra", "Collibra", "data-governance", ["collibra data intelligence", "collibra governance"]),
  s("openmetadata", "OpenMetadata", "data-catalog", ["open metadata", "openmetadata platform"]),
  s("montecarlodata", "Monte Carlo Data Observability", "data-observability", ["monte carlo data", "data downtime observability"]),

  // ── Business Intelligence (BI) & Analytics ──
  s("tableau", "Tableau", "bi-analytics", ["tableau software", "tableau visualization", "tableau dashboard", "tableau desktop", "tableau server", "tableau prep", "calculated fields tableau"], ["high-demand", "core"]),
  s("power-bi", "Microsoft Power BI", "bi-analytics", ["powerbi", "power bi analytics", "power bi desktop", "power bi service", "power bi dashboards", "dax formulas", "power query"], ["high-demand", "core"]),
  s("looker", "Looker (Google Cloud)", "bi-analytics", ["google looker", "looker bi", "lookml", "looker dashboards", "looker explores"], ["high-demand"]),
  s("metabase", "Metabase", "bi-analytics", ["metabase bi", "metabase dashboard", "metabase queries"]),
  s("apache-superset", "Apache Superset", "bi-analytics", ["superset", "superset bi", "apache superset dashboards"]),
  s("thoughtspot", "ThoughtSpot", "bi-analytics", ["thoughtspot search bi"]),
  s("qlik-sense", "Qlik Sense / QlikView", "bi-analytics", ["qlik", "qlik sense", "qlikview"]),
  s("sisense", "Sisense", "bi-analytics", ["sisense analytics", "sisense dashboards"]),
  s("microstrategy", "MicroStrategy", "bi-analytics", ["microstrategy bi", "microstrategy enterprise"]),

  // ── Data Architecture Concepts & Methodologies ──
  s("etl-pipeline", "ETL Pipeline Engineering", "data-concept", ["extract transform load", "etl", "etl process", "etl architecture", "batch etl"], ["high-demand", "core"]),
  s("elt-pipeline", "ELT Pipeline Architecture", "data-concept", ["extract load transform", "elt", "modern elt", "cloud elt", "in-warehouse transformation"]),
  s("data-warehouse-concept", "Data Warehousing (DWH)", "data-concept", ["dwh", "enterprise data warehouse", "edw", "star schema", "snowflake schema", "dimensional modeling", "kimball methodology", "inmon methodology", "fact and dimension tables", "slowly changing dimensions scd"], ["high-demand", "core"]),
  s("data-lake-concept", "Data Lake Architecture", "data-concept", ["data lakes", "raw staging curated zones", "medallion architecture", "bronze silver gold architecture"]),
  s("data-lakehouse-concept", "Data Lakehouse Architecture", "data-concept", ["lakehouse", "lakehouse architecture", "unified analytics platform"]),
  s("data-mesh", "Data Mesh", "data-concept", ["data mesh architecture", "domain-oriented decentralized data", "data as a product", "self-serve data infrastructure", "federated computational governance"], ["trending"]),
  s("data-fabric", "Data Fabric", "data-concept", ["data fabric architecture", "unified data management"]),
  s("data-modeling-concept", "Dimensional Data Modeling", "data-concept", ["dimensional modeling", "star schema design", "factless fact table", "surrogate keys", "conformed dimensions"]),
  s("stream-processing-concept", "Stream Processing & Real-Time Analytics", "data-concept", ["real-time streaming", "event stream processing", "windowing tumbling sliding", "event time processing", "watermarks"]),
  s("batch-processing-concept", "Batch Data Processing", "data-concept", ["batch processing", "batch workloads", "scheduled data pipelines"]),
  s("data-lineage-concept", "Data Lineage & Provenance", "data-concept", ["data lineage", "end-to-end data tracing", "column-level lineage"]),
  s("data-governance-concept", "Data Governance & Compliance", "data-concept", ["data governance", "pii masking", "data retention policies", "data access policies"]),
];
