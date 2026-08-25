import { s, type SkillDef } from "../types";

export const TOOLS_PRACTICES: SkillDef[] = [
  // ── Version Control & Collaboration ──
  s("git", "Git", "version-control", ["git vcs", "git version control", "git branching", "git merge", "git rebase", "git cherry-pick"], ["high-demand", "core"]),
  s("github", "GitHub Platform", "developer-platform", ["github", "github enterprise", "github pull requests", "github code scanning"], ["high-demand", "core"]),
  s("gitlab", "GitLab Platform", "developer-platform", ["gitlab", "gitlab merge requests", "gitlab self-managed"]),
  s("bitbucket", "Atlassian Bitbucket", "developer-platform", ["bitbucket", "bitbucket server"]),
  s("code-review", "Code Review Practices & PR Hygiene", "engineering-practice", ["code review", "peer code review", "pull request review", "pr feedback"], ["core"]),
  s("backstage-spotify", "Spotify Backstage (Developer Portal)", "platform-tooling", ["backstage", "spotify backstage", "internal developer portal backstage"]),

  // ── Java / JVM Build Tools ──
  s("maven", "Apache Maven", "build-tool", ["maven", "maven build", "pom.xml", "maven plugins", "maven repository"]),
  s("gradle", "Gradle", "build-tool", ["gradle build", "gradle wrapper", "build.gradle", "gradle tasks"]),

  // ── Scientific Computing & Mathematical Python ──
  s("numpy", "NumPy", "data-library", ["numpy python", "numpy arrays", "vectorized operations numpy", "np.ndarray"], ["high-demand", "core"]),
  s("scipy", "SciPy", "data-library", ["scipy python", "scipy scientific computing", "scipy optimize", "scipy stats"]),
  s("statistical-analysis", "Statistical Analysis & Hypothesis Testing", "data-science", ["statistics", "hypothesis testing", "p-values", "anova", "confidence intervals", "bayesian statistics"], ["high-demand", "core"]),
  s("data-visualization", "Data Visualization & Dashboards", "data-analytics", ["data viz", "data visualisation", "chart design", "visual analytics"], ["high-demand", "core"]),

  // ── Microsoft BI & ETL ──
  s("ssis-etl", "SQL Server Integration Services (SSIS)", "data-etl", ["ssis", "sql server integration services", "ssis packages"]),
  s("ssas-analysis", "SQL Server Analysis Services (SSAS)", "data-analytics", ["ssas", "ssas tabular models", "multidimensional ssas"]),
  s("ssrs-reporting", "SQL Server Reporting Services (SSRS)", "data-reporting", ["ssrs", "ssrs reports", "paginated reports"]),

  // ── Core Engineering Qualities & Scalability ──
  s("scalability", "Scalability & High-Throughput Engineering", "architecture-concept", ["horizontal scalability", "vertical scalability", "high throughput systems", "low latency architecture", "scaling to millions of users"], ["high-demand", "core"]),
  s("state-management", "Frontend State Management Architecture", "frontend-concept", ["state management", "global state management", "unidirectional data flow", "flux architecture"]),
  s("threat-modeling", "Threat Modeling (STRIDE / DREAD)", "security-practice", ["threat modeling", "stride model", "dread model", "security risk analysis"]),
  s("kubernetes-security", "Kubernetes Security & Hardening", "security-discipline", ["k8s security", "pod security standards", "falco runtime security", "kube-bench", "trivy container security"]),
  s("ci/cd-testing", "Automated Testing in CI/CD Pipelines", "testing-practice", ["ci/cd testing", "continuous testing", "test automation in pipeline"]),
];
