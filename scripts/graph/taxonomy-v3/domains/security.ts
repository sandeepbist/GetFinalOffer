import { s, type SkillDef } from "../types";

export const SECURITY: SkillDef[] = [
  // ── Application Security (AppSec) ──
  s("application-security", "Application Security (AppSec)", "appsec", ["appsec", "app security", "software security", "secure sdlc", "threat modeling", "secure code review", "application hardening"], ["high-demand", "core"]),
  s("owasp-top-10", "OWASP Top 10 Security Risks", "appsec-standard", ["owasp", "owasp top 10", "owasp api security top 10", "owasp asvs", "open web application security project"], ["high-demand", "core"]),
  s("xss-prevention", "Cross-Site Scripting (XSS) Prevention", "vulnerability-mitigation", ["xss", "cross site scripting", "reflected xss", "stored xss", "dom xss", "content security policy csp", "input sanitization"]),
  s("sql-injection-prevention", "SQL Injection (SQLi) Prevention", "vulnerability-mitigation", ["sqli", "sql injection", "parameterized queries", "prepared statements sql"]),
  s("csrf-prevention", "Cross-Site Request Forgery (CSRF) Prevention", "vulnerability-mitigation", ["csrf", "cross site request forgery", "csrf tokens", "samesite cookies"]),
  s("ssrf-prevention", "Server-Side Request Forgery (SSRF) Prevention", "vulnerability-mitigation", ["ssrf", "server side request forgery", "blind ssrf"]),
  s("idor-prevention", "Insecure Direct Object References (IDOR) Mitigation", "vulnerability-mitigation", ["idor", "broken object level authorization bola", "broken function level authorization"]),
  s("sast-dast", "SAST / DAST Security Scanning", "security-tooling", ["sast", "dast", "static application security testing", "dynamic application security testing", "iast", "interactive application security testing"]),
  s("snyk-security", "Snyk Developer Security", "security-tooling", ["snyk", "snyk open source", "snyk code", "snyk container", "snyk iac", "vulnerability remediation"], ["high-demand"]),
  s("sonarqube-security", "SonarQube Security Analysis", "security-tooling", ["sonarqube", "sonarcloud", "code quality security hotspots", "taint analysis"]),
  s("checkmarx", "Checkmarx", "security-tooling", ["checkmarx sast", "cxone"]),
  s("veracode", "Veracode", "security-tooling", ["veracode security platform", "veracode sast"]),
  s("semgrep", "Semgrep (Static Analysis)", "security-tooling", ["semgrep", "semgrep rules", "custom static analysis rules"]),
  s("software-supply-chain-security", "Software Supply Chain Security & SBOM", "security-concept", ["software bill of materials", "sbom", "cyclonedx", "spdx", "sigstore", "cosign", "slsa framework", "dependency vulnerability management"], ["trending", "high-demand"]),

  // ── Cloud Security & CSPM ──
  s("cloud-security", "Cloud Security Architecture", "cloud-sec", ["cloud security engineering", "cloud hardening", "shared responsibility model", "cloud perimeter security"], ["high-demand", "core"]),
  s("cspm", "Cloud Security Posture Management (CSPM)", "cloud-sec", ["cspm", "cloud posture", "prisma cloud", "wiz cloud security", "lacework", "orca security"], ["trending", "high-demand"]),
  s("cwpp", "Cloud Workload Protection Platform (CWPP)", "cloud-sec", ["cwpp", "runtime protection", "agentless cloud security"]),
  s("ciem", "Cloud Infrastructure Entitlement Management (CIEM)", "cloud-sec", ["ciem", "least privilege cloud iam", "overprivileged identity analysis"]),
  s("wiz-security", "Wiz Cloud Security", "cloud-sec-tool", ["wiz", "wiz.io", "wiz cspm", "graph based cloud security"], ["trending", "high-demand"]),
  s("prisma-cloud", "Palo Alto Prisma Cloud", "cloud-sec-tool", ["prisma cloud", "twistlock", "palo alto cloud security"]),

  // ── Identity & Access Management (IAM) ──
  s("iam-concept", "Identity & Access Management (IAM)", "identity", ["iam", "identity management", "access governance", "privileged access management pam", "identity lifecycle"], ["high-demand", "core"]),
  s("okta-platform", "Okta Identity Cloud", "identity-platform", ["okta", "okta sso", "okta universal directory", "okta workflows", "okta auth0"], ["high-demand", "core"]),
  s("auth0-platform", "Auth0 by Okta", "identity-platform", ["auth0", "auth0 authentication", "auth0 rules actions", "auth0 universal login"], ["high-demand"]),
  s("keycloak-iam", "Keycloak Identity & Access", "identity-platform", ["keycloak", "open source iam", "keycloak sso", "keycloak realms"]),
  s("ping-identity", "Ping Identity", "identity-platform", ["pingfederate", "pingone", "ping identity sso"]),
  s("cyberark", "CyberArk Privileged Access Security", "identity-platform", ["cyberark", "pam cyberark", "enterprise vault cyberark"]),
  s("hashicorp-vault", "HashiCorp Vault", "secrets-management", ["vault", "hashicorp vault secrets", "dynamic secrets vault", "transit encryption vault", "pki engine vault"], ["high-demand", "core"]),
  s("saml-protocol", "SAML 2.0 Protocol", "identity-protocol", ["saml", "saml 2.0", "saml assertion", "identity provider idp", "service provider sp"]),
  s("active-directory-security", "Active Directory & LDAP", "identity-platform", ["active directory", "ad", "domain controller", "group policy gpo", "kerberos", "ldap directory service"]),
  s("zero-trust-architecture", "Zero Trust Architecture (ZTA)", "security-concept", ["zero trust", "never trust always verify", "microsegmentation", "ztna", "zero trust network access", "beyondcorp"], ["high-demand", "core"]),

  // ── Cryptography & Data Protection ──
  s("cryptography", "Applied Cryptography", "cryptography", ["cryptographic algorithms", "symmetric encryption", "asymmetric encryption", "hashing algorithms", "sha-256", "aes-256", "rsa", "elliptic curve cryptography ecc", "digital signatures", "hmac"], ["core"]),
  s("pki-management", "Public Key Infrastructure (PKI) & Certificates", "cryptography", ["pki", "x.509 certificates", "ca certificate authority", "ssl/tls certificates", "certificate lifecycle management", "letsencrypt"]),
  s("data-encryption", "Data Encryption at Rest & in Transit", "data-protection", ["encryption at rest", "encryption in transit", "tde transparent data encryption", "envelope encryption", "bring your own key byok"]),
  s("post-quantum-cryptography", "Post-Quantum Cryptography (PQC)", "cryptography", ["pqc", "quantum resistant algorithms", "kyber", "dilithium", "nist pqc"]),

  // ── Network Security, Firewalls & DDoS ──
  s("network-security", "Network Security Engineering", "network-sec", ["network security", "firewall architecture", "dmz", "vpc security", "vpn architecture", "ipsec"], ["high-demand", "core"]),
  s("waf-firewall", "Web Application Firewall (WAF)", "network-sec", ["waf", "cloudflare waf", "aws waf", "imperva waf", "modsecurity", "ddos mitigation", "rate limiting waf"]),
  s("ids-ips-systems", "Intrusion Detection & Prevention Systems (IDS/IPS)", "network-sec", ["ids", "ips", "snort", "suricata", "zeek", "network traffic analysis nta"]),
  s("palo-alto-networks", "Palo Alto Networks Next-Gen Firewalls (NGFW)", "network-sec-tool", ["palo alto firewall", "pan-os", "ngfw", "globalprotect"]),
  s("fortinet-fortigate", "Fortinet FortiGate", "network-sec-tool", ["fortinet", "fortigate firewall", "fortios"]),
  s("cisco-security", "Cisco Security & Firepower", "network-sec-tool", ["cisco asa", "cisco firepower", "cisco anyconnect"]),

  // ── SOC, SIEM, SOAR & Incident Response ──
  s("soc-operations", "Security Operations Center (SOC)", "soc", ["soc analyst", "soc tier 1 2 3", "24/7 security monitoring", "triage security alerts"], ["high-demand"]),
  s("siem-platform", "Security Information & Event Management (SIEM)", "soc-tool", ["siem", "log correlation", "siem rules", "security analytics", "splunk enterprise security", "microsoft sentinel", "qradar", "sumo logic siem"], ["high-demand", "core"]),
  s("soar-platform", "Security Orchestration, Automation & Response (SOAR)", "soc-tool", ["soar", "security playbooks", "cortex xsoar", "splunk phantom", "automated incident remediation"]),
  s("edr-xdr", "Endpoint Detection & Response (EDR / XDR)", "endpoint-sec", ["edr", "xdr", "crowdstrike falcon", "sentinelone", "microsoft defender for endpoint", "carbon black"], ["high-demand"]),
  s("crowdstrike-falcon", "CrowdStrike Falcon", "endpoint-sec-tool", ["crowdstrike", "falcon sensor", "threat hunting crowdstrike"], ["high-demand"]),
  s("sentinelone", "SentinelOne Singularity", "endpoint-sec-tool", ["sentinelone", "s1 autonomous endpoint security"]),
  s("incident-response-discipline", "Incident Response & Forensics (DFIR)", "incident-response", ["incident response", "dfir", "digital forensics", "breach investigation", "malware triage", "root cause analysis rca", "containment eradication recovery"], ["high-demand"]),
  s("threat-intelligence", "Cyber Threat Intelligence (CTI)", "threat-intel", ["threat intel", "mitre att&ck framework", "ioc indicators of compromise", "threat hunting", "misp", "virustotal", "stix/taxii"]),

  // ── Penetration Testing, Offensive Security & Bug Bounty ──
  s("penetration-testing", "Penetration Testing (Ethical Hacking)", "offensive-sec", ["pentest", "pen testing", "ethical hacker", "network pentesting", "web pentesting", "api pentesting", "red teaming", "oscp certification", "burp suite", "metasploit", "nmap", "kali linux"], ["high-demand", "core"]),
  s("burp-suite", "Burp Suite Professional", "offensive-sec-tool", ["burp suite", "burp proxy", "burp scanner", "portswigger", "web vulnerability scanning"]),
  s("metasploit", "Metasploit Framework", "offensive-sec-tool", ["metasploit", "exploit development", "meterpreter"]),
  s("nmap", "Nmap Network Scanner", "offensive-sec-tool", ["nmap", "port scanning", "network discovery", "nmap scripting engine nse"]),
  s("wireshark", "Wireshark Packet Analysis", "offensive-sec-tool", ["wireshark", "packet capture", "pcap analysis", "network protocol dissection"]),
  s("vulnerability-management", "Vulnerability Management (Nessus / Qualys)", "sec-assessment", ["vulnerability scanning", "tenable nessus", "qualys guard", "rapid7 nexpose", "cve cvss scoring", "remediation tracking"]),

  // ── Compliance, Governance & Risk (GRC) ──
  s("grc-framework", "Governance, Risk & Compliance (GRC)", "grc", ["grc", "risk assessment", "security governance", "vendor risk management vrm", "compliance auditing", "security policies"], ["high-demand"]),
  s("soc2-compliance", "SOC 2 Type I & Type II Compliance", "grc-compliance", ["soc 2", "soc2", "soc 2 type 2", "trust services criteria", "vanta", "drata", "secureframe"], ["high-demand", "core"]),
  s("iso-27001", "ISO/IEC 27001 Certification", "grc-compliance", ["iso 27001", "isms information security management system", "iso 27002 controls", "iso audit"]),
  s("gdpr-compliance", "GDPR (General Data Protection Regulation)", "grc-compliance", ["gdpr", "data privacy", "dpo data protection officer", "right to be forgotten", "data subject access requests dsar"]),
  s("hipaa-compliance", "HIPAA Compliance (Healthcare Data)", "grc-compliance", ["hipaa", "phi protected health information", "hipaa security rule", "hitech act", "baa business associate agreement"]),
  s("pci-dss-compliance", "PCI DSS (Payment Card Security)", "grc-compliance", ["pci dss", "payment card industry", "pci dss 4.0", "cde cardholder data environment", "tokenization pci"]),
  s("fedramp-compliance", "FedRAMP Authorization (US Federal Cloud)", "grc-compliance", ["fedramp", "fedramp moderate", "fedramp high", "nist sp 800-53", "fisma compliance"]),
  s("nist-cybersecurity-framework", "NIST Cybersecurity Framework (CSF)", "grc-framework", ["nist csf", "nist 800-53", "nist 800-171", "identify protect detect respond recover"]),
];
