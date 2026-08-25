import { s, type SkillDef } from "../types";

export const PRODUCT_MANAGEMENT: SkillDef[] = [
  // ── Product Strategy, Discovery & Execution ──
  s("product-management", "Product Management (PM)", "product-core", ["product manager", "pm", "technical product management", "tpm", "product lifecycle management plm", "product strategy", "product discovery", "product execution"], ["high-demand", "core"]),
  s("product-roadmapping", "Product Roadmapping & Prioritization", "product-strategy", ["product roadmap", "roadmap planning", "rice scoring framework", "kano model", "moscow prioritization", "value vs effort matrix"], ["high-demand", "core"]),
  s("user-story-mapping", "User Story Mapping & Requirements Gathering", "product-execution", ["user stories", "acceptance criteria", "product requirements document prd", "epics and features", "story point estimation"]),
  s("mvp-definition", "MVP Definition & Product-Market Fit (PMF)", "product-strategy", ["minimum viable product mvp", "product market fit", "pmf validation", "lean startup methodology"]),
  s("competitive-analysis", "Competitive Analysis & Market Research", "product-strategy", ["market research", "swot analysis", "tam sam som", "competitor benchmarking"]),
  s("go-to-market", "Go-To-Market (GTM) Strategy", "product-strategy", ["gtm strategy", "product launch planning", "pricing strategy", "product packaging"]),

  // ── Product Analytics & Experimentation ──
  s("amplitude-analytics", "Amplitude Product Analytics", "product-analytics", ["amplitude", "amplitude analytics", "cohort analysis amplitude", "funnel analysis amplitude", "retention charts"], ["high-demand"]),
  s("mixpanel", "Mixpanel", "product-analytics", ["mixpanel", "mixpanel event tracking", "mixpanel funnels", "user path analysis"]),
  s("posthog", "PostHog Product Analytics", "product-analytics", ["posthog", "posthog session recording", "posthog feature flags", "open source product analytics"], ["trending", "high-demand"]),
  s("heap-analytics", "Heap Analytics", "product-analytics", ["heap", "autocapture heap"]),
  s("google-analytics-4", "Google Analytics 4 (GA4)", "marketing-analytics", ["ga4", "google analytics", "ga4 custom events", "conversion tracking ga4"]),
  s("ab-testing-experimentation", "A/B Testing & Experimentation Strategy", "experimentation", ["a/b testing", "split testing", "multivariate testing", "statistical significance", "sample size calculation", "optimizely", "vwo", "launchdarkly experiments"], ["high-demand", "core"]),
  s("north-star-metrics", "Product Metrics (North Star / OKRs / KPIs)", "product-analytics", ["north star metric", "okrs", "objectives and key results", "kpis", "arr", "mrr", "churn rate", "ltv", "cac", "dau/mau ratio", "net promoter score nps"], ["high-demand", "core"]),
  s("conversion-rate-optimization", "Conversion Rate Optimization (CRO)", "growth", ["cro", "funnel optimization", "landing page optimization", "checkout flow optimization"]),

  // ── Agile, Scrum & Project Management Tools ──
  s("agile-methodology", "Agile Software Development", "methodology", ["agile", "agile methodology", "agile transformation", "agile mindset", "agile manifesto"], ["high-demand", "core"]),
  s("scrum-framework", "Scrum Framework", "methodology", ["scrum", "scrum master", "sprint planning", "daily standup", "sprint review", "sprint retrospective", "backlog refinement", "sprint burndown chart", "csm certified scrum master"], ["high-demand", "core"]),
  s("kanban-methodology", "Kanban Methodology", "methodology", ["kanban", "kanban board", "wip limits", "work in progress limits", "cumulative flow diagram", "lead time cycle time"]),
  s("safe-framework", "Scaled Agile Framework (SAFe)", "methodology", ["safe", "scaled agile", "release trains art", "program increment pi planning"]),
  s("jira-software", "Atlassian Jira", "pm-tool", ["jira", "jira software", "jira workflows", "jira boards", "jira automation", "jql jira query language"], ["high-demand", "core"]),
  s("linear-app", "Linear", "pm-tool", ["linear", "linear app", "linear issue tracking", "modern issue tracking"], ["trending", "high-demand"]),
  s("confluence-wiki", "Atlassian Confluence", "collaboration-tool", ["confluence", "confluence documentation", "team wiki confluence"]),
  s("notion-workspace", "Notion Workspace", "collaboration-tool", ["notion", "notion databases", "notion documentation", "notion wikis"]),
  s("asana-pm", "Asana", "pm-tool", ["asana", "asana task management", "asana projects"]),
  s("monday-com", "Monday.com", "pm-tool", ["monday.com", "monday work os"]),
  s("clickup-pm", "ClickUp", "pm-tool", ["clickup", "clickup project management"]),
  s("trello-pm", "Trello", "pm-tool", ["trello", "trello kanban"]),

  // ── Engineering Leadership, Mentorship & Collaboration ──
  s("technical-leadership", "Technical Leadership (Tech Lead / Lead Engineer)", "leadership", ["tech lead", "technical lead", "engineering leadership", "guiding technical vision", "technical decision making"], ["high-demand", "core"]),
  s("engineering-management", "Engineering Management (EM / VP / CTO)", "leadership", ["engineering manager", "people management engineering", "performance reviews", "1-on-1 meetings", "hiring and recruiting engineers", "career ladders", "team health"], ["high-demand", "core"]),
  s("technical-mentoring", "Mentorship & Developer Coaching", "leadership", ["mentoring", "developer coaching", "code review guidance", "pair programming mentoring"]),
  s("cross-functional-collaboration", "Cross-Functional Team Collaboration", "leadership", ["cross functional collaboration", "working with product design engineering", "stakeholder management", "executive communication"]),
  s("technical-writing-discipline", "Technical Writing & Developer Documentation", "documentation", ["technical writing", "api documentation", "developer guides", "rfc request for comments", "architecture decision records adr"]),
];
