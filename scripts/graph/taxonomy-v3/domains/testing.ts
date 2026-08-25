import { s, type SkillDef } from "../types";

export const TESTING: SkillDef[] = [
  // ── End-to-End (E2E) & Browser Automation ──
  s("playwright", "Microsoft Playwright", "test-automation", ["playwright testing", "playwright e2e", "microsoft playwright", "playwright test runner", "playwright codegen", "multi-browser testing playwright", "playwright traces"], ["trending", "high-demand", "core"]),
  s("cypress", "Cypress", "test-automation", ["cypress testing", "cypress io", "cypress e2e", "cypress fixtures", "cypress custom commands", "cypress dashboard"], ["high-demand", "core"]),
  s("selenium-webdriver", "Selenium WebDriver", "test-automation", ["selenium", "selenium automation", "selenium grid", "selenium java", "selenium python", "webdriver"], ["high-demand", "core"]),
  s("puppeteer", "Puppeteer", "test-automation", ["puppeteer headless chrome", "google puppeteer", "browser automation puppeteer", "pdf generation puppeteer"]),
  s("webdriverio", "WebdriverIO (WDIO)", "test-automation", ["webdriverio", "wdio framework", "webdriver io"]),
  s("testcafe", "TestCafe", "test-automation", ["testcafe e2e", "testcafe automation"]),
  s("nightwatchjs", "Nightwatch.js", "test-automation", ["nightwatch js", "nightwatch e2e"]),

  // ── JavaScript / TypeScript Unit & Integration Testing ──
  s("jest-unit", "Jest Testing Framework", "unit-testing", ["jest", "jest test runner", "jest mocking", "jest snapshots", "ts-jest", "jest coverage"], ["high-demand", "core"]),
  s("vitest-unit", "Vitest Testing Framework", "unit-testing", ["vitest", "vitest test runner", "vite native testing", "vitest coverage"], ["trending", "high-demand", "core"]),
  s("mocha-chai", "Mocha & Chai", "unit-testing", ["mocha", "chai", "mochajs", "chai assertions", "sinon js mocking"]),
  s("jasmine-testing", "Jasmine", "unit-testing", ["jasmine testing framework", "jasmine assertions"]),
  s("ava-testing", "AVA", "unit-testing", ["ava test runner", "concurrent javascript tests"]),

  // ── Python Testing Frameworks ──
  s("pytest", "pytest", "unit-testing", ["py test", "pytest python", "pytest fixtures", "pytest plugins", "pytest-mock", "pytest-asyncio", "pytest parametrize"], ["high-demand", "core"]),
  s("python-unittest", "unittest (Python Standard Library)", "unit-testing", ["python unittest", "unittest.mock", "testcase python"]),
  s("hypothesis", "Hypothesis (Property-Based Testing Python)", "property-testing", ["hypothesis property based testing"]),
  s("robot-framework", "Robot Framework", "test-automation", ["robot framework keyword driven", "robot framework python"]),

  // ── Java / JVM Testing Frameworks ──
  s("junit5", "JUnit 5 / JUnit 4", "unit-testing", ["junit", "junit 5", "junit jupiter", "junit assertions", "parameterized tests junit"], ["high-demand", "core"]),
  s("testng", "TestNG", "unit-testing", ["testng java", "testng dataprovider", "testng parallel execution"]),
  s("mockito", "Mockito", "mocking-library", ["mockito java", "mocking mockito", "powermock"]),
  s("assertj", "AssertJ", "assertion-library", ["assertj fluent assertions java"]),
  s("spock-framework", "Spock Framework (Groovy / Java)", "bdd-framework", ["spock bdd", "spock testing specifications"]),
  s("archunit", "ArchUnit", "architecture-testing", ["archunit java architecture testing"]),

  // ── .NET & C# Testing Frameworks ──
  s("xunit-dotnet", "xUnit.net", "unit-testing", ["xunit", "xunit .net", "xunit c#", "xunit facts theories"]),
  s("nunit-dotnet", "NUnit", "unit-testing", ["nunit", "nunit .net", "nunit assertions"]),
  s("moq", "Moq (C# Mocking)", "mocking-library", ["moq library", "moq c#"]),
  s("fluentassertions", "Fluent Assertions (.NET)", "assertion-library", ["fluentassertions c#"]),

  // ── API Testing & Web Service Validation ──
  s("postman-api-testing", "Postman & Newman", "api-testing", ["postman", "postman collections", "postman automated tests", "newman cli", "postman test scripts"], ["high-demand", "core"]),
  s("insomnia-testing", "Insomnia REST Client", "api-testing", ["insomnia rest", "insomnia collections"]),
  s("rest-assured", "REST Assured (Java API Testing)", "api-testing", ["rest assured", "rest-assured java", "api automation rest assured"]),
  s("schemathesis", "Schemathesis", "property-testing", ["schemathesis api testing", "property-based api testing"]),
  s("karate-framework", "Karate Framework", "api-testing", ["karate bdd api testing", "karate dsl"]),

  // ── Performance, Stress & Load Testing ──
  s("k6-load-testing", "Grafana k6", "performance-testing", ["k6", "grafana k6", "k6 load testing", "k6 performance scripts", "distributed load testing k6"], ["trending", "high-demand", "core"]),
  s("apache-jmeter", "Apache JMeter", "performance-testing", ["jmeter", "jmeter load testing", "jmeter thread groups", "stress testing jmeter", "jmeter distributed testing"], ["high-demand", "core"]),
  s("gatling", "Gatling", "performance-testing", ["gatling load testing", "gatling scala", "gatling simulation"]),
  s("locust-load-testing", "Locust (Python Load Testing)", "performance-testing", ["locust", "locust load testing", "locustfile python"]),
  s("artillery-io", "Artillery.io", "performance-testing", ["artillery load testing", "artillery cloud"]),

  // ── Contract Testing & Consumer-Driven Contracts ──
  s("pact-contract-testing", "Pact (Consumer-Driven Contract Testing)", "contract-testing", ["pact", "pact contract testing", "pact broker", "microservices contract testing", "bi-directional contracts"], ["trending", "high-demand"]),
  s("spring-cloud-contract", "Spring Cloud Contract", "contract-testing", ["spring contract testing", "stub runner"]),

  // ── Visual Regression & Snapshot Testing ──
  s("percy-visual-testing", "BrowserStack Percy", "visual-regression", ["percy", "percy visual regression", "visual diff testing"]),
  s("applitools-eyes", "Applitools Eyes (AI Visual Testing)", "visual-regression", ["applitools", "visual ai applitools"]),
  s("chromatic", "Chromatic (Storybook Visual Testing)", "visual-regression", ["chromatic storybook", "component visual regression"]),

  // ── Methodologies, Test Design & Quality Engineering ──
  s("test-driven-development", "Test-Driven Development (TDD)", "methodology", ["tdd", "test driven development", "red green refactor cycle", "unit test first"], ["high-demand", "core"]),
  s("behavior-driven-development", "Behavior-Driven Development (BDD)", "methodology", ["bdd", "behavior driven development", "given when then", "cucumber bdd", "gherkin syntax", "specflow"]),
  s("test-automation-architecture", "Test Automation Framework Architecture", "test-strategy", ["page object model pom", "screenplay pattern", "data-driven testing", "keyword-driven testing", "hybrid test framework"], ["high-demand", "core"]),
  s("qa-strategy", "Quality Assurance Strategy & Test Planning", "discipline", ["qa strategy", "test plan", "test strategy", "traceability matrix", "risk-based testing", "defect lifecycle"], ["high-demand", "core"]),
  s("mutation-testing", "Mutation Testing (Stryker / Pitest)", "test-quality", ["mutation testing", "stryker mutator", "pitest java", "test suite resilience"]),
  s("code-coverage-analysis", "Code Coverage & Quality Gates", "test-quality", ["code coverage", "line coverage", "branch coverage", "istanbul nyc", "jacoco", "cobertura"]),
];
