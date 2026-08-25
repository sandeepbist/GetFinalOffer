import { s, type SkillDef } from "../types";

export const BACKEND: SkillDef[] = [
  // JavaScript / TypeScript Backends
  s("nodejs", "Node.js", "runtime", ["node", "node js", "nodejs runtime", "server side javascript", "node.js development", "node 20", "node 22", "v8 runtime"], ["high-demand", "core"]),
  s("deno", "Deno", "runtime", ["deno runtime", "denojs", "deno deploy", "secure javascript runtime"]),
  s("bun", "Bun", "runtime", ["bun runtime", "bun js", "bun package manager", "bun http server"], ["trending"]),
  s("express", "Express.js", "backend-framework", ["express", "express js", "expressjs", "express framework", "express middleware"], ["high-demand", "core"]),
  s("fastify", "Fastify", "backend-framework", ["fastify framework", "fastify node", "fastify plugins", "high performance node"]),
  s("nestjs", "NestJS", "backend-framework", ["nest js", "nest.js", "nestjs framework", "nestjs microservices", "nestjs modules"], ["trending", "high-demand"]),
  s("koa", "Koa", "backend-framework", ["koajs", "koa js", "koa framework"]),
  s("hapi", "Hapi", "backend-framework", ["hapijs", "hapi js", "hapi framework", "@hapi/hapi"]),
  s("feathersjs", "Feathers.js", "backend-framework", ["feathers js", "feathersjs framework"]),
  s("adonisjs", "AdonisJS", "backend-framework", ["adonis js", "adonis framework", "node fullstack framework"]),
  s("socketio", "Socket.IO", "realtime-framework", ["socket io", "socket.io server", "websocket socketio"]),

  // Python Backends
  s("django", "Django", "backend-framework", ["django framework", "django python", "django web", "django orm", "django admin", "django rest framework", "drf"], ["high-demand", "core"]),
  s("django-rest-framework", "Django REST Framework (DRF)", "backend-framework", ["drf", "django rest", "django api", "drf serializers"]),
  s("flask", "Flask", "backend-framework", ["flask framework", "flask python", "flask web", "flask microframework", "flask rest"]),
  s("fastapi", "FastAPI", "backend-framework", ["fast api", "fastapi python", "fastapi framework", "fastapi async", "pydantic fastapi", "starlette fastapi"], ["trending", "high-demand"]),
  s("tornado", "Tornado", "backend-framework", ["tornado python", "tornado web server"]),
  s("sanic", "Sanic", "backend-framework", ["sanic python", "sanic async"]),
  s("aiohttp", "aiohttp", "backend-framework", ["aiohttp python", "asyncio http"]),
  s("celery", "Celery", "task-queue", ["celery python", "celery task queue", "celery workers", "distributed task queue celery"], ["high-demand"]),

  // Java & JVM Backends
  s("spring-boot", "Spring Boot", "backend-framework", ["springboot", "spring boot java", "spring boot framework", "spring boot 3", "spring boot microservices", "spring initializr"], ["high-demand", "core"]),
  s("spring-framework", "Spring Framework", "backend-framework", ["spring", "spring java", "spring core", "spring mvc", "spring context", "spring di", "dependency injection spring"], ["high-demand", "core"]),
  s("spring-cloud", "Spring Cloud", "backend-framework", ["spring cloud microservices", "spring cloud gateway", "eureka", "spring cloud config"]),
  s("spring-security", "Spring Security", "security-framework", ["spring security authentication", "spring oauth2", "spring jwt"]),
  s("spring-data", "Spring Data", "backend-framework", ["spring data jpa", "spring data mongodb", "spring data rest"]),
  s("quarkus", "Quarkus", "backend-framework", ["quarkus java", "quarkus framework", "supersonic subatomic java", "graalvm quarkus"], ["trending"]),
  s("micronaut", "Micronaut", "backend-framework", ["micronaut java", "micronaut framework", "micronaut microservices"]),
  s("vert-x", "Eclipse Vert.x", "backend-framework", ["vertx", "vert.x", "reactive vertx"]),
  s("dropwizard", "Dropwizard", "backend-framework", ["dropwizard java", "dropwizard rest"]),
  s("ktor", "Ktor", "backend-framework", ["ktor kotlin", "ktor framework", "ktor server"]),
  s("play-framework", "Play Framework", "backend-framework", ["play framework scala", "play framework java", "play framework"]),

  // .NET & C# Backends
  s("aspnet-core", "ASP.NET Core", "backend-framework", ["asp.net core", "aspnet", "asp net core", "dotnet web", ".net core web", "asp.net core web api", ".net 8", ".net 9", "minimal apis"], ["high-demand", "core"]),
  s("aspnet-mvc", "ASP.NET MVC", "backend-framework", ["asp.net mvc", "aspnet mvc", "dot net mvc"]),
  s("wcf", "WCF", "backend-framework", ["windows communication foundation", "wcf services"]),
  s("signalr", "SignalR", "realtime-framework", ["asp.net signalr", "signalr websockets", "realtime signalr"]),
  s("blazor-server", "Blazor Server", "backend-framework", ["blazor server side", "asp.net blazor"]),

  // Go Backends
  s("gin", "Gin Web Framework", "backend-framework", ["gin golang", "gin framework", "gin web", "gin router", "gin-gonic"]),
  s("echo", "Echo Framework", "backend-framework", ["echo golang", "echo framework", "echo web"]),
  s("fiber", "Fiber Framework", "backend-framework", ["fiber golang", "fiber framework", "gofiber"]),
  s("chi", "Chi Router", "backend-framework", ["chi golang", "chi router", "go-chi"]),
  s("gorilla-mux", "Gorilla Mux", "backend-framework", ["gorilla mux", "gorilla web toolkit"]),
  s("go-zero", "go-zero", "backend-framework", ["go-zero microservices", "gozero"]),
  s("kratos", "Kratos", "backend-framework", ["go kratos", "go-kratos microservices"]),

  // Rust Backends
  s("actix", "Actix Web", "backend-framework", ["actix rust", "actix framework", "actix-web", "actix actor"]),
  s("axum", "Axum", "backend-framework", ["axum rust", "axum framework", "tokio axum"], ["trending"]),
  s("rocket", "Rocket", "backend-framework", ["rocket rust", "rocket framework", "rocket web"]),
  s("warp-rust", "Warp", "backend-framework", ["warp rust", "warp web framework"]),
  s("tokio", "Tokio (Async Rust)", "async-runtime", ["tokio rust", "tokio async runtime", "async-std"]),

  // Ruby Backends
  s("rails", "Ruby on Rails", "backend-framework", ["ror", "ruby on rails", "rails framework", "ruby rails", "rails 7", "rails 8", "activerecord", "actioncable"], ["high-demand", "core"]),
  s("sinatra", "Sinatra", "backend-framework", ["sinatra ruby", "sinatra framework", "sinatra microframework"]),
  s("hanami", "Hanami", "backend-framework", ["hanami ruby", "lotus ruby"]),
  s("sidekiq", "Sidekiq", "task-queue", ["sidekiq ruby", "sidekiq queue", "sidekiq pro", "redis sidekiq"]),

  // PHP Backends
  s("laravel", "Laravel", "backend-framework", ["laravel php", "laravel framework", "laravel 10", "laravel 11", "eloquent orm", "artisan cli", "laravel livewire", "laravel octane"], ["high-demand", "core"]),
  s("symfony", "Symfony", "backend-framework", ["symfony php", "symfony framework", "symfony 6", "symfony 7", "symfony components"]),
  s("codeigniter", "CodeIgniter", "backend-framework", ["codeigniter php", "codeigniter 4"]),
  s("cakephp", "CakePHP", "backend-framework", ["cakephp framework"]),
  s("laminas", "Laminas (Zend)", "backend-framework", ["zend framework", "laminas project"]),
  s("slim-php", "Slim", "backend-framework", ["slim micro framework", "slim php"]),

  // Elixir / Erlang Backends
  s("phoenix", "Phoenix Framework", "backend-framework", ["phoenix elixir", "phoenix framework", "phoenix liveview", "elixir phoenix"]),
  s("phoenix-liveview", "Phoenix LiveView", "realtime-framework", ["liveview", "liveview elixir"]),
  s("gen-server", "GenServer / OTP", "concurrency-model", ["genserver", "erlang otp", "elixir genserver", "supervisor trees"]),

  // API Protocols, RPC & Paradigms
  s("rest-api", "RESTful API Design", "api-paradigm", ["rest api", "restful", "restful web services", "rest architectural style", "rest endpoints", "crud apis", "rest verbs"], ["high-demand", "core"]),
  s("graphql-api", "GraphQL API", "api-paradigm", ["graphql server", "graphql schema design", "apollo server", "graphql resolvers", "graphql subscriptions", "graphql federation", "subgraphs"], ["high-demand", "core"]),
  s("grpc", "gRPC", "api-paradigm", ["grpc protocol", "google rpc", "grpc api", "grpc streaming", "grpc microservices", "bidirectional streaming grpc"], ["high-demand"]),
  s("trpc", "tRPC", "api-paradigm", ["trpc backend", "trpc router", "end-to-end typesafe rpc"], ["trending"]),
  s("openapi-spec", "OpenAPI Specification / Swagger", "api-standard", ["openapi", "swagger", "openapi 3.0", "openapi 3.1", "swagger ui", "api documentation spec", "contract-first api"]),
  s("soap", "SOAP Web Services", "api-paradigm", ["soap api", "wsdl", "soap web service", "xml soap"]),
  s("json-rpc", "JSON-RPC", "api-paradigm", ["json rpc", "jsonrpc 2.0"]),
  s("webhooks", "Webhooks Implementation", "api-paradigm", ["webhook receiver", "webhook dispatcher", "event webhooks", "webhook signatures", "hmac webhooks"]),

  // Message Brokers & Event Streaming
  s("apache-kafka", "Apache Kafka", "message-broker", ["kafka", "kafka streaming", "kafka messaging", "event streaming", "kafka cluster", "kafka consumers", "kafka producers", "kafka streams", "ksqldb", "schema registry"], ["high-demand", "core"]),
  s("rabbitmq", "RabbitMQ", "message-broker", ["rabbit mq", "rabbitmq messaging", "amqp broker", "rabbitmq exchanges", "rabbitmq routing", "dead letter exchange"], ["high-demand", "core"]),
  s("apache-pulsar", "Apache Pulsar", "message-broker", ["pulsar", "apache pulsar messaging", "multi-tenant messaging"]),
  s("activemq", "Apache ActiveMQ", "message-broker", ["activemq", "activemq artemis", "jms broker"]),
  s("nats", "NATS Messaging", "message-broker", ["nats", "nats.io", "nats streaming", "nats jetstream"], ["trending"]),
  s("redis-streams", "Redis Streams", "message-broker", ["redis stream", "redis consumer groups", "redis messaging"]),
  s("amazon-sqs", "Amazon SQS", "message-broker", ["aws sqs", "simple queue service", "sqs fifo", "dead letter queues sqs"]),
  s("amazon-sns", "Amazon SNS", "message-broker", ["aws sns", "simple notification service", "pub sub sns"]),
  s("google-pubsub", "Google Cloud Pub/Sub", "message-broker", ["google pubsub", "gcp pub/sub", "cloud pubsub"]),
  s("azure-service-bus", "Azure Service Bus", "message-broker", ["service bus azure", "azure queue storage"]),
  s("azure-event-hubs", "Azure Event Hubs", "message-broker", ["event hubs azure", "big data streaming azure"]),

  // Job Queues & Background Processing
  s("bullmq", "BullMQ", "task-queue", ["bull mq", "bull queue", "bullmq queue", "redis job queue", "nodejs background workers"], ["high-demand"]),
  s("resque", "Resque", "task-queue", ["resque ruby", "resque redis"]),
  s("hangfire", "Hangfire", "task-queue", ["hangfire dotnet", "hangfire c#", "background jobs .net"]),
  s("quartz", "Quartz Scheduler", "task-scheduler", ["quartz java", "quartz enterprise job scheduler", "cron quartz"]),
  s("temporal", "Temporal.io Workflow Orchestration", "workflow-engine", ["temporal workflow", "temporal io", "temporal orchestrator", "durable execution"], ["trending", "high-demand"]),
  s("cadence", "Uber Cadence", "workflow-engine", ["cadence workflow", "uber cadence"]),
  s("apache-airflow", "Apache Airflow", "workflow-engine", ["airflow", "airflow workflow", "airflow dag", "airflow orchestrator"], ["high-demand", "core"]),
  s("prefect", "Prefect", "workflow-engine", ["prefect workflows", "prefect orchestrator", "prefect 2"]),
  s("dagster", "Dagster", "workflow-engine", ["dagster orchestrator", "dagster data assets"], ["trending"]),

  // Authentication, Authorization & Identity
  s("oauth2", "OAuth 2.0 / OpenID Connect", "authentication", ["oauth", "oauth 2", "oauth2.0", "openid connect", "oidc", "oauth flows", "authorization code grant", "client credentials grant"], ["high-demand", "core"]),
  s("jwt", "JSON Web Tokens (JWT)", "authentication", ["jwt", "json web token", "jwt tokens", "jwt authentication", "jwt validation", "jwt claims", "refresh tokens", "access tokens"], ["high-demand", "core"]),
  s("session-auth", "Session-Based Authentication", "authentication", ["session auth", "express-session", "cookie based auth", "http only cookies", "csrf protection"]),
  s("rbac", "Role-Based Access Control (RBAC)", "authorization", ["rbac", "role based permissions", "role access control"]),
  s("abac", "Attribute-Based Access Control (ABAC)", "authorization", ["abac", "policy based access control", "opa abac"]),
  s("pdp-pep", "Policy Enforcement (OPA / Cedar)", "authorization", ["open policy agent", "opa", "rego language", "aws cedar", "casbin"]),
  s("sso", "Single Sign-On (SSO)", "authentication", ["sso integration", "saml sso", "enterprise sso", "okta sso", "auth0 sso"]),
  s("mfa", "Multi-Factor Authentication (MFA)", "authentication", ["2fa", "two factor auth", "totp", "webauthn", "fido2", "passkeys"]),
  s("better-auth", "Better Auth", "authentication", ["better-auth", "typescript auth framework", "better auth nextjs"]),
  s("next-auth", "NextAuth.js / Auth.js", "authentication", ["nextauth", "next-auth", "auth.js", "@auth/core"]),
  s("passportjs", "Passport.js", "authentication", ["passport js", "passport strategies", "passport local", "passport jwt"]),

  // Caching, Performance & Resiliency Patterns
  s("redis-caching", "Redis Caching Strategies", "caching", ["redis cache", "cache aside pattern", "write through cache", "cache invalidation", "distributed caching", "redis ttl"], ["high-demand", "core"]),
  s("memcached-caching", "Memcached", "caching", ["memcached caching", "distributed memory object caching"]),
  s("rate-limiting", "API Rate Limiting & Throttling", "resiliency", ["rate limiter", "token bucket algorithm", "leaky bucket", "sliding window rate limiter", "upstash ratelimit"], ["high-demand"]),
  s("circuit-breaker", "Circuit Breaker Pattern", "resiliency", ["circuit breaker", "opossum", "resilience4j", "netflix hystrix", "polly c#"]),
  s("bulkhead-isolation", "Bulkhead Pattern", "resiliency", ["bulkhead isolation", "thread pool isolation"]),
  s("retry-backoff", "Exponential Backoff & Retries", "resiliency", ["exponential backoff", "jitter retry", "retry strategies"]),
  s("connection-pooling", "Database Connection Pooling", "performance", ["connection pool", "pgbouncer", "hikari cp", "connection pool tuning"]),
  s("distributed-locking", "Distributed Locking (Redlock)", "concurrency", ["redlock", "redis distributed lock", "zookeeper lock", "distributed mutex"]),
  s("database-sharding", "Database Sharding & Partitioning", "scalability", ["horizontal sharding", "range partitioning", "hash partitioning", "shard keys"]),
  s("read-write-splitting", "Read/Write Replica Splitting", "scalability", ["primary replica replication", "read replicas", "query routing"]),
];
