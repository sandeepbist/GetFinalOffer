import { s, type SkillDef } from "../types";

export const ENTERPRISE_FINTECH: SkillDef[] = [
  // ── CRM, ERP & Enterprise Platforms ──
  s("salesforce", "Salesforce CRM & Platform", "enterprise-crm", ["salesforce", "sfdc", "salesforce cloud", "sales cloud", "service cloud", "salesforce admin", "soql", "salesforce flows"], ["high-demand", "core"]),
  s("salesforce-apex", "Salesforce Apex Programming", "enterprise-crm", ["salesforce apex", "apex triggers", "apex classes", "apex batch jobs", "asynchronous apex", "apex unit testing"], ["high-demand", "core"]),
  s("salesforce-lightning", "Salesforce Lightning Web Components (LWC)", "enterprise-crm", ["lwc", "lightning web components", "aura components salesforce", "lightning design system slds"], ["high-demand"]),
  s("sap-erp", "SAP ERP & S/4HANA", "enterprise-erp", ["sap", "sap s/4hana", "sap ecc", "sap erp modules", "sap fico", "sap mm", "sap sd", "sap integration"], ["high-demand", "core"]),
  s("sap-abap", "SAP ABAP Development", "enterprise-erp", ["abap", "sap abap", "abap on hana", "abap core data services cds", "badi abap", "bapi sap"]),
  s("sap-hana-db", "SAP HANA Database", "enterprise-erp", ["sap hana", "hana studio", "in memory sap hana", "calculation views hana"]),
  s("servicenow-platform", "ServiceNow Enterprise Platform", "enterprise-itsm", ["servicenow", "service now", "servicenow itsm", "servicenow itom", "servicenow developer", "glide record servicenow", "flow designer servicenow", "servicenow csdm"], ["high-demand", "core"]),
  s("workday-hcm", "Workday HCM & Financials", "enterprise-hris", ["workday", "workday hcm", "workday enterprise interface builder eib", "workday studio", "workday prism analytics"]),
  s("microsoft-dynamics", "Microsoft Dynamics 365", "enterprise-erp", ["dynamics 365", "d365", "dynamics crm", "dynamics finance and operations", "x++ programming dynamics"]),
  s("hubspot-crm", "HubSpot CRM & Marketing Hub", "enterprise-crm", ["hubspot", "hubspot crm", "hubspot custom objects", "hubspot cms", "hubspot api integrations"]),
  s("zendesk-platform", "Zendesk Support & Suite", "enterprise-support", ["zendesk", "zendesk api", "zendesk apps framework zaf", "zendesk Sunshine"]),
  s("zoho-crm", "Zoho CRM & Suite", "enterprise-crm", ["zoho", "zoho crm", "deluge scripting zoho"]),

  // ── E-Commerce & Headless Commerce ──
  s("shopify-platform", "Shopify & Shopify Plus", "ecommerce", ["shopify", "shopify plus", "shopify theme development", "liquid templating", "shopify app development", "shopify graphql admin api", "shopify storefront api", "hydrogen oxygen shopify"], ["high-demand", "core"]),
  s("magento-adobe-commerce", "Magento / Adobe Commerce", "ecommerce", ["magento", "magento 2", "adobe commerce", "magento php modules", "magento pwa studio"]),
  s("woocommerce", "WooCommerce", "ecommerce", ["woocommerce wordpress", "woo commerce plugin", "woocommerce rest api"]),
  s("commercelayer", "Commerce Layer / Commercetools", "ecommerce", ["commercelayer", "commercetools", "headless commerce", "mach architecture"]),
  s("bigcommerce", "BigCommerce", "ecommerce", ["bigcommerce platform", "bigcommerce stencil"]),

  // ── Headless & Traditional CMS ──
  s("contentful-cms", "Contentful Headless CMS", "cms", ["contentful", "contentful graphql", "contentful content models", "contentful migration"]),
  s("sanity-io", "Sanity.io", "cms", ["sanity", "sanity cms", "groq query language sanity", "sanity studio"]),
  s("strapi-cms", "Strapi Headless CMS", "cms", ["strapi", "strapi nodejs", "strapi content types", "open source headless cms"]),
  s("wordpress-development", "WordPress Development", "cms", ["wordpress", "wp", "wordpress theme development", "wordpress plugin development", "gutenberg blocks", "headless wordpress wp-graphql"]),
  s("drupal-cms", "Drupal", "cms", ["drupal", "drupal 10", "drupal modules", "twig drupal"]),

  // ── Payments, Billing & FinTech Protocols ──
  s("stripe-payments", "Stripe Payments & Billing", "fintech-payments", ["stripe", "stripe api", "stripe webhooks", "stripe checkout", "stripe elements", "stripe billing", "stripe connect marketplace", "stripe radar fraud prevention"], ["high-demand", "core"]),
  s("plaid-api", "Plaid Financial Data API", "fintech-banking", ["plaid", "plaid link", "plaid bank auth", "plaid transactions", "open banking plaid"]),
  s("adyen-payments", "Adyen Global Payment Platform", "fintech-payments", ["adyen", "adyen api", "adyen drop-in"]),
  s("paypal-braintree", "PayPal & Braintree", "fintech-payments", ["paypal api", "braintree payments", "paypal checkout"]),
  s("ach-sepa-payments", "ACH, SEPA & Wire Transfer Processing", "fintech-rails", ["ach payments", "sepa credit transfer", "wire transfer processing", "direct debit"]),
  s("iso-20022", "ISO 20022 Financial Messaging Standard", "fintech-standard", ["iso 20022", "pacs.008", "camt.053", "pain.001", "swift mx messages"]),
  s("fix-protocol", "FIX Protocol (Financial Information eXchange)", "fintech-trading", ["fix protocol", "financial information exchange", "fix 4.2", "fix 4.4", "quickfix"]),
  s("ledger-accounting-engine", "Double-Entry Bookkeeping & Ledger Systems", "fintech-core", ["double entry ledger", "financial accounting engine", "reconciliation systems", "immutability ledger"]),
  s("core-banking-systems", "Core Banking Integration (Mambu / Thought Machine)", "fintech-banking", ["core banking", "mambu", "thought machine vault", "banking as a service baas"]),

  // ── Communications & Messaging APIs ──
  s("twilio-platform", "Twilio Communications APIs", "communications-api", ["twilio", "twilio sms api", "twilio voice", "twilio programmable video", "twilio sendgrid", "twiml"]),
  s("sendgrid-email", "SendGrid Email Infrastructure", "communications-api", ["sendgrid", "sendgrid smtp", "transactional email sendgrid"]),
  s("mailgun-email", "Mailgun", "communications-api", ["mailgun", "mailgun transactional email api"]),

  // ── Robotic Process Automation (RPA) & Workflow Automation ──
  s("rpa-discipline", "Robotic Process Automation (RPA)", "automation-discipline", ["rpa", "robotic process automation", "bot development", "unattended bots", "attended automation"]),
  s("uipath", "UiPath RPA Platform", "rpa-tool", ["uipath", "uipath studio", "uipath orchestrator", "uipath robots"]),
  s("automation-anywhere", "Automation Anywhere", "rpa-tool", ["automation anywhere", "automation 360", "iq bot"]),
  s("power-automate", "Microsoft Power Automate (Flow)", "automation-tool", ["power automate", "microsoft flow", "power automate desktop pad", "cloud flows power automate"]),
  s("power-apps", "Microsoft Power Apps", "low-code-platform", ["power apps", "canvas apps", "model driven apps", "power platform microsoft"]),
  s("zapier-integration", "Zapier & Make (Integromat)", "automation-tool", ["zapier", "make.com", "integromat", "nocode api workflows"]),
];
