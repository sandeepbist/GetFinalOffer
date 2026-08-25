import { s, type SkillDef } from "../types";

export const ARCHITECTURE_PATTERNS: SkillDef[] = [
  // ── System Design & Distributed Systems Core ──
  s("system-design", "System Design & Architecture", "architecture-core", ["system design", "system design interview", "systems architecture", "large scale distributed systems", "scalability design", "high availability design", "fault tolerant systems"], ["high-demand", "core"]),
  s("distributed-systems", "Distributed Systems Engineering", "architecture-core", ["distributed systems", "distributed computing", "distributed state", "split brain prevention", "distributed coordination", "zookeeper", "etcd", "distributed transactions"], ["high-demand", "core"]),
  s("cap-theorem", "CAP Theorem & PACELC Theorem", "architecture-theory", ["cap theorem", "pacelc theorem", "consistency vs availability vs partition tolerance", "eventual consistency", "strong consistency", "causal consistency", "tunable consistency"]),
  s("distributed-consensus", "Distributed Consensus Algorithms (Raft / Paxos)", "architecture-theory", ["consensus algorithms", "raft consensus", "paxos algorithm", "leader election", "log replication raft", "zab protocol"]),
  s("microservices-architecture", "Microservices Architecture", "architecture-pattern", ["microservices", "microservice pattern", "service boundaries", "microservices decomposition", "strangler fig pattern", "database per service pattern", "service discovery"], ["high-demand", "core"]),
  s("modular-monolith", "Modular Monolith Architecture", "architecture-pattern", ["modular monolith", "clean monolith", "in-process modules", "monolith first"]),
  s("event-driven-architecture", "Event-Driven Architecture (EDA)", "architecture-pattern", ["event driven", "eda", "event-driven architecture", "event notification", "event-carried state transfer", "choreography vs orchestration"], ["high-demand", "core"]),
  s("cqrs-pattern", "Command Query Responsibility Segregation (CQRS)", "architecture-pattern", ["cqrs", "command model", "query model", "read model projection", "cqrs with event sourcing"], ["high-demand"]),
  s("event-sourcing-pattern", "Event Sourcing Pattern", "architecture-pattern", ["event sourcing", "event store", "immutable event log", "event replay", "snapshots in event sourcing"], ["high-demand"]),
  s("saga-pattern", "Saga Pattern (Distributed Transactions)", "architecture-pattern", ["saga pattern", "choreographed saga", "orchestrated saga", "compensating transactions", "saga execution coordinator"]),
  s("api-gateway-pattern", "API Gateway & Backends for Frontends (BFF)", "architecture-pattern", ["api gateway pattern", "bff pattern", "backend for frontend", "api composition", "request aggregation"]),
  s("circuit-breaker-pattern", "Circuit Breaker & Fault Tolerance Patterns", "architecture-pattern", ["circuit breaker pattern", "fallback pattern", "bulkhead pattern", "graceful degradation"]),
  s("outbox-pattern", "Transactional Outbox Pattern", "architecture-pattern", ["transactional outbox", "cdc change data capture outbox", "debezium outbox pattern"]),
  s("idempotency-pattern", "Idempotent API & Message Design", "architecture-pattern", ["idempotency", "idempotent consumer", "idempotency keys", "exactly once processing semantics"]),

  // ── Domain-Driven Design & Software Modeling ──
  s("domain-driven-design", "Domain-Driven Design (DDD)", "software-design", ["ddd", "domain driven design", "bounded context", "ubiquitous language", "aggregate roots", "entities and value objects", "domain events", "context mapping"], ["high-demand", "core"]),
  s("clean-architecture", "Clean Architecture (Uncle Bob)", "software-design", ["clean architecture", "dependency rule clean arch", "use cases clean arch", "entities use cases interface adapters"]),
  s("hexagonal-architecture", "Hexagonal Architecture (Ports and Adapters)", "software-design", ["hexagonal architecture", "ports and adapters", "onion architecture"]),
  s("mvc-pattern", "Model-View-Controller (MVC)", "software-design", ["mvc", "mvc pattern", "model view controller"]),
  s("mvvm-pattern", "Model-View-ViewModel (MVVM)", "software-design", ["mvvm", "mvvm pattern", "data binding mvvm"]),

  // ── Software Design Patterns (Gang of Four) ──
  s("design-patterns-gof", "Software Design Patterns (GoF)", "software-design", ["design patterns", "gang of four", "gof patterns", "creational patterns", "structural patterns", "behavioral patterns"], ["high-demand", "core"]),
  s("singleton-pattern", "Singleton Pattern", "design-pattern", ["singleton design pattern", "thread safe singleton"]),
  s("factory-pattern", "Factory & Abstract Factory Pattern", "design-pattern", ["factory pattern", "abstract factory", "factory method"]),
  s("builder-pattern", "Builder Pattern", "design-pattern", ["builder design pattern", "fluent builder"]),
  s("adapter-pattern", "Adapter Pattern", "design-pattern", ["adapter design pattern", "wrapper pattern"]),
  s("decorator-pattern", "Decorator Pattern", "design-pattern", ["decorator design pattern", "python decorators pattern"]),
  s("observer-pattern", "Observer / Pub-Sub Pattern", "design-pattern", ["observer pattern", "publisher subscriber pattern", "event listener pattern"]),
  s("strategy-pattern", "Strategy Pattern", "design-pattern", ["strategy design pattern", "policy pattern"]),
  s("template-method-pattern", "Template Method Pattern", "design-pattern", ["template method design pattern"]),
  s("solid-principles", "SOLID Design Principles", "software-design", ["solid", "solid principles", "single responsibility", "open closed principle", "liskov substitution", "interface segregation", "dependency inversion"], ["high-demand", "core"]),
  s("dry-kiss-yagni", "DRY, KISS & YAGNI Principles", "software-design", ["dry don't repeat yourself", "kiss keep it simple stupid", "yagni you aren't gonna need it"]),

  // ── Data Structures & Algorithmic Problem Solving ──
  s("data-structures", "Data Structures", "computer-science", ["dsa", "data structures", "arrays", "linked lists", "stacks", "queues", "hash tables", "hash maps", "binary search trees bst", "avl trees", "red-black trees", "heaps", "priority queues", "trie", "graphs", "adjacency list", "disjoint set union dsu"], ["high-demand", "core"]),
  s("algorithms", "Algorithms & Problem Solving", "computer-science", ["algorithms", "algorithmic problem solving", "asymptotic notation", "big o notation", "time complexity", "space complexity"], ["high-demand", "core"]),
  s("sorting-searching-algorithms", "Sorting & Searching Algorithms", "computer-science", ["binary search", "quick sort", "merge sort", "heap sort", "two pointers technique", "sliding window algorithm"]),
  s("graph-algorithms", "Graph Algorithms (BFS / DFS / Dijkstra / Topological Sort)", "computer-science", ["bfs breadth first search", "dfs depth first search", "dijkstra shortest path", "bellman ford", "floyd warshall", "topological sort", "kruskal prim minimum spanning tree"]),
  s("dynamic-programming", "Dynamic Programming & Memoization", "computer-science", ["dynamic programming", "dp", "memoization", "tabulation", "knapsack problem", "longest common subsequence lcs"]),
  s("greedy-algorithms", "Greedy Algorithms", "computer-science", ["greedy technique", "greedy approach", "huffman coding"]),

  // ── Concurrency & Parallel Programming Models ──
  s("concurrent-programming", "Concurrent & Parallel Programming", "concurrency", ["concurrency", "multithreading", "parallel programming", "thread safety", "race conditions", "deadlock prevention", "mutexes and locks", "semaphores", "condition variables", "atomic operations", "compare and swap cas"], ["high-demand", "core"]),
  s("actor-model", "Actor Model (Akka / Erlang)", "concurrency-model", ["actor model", "actors concurrency", "akka actors", "erlang actors"]),
  s("reactive-programming", "Reactive Programming (ReactiveX / RxJS)", "concurrency-model", ["reactive programming", "rx", "rxjs", "reactor java", "reactive streams", "observables and operators"]),
];
