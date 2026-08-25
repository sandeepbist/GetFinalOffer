import { s, type SkillDef } from "../types";

export const DEVOPS: SkillDef[] = [
  // ── Containers & Virtualization ──
  s("docker", "Docker", "containerization", ["docker container", "docker containerization", "docker image", "dockerfile", "docker engine", "multi-stage builds docker", "rootless docker"], ["high-demand", "core"]),
  s("docker-compose", "Docker Compose", "containerization", ["docker-compose", "compose yaml", "docker multi container"]),
  s("podman", "Podman", "containerization", ["podman containers", "daemonless podman", "podman desktop", "rootless podman"]),
  s("buildah", "Buildah", "containerization", ["buildah container images", "oci images buildah"]),
  s("skopeo", "Skopeo", "containerization", ["skopeo container registry utility"]),
  s("containerd", "containerd", "container-runtime", ["containerd runtime", "cri containerd"]),
  s("crio", "CRI-O", "container-runtime", ["cri-o kubernetes container runtime"]),
  s("qemu", "QEMU", "virtualization", ["qemu virtualization", "kvm qemu"]),
  s("vmware-vsphere", "VMware vSphere / ESXi", "virtualization", ["vmware", "vsphere", "esxi", "vmware workstation", "vcenter"]),

  // ── Kubernetes & Container Orchestration ──
  s("kubernetes", "Kubernetes", "container-orchestration", ["k8s", "kube", "kubernetes orchestration", "kubernetes cluster", "kubectl", "kubernetes pods", "kubernetes deployments", "kubernetes statefulsets", "kubernetes daemonsets", "k8s ingress", "k8s rbac", "crd", "custom resource definitions"], ["high-demand", "core"]),
  s("helm", "Helm (Kubernetes Package Manager)", "container-orchestration", ["helm charts", "helm kubernetes", "helm package", "helm values", "helm release", "helm 3"], ["high-demand"]),
  s("kustomize", "Kustomize", "container-orchestration", ["kustomize kubernetes", "template-free yaml patching"]),
  s("k3s", "K3s", "container-orchestration", ["k3s kubernetes", "lightweight kubernetes", "edge kubernetes"]),
  s("rancher", "SUSE Rancher", "container-orchestration", ["rancher", "rancher kubernetes management", "rke"]),
  s("redhat-openshift", "Red Hat OpenShift", "container-orchestration", ["openshift", "ocp", "openshift container platform", "okd"]),
  s("cilium", "Cilium (eBPF Networking & Security)", "container-networking", ["cilium ebpf", "cilium cni", "cilium service mesh", "hubble observability"], ["trending", "high-demand"]),
  s("calico", "Project Calico", "container-networking", ["calico cni", "calico network policies"]),
  s("flannel", "Flannel", "container-networking", ["flannel cni"]),
  s("keda", "KEDA (Kubernetes Event-driven Autoscaling)", "container-orchestration", ["keda autoscaling", "keda scaler"]),
  s("cert-manager", "cert-manager", "container-orchestration", ["cert manager kubernetes", "letsencrypt cert-manager"]),
  s("external-dns", "ExternalDNS", "container-orchestration", ["external dns kubernetes"]),

  // ── Service Mesh & Ingress Controllers ──
  s("istio", "Istio Service Mesh", "service-mesh", ["istio", "istio service mesh", "envoy istio", "istiod", "virtualservice istio", "ambient mesh"], ["high-demand"]),
  s("linkerd", "Linkerd", "service-mesh", ["linkerd service mesh", "ultralight rust service mesh"]),
  s("consul-mesh", "HashiCorp Consul", "service-mesh", ["consul", "consul service mesh", "consul connect"]),
  s("envoy-proxy", "Envoy Proxy", "service-mesh", ["envoy", "envoy proxy", "envoy edge gateway"]),
  s("traefik", "Traefik", "reverse-proxy", ["traefik proxy", "traefik ingress", "traefik hub", "cloud native reverse proxy"]),
  s("nginx-ingress", "NGINX Ingress Controller", "reverse-proxy", ["nginx ingress", "ingress-nginx", "nginx plus ingress"]),
  s("kong-gateway", "Kong API Gateway", "api-gateway", ["kong", "kong api gateway", "kong ingress controller", "kong plugins"]),
  s("emissary-ingress", "Emissary-ingress (Ambassador)", "api-gateway", ["ambassador api gateway", "emissary ingress"]),

  // ── Infrastructure as Code (IaC) & Configuration Management ──
  s("terraform", "HashiCorp Terraform", "iac", ["tf", "hashicorp terraform", "terraform iac", "hcl", "terraform modules", "terraform state", "terraform cloud", "opentofu"], ["high-demand", "core"]),
  s("opentofu", "OpenTofu", "iac", ["open tofu", "linux foundation opentofu", "terraform fork"]),
  s("pulumi", "Pulumi", "iac", ["pulumi iac", "pulumi typescript", "pulumi python", "pulumi infrastructure"]),
  s("crossplane", "Crossplane", "iac", ["crossplane kubernetes", "universal control plane"]),
  s("ansible", "Ansible", "configuration-management", ["ansible automation", "ansible playbook", "red hat ansible", "ansible galaxy", "ansible roles", "ansible inventory"], ["high-demand", "core"]),
  s("chef", "Chef", "configuration-management", ["chef automation", "chef cookbooks", "progress chef"]),
  s("puppet", "Puppet", "configuration-management", ["puppet automation", "puppet manifests", "puppet enterprise"]),
  s("saltstack", "SaltStack", "configuration-management", ["salt", "salt automation", "salt states"]),
  s("packer", "HashiCorp Packer", "iac", ["packer", "packer image building", "ami builder packer"]),
  s("vagrant", "HashiCorp Vagrant", "virtualization-tool", ["vagrant", "vagrantfile", "development environments vagrant"]),

  // ── CI/CD & Build Automation ──
  s("github-actions", "GitHub Actions", "cicd", ["gh actions", "github ci", "github workflows", "composite actions", "custom github action", "github runner"], ["high-demand", "core"]),
  s("gitlab-ci", "GitLab CI/CD", "cicd", ["gitlab ci", "gitlab cicd", "gitlab pipeline", ".gitlab-ci.yml", "gitlab runner"], ["high-demand", "core"]),
  s("jenkins", "Jenkins", "cicd", ["jenkins ci", "jenkins pipeline", "jenkins server", "jenkinsfile", "declarative pipeline jenkins", "jenkins plugins"], ["high-demand", "core"]),
  s("circleci", "CircleCI", "cicd", ["circle ci", "circleci pipeline", "circleci orbs"]),
  s("travis-ci", "Travis CI", "cicd", ["travisci", "travis ci pipeline"]),
  s("bitbucket-pipelines", "Bitbucket Pipelines", "cicd", ["bitbucket ci", "bitbucket pipelines yaml"]),
  s("azure-pipelines", "Azure Pipelines", "cicd", ["azure devops pipelines", "azure yaml pipeline"]),
  s("buildkite", "Buildkite", "cicd", ["build kite", "buildkite agent", "hybrid buildkite"]),
  s("teamcity", "TeamCity", "cicd", ["jetbrains teamcity", "teamcity server"]),
  s("drone-ci", "Drone CI", "cicd", ["drone", "harness drone"]),
  s("harness-platform", "Harness CI/CD", "cicd", ["harness", "harness continuous delivery", "harness chaos"]),

  // ── GitOps & Continuous Delivery ──
  s("argocd", "ArgoCD", "gitops", ["argo cd", "argo cd gitops", "argo rollouts", "argocd applications", "declarative gitops"], ["trending", "high-demand"]),
  s("fluxcd", "FluxCD", "gitops", ["flux cd", "flux v2", "flux gitops", "weaveworks flux"]),
  s("spinnaker", "Spinnaker", "continuous-delivery", ["spinnaker cd", "netflix spinnaker", "multi-cloud deployment spinnaker"]),
  s("tekton", "Tekton Pipelines", "cicd", ["tekton", "cloud native cicd tekton"]),

  // ── Observability, APM, Monitoring & Metrics ──
  s("prometheus", "Prometheus", "monitoring", ["prometheus monitoring", "prom", "prometheus metrics", "promql", "node exporter", "alertmanager", "prometheus operator"], ["high-demand", "core"]),
  s("grafana", "Grafana", "monitoring", ["grafana dashboard", "grafana visualization", "grafana alerts", "grafana cloud", "grafana loki"], ["high-demand", "core"]),
  s("datadog", "Datadog", "observability", ["data dog", "datadog monitoring", "datadog apm", "datadog agent", "datadog synthetic", "datadog dashboards", "datadog rum"], ["high-demand", "core"]),
  s("new-relic", "New Relic", "observability", ["newrelic", "new relic monitoring", "new relic apm", "new relic alerts"]),
  s("dynatrace", "Dynatrace", "observability", ["dynatrace monitoring", "dynatrace apm", "dynatrace oneagent", "davis ai dynatrace"]),
  s("appdynamics", "AppDynamics (Cisco)", "observability", ["appdynamics apm", "cisco appdynamics"]),
  s("splunk", "Splunk", "observability", ["splunk enterprise", "splunk logging", "splunk spl", "splunk forwarder", "splunk observabilty cloud"], ["high-demand"]),
  s("elk-stack", "ELK Stack (Elasticsearch, Logstash, Kibana)", "logging", ["elk", "elastic stack", "kibana dashboards", "logstash pipeline", "filebeat", "metricbeat"], ["high-demand", "core"]),
  s("grafana-loki", "Grafana Loki", "logging", ["loki", "loki log aggregation", "promtail", "logql"]),
  s("fluentd", "Fluentd / Fluent Bit", "logging", ["fluentd", "fluent bit", "log forwarding fluentd"]),
  s("opentelemetry", "OpenTelemetry (OTel)", "observability", ["otel", "open telemetry", "opentelemetry collector", "opentelemetry tracing", "opentelemetry sdk", "otel instrumentation"], ["trending", "high-demand"]),
  s("jaeger", "Jaeger", "distributed-tracing", ["jaeger tracing", "jaeger distributed tracing", "opentracing"]),
  s("zipkin", "Zipkin", "distributed-tracing", ["zipkin tracing", "distributed tracing zipkin"]),
  s("sentry", "Sentry", "error-tracking", ["sentry.io", "sentry error tracking", "sentry crash reporting", "sentry performance monitoring"], ["high-demand"]),
  s("pagerduty", "PagerDuty", "incident-management", ["pager duty", "pagerduty on-call", "pagerduty escalation policies", "incident response pagerduty"]),
  s("opsgenie", "OpsGenie (Atlassian)", "incident-management", ["ops genie", "atlassian opsgenie"]),
  s("victorops", "Splunk On-Call (VictorOps)", "incident-management", ["victorops", "splunk on call"]),

  // ── Web Servers, Load Balancers & Proxies ──
  s("nginx", "NGINX", "web-server", ["nginx server", "nginx reverse proxy", "nginx load balancer", "nginx configuration", "nginx.conf"], ["high-demand", "core"]),
  s("apache-httpd", "Apache HTTP Server", "web-server", ["apache", "httpd", "apache web server", "htaccess", "mod_rewrite"]),
  s("haproxy", "HAProxy", "load-balancer", ["ha proxy", "haproxy load balancer", "haproxy tcp http load balancing", "haproxy cfg"]),
  s("caddy-server", "Caddy Web Server", "web-server", ["caddy", "caddyfile", "automatic https caddy"]),

  // ── Deployment & Reliability Methodologies ──
  s("blue-green-deployment", "Blue-Green Deployment", "deployment-strategy", ["blue green", "blue green deploy", "zero downtime blue green"]),
  s("canary-deployment", "Canary Deployment Strategy", "deployment-strategy", ["canary deploy", "canary release", "traffic splitting canary"]),
  s("rolling-deployment", "Rolling Updates / Deployments", "deployment-strategy", ["rolling update", "zero downtime deployment"]),
  s("feature-flags-concept", "Feature Flagging & Toggles", "deployment-strategy", ["feature flags", "feature toggles", "launchdarkly", "unleash", "flagsmith"]),
  s("gitops-methodology", "GitOps", "methodology", ["git ops", "gitops methodology", "git as single source of truth"]),
  s("devops-culture", "DevOps Practices & Culture", "discipline", ["devops", "dev ops", "devops engineering", "ci/cd pipeline design", "continuous integration continuous delivery"], ["high-demand", "core"]),
  s("sre-discipline", "Site Reliability Engineering (SRE)", "discipline", ["sre", "site reliability engineering", "sli slo sla definition", "error budgets", "toil reduction", "blameless postmortems"], ["high-demand", "core"]),
  s("devsecops-discipline", "DevSecOps", "discipline", ["dev sec ops", "security in cicd", "shift left security", "sast dast in pipelines"], ["trending", "high-demand"]),
  s("chaos-engineering", "Chaos Engineering", "discipline", ["chaos engineering", "gremlin chaos", "chaos mesh", "litmus chaos", "resilience testing"]),
];
