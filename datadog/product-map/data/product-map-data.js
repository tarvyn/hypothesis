const MAT = {
  core:{c:"var(--m-core)",label:"Core · strength"},
  proven:{c:"var(--m-proven)",label:"Proven expansion"},
  contested:{c:"var(--m-contested)",label:"Contested bet"},
  option:{c:"var(--m-option)",label:"Optionality"},
};

const MATURITY = {
  scaled:{color:"var(--m-core)",label:"Scaled",score:4,max:4},
  proven:{color:"var(--m-proven)",label:"Proven",score:3,max:4},
  validated:{color:"var(--m-contested)",label:"Validated early",score:2,max:4},
  option:{color:"var(--m-option)",label:"Preview / option",score:1,max:4},
};

const POSITION = {
  leader:{color:"#2ed6a0",label:"Leader",score:5,max:5},
  strong_challenger:{color:"#4aa3e0",label:"Strong challenger",score:4,max:5},
  challenger:{color:"#f5b13f",label:"Challenger",score:3,max:5},
  niche:{color:"#a78bfa",label:"Niche",score:2,max:5},
  unproven:{color:"#6b7398",label:"Unproven",score:1,max:5},
};

const MOMENTUM = {
  improving:{color:"#2ed6a0",label:"Improving",score:3,max:3},
  stable:{color:"#4aa3e0",label:"Stable",score:2,max:3},
  watch:{color:"#f5b13f",label:"Watch",score:1,max:3},
  insufficient:{color:"#6b7398",label:"Insufficient evidence",score:null,max:3},
};

const MOAT_CONVICTION = {
  strong:{
    color:"#2ed6a0",label:"Strong",score:4,max:4,
    rationale:"Scaled adoption and multiple reinforcing mechanisms make the differentiation difficult to reproduce or displace.",
  },
  credible:{
    color:"#4aa3e0",label:"Credible",score:3,max:4,
    rationale:"Platform context and workflow integration create meaningful differentiation, though the advantage is not fully category-defining.",
  },
  emerging:{
    color:"#f5b13f",label:"Emerging",score:2,max:4,
    rationale:"The moat mechanism is plausible, but adoption, switching-cost, or durability evidence is still incomplete.",
  },
  weak:{
    color:"#ff5c8a",label:"Weak",score:1,max:4,
    rationale:"Current differentiation is mostly completeness or bundling; durable switching costs are not yet demonstrated.",
  },
};

const MOAT_MECHANISM_EXPLANATION = {
  data_gravity:"The product can benefit when the relevant telemetry is already retained in Datadog, reducing the incremental work needed to activate another use case.",
  cross_signal:"Its value can increase when logs, metrics, traces, security events, and workflow context are analyzed together instead of in separate tools.",
  integration_breadth:"Broad integrations can reduce deployment friction and make the product useful across a heterogeneous stack.",
  installed_base:"Existing Datadog customers provide a lower-friction distribution base for adoption and expansion.",
  bundle:"The product can be bought and operated as part of a broader Datadog suite rather than as another stand-alone vendor relationship.",
  workflow_lock_in:"Repeated use inside operational workflows can raise retraining, reconfiguration, and process-change costs.",
  feedback_loop:"More usage and telemetry can improve prioritization, recommendations, and the product-development feedback loop.",
  developer_habit:"Daily use inside developer workflows can create habit and make replacement disruptive.",
  platform_access:"A shared Datadog interface can become a common access layer to telemetry and actions.",
  hyperscaler_validation:"Adoption by technically demanding hyperscalers can validate capability, although it does not by itself prove broad commercial durability.",
};

const SOURCE_REGISTRY = {
  "sec-10k-2025":{
    label:"Datadog FY2025 Form 10-K",
    publisher:"Datadog / SEC",
    date:"2026-02-18",
    sourceClass:"company_audited",
    access:"public",
    url:"https://www.sec.gov/Archives/edgar/data/1561550/000162828026008819/ddog-20251231.htm",
    hoverText:"Substantially all of our revenue is from subscription software sales.",
    hoverType:"quote",
  },
  "datadog-investor-day-2026":{
    label:"Datadog Investor Day 2026",
    publisher:"Datadog Investor Relations",
    date:"2026-02-12",
    sourceClass:"company_directional",
    access:"public",
    url:"https://investors.datadoghq.com/events/event-details/investor-day-2026/",
    hoverText:"Investor Day 2026 — Feb 12, 2026 at 1:00 PM EST.",
    hoverType:"quote",
  },
  "datadog-q1-2026-call":{
    label:"Datadog FQ1 2026 earnings call",
    publisher:"Datadog Investor Relations",
    date:"2026-05-07",
    sourceClass:"company_directional",
    access:"public",
    url:"https://investors.datadoghq.com/static-files/b162f4b4-ae66-4fd2-bc41-92b4f9a877c9",
    hoverText:"Our customers' usage of AI within the Datadog platform continues to grow rapidly.",
    hoverType:"quote",
  },
  "datadog-product-site":{
    label:"Datadog product portfolio",
    publisher:"Datadog",
    date:"2026-07-24",
    sourceClass:"company_product",
    access:"public",
    url:"https://www.datadoghq.com/product/",
    hoverText:"Your servers, your clouds, your metrics, your apps, your team. Together.",
    hoverType:"quote",
  },
  "morningstar-ddog-2026":{
    label:"Morningstar Equity Analyst Report: Datadog",
    publisher:"Morningstar via IBKR",
    analyst:"Mark Giarelli",
    date:"2026-05-07",
    reportAsOf:"2026-07-18",
    sourceClass:"third_party_research",
    access:"subscriber",
    url:"https://www.interactivebrokers.com/en/pricing/research-news-services.php",
    rightsNote:"Citation-only. The report PDF is not hosted or redistributed.",
    hoverText:"We assign Datadog a Morningstar Economic Moat Rating of wide.",
    hoverType:"quote",
  },
  "reflexivity-ibkr-2026":{
    label:"Reflexivity company research: Datadog",
    publisher:"Reflexivity via IBKR",
    date:"2026-07-22",
    sourceClass:"third_party_research",
    access:"subscriber",
    url:"https://www.interactivebrokers.ie/portal/?loginType=1&action=ACCT_MGMT_MAIN&clt=0&RL=1#/quote/383858515/fundamentals/connections",
    rightsNote:"Subscriber research. Only normalized summaries and locators are used.",
    hoverText:"No verbatim source modal was captured in the IBKR extraction.",
    hoverType:"note",
  },
  "author-assessment":{
    label:"Map analyst judgment",
    publisher:"Product-map analysis",
    date:"2026-07-24",
    sourceClass:"author_judgment",
    access:"internal",
    url:null,
    hoverText:"Our analytical inference for this map. It is not a Datadog, Morningstar, or broker opinion.",
    hoverType:"note",
  },
};

const PRODUCT_SOURCES = {
  "Infrastructure Monitoring":{label:"Infrastructure Monitoring",url:"https://www.datadoghq.com/product/infrastructure-monitoring/",quote:"Complete visibility into infrastructure performance and security with easy deployment, minimal maintenance, and unmatched breadth of coverage."},
  "Log Management":{label:"Log Management",url:"https://www.datadoghq.com/product/log-management/",quote:"Collect, monitor, manage, and analyze large volumes of logs as well as unify metrics and traces."},
  "APM":{label:"Application Performance Monitoring",url:"https://www.datadoghq.com/product/apm/",quote:"Monitor service health metrics, distributed traces, and code performance with cloud-scale Application Performance Monitoring."},
  "Real User Monitoring":{label:"Real User Monitoring",url:"https://www.datadoghq.com/product/real-user-monitoring/",quote:"Real User Monitoring enables IT teams with user data and metrics to optimize frontend performance."},
  "Synthetic Testing":{label:"Synthetic Monitoring",url:"https://www.datadoghq.com/product/synthetic-monitoring/",quote:"Run API and browser tests to simulate how your systems are performing and catch issues before real users are impacted."},
  "Mobile App Testing":{label:"Mobile App Testing",url:"https://www.datadoghq.com/product/mobile-app-testing/",quote:"Create simple, no-code mobile app tests to automatically validate key user flows."},
  "Session Replay":{label:"Session Replay",url:"https://www.datadoghq.com/product/session-replay/",quote:"Capture real user sessions to uncover issues and improve experiences across web and mobile applications."},
  "Experimentation":{label:"Experiments",url:"https://www.datadoghq.com/product/experiments/",quote:"Run trusted experiments and A/B tests faster."},
  "Network Monitoring":{label:"Network Monitoring",url:"https://www.datadoghq.com/product/network-monitoring/",quote:"Full visibility into every layer of your environment—whether in the cloud, on-premise, or hybrid."},
  "Continuous Profiler":{label:"Continuous Profiler",url:"https://www.datadoghq.com/product/code-profiling/",quote:"Automatically analyze and correlate profile data with distributed traces to optimize code performance in production."},
  "Error Tracking":{label:"Error Tracking",url:"https://www.datadoghq.com/error-tracking/",quote:"Group, prioritize and resolve errors with speed and confidence."},
  "Database Monitoring":{label:"Database Monitoring",url:"https://www.datadoghq.com/product/database-monitoring/",quote:"Resolve issues and optimize inefficient query performance across entire database fleets."},
  "Cloud Cost Management":{label:"Cloud Cost Management",url:"https://www.datadoghq.com/product/cloud-cost-management/",quote:"Unify cost and performance data to empower engineers to optimize workloads and enable FinOps to reduce waste."},
  "Observability Pipelines":{label:"Observability Pipelines",url:"https://www.datadoghq.com/product/observability-pipelines/",quote:"Control costs, simplify SIEM migrations, and manage sensitive data at scale."},
  "Data Streams Monitoring":{label:"Data Streams Monitoring",url:"https://www.datadoghq.com/product/data-streams-monitoring/",quote:"Map, monitor, and troubleshoot your streaming data pipelines."},
  "LLM Observability":{label:"Agent Observability",url:"https://www.datadoghq.com/products/ai/agent-observability/",quote:"Evaluate, improve, and trace your AI agents with offline experimentation and production observability in one platform."},
  "GPU Monitoring":{label:"GPU Monitoring",url:"https://www.datadoghq.com/product/gpu-monitoring/",quote:"Monitor GPU capacity, performance, health, and cost in one place."},
  "AI Agents Console":{label:"Agent Observability",url:"https://www.datadoghq.com/products/ai/agent-observability/",quote:"Evaluate, improve, and trace your AI agents with offline experimentation and production observability in one platform."},
  "Data Observability":{label:"Data Observability",url:"https://www.datadoghq.com/products/observability/data-observability/",quote:"Detect, resolve, and optimize data quality and pipeline issues before they corrupt AI models or undermine business decisions."},
  "Cloud Security":{label:"Cloud Security",url:"https://www.datadoghq.com/product/cloud-security/",quote:"Real-time threat detection and continuous configuration audits across your entire cloud infrastructure."},
  "Code Security":{label:"Code Security",url:"https://www.datadoghq.com/product/code-security/",quote:"Improve code security posture from development to production using static and runtime testing."},
  "Cloud SIEM":{label:"Cloud SIEM",url:"https://www.datadoghq.com/product/cloud-siem/",quote:"An AI-driven threat detection and incident response platform for security operations teams."},
  "Data Security":{label:"Sensitive Data Scanner",url:"https://www.datadoghq.com/product/sensitive-data-scanner/",quote:"Discover, classify, and redact sensitive data in real time and at scale."},
  "Security: AI Guard":{label:"AI Guard",url:"https://docs.datadoghq.com/security/ai_guard/",quote:"Inspect, block, and govern AI behavior in real time."},
  "Bits AI Security Analyst":{label:"Bits Security Analyst",url:"https://www.datadoghq.com/product/ai/bits-security-analyst/",quote:"An always-on SOC analyst teammate built to handle complex threat investigations and security alerts."},
  "CI Visibility":{label:"CI Pipeline Visibility",url:"https://www.datadoghq.com/product/ci-cd-monitoring/",quote:"Monitor all your CI pipelines and tests in a single platform."},
  "Test Optimization":{label:"Test Optimization",url:"https://www.datadoghq.com/product/test-optimization/",quote:"Monitor, debug, and accelerate every test suite across your entire CI environment."},
  "Continuous Testing":{label:"Continuous Testing",url:"https://www.datadoghq.com/product/continuous-testing/",quote:"Automate software testing to accelerate application development and ship high-quality features faster."},
  "IDE Plugins":{label:"IDE Plugins",url:"https://www.datadoghq.com/product/platform/ides/",quote:"Bring live production data—resource-consuming methods, errors, open-source vulnerabilities, and more—directly into your IDEs."},
  "Feature Flags":{label:"Feature Flags",url:"https://www.datadoghq.com/product/feature-flags/",quote:"Natively integrates observability data with feature flags."},
  "Datadog MCP Server":{label:"MCP Server",url:"https://www.datadoghq.com/product/ai/mcp-server/",quote:"Connect AI agents to observability data with real-time telemetry and within security and governance controls."},
  "Bits AI Dev Agent":{label:"Bits Code",url:"https://www.datadoghq.com/product/ai/bits-code/",quote:"Resolve production issues faster with autonomous, AI-generated code fixes grounded in your observability data."},
  "On-Call":{label:"Incident Response",url:"https://www.datadoghq.com/product/incident-response/",quote:"Manage on-call schedules, alerts, and incident response with Datadog."},
  "Incident Management":{label:"Incident Response",url:"https://www.datadoghq.com/product/incident-response/",quote:"Manage on-call schedules, alerts, and incident response with Datadog."},
  "Event Management":{label:"Event Management",url:"https://www.datadoghq.com/product/event-management/",quote:"Transform alert fatigue into actionable insights and accelerate remediation with automated event correlation."},
  "Resource Catalog":{label:"Software Catalog",url:"https://www.datadoghq.com/product/software-catalog/",quote:"A central hub for engineering knowledge about software ownership, dependencies, versions, on-call coverage, performance, and security posture."},
  "Internal Developer Portal":{label:"Internal Developer Portal",url:"https://www.datadoghq.com/product/internal-developer-portal/",quote:"Ship quickly and confidently with developer self-service, delivery guardrails, and live system data."},
  "Workflow Automation":{label:"Workflow Automation",url:"https://www.datadoghq.com/product/workflow-automation/",quote:"Automate remediation processes across your tech stack and quickly respond to alerts, incidents, and security threats."},
  "App Builder":{label:"App Builder",url:"https://www.datadoghq.com/product/app-builder/",quote:"Turn observability insights into action with custom apps built to accelerate remediation and drive collaboration."},
  "Bits AI SRE Agent":{label:"Bits Investigation",url:"https://www.datadoghq.com/product/ai/bits-investigation/",quote:"An AI SRE agent grounded in thousands of real-world incidents, identifying root causes faster."},
  "Product Analytics":{label:"Product Analytics",url:"https://www.datadoghq.com/product/product-analytics/",quote:"Get data-driven insights into user behavior and product usage to improve user experiences and product outcomes."},
};

const ENTITY_TYPES = {
  product:{label:"Product"},
  product_family:{label:"Product family"},
  capability:{label:"Capability"},
  interface:{label:"Interface / surface"},
  solution:{label:"Solution / use case"},
  platform_primitive:{label:"Platform primitive"},
  deployment:{label:"Deployment model"},
  enabler:{label:"GTM / compliance enabler"},
};

const DATA = [
 {
  id:"obs", color:"var(--obs)", catName:"Observability",
  gart:"Gartner · <b>Enterprise Infrastructure Software</b>",
  anchor:{val:"$28B", none:false, conf:"f", scope:"category", lab:"Market TAM · 2026E · Gartner"},
  suites:[
   {name:"Core (3 pillars)", pos:"Leader", mat:"core", products:[
    {n:"Infrastructure Monitoring", arr:">$1.6B ARR",
     what:"Tracks the health of everything your code runs on — servers, VMs, containers, Kubernetes pods, cloud services — as live metrics (CPU, memory, disk, network, uptime), with 800+ ready-made integrations.",
     ex:"A Kubernetes node quietly runs out of memory at 2am. It shows the pod restarts and the memory-climb graph and pages you before customers ever see 500 errors.",
     why:"You can't run cloud systems blind, so this is usually the first Datadog product a company buys. Pricing is usage-linked (per host), but through a mix of annual and multi-year subscriptions, committed usage, monthly usage, and overages — so growing workloads create an expansion vector rather than automatic revenue: customers can and do optimize usage, renegotiate commitments, and change architecture.",
     edge:"Datadog is the clear leader. The advantage is breadth plus a single pane: one agent, hundreds of integrations, and metrics/traces/logs correlated together — versus stitching separate tools. It competes with the hyperscalers' own tools (CloudWatch, Azure Monitor) and Dynatrace/New Relic; the hyperscalers are cheaper and 'good enough' for single-cloud shops, which caps how much Datadog can charge."},
    {n:"Log Management", arr:">$1.0B ARR",
     what:"Ingests, stores, and makes searchable every log line your systems emit — app logs, access logs, errors — from thousands of services, with fast full-text search.",
     ex:"A checkout fails intermittently. You search all logs for that one request ID across every microservice in a single query, instead of SSH-ing into ten machines to grep.",
     why:"Logs are where the 'why' of a problem lives, and having them beside your metrics and traces — click from a slow trace straight to its logs — is a huge time-saver in an incident. Log volume grows with usage, making it a strong expansion line.",
     edge:"Leader, but the most price-pressured of the three pillars: logs are expensive to store, and cheaper options (Grafana Loki, Elastic, OpenSearch) compete hard on cost. Datadog's answer is tiered storage — ingest everything, index only what you need (Flex Logs, itself approaching $100M ARR) — plus the value of having logs correlated with the rest of the platform. You pay a premium for the correlation, not the storage. BYOC (Bring Your Own Cloud)-style deployment, where data stays in the customer's own storage, further defuses the cost objection at some margin cost."},
    {n:"APM", arr:"APM+DEM >$1B ARR",
     what:"Application Performance Monitoring (APM) uses distributed tracing to follow one request across every service, function, and database call in your backend and show exactly where the time went.",
     ex:"An endpoint is slow. The flame graph reveals the request spent 2.4s on a single N+1 query buried three services deep — you see the exact span, not just 'the service is slow.'",
     why:"In microservices, 'which service is slow' is genuinely hard, and APM answers it in seconds — mapping directly to developer productivity and to customer-facing latency. It's the natural upsell on top of Infrastructure Monitoring.",
     edge:"Strong leader — and still compounding: core APM growth re-accelerated into the mid-30% range as of the latest quarters. The moat is that APM data is most useful stitched to your infra metrics and logs — which Datadog already holds. It competes with Dynatrace, New Relic, and open-source stacks built on OpenTelemetry (Grafana Tempo, Honeycomb). OpenTelemetry is the thing to watch: as instrumentation becomes a vendor-neutral standard, it lowers switching costs and lets cheaper backends compete — a slow threat to APM's stickiness."},
   ]},
   {name:"Digital Experience Monitoring", pos:"Challenger", mat:"proven", products:[
    {n:"Real User Monitoring", border:true,
     what:"Captures what real users actually experience in the browser or mobile app — load time, Core Web Vitals, JS errors, slow resources, rage clicks — tied to individual real sessions.",
     ex:"Users on Safari in Spain say the app 'feels slow.' RUM shows their LCP is 4s because one image CDN is slow only in that region — invisible to your backend metrics.",
     why:"Backend dashboards can be all-green while users still suffer from slow client rendering or bad networks. RUM closes that gap and connects frontend pain to the backend trace behind it. This is your world already.",
     edge:"Good, but not the dominant name — it competes with New Relic Browser, Dynatrace, and specialists, while Google's free Web Vitals tooling sets a low price floor. Datadog's edge is linking a slow RUM session straight to its backend APM trace, front-to-back in one click, which point tools can't. Position is 'strong attach to APM,' not category leadership."},
    {n:"Synthetic Testing", border:true,
     what:"Scripted robots that act like users on a schedule — load your login page, run a checkout, hit an API — from locations worldwide, alerting when something breaks or slows.",
     ex:"Every minute from five regions a robot logs in and adds an item to cart. At 3am it fails from Frankfurt, paging you about a regional outage before any real user is awake to hit it.",
     why:"It catches problems in quiet hours and validates critical flows continuously, not just when a user happens to try — and gives uptime Service-Level Agreements (SLAs) real teeth. It pairs with RUM: real users plus proactive checks.",
     edge:"Competes with Pingdom, Checkly, Grafana Synthetic Monitoring. Standalone synthetics is commoditized and price-sensitive; Datadog's advantage is that a failing test drops you straight into the APM trace and infra metrics of the failing request. The value is the integration, not the checks themselves."},
    {n:"Mobile App Testing", border:true,
     what:"Automated end-to-end tests for iOS/Android apps, run on real devices, checking that key flows still work across OS versions and hardware.",
     ex:"After an iOS update, the test catches that your login button stopped responding on iPhone 15 — before your users start filing crash reports.",
     why:"Mobile fragmentation (many devices and OS versions) makes manual testing impractical; automated device testing catches breakage early. It extends synthetics into the mobile world.",
     edge:"A niche completeness feature within DEM, competing with device farms (BrowserStack, Sauce Labs). It exists so mobile-heavy customers don't need a separate vendor — not a market-leading product on its own."},
    {n:"Session Replay", border:true,
     what:"Reconstructs and replays a user's session as a video-like timeline — every click, scroll, and page, with the DOM rebuilt — so you can watch exactly what happened.",
     ex:"A user reports 'the form wouldn't submit.' You replay their session and see a validation error hidden below the fold that never scrolled into view.",
     why:"It turns vague bug reports into reproducible sequences and reveals UX friction (dead clicks, confusion) that metrics miss — bridging debugging and product research.",
     edge:"Competes with FullStory, Hotjar, LogRocket, and Microsoft Clarity (free). On its own it's a contested, partly-commoditized space; Datadog's version earns its place by linking a replay to the technical errors and traces behind it — a frontend-plus-backend view point tools lack."},
    {n:"Experimentation", border:true,
     what:"Runs A/B and multivariate tests — serve variant A to half your users and B to the other half, then measure which drives the target metric — driven by feature flags with the statistics built in.",
     ex:"You test a green vs. blue 'Buy' button; it reports green lifts conversion 3% with statistical significance, so you ship it to everyone.",
     why:"It replaces opinion-based product decisions with measured ones and reuses the flagging infrastructure teams already have. A natural extension of feature flags into decision-making.",
     edge:"Launched to general availability as 'Datadog Experiments' in 2026 — competes with Optimizely, LaunchDarkly, Statsig, and Amplitude Experiment. Datadog's angle is that experiments tied to full observability plus product analytics can measure not just conversion but the performance and error impact of a change, with observability guardrails on every rollout. Newly GA; still a challenger against entrenched experimentation platforms."},
   ]},
   {name:"Wider Observability", pos:"Leader", mat:"proven", products:[
    {n:"Network Monitoring",
     what:"Maps how traffic flows between your services, containers, hosts, and cloud regions — latency, throughput, dropped packets, DNS issues between any two points.",
     ex:"Two services intermittently time out. It shows packet loss on a specific cross-availability-zone path — the application code was never the problem.",
     why:"'The app is slow' is often really a network problem, and networks are usually a blind spot for app teams — this saves hours of blaming the wrong layer. It adds revenue with no new sales motion; it's an add-on to existing infra customers.",
     edge:"Part of the land-and-expand engine. It competes with network specialists (Kentik, ThousandEyes) but wins by living inside the same platform, so app teams — not just network teams — can actually use it. Not a standalone battleground; this is expansion revenue."},
    {n:"Continuous Profiler",
     what:"Continuously samples a running process in production to show which exact functions and lines burn CPU, memory, and I/O — always on, with negligible overhead.",
     ex:"A service's cloud bill is high. The profiler shows 30% of CPU is spent in a JSON-serialization call inside a hot loop — pointing you at a one-line fix.",
     why:"APM finds the slow service; the profiler finds the slow line inside it, closing the last mile to an actual code fix and often cutting compute cost directly. High value for performance-sensitive teams.",
     edge:"A genuine differentiator — always-on production profiling is technically hard and few do it well, and it complements APM tightly. It competes with Pyroscope (now Grafana) and language-specific profilers, but Datadog's is production-grade and integrated. A quiet moat-builder."},
    {n:"Error Tracking",
     what:"Collects exceptions and crashes, then groups and de-duplicates them so thousands of identical errors become one issue with a count, stack trace, affected-user count, and trend.",
     ex:"A bad deploy throws 50,000 null-pointer errors. It shows one new issue spiking since 14:32, tied to the release — so you know exactly what to roll back.",
     why:"Raw error logs are noise; grouped errors are a to-do list telling you what's newly broken, how bad, and for whom. It's the daily triage tool for engineers — you know this from Sentry.",
     edge:"Directly competes with Sentry, Bugsnag, and Rollbar — entrenched tools many devs love. Datadog's pitch is 'your traces and logs already live here, so errors belong here too, fully correlated.' It's more a consolidation play (replace Sentry, cut tool sprawl) than a clear feature win — Sentry is a real, sticky competitor, which is why this leans challenger."},
    {n:"Database Monitoring",
     what:"Deep monitoring of your databases specifically — slow queries, lock contention, query plans, and load per query, beyond what generic infra metrics show.",
     ex:"APM flags a slow DB call. This shows the exact SQL, that it's doing a full table scan, and that one index would fix it.",
     why:"Databases are the most common backend bottleneck and the scariest to touch; this lets non-DBAs find and fix query problems safely. A natural upsell for any data-heavy app.",
     edge:"Add-on expansion revenue, competing with SolarWinds DPA, Percona, and cloud-native DB insights. It wins by connecting the slow query straight to the APM trace that triggered it. Not a fought-over category for Datadog — it's platform completeness."},
    {n:"Cloud Cost Management",
     what:"Maps your cloud bill onto what's actually running — attributing spend to specific teams, services, features, or containers, in the same place you see their performance.",
     ex:"The AWS bill jumps 20%. It shows one team's new service running oversized instances at 8% utilization — fixable waste, tied to a name.",
     why:"Cloud cost (FinOps) is a boardroom topic, and most teams can't tie spend to engineering decisions. Putting cost next to performance lets teams trade 'faster' against 'cheaper' with real numbers — and expands Datadog's buyer into finance.",
     edge:"Newer and contested — competes with CloudHealth, Apptio Cloudability, Kubecost, and AWS's own cost tools. Datadog's edge is uniquely combining cost with the utilization and performance data it already has (cost-per-request, not just cost-per-resource). Promising, not yet a category leader."},
    {n:"Observability Pipelines",
     what:"A processing layer between your systems and your storage that lets you filter, transform, redact, and route telemetry before it's stored — so you control volume and cost.",
     ex:"80% of your logs are health-check noise. The pipeline drops them before ingestion, redacts credit-card numbers, and sends a copy to cheap archive storage — cutting the bill without losing what matters.",
     why:"Telemetry volume and its cost are exploding; this gives teams a central valve for cost and compliance. Strategically, it also lets Datadog answer the 'your bill is too high' objection instead of losing the data.",
     edge:"Competes with Cribl (the category leader) and open-source Vector — which Datadog owns, having acquired it, giving it real credibility here. Interesting because it both defends against cost complaints and keeps Datadog in the data path even for data headed elsewhere."},
    {n:"Data Streams Monitoring",
     what:"Tracks data flowing through message queues and streams (Kafka, RabbitMQ, SQS) — lag, throughput, and exactly where messages back up or get lost across the pipeline.",
     ex:"Orders are processing late. It shows one Kafka consumer group lagging 40,000 messages behind because a downstream service can't keep up.",
     why:"Event-driven architectures are common and their failures are invisible to normal APM (the problem is 'stuck in a queue,' not 'a slow endpoint'). It fills a real blind spot for modern backends.",
     edge:"Niche but differentiated — few competitors do end-to-end stream lineage well. Expansion revenue for customers with event-driven systems, tightly integrated with APM. Not a standalone market fight."},
   ]},
   {name:"Datadog for AI", pos:"Emerging", mat:"option", products:[
    {n:"LLM Observability", ai:true,
     what:"Monitoring purpose-built for apps that call large language models — tracing every prompt and response, tracking token cost and latency, and flagging quality problems like hallucinations or prompt injection.",
     ex:"Your support chatbot starts giving wrong answers. It shows a prompt-template change doubled the hallucination rate and tripled token cost per conversation.",
     why:"LLM apps fail in new, fuzzy ways (nondeterministic output, runaway cost) that classic APM wasn't built for, and anyone shipping AI features needs this. Adoption is exploding — the highest-growth corner of the portfolio.",
     edge:"A high-potential land grab against fast-moving specialists: Arize, LangSmith, Weights and Biases, Helicone. Datadog's advantage is that AI features live inside real apps it already monitors, so model traces sit beside the rest of the system. But the space is new, crowded, and standards are unsettled — real upside, real uncertainty."},
    {n:"GPU Monitoring", ai:true,
     what:"Monitors the GPUs powering AI/ML workloads — utilization, memory, temperature, bottlenecks — so you know whether your very expensive silicon is working or stalling.",
     ex:"A training job is slow and costing thousands a day. It shows the GPUs are only 30% utilized because the data-loading pipeline can't feed them fast enough.",
     why:"GPUs are scarce and extremely expensive, so wasted GPU time is wasted money — and the need grows with every AI workload. It ties into the same cost story as FinOps.",
     edge:"Generally available since Q1-2026 and no longer just a bet: major hyperscalers are adopting Datadog for GPU/observability in AI-training environments — a break from their historical in-house builds. Competes with NVIDIA's own tooling and ML-platform observability. Still early in revenue terms, but the strategic signal (hyperscalers as customers) is unusually strong for a product this young."},
    {n:"AI Agents Console", ai:true,
     what:"Observability for autonomous AI agents — visualizing the multi-step reasoning and actions an agent takes, so you can see what it decided, which tools it called, and where it went wrong.",
     ex:"A customer-service agent issues a refund it shouldn't. The console shows the exact step and reasoning chain that led there.",
     why:"As companies deploy agents that act on their own, 'why did it do that?' becomes critical for trust, safety, and debugging — exactly the observability problem, one layer up. It anchors Datadog's whole 'observe autonomy' thesis.",
     edge:"Very early, aligned with the CTO's vision that observability is the control layer for AI autonomy; competitors are nascent. Pure optionality — potentially significant if agents go mainstream, negligible if they don't."},
    {n:"Data Observability", ai:true, border:true,
     what:"A suite (not a single product): Data Quality Monitoring plus Jobs Monitoring, with catalog and lineage capabilities. Together they watch the health of data flowing through pipelines and warehouses — missing values, schema changes, freshness/staleness, volume anomalies, and failing pipeline jobs. Adjacent to (but distinct from) Data Streams Monitoring, which tracks the transport layer (queues/streams) rather than data quality.",
     ex:"A dashboard shows revenue at zero. It reveals an upstream table stopped updating overnight because a schema change broke ingestion — the data is wrong, not the business.",
     why:"Bad data silently corrupts analytics and AI models ('garbage in, garbage out'); catching it early prevents wrong decisions. Increasingly essential as companies depend on data and ML.",
     edge:"New for Datadog and adjacent to a distinct market led by Monte Carlo and Bigeye — a border case between observability and data-quality. A reasonable extension since Datadog sees the pipelines, but it's an entrant here, not a leader."},
   ]},
  ]
 },
 {
  id:"sec", color:"var(--sec)", catName:"Security",
  gart:"Gartner · <b>Information Security</b>",
  anchor:{val:"—", none:true, conf:"n", scope:"category", lab:"TAM not separately isolated"},
  suites:[
   {name:"Security suite", pos:"Challenger", mat:"contested", products:[
    {n:"Cloud Security",
     what:"Continuously scans your cloud environment for misconfigurations, risky permissions, and active threats — a public S3 bucket, an over-privileged role, an exposed database, suspicious API calls.",
     ex:"Someone spins up a database open to the whole internet. Cloud Security flags it within minutes and shows the blast radius — what data it holds and who can reach it.",
     why:"Most cloud breaches come from misconfiguration, not exotic hacks, so security teams need continuous visibility into a constantly-changing cloud. Putting it beside the ops data means dev and security see the same picture. This is Datadog's biggest security bet.",
     edge:"Competes head-on with Wiz (the breakout leader, now Google-owned), Palo Alto Prisma, and CrowdStrike. Datadog's edge is that the security team sees the same real-time infra and app telemetry ops does — one platform, shared context. But Wiz is a fast-growing, formidable incumbent, so Datadog is a genuine challenger here in a live land-grab, not the leader."},
    {n:"Code Security",
     what:"Scans your source code and its open-source dependencies for known vulnerabilities and insecure patterns, flagging them in the pipeline and in production.",
     ex:"A library you depend on gets a critical CVE. It tells you which of your services actually call the vulnerable function — not just which import the package — so you fix what truly matters.",
     why:"Most modern code is other people's dependencies, and their vulnerabilities become yours; catching issues in the PR/CI stage is far cheaper than after a breach. It bridges dev and security.",
     edge:"Competes with Snyk (the category leader devs love), GitHub Advanced Security, and Checkmarx. Datadog's differentiator is runtime context — it knows which vulnerable code is actually running and reachable in production, cutting false-positive noise. Strong idea, but Snyk and GitHub are entrenched in the developer workflow, so this stays a challenger."},
    {n:"Cloud SIEM", border:true,
     what:"A security-analytics layer that ingests security-relevant logs and events from across your stack, correlates them, and raises alerts on attack patterns — the SOC analyst's detection dashboard.",
     ex:"It ties a suspicious login, a permission change, and an unusual data download into one 'possible account takeover' alert, instead of three unrelated log lines.",
     why:"Security teams must detect threats across everything, and traditional SIEMs are notoriously expensive and painful. Datadog's angle: you're already sending logs here, so detection can ride the same pipeline — cutting tool and cost sprawl.",
     edge:"Competes with Splunk (the incumbent giant), Microsoft Sentinel, and Elastic Security. It's a border case — SIEM is essentially log management pointed at security, which is Datadog's home turf, so there's real synergy. But established SIEMs own security-team mindshare and compliance depth; Datadog is an efficient challenger, strongest with customers already all-in on its logs."},
    {n:"Data Security",
     what:"Discovers where sensitive data (PII, secrets, credentials) lives across your systems and flags when it's exposed or mishandled.",
     ex:"It detects that an API is accidentally logging full credit-card numbers into your log stream — and alerts you before that becomes a compliance violation.",
     why:"You can't protect data you don't know you have; discovery plus monitoring reduces breach and compliance risk. It complements the rest of the security suite.",
     edge:"Adjacent to the data-security-posture space (BigID, Cyera). For Datadog it's more a suite-completeness feature than a lead product — it makes the security bundle more compelling rather than winning on its own."},
    {n:"Security: AI Guard", ai:true,
     what:"Runtime guardrails for AI features — inspecting prompts and model actions to block prompt injection, data leakage, and unsafe or unauthorized actions by an AI.",
     ex:"A user tries to jailbreak your chatbot into revealing another customer's data. AI Guard detects the injection pattern and blocks the response.",
     why:"AI features open brand-new attack surfaces that classic security tools don't cover; as companies ship AI, they need protection built for it. It rides the AI and security waves at once.",
     edge:"Very new, part of an emerging category (Lakera, Protect AI). A forward bet that 'AI security' becomes standard — small today, clearly on-trend."},
    {n:"Bits AI Security Analyst", ai:true,
     what:"An AI agent that investigates security alerts the way a senior SOC analyst would — pulling context, correlating signals, explaining what likely happened, and delivering a verdict with next steps. Generally available since March 2026 as part of Cloud SIEM, and also offered as a standalone agent deployable in other SIEMs.",
     ex:"An alert fires at 2am. Instead of paging a human, the agent gathers related logs and changes, writes 'likely a compromised API key from this IP,' and recommends revoking it — Datadog claims investigation time cut by up to 98%.",
     why:"Security teams are drowning in alerts and short-staffed; an agent that triages and explains saves scarce analyst time. Part of Datadog's 'AI teammate' story — and the standalone-in-any-SIEM option is a notable wedge into competitors' installed bases.",
     edge:"An AI layer over the security suite — assess it as an amplifier that makes the whole bundle stickier, not a standalone product. It competes with AI-SOC startups and hyperscaler SIEM copilots, and its value depends on the underlying security data being good. The 98%/30-second claims are vendor-stated, not independently verified."},
   ]},
  ]
 },
 {
  id:"dev", color:"var(--dev)", catName:"Software Delivery & Service Management",
  gart:"Gartner · <b>Enterprise Application Software</b>",
  anchor:{val:"—", none:true, conf:"n", scope:"category", lab:"TAM not separately isolated"},
  suites:[
   {name:"Software Delivery", pos:"Challenger", mat:"contested", products:[
    {n:"CI Visibility",
     what:"Monitors your CI/CD pipelines the way APM monitors an app — build duration, failure rates, flaky tests, and queue times across every run.",
     ex:"Your builds crept from 8 to 25 minutes. It shows one test stage is the culprit and is flaky 12% of the time, wasting hours of engineers waiting.",
     why:"Slow, flaky pipelines silently tax every engineer every day, and most teams have no visibility into why. This turns CI from a black box into something measurable — and pulls Datadog earlier into the dev lifecycle, before production.",
     edge:"A newer space, competing with GitHub's and CircleCI's own analytics and point tools. Datadog's edge is treating pipeline data as just another observability signal, in the same platform as prod. It expands the footprint from 'runtime' into 'build time' — promising, but not yet a must-have leader."},
    {n:"Test Optimization",
     what:"Analyzes test suites to make them faster and more trustworthy — spotting slow, flaky, and redundant tests and recommending what to fix or skip.",
     ex:"It finds 15 flaky tests cause 80% of your false CI failures, and that some tests only need to run when related files change — cutting CI time in half.",
     why:"Flaky and slow tests destroy trust in CI and waste enormous developer time, so targeting them has an outsized payoff. Directly relatable pain for any dev team.",
     edge:"Emerging and overlapping with CI Visibility; competes with specialized flaky-test tools. Value scales with org size. A differentiator within the delivery suite rather than a standalone market leader."},
    {n:"Continuous Testing",
     what:"Runs browser and end-to-end tests at scale, across environments and in parallel, as part of the release pipeline — reusing the same tech as Synthetic Testing.",
     ex:"On every deploy it runs your critical user journeys across browsers in parallel and gates the release if a key flow breaks.",
     why:"Automated pre-release testing catches regressions before users do, and running it in the pipeline makes 'tested' the default, not a manual step. It links testing to the same platform that watches production.",
     edge:"Competes directly with Cypress Cloud, BrowserStack, and Sauce Labs, and indirectly with in-house testing stacks built around Playwright. Datadog's angle is managed execution, codeless authoring, and unifying synthetics, testing, and production monitoring so one test artifact spans pre-prod and prod. A tooling-rich, contested space; Datadog competes on consolidation rather than replacing Playwright itself."},
    {n:"IDE Plugins",
     what:"Brings Datadog's production signals into your editor (VS Code, JetBrains) — the errors, slow spans, and security issues attached to the exact function you're viewing.",
     ex:"While editing a service you see inline that this method throws the most errors in prod and its p99 latency spiked yesterday — context you'd otherwise hunt for in a dashboard.",
     why:"It puts production reality where developers actually work, shortening the loop between writing code and seeing how it behaves live. An adoption-and-stickiness play.",
     edge:"Not a market of its own — a convenience layer that deepens developer engagement. Its strategic value is habit formation: the more Datadog lives in the IDE, the harder it is to displace."},
    {n:"Feature Flags",
     what:"Turn features on or off — globally, per segment, or for a percentage — without a redeploy, with an instant kill-switch.",
     ex:"You release a risky checkout to 5% of users, watch its error rate and conversion in Datadog, then ramp to 100% or kill it instantly if metrics dip — no redeploy either way. You know this one.",
     why:"Flags decouple deploy from release, enabling safe gradual rollouts and instant rollback — core to modern shipping. Datadog's twist: the flag sits next to the metrics that tell you if the rollout is healthy.",
     edge:"Competes directly with LaunchDarkly (the clear leader), Split, and open-source options. Datadog is a late entrant whose only real edge is bundling flags with the observability data that judges a rollout. A genuine challenger — LaunchDarkly owns the mindshare."},
    {n:"Datadog MCP Server", ai:true,
     what:"An adapter implementing the Model Context Protocol so AI assistants can query your Datadog data in natural language — an agent can ask 'what's erroring in prod right now?' and get real, live answers.",
     ex:"From your AI coding assistant you ask 'why did checkout latency spike this morning?' and it pulls the actual Datadog traces to answer.",
     why:"It makes Datadog's data usable by the emerging wave of AI agents, keeping Datadog relevant as AI becomes the interface to tooling. Strategically important for staying in the workflow.",
     edge:"Generally available since Q1-2026 with management citing rapidly growing adoption — but note the two-edged nature: it also opens Datadog's data to frontier AI models, which could let an outside agent plus a thin layer capture value Datadog would rather keep. The single most important item to watch for the moat."},
    {n:"Bits AI Dev Agent", ai:true,
     what:"An AI coding assistant wired into your live telemetry — it can read real production errors, traces, and metrics to help write, debug, and fix code with actual runtime context.",
     ex:"Given a production error, it proposes a fix informed by the real stack trace and the input that triggered it — not just a guess from reading the source.",
     why:"Assistants that know how your code behaves in production, not just how it reads, can fix real problems. Part of the 'AI teammate' and 'close the software loop' thesis.",
     edge:"Competes directly with Sentry Seer in production-aware debugging and remediation, and indirectly with general-purpose coding agents including OpenAI Codex, Anthropic Claude Code, GitHub Copilot, Cursor, and GitLab Duo. Bits AI Dev differentiates by starting from live Datadog telemetry, identifying production issues autonomously, and carrying the workflow through root-cause analysis, tested code changes, and a pull request. Datadog MCP also makes external coding agents potential complements, weakening the exclusivity of this advantage."},
   ]},
   {name:"Service Management", pos:"Challenger", mat:"contested", products:[
    {n:"On-Call",
     what:"Manages who gets alerted when something breaks — on-call schedules, rotations, escalation policies, and multi-channel alerting (push, SMS, phone).",
     ex:"A critical alert fires; it pages the primary engineer, and if they don't acknowledge in 5 minutes, escalates automatically to the secondary and then the manager.",
     why:"Alerts are useless if they don't reach the right person fast; on-call management is essential ops plumbing. Datadog's pitch: the alert and the data behind it live in one place, so responders don't tool-hop.",
     edge:"Competes directly with PagerDuty (the category-defining leader) and Opsgenie. Datadog is a newer entrant whose edge is bundling — no separate alerting tool, and the alert fires with full context attached. A real challenger to entrenched PagerDuty, winning mostly where customers want to consolidate."},
    {n:"Incident Management",
     what:"Coordinates the whole response to an outage — declare an incident, auto-create a chat channel and bridge, assign roles, track a timeline, and generate the post-mortem.",
     ex:"A severity-1 hits: one click declares the incident, spins up the Slack war-room, starts the timeline, and later exports a post-mortem draft with events pre-filled.",
     why:"In a real outage, coordination chaos costs time and money; a structured process shortens downtime and improves the learning afterward. It naturally belongs where the incident's data already is.",
     edge:"Competes with incident.io, FireHydrant, PagerDuty, and Atlassian. Datadog's advantage is that the incident is born attached to the monitors and traces that detected it. A consolidation play against focused incident-tooling startups."},
    {n:"Event Management",
     what:"Aggregates the flood of alerts and events from every tool into one stream and intelligently reduces noise — correlating and de-duplicating so a storm of related alerts becomes one signal.",
     ex:"A single database failure triggers 200 downstream alerts; Event Management collapses them into one root-cause event instead of paging everyone 200 times.",
     why:"Alert fatigue is a genuine operational hazard; noise reduction keeps teams responsive to what matters. It's core to making the rest of the alerting stack usable.",
     edge:"Competes with AIOps/event-correlation tools (BigPanda, Moogsoft). Datadog's edge is doing correlation on data it already holds end-to-end. A capability that strengthens the ops bundle more than a standalone win."},
    {n:"Resource Catalog",
     what:"An automatically-maintained inventory of all your services — what exists, which team owns each, dependencies, tier, and health.",
     ex:"An incident hits an unfamiliar service. The catalog instantly tells you who owns it, what it depends on, and what depends on it — so you know who to call and what's at risk.",
     why:"In large orgs nobody knows the whole system; a live catalog answers 'what do we run and who owns it,' foundational for ops, security, and onboarding. Increasingly expected in platform engineering.",
     edge:"Overlaps with internal developer portals — Backstage (the open-source standard from Spotify) and Cortex/OpsLevel. Datadog's edge is auto-population from real telemetry rather than manual upkeep, which is Backstage's weakness. Solid within the platform-engineering trend, but competing with a very popular free option."},
    {n:"Internal Developer Portal",
     what:"A self-service layer that lets developers provision services, environments, and resources themselves within guardrails — instead of filing tickets to ops.",
     ex:"A developer clicks to scaffold a new service with monitoring, CI, and permissions pre-wired to company standards — minutes instead of a multi-day ops request.",
     why:"Platform engineering (self-service plus guardrails) is a major trend for scaling engineering without scaling ops headcount. It positions Datadog inside that movement.",
     edge:"Competes with Backstage-based platforms, Humanitec, and Port. It's Datadog extending from 'observe' into 'operate and provision' — newer territory, ambitious, and not a stronghold. An emerging bet."},
    {n:"Workflow Automation",
     what:"Build automated runbooks — 'when X alert fires, run these steps' — to remediate common issues without a human, using a library of integrations and actions.",
     ex:"When a disk-full alert fires, a workflow automatically clears temp files, expands the volume, and posts the result to Slack — nobody paged at all.",
     why:"Auto-remediation cuts toil and mean-time-to-resolution for known problems, freeing engineers for real work. It's the action layer that makes observability actionable.",
     edge:"Competes with Rundeck, PagerDuty's automation, and general workflow tools. Datadog's edge is triggering automations directly off its own monitors with full context. It strengthens the 'detect → decide → act' story underpinning the autonomy thesis."},
    {n:"App Builder",
     what:"A low-code tool to build small internal apps and UIs on top of Datadog's data and actions — dashboards that do things, not just display.",
     ex:"Build a one-page tool where support staff can look up a customer's status and trigger a safe remediation, backed by Datadog data, without a full dev project.",
     why:"Teams constantly need small custom internal tools, and building them on existing Datadog data and actions is faster than from scratch. It extends the platform beyond monitoring.",
     edge:"Newer, adjacent to low-code/internal-tool builders (Retool). A completeness and stickiness feature that deepens platform lock-in more than it competes as a product. Optionality."},
    {n:"Bits AI SRE Agent", ai:true,
     what:"An AI on-call teammate: when an alert fires, it investigates like a site-reliability engineer — checking metrics, logs, traces, and recent deploys — then proposes the likely root cause and a fix.",
     ex:"An alert fires for high latency; the agent correlates it to a deploy 20 minutes earlier, identifies the offending change, and suggests a rollback — before a human has opened the laptop.",
     why:"Root-cause analysis at 2am is slow, stressful, and expert-dependent; an agent that does the first-pass investigation compresses downtime and reduces reliance on a few senior engineers. It's the centerpiece of Datadog's 'AI advantage' pitch, trained on real developer fix outcomes wrapped as evals.",
     edge:"The most important AI product to watch. Its potential moat is the data-plus-eval feedback loop (proprietary telemetry plus real fix outcomes) — but the model itself isn't the moat, and its edge depends on that loop actually compounding and not being commoditized by frontier models reaching the same data via MCP. High strategic weight, unproven magnitude."},
   ]},
  ]
 },
 {
  id:"pa", color:"var(--pa)", catName:"Product Analytics",
  gart:"Gartner · <b>Enterprise Application Software</b>",
  anchor:{val:"—", none:true, conf:"n", scope:"category", lab:"TAM not separately isolated"},
  suites:[
   {name:"Product Analytics", pos:"Emerging", mat:"option", products:[
    {n:"Product Analytics",
     what:"Measures how users actually move through your product — funnels, retention curves, feature adoption, drop-off points — so product teams decide from behavior, not opinion.",
     ex:"You see 60% of new users drop at step 3 of onboarding, and that users who try feature X in week one retain twice as long — directing what to fix and what to promote.",
     why:"Product teams need to know what's working to prioritize well, and behavioral analytics is how modern product decisions get made. For Datadog it's the seed of a whole new category and a new buyer — product managers, not just engineers.",
     edge:"New and contested against entrenched, beloved tools: Amplitude, Mixpanel, PostHog, Heap. Datadog's angle is that behavioral data beside performance and error data shows whether a feature is failing because it's confusing or because it's slow/broken. Genuinely early — a small, unproven line against strong incumbents. Pure optionality."},
    {n:"Session Replay", border:true,
     what:"Reconstructs and replays a user's session so you can watch how they navigated — the same tool that appears under Digital Experience Monitoring.",
     ex:"A user churns at a paywall; you replay their session and see they couldn't find the plan-selector on mobile.",
     why:"Watching real sessions turns behavioral metrics into concrete UX insight, which is why it sits in Product Analytics as much as in monitoring.",
     edge:"Same competitive picture as under DEM (FullStory, Hotjar, Microsoft Clarity). It's listed here because behavior — not just debugging — is the main use case, and it's a clear border product between the two categories."},
    {n:"Experimentation", border:true,
     what:"A/B testing to prove which version of a feature performs better — also listed under Digital Experience Monitoring.",
     ex:"You test two onboarding flows and measure which lifts week-one retention, then ship the winner.",
     why:"Experiments are a core product-analytics workflow — the rigorous way to turn a product hypothesis into a measured decision.",
     edge:"Competes with Optimizely, Statsig, and Amplitude Experiment. A border product with DEM; it lives here because experimentation is fundamentally a product-decision tool, not a monitoring one."},
   ]},
  ]
 },
];

const TRACTION = {
  "Infrastructure Monitoring":{scope:"Product",text:"> $1.6B ARR. Expansion vectors cited include Storage Management, Kubernetes autoscaling and GPU monitoring design partnerships."},
  "Log Management":{scope:"Product",text:"> $1B ARR; Flex Logs is approaching $100M ARR. Reflexivity links the product to nearly 100 enterprise consolidation wins and to Cloud SIEM efficiency."},
  "APM":{scope:"APM + DEM",text:"The combined Application Performance Monitoring (APM) and Digital Experience Monitoring (DEM) suite has crossed $1B ARR. APM was described as the fastest-growing core product, with growth in the mid-30% range and inclusion in an eight-figure expansion."},
  "Real User Monitoring":{scope:"DEM suite",text:"APM + DEM has crossed $1B ARR. Recent DEM investment highlighted Path Analytics and RUM without Limits as attach drivers for the broader APM suite."},
  "Network Monitoring":{scope:"Product",text:"A per-host expansion product inside the observability platform. Recent positioning links Network Performance Monitoring with Path Analytics across digital experience workflows."},
  "Cloud Cost Management":{scope:"Product",text:"Still ancillary rather than a primary revenue driver, but it has appeared in a nearly seven-figure consolidation deal and a Fortune 500 expansion focused on cost visibility and governance."},
  "LLM Observability":{scope:"Product",text:"> 1,000 customers in Q1-2026 after roughly 10× client growth in six months. Reflexivity also cites 4× growth in processed LLM spans and inclusion in a seven-figure expansion."},
  "Data Observability":{scope:"Product",text:"Early commercial traction includes a nearly seven-figure European consolidation deal and an eight-figure Latin American financial-services expansion."},
  "Cloud Security":{scope:"Security suite",text:"Security ARR growth was described in the mid-50% range. Cloud SIEM and newer security modules have been included in seven-figure enterprise consolidation deals."},
  "Cloud SIEM":{scope:"Security suite",text:"A central security-suite wedge: Reflexivity cites displacement of established SIEM vendors and inclusion in seven-figure consolidation agreements."},
  "Datadog MCP Server":{scope:"Product",text:"Tool calls increased 11× sequentially while the product was in preview with thousands of customers; the map reflects its subsequent general availability."},
  "On-Call":{scope:"Service Management suite",text:"Reflexivity associates the service-management portfolio with more than 3,000 customers and a nearly seven-figure European consolidation agreement."},
  "Bits AI SRE Agent":{scope:"Bits AI family",text:"> 2,000 trial and paying customers conducting incident investigations. The Bits AI family has also appeared in seven-figure enterprise expansions."},
};

const COMPETITIVE_SETS = {
  "Infrastructure Monitoring":[["Dynatrace","direct"],["New Relic","direct"],["IBM Instana","direct"],["AWS CloudWatch","native"],["Azure Monitor","native"],["Google Cloud Operations","native"],["Oracle Cloud","native"]],
  "Log Management":[["Elastic","direct"],["Splunk","direct"],["Grafana Loki","direct"],["OpenSearch","native"],["CrowdStrike LogScale","adjacent"],["Snowflake","adjacent"]],
  "APM":[["Dynatrace","direct"],["New Relic","direct"],["Cisco AppDynamics","direct"],["IBM Instana","direct"],["Grafana Tempo","direct"],["Honeycomb","direct"],["Oracle APM","native"]],
  "Real User Monitoring":[["New Relic Browser","direct"],["Dynatrace","direct"],["Microsoft Clarity","adjacent"],["Google Web Vitals","native"]],
  "Synthetic Testing":[["Pingdom","direct"],["Checkly","direct"],["Grafana Synthetic Monitoring","direct"]],
  "Mobile App Testing":[["BrowserStack","direct"],["Sauce Labs","direct"]],
  "Session Replay":[["FullStory","direct"],["Hotjar","direct"],["LogRocket","direct"],["Microsoft Clarity","native"]],
  "Experimentation":[["Optimizely","direct"],["LaunchDarkly","direct"],["Statsig","direct"],["Amplitude Experiment","direct"]],
  "Network Monitoring":[["Kentik","direct"],["Cisco ThousandEyes","direct"],["Netscout","direct"],["Cloudflare","adjacent"]],
  "Continuous Profiler":[["Grafana Pyroscope","direct"],["Language-native profilers","native"]],
  "Error Tracking":[["Sentry","direct"],["Bugsnag","direct"],["Rollbar","direct"]],
  "Database Monitoring":[["SolarWinds DPA","direct"],["Percona","direct"],["Cloud-native DB insights","native"]],
  "Cloud Cost Management":[["VMware CloudHealth","direct"],["IBM Apptio Cloudability","direct"],["Kubecost","direct"],["AWS / Azure / GCP cost tools","native"]],
  "Observability Pipelines":[["Cribl","direct"],["OpenTelemetry Collector","native"],["Fluent Bit","native"]],
  "Data Streams Monitoring":[["Confluent","adjacent"],["Cloud-native queue metrics","native"]],
  "LLM Observability":[["Arize","direct"],["LangSmith","direct"],["Weights & Biases","direct"],["Helicone","direct"]],
  "GPU Monitoring":[["NVIDIA tooling","native"],["Hyperscaler GPU monitoring","native"],["ML-platform observability","adjacent"]],
  "AI Agents Console":[["LangSmith","adjacent"],["Arize","adjacent"],["Weights & Biases","adjacent"]],
  "Data Observability":[["Monte Carlo","direct"],["Bigeye","direct"],["Snowflake","adjacent"]],
  "Cloud Security":[["Wiz","direct"],["Palo Alto Prisma Cloud","direct"],["CrowdStrike Falcon Cloud","direct"],["Qualys","direct"],["Tenable","direct"],["SentinelOne","adjacent"]],
  "Code Security":[["Snyk","direct"],["GitHub Advanced Security","direct"],["Checkmarx","direct"],["GitLab","adjacent"]],
  "Cloud SIEM":[["Splunk","direct"],["Microsoft Sentinel","direct"],["Elastic Security","direct"],["Rapid7 InsightIDR","direct"],["CrowdStrike LogScale","direct"],["Fortinet","adjacent"]],
  "Data Security":[["BigID","direct"],["Cyera","direct"]],
  "Security: AI Guard":[["Lakera","direct"],["Protect AI","direct"],["Palo Alto Networks","adjacent"],["Cloudflare","adjacent"]],
  "Bits AI Security Analyst":[["Microsoft Security Copilot","adjacent"],["CrowdStrike Charlotte AI","adjacent"],["Hyperscaler SIEM copilots","native"]],
  "CI Visibility":[["GitHub Actions analytics","native"],["CircleCI Insights","native"],["GitLab","direct"]],
  "Test Optimization":[["GitHub / GitLab CI analytics","native"],["Specialist flaky-test tools","direct"]],
  "Continuous Testing":[["Cypress Cloud","direct"],["BrowserStack","direct"],["Sauce Labs","direct"]],
  "IDE Plugins":[["Editor-native observability extensions","native"]],
  "Feature Flags":[["LaunchDarkly","direct"],["Split","direct"],["Unleash","direct"]],
  "Datadog MCP Server":[["Vendor-native MCP servers","adjacent"],["Hyperscaler operations agents","native"]],
  "Bits AI Dev Agent":[["Sentry Seer","direct"],["OpenAI Codex","adjacent"],["Anthropic Claude Code","adjacent"],["GitHub Copilot","adjacent"],["Cursor","adjacent"],["GitLab Duo","adjacent"]],
  "On-Call":[["PagerDuty","direct"],["Atlassian Opsgenie","direct"],["ServiceNow","adjacent"]],
  "Incident Management":[["incident.io","direct"],["FireHydrant","direct"],["PagerDuty","direct"],["Atlassian","direct"],["ServiceNow","adjacent"]],
  "Event Management":[["BigPanda","direct"],["Moogsoft","direct"],["PagerDuty AIOps","direct"],["ServiceNow ITOM","direct"]],
  "Resource Catalog":[["Backstage","direct"],["Cortex","direct"],["OpsLevel","direct"],["ServiceNow CMDB","adjacent"]],
  "Internal Developer Portal":[["Backstage","direct"],["Humanitec","direct"],["Port","direct"],["Atlassian Compass","adjacent"]],
  "Workflow Automation":[["Rundeck","direct"],["PagerDuty Automation","direct"],["ServiceNow Flow Designer","adjacent"]],
  "App Builder":[["Retool","direct"],["ServiceNow App Engine","adjacent"]],
  "Bits AI SRE Agent":[["PagerDuty","adjacent"],["Dynatrace Davis AI","adjacent"],["ServiceNow AIOps","adjacent"]],
  "Product Analytics":[["Amplitude","direct"],["Mixpanel","direct"],["PostHog","direct"],["Heap","direct"],["Google Analytics","native"]],
};

const slugify = value => value
  .toLowerCase()
  .replace(/&/g, " and ")
  .replace(/[^a-z0-9]+/g, "-")
  .replace(/(^-|-$)/g, "");

const PRODUCT_META = {};
const setMeta = (names, values) => names.forEach(name => {
  PRODUCT_META[name] = {
    entityType:"product",
    maturity:"validated",
    position:"challenger",
    momentum:"stable",
    monetization:["usage"],
    motion:["expand"],
    workloads:[],
    moat:["bundle"],
    moatConviction:"emerging",
    dcf:["nrr"],
    capabilities:[],
    ...PRODUCT_META[name],
    ...values,
  };
});

setMeta([
  "Infrastructure Monitoring","Log Management","APM",
], {
  maturity:"scaled",
  position:"leader",
  momentum:"improving",
  motion:["land","expand","defend"],
  moat:["data_gravity","cross_signal","integration_breadth","installed_base"],
  dcf:["new_logo","land_size","usage_growth","nrr","growth_duration"],
});

setMeta([
  "Real User Monitoring","Network Monitoring","Continuous Profiler",
  "Database Monitoring","Observability Pipelines","CI Visibility",
], {
  maturity:"proven",
  position:"strong_challenger",
  motion:["expand","defend"],
  moat:["cross_signal","bundle","workflow_lock_in"],
  dcf:["nrr","grr","growth_duration"],
});

setMeta([
  "Synthetic Testing","Session Replay","Error Tracking","Data Streams Monitoring",
  "Cloud Security","Cloud SIEM","Code Security","On-Call","Incident Management",
  "Event Management","Resource Catalog","Feature Flags",
], {
  maturity:"proven",
  position:"challenger",
  motion:["expand","defend"],
  moat:["bundle","cross_signal","workflow_lock_in"],
  dcf:["nrr","grr"],
});

setMeta([
  "Mobile App Testing","Cloud Cost Management","Data Security","Test Optimization",
  "Continuous Testing","Internal Developer Portal","Workflow Automation","App Builder",
  "Product Analytics",
], {
  maturity:"validated",
  position:"challenger",
  momentum:"insufficient",
  moat:["bundle"],
  dcf:["nrr","tam_duration","r_and_d_intensity"],
});

setMeta([
  "LLM Observability","GPU Monitoring","Data Observability",
  "Bits AI Security Analyst","Datadog MCP Server","Bits AI SRE Agent",
], {
  maturity:"validated",
  position:"unproven",
  momentum:"improving",
  motion:["land","expand"],
  workloads:["ai"],
  moat:["cross_signal","workflow_lock_in","feedback_loop"],
  dcf:["new_tam","usage_growth","nrr","growth_duration","r_and_d_intensity"],
});

setMeta([
  "AI Agents Console","Security: AI Guard","Bits AI Dev Agent",
], {
  maturity:"option",
  position:"unproven",
  momentum:"insufficient",
  workloads:["ai","agents"],
  moat:["cross_signal","feedback_loop"],
  dcf:["new_tam","tam_duration","r_and_d_intensity"],
});

setMeta(["Experimentation"], {
  maturity:"validated",
  position:"challenger",
  momentum:"improving",
  canonicalCategory:"pa",
  motion:["expand"],
  moat:["cross_signal","bundle"],
  dcf:["nrr","tam_duration"],
});

setMeta(["IDE Plugins"], {
  entityType:"interface",
  maturity:"proven",
  position:"niche",
  motion:["defend"],
  moat:["developer_habit","workflow_lock_in"],
  dcf:["grr"],
});

setMeta(["Datadog MCP Server"], {
  entityType:"platform_primitive",
  monetization:["usage","ai_credits"],
  workloads:["ai","agents","inference"],
  motion:["expand","defend"],
  moat:["workflow_lock_in","platform_access"],
  dcf:["usage_growth","nrr","interface_risk"],
});

setMeta(["GPU Monitoring"], {
  workloads:["ai","training","inference"],
  motion:["land","expand"],
  moat:["cross_signal","integration_breadth","hyperscaler_validation"],
  dcf:["new_tam","land_size","usage_growth","gross_margin_risk"],
});

setMeta(["LLM Observability"], {
  workloads:["ai","inference","agents"],
  motion:["land","expand"],
  moat:["cross_signal","workflow_lock_in"],
  dcf:["new_tam","usage_growth","nrr"],
});

setMeta(["APM"], {
  workloads:["inference","agents"],
});

setMeta(["Log Management"], {
  workloads:["training","inference","agents"],
  dcf:["new_logo","land_size","usage_growth","nrr","growth_duration","gross_margin_risk"],
  capabilities:["Flex Logs","Cloud Prem / BYOC deployment"],
});

setMeta(["Infrastructure Monitoring","Network Monitoring","Cloud Cost Management"], {
  workloads:["training","inference"],
});

setMeta(["Data Observability"], {
  entityType:"product_family",
  canonicalCategory:"obs",
  workloads:["ai","training"],
});

setMeta(["Cloud SIEM"], {
  canonicalCategory:"sec",
  momentum:"improving",
  motion:["land","expand","defend"],
  moat:["data_gravity","cross_signal","bundle"],
  dcf:["new_logo","land_size","nrr","growth_duration"],
});

setMeta(["Real User Monitoring"], {
  canonicalCategory:"obs",
});

setMeta(["Session Replay"], {
  canonicalCategory:"obs",
});

setMeta(["Product Analytics"], {
  canonicalCategory:"pa",
});

setMeta(["On-Call","Incident Management"], {
  monetization:["seat","usage"],
});

setMeta(["Cloud Security","Cloud SIEM","Data Security","Bits AI Security Analyst"], {
  workloads:[...(PRODUCT_META["Cloud Security"]?.workloads || []),"regulated"],
});

setMeta(["Infrastructure Monitoring","Log Management","APM"], {
  moatConviction:"strong",
});

setMeta([
  "Real User Monitoring","Network Monitoring","Continuous Profiler",
  "Database Monitoring","Observability Pipelines","Cloud Security",
  "Cloud SIEM","CI Visibility","Incident Management",
], {
  moatConviction:"credible",
});

setMeta([
  "Mobile App Testing","AI Agents Console","Security: AI Guard",
  "Bits AI Dev Agent","App Builder",
], {
  moatConviction:"weak",
});

const BOUNDARY_CONVENTIONS = {
  "Real User Monitoring":{
    canonicalCategory:"obs",
    alternateCategories:["pa"],
    reason:"Primary buyer, workflow, and monetization attach remain inside Digital Experience Monitoring.",
    decisionDate:"2025-Q4",
    reviewTrigger:"Company or Gartner reclassifies the primary buying center.",
  },
  "Session Replay":{
    canonicalCategory:"obs",
    alternateCategories:["pa"],
    reason:"Kept canonically in DEM; repeated in Product Analytics only as a documented reference.",
    decisionDate:"2025-Q4",
    reviewTrigger:"Product Analytics becomes the primary commercial home.",
  },
  "Experimentation":{
    canonicalCategory:"pa",
    alternateCategories:["obs"],
    reason:"Experimentation is canonically a product-decision workflow, with DEM shown as the operational attach.",
    decisionDate:"2026-Q1",
    reviewTrigger:"Datadog changes the suite ownership in its formal product taxonomy.",
  },
  "Data Observability":{
    canonicalCategory:"obs",
    alternateCategories:["pa"],
    reason:"Operational data quality and jobs monitoring are treated as observability, not behavioral analytics.",
    decisionDate:"2025-Q4",
    reviewTrigger:"A stable market standard places the suite in a distinct data-management category.",
  },
  "Cloud SIEM":{
    canonicalCategory:"sec",
    alternateCategories:["obs"],
    reason:"The product reuses the log data plane but serves a security buyer and security outcome.",
    decisionDate:"2025-Q4",
    reviewTrigger:"Primary buyer or company suite ownership changes.",
  },
};

const RELATED_ENTITIES = [
  {
    id:"apm-recommendations",
    name:"APM Recommendations",
    entityType:"capability",
    parent:"APM",
    description:"Combines APM, RUM, profiler, and database telemetry to surface prioritized performance and reliability fixes.",
    moat:["cross_signal","feedback_loop"],
    dcf:["nrr","grr"],
    asOf:"2026-Q1",
  },
  {
    id:"bits-assistant",
    name:"Bits Assistant",
    entityType:"interface",
    parent:"Datadog MCP Server",
    description:"Natural-language search and action surface across Datadog; in preview during Q1 2026.",
    moat:["workflow_lock_in","platform_access"],
    dcf:["usage_growth","nrr","interface_risk"],
    asOf:"2026-Q1",
  },
  {
    id:"training-observability",
    name:"Training Observability",
    entityType:"solution",
    parent:"GPU Monitoring",
    description:"A workload overlay spanning GPU, infrastructure, network, logs, cost, data, and security signals.",
    moat:["cross_signal","integration_breadth"],
    dcf:["new_tam","land_size","usage_growth"],
    asOf:"2026-Q1",
  },
];

const PLATFORM_ENABLERS = [
  {
    id:"cloud-prem-byoc",
    name:"Cloud Prem / BYOC",
    entityType:"deployment",
    tags:["byoc","regulated"],
    description:"Runs supported Datadog products in customer-controlled infrastructure for sovereignty, residency, and very large workloads.",
    dcf:["new_tam","gross_margin_risk","r_and_d_intensity"],
  },
  {
    id:"fedramp-high",
    name:"FedRAMP High",
    entityType:"enabler",
    tags:["regulated"],
    description:"Unlocks U.S. federal workloads that require the highest Datadog certification level disclosed in Q1 2026.",
    dcf:["new_tam","sales_cycle"],
  },
  {
    id:"uk-data-residency",
    name:"UK data center",
    entityType:"enabler",
    tags:["regulated"],
    description:"Adds a regional deployment option for regulated and data-residency-sensitive customers.",
    dcf:["new_tam","r_and_d_intensity"],
  },
];

const Q1_EVIDENCE = {
  "GPU Monitoring":[
    {
      claim:"Initial hyperscaler training validation: one seven-figure and one eight-figure annualized AI-research deal included large parallel GPU-grid monitoring.",
      source:"Datadog FQ1 2026 earnings call",
      sourceId:"datadog-q1-2026-call",
      locator:"pp. 5-6; pp. 9-10",
      excerpt:"using GPU monitoring on large parallel GPU grids.",
      excerptType:"quote",
      sourceClass:"company_directional",
      scope:"product_and_bundle",
      confidence:"medium",
      asOf:"2026-Q1",
    },
  ],
  "LLM Observability":[
    {
      claim:"LLM Observability spans nearly tripled quarter over quarter.",
      source:"Datadog FQ1 2026 earnings call",
      sourceId:"datadog-q1-2026-call",
      locator:"p. 5",
      excerpt:"The number of spans sent to our LLM Observability product nearly tripled quarter-over-quarter.",
      excerptType:"quote",
      sourceClass:"company_directional",
      scope:"usage",
      confidence:"medium",
      asOf:"2026-Q1",
    },
  ],
  "Datadog MCP Server":[
    {
      claim:"MCP Server tool calls quadrupled quarter over quarter after general availability.",
      source:"Datadog FQ1 2026 earnings call",
      sourceId:"datadog-q1-2026-call",
      locator:"p. 5",
      excerpt:"the number of Datadog MCP Server tool calls, quadrupled quarter-over-quarter",
      excerptType:"quote",
      sourceClass:"company_directional",
      scope:"usage",
      confidence:"medium",
      asOf:"2026-Q1",
    },
  ],
  "Bits AI SRE Agent":[
    {
      claim:"Bits AI SRE investigations more than doubled from December to March.",
      source:"Datadog FQ1 2026 earnings call",
      sourceId:"datadog-q1-2026-call",
      locator:"p. 5",
      excerpt:"Bits AI SRE Agent investigations have more than doubled from December to March.",
      excerptType:"quote",
      sourceClass:"company_directional",
      scope:"usage",
      confidence:"medium",
      asOf:"2026-Q1",
    },
  ],
  "APM":[
    {
      claim:"APM Recommendations now correlates APM, RUM, profiler, and database telemetry to explain actionable fixes.",
      source:"Datadog FQ1 2026 earnings call",
      sourceId:"datadog-q1-2026-call",
      locator:"p. 5",
      excerpt:"APM automatically identified performance and reliability issues and most importantly, explain how to fix them.",
      excerptType:"quote",
      sourceClass:"company_directional",
      scope:"capability",
      confidence:"medium",
      asOf:"2026-Q1",
    },
  ],
};

const firstSentence = value => {
  const normalized = String(value || "").replace(/\s+/g," ").trim();
  const match = normalized.match(/^.*?[.!?](?=\s|$)/);
  return match ? match[0] : normalized;
};

const compactText = (value,max=150) => {
  const normalized = String(value || "").replace(/\s+/g," ").trim();
  if(normalized.length <= max) return normalized;
  const clipped = normalized.slice(0,max - 1);
  return `${clipped.slice(0,clipped.lastIndexOf(" "))}…`;
};

const SOURCE_EVIDENCE_DEFAULTS = {
  "sec-10k-2025":{role:"limitation",scope:"company"},
  "datadog-investor-day-2026":{role:"supporting",scope:"portfolio taxonomy"},
  "datadog-q1-2026-call":{role:"supporting",scope:"company or disclosed product"},
  "datadog-product-site":{role:"direct",scope:"product"},
  "morningstar-ddog-2026":{role:"context",scope:"company"},
  "reflexivity-ibkr-2026":{role:"supporting",scope:"product or suite"},
  "author-assessment":{role:"judgment",scope:"product"},
};

const assessmentSource = (id,locator,excerpt=null,excerptType=null,details={}) => ({
  id,
  locator,
  role:details.role || SOURCE_EVIDENCE_DEFAULTS[id]?.role || "supporting",
  scope:details.scope || SOURCE_EVIDENCE_DEFAULTS[id]?.scope || "unspecified",
  ...(excerpt ? {excerpt} : {}),
  ...(excerptType ? {excerptType} : {}),
  ...(details.summary ? {summary:details.summary} : {}),
  ...(details.caveat ? {caveat:details.caveat} : {}),
});

const productSource = (product,locator,caveat=null) => {
  const source = PRODUCT_SOURCES[product.n];
  return {
    id:"datadog-product-site",
    label:`Datadog: ${source.label}`,
    locator,
    url:source.url,
    role:"direct",
    scope:"product",
    excerpt:source.quote,
    excerptType:"company_excerpt",
    summary:`Map summary of the product function: ${product.what}`,
    caveat:caveat || "The company page supports the stated capability and positioning. It does not independently prove adoption, competitive rank, momentum, or moat.",
  };
};

const companyMoatContext = () => assessmentSource(
  "morningstar-ddog-2026",
  "Economic Moat, pp. 2-4",
  "Morningstar assigns Datadog a company-wide wide moat primarily from switching costs and network effects. Its analysis links switching costs to deployment and reconfiguration effort, mission-critical workflows, tailored dashboards, and high gross retention.",
  "parsed_summary",
  {
    role:"context",
    scope:"company",
    caveat:"Context only: Morningstar evaluates Datadog as a company and does not assign a moat rating to Cloud SIEM or any other individual product.",
  }
);

const buildAssessmentEvidence = (product,meta,legacyEvidence,q1Evidence) => {
  const traction = legacyEvidence[0];
  const latest = q1Evidence[0];
  const maturityEvidence = latest || traction;
  const maturitySource = latest
    ? assessmentSource("datadog-q1-2026-call",latest.locator,latest.excerpt,latest.excerptType,{
        role:"supporting",
        scope:latest.scope.replace(/_/g," "),
        summary:latest.claim,
        caveat:"Management disclosure is directional and does not provide stand-alone product revenue.",
      })
    : traction
      ? assessmentSource("reflexivity-ibkr-2026",traction.locator,traction.claim,"parsed_summary",{
          role:"supporting",
          scope:traction.scope,
          caveat:"Normalized summary from subscriber research; the original IBKR source modal was not retained as a verbatim extract.",
        })
      : assessmentSource(
          "datadog-investor-day-2026",
          "Product taxonomy and suite mapping",
          `${product.n} appears in Datadog's current portfolio taxonomy, but Datadog does not disclose stand-alone revenue or adoption for this product.`,
          "note",
          {role:"supporting",scope:"portfolio taxonomy"}
        );

  const maturityRationale = {
    scaled:maturityEvidence
      ? `Scaled: ${maturityEvidence.claim}`
      : "Scaled reflects established platform-scale adoption and a disclosed core-product role.",
    proven:maturityEvidence
      ? `Proven adoption: ${maturityEvidence.claim}`
      : "Proven reflects an established commercial product in Datadog's 2026 suite, although stand-alone revenue is not disclosed.",
    validated:maturityEvidence
      ? `Early validation: ${maturityEvidence.claim} Stand-alone scale is undisclosed.`
      : "Validated early reflects a launched product with a defined buyer and use case, but without disclosed stand-alone scale.",
    option:"Preview / option reflects a newly introduced surface without disclosed repeatable adoption or product-level revenue.",
  }[meta.maturity || "validated"];

  const competitorNames = (COMPETITIVE_SETS[product.n] || []).slice(0,2).map(([name]) => name);
  const competitiveBasis = competitorNames.length
    ? `The comparison set includes ${competitorNames.join(", ")}.`
    : "The available evidence does not establish a broad independent competitive set.";
  const positionRationale = `Our product-level judgment: ${product.edge} ${competitiveBasis}`;
  const positionSources = [
    assessmentSource(
      "author-assessment",
      "Product and competitor comparison",
      `Why we assigned ${POSITION[meta.position || "challenger"].label}: ${product.edge} ${competitiveBasis}`,
      "note",
      {
        role:"judgment",
        scope:"product",
        caveat:"This is the map's inference from product positioning and the named competitive set, not a company or third-party analyst rating.",
      }
    ),
    productSource(
      product,
      `${product.n} product positioning`,
      "The company page confirms Datadog's own positioning. It does not independently validate the competitive rank assigned by this map."
    ),
  ];

  let momentumRationale;
  let momentumSources;
  if(latest){
    momentumRationale = `${latest.claim} Directional only; no product revenue is disclosed.`;
    momentumSources = [assessmentSource("datadog-q1-2026-call",latest.locator,latest.excerpt,latest.excerptType,{
      role:"supporting",
      scope:latest.scope.replace(/_/g," "),
      summary:latest.claim,
      caveat:"Management disclosure supports direction of usage, not stand-alone revenue growth or durable market share.",
    })];
  } else if(traction){
    momentumRationale = `${traction.claim} Based on subscriber research synthesis of company disclosures.`;
    momentumSources = [assessmentSource("reflexivity-ibkr-2026",traction.locator,traction.claim,"parsed_summary",{
      role:"supporting",
      scope:traction.scope,
      caveat:"Normalized summary from subscriber research; use it as directional evidence rather than a verbatim company disclosure.",
    })];
  } else if((meta.momentum || "insufficient") === "stable"){
    momentumRationale = "Stable means no product-specific acceleration or deterioration was disclosed; the product remains an established part of the current suite.";
    momentumSources = [
      assessmentSource(
        "datadog-investor-day-2026",
        "Product taxonomy and suite mapping",
        `${product.n} remains in the current product taxonomy. No product-specific growth rate or adoption trend is disclosed.`,
        "note",
        {role:"limitation",scope:"portfolio taxonomy"}
      ),
      productSource(
        product,
        `${product.n} product positioning`,
        "The live product page supports continued portfolio presence, not the absence or presence of growth acceleration."
      ),
    ];
  } else if((meta.momentum || "insufficient") === "improving"){
    momentumRationale = "Improving is an author assessment based on recent launch cadence and expanded suite placement; Datadog does not disclose stand-alone product growth.";
    momentumSources = [
      assessmentSource(
        "author-assessment",
        "Launch and suite-cadence interpretation",
        `We infer improving momentum from the recent launch and suite-placement evidence available for ${product.n}; this is not a disclosed product growth rate.`,
        "note",
        {role:"judgment",scope:"product"}
      ),
      assessmentSource(
        "datadog-investor-day-2026",
        "Product taxonomy and launch context",
        `${product.n} is presented within Datadog's current suite and launch context, without stand-alone growth disclosure.`,
        "note",
        {role:"supporting",scope:"portfolio taxonomy"}
      ),
    ];
  } else {
    momentumRationale = "Insufficient evidence means Datadog has not disclosed enough product-level adoption or growth data to establish a direction.";
    momentumSources = [
      assessmentSource(
        "sec-10k-2025",
        "Business and segment reporting",
        "Datadog reports substantially all revenue as subscription software sales and does not provide stand-alone product revenue in the filing.",
        "parsed_summary",
        {role:"limitation",scope:"company"}
      ),
      assessmentSource(
        "datadog-investor-day-2026",
        "Product taxonomy; no stand-alone product financials",
        `${product.n} is visible in the portfolio taxonomy, but the presentation does not provide a product-level growth series.`,
        "note",
        {role:"limitation",scope:"portfolio taxonomy"}
      ),
    ];
  }

  const moatKey = meta.moatConviction || "emerging";
  const moatKeys = meta.moat || ["bundle"];
  const moatNames = moatKeys.map(key => key.replace(/_/g," ")).join(", ");
  const mechanismBasis = moatKeys
    .map(key => MOAT_MECHANISM_EXPLANATION[key] || `${key.replace(/_/g," ")} may contribute to differentiation.`)
    .join(" ");
  const moatRationale = `${MOAT_CONVICTION[moatKey].label} is our product-level judgment, not a company rating. The case rests on ${moatNames}. ${product.why}`;
  const moatSources = [
    assessmentSource(
      "author-assessment",
      "Product-level moat interpretation",
      `Why we assigned ${MOAT_CONVICTION[moatKey].label}: ${mechanismBasis} Product logic: ${product.why} Competitive constraint: ${product.edge}`,
      "note",
      {
        role:"judgment",
        scope:"product",
        caveat:"This is the map's analytical inference. Datadog does not disclose product-level retention, switching costs, or economic-moat ratings.",
      }
    ),
    productSource(
      product,
      `${product.n} integration and workflow claims`,
      "The company page supports the product capability and platform-integration premise. It does not independently establish durable switching costs or moat strength."
    ),
  ];
  if(["strong","credible"].includes(moatKey)) moatSources.push(companyMoatContext());

  return {
    maturity:{
      rationale:maturityRationale,
      confidence:maturityEvidence ? "medium" : "low",
      asOf:"2026-Q1",
      sources:[
        maturitySource,
        productSource(
          product,
          `${product.n} commercial product page`,
          "The live company page confirms a marketed product and defined use case. It does not establish commercial scale."
        ),
      ],
    },
    position:{
      rationale:positionRationale,
      confidence:competitorNames.length ? "medium" : "low",
      asOf:"2026-Q1",
      sources:positionSources,
    },
    momentum:{
      rationale:momentumRationale,
      confidence:latest || traction ? "medium" : "low",
      asOf:"2026-Q1",
      sources:momentumSources,
    },
    moatConviction:{
      rationale:moatRationale,
      confidence:["strong","credible"].includes(moatKey) ? "medium" : "low",
      asOf:"2026-Q1",
      sources:moatSources,
    },
  };
};

const normalizeProducts = () => {
  const firstCategory = {};
  DATA.forEach(category => category.suites.forEach(suite => suite.products.forEach(product => {
    firstCategory[product.n] ||= category.id;
  })));

  DATA.forEach(category => category.suites.forEach(suite => suite.products.forEach(product => {
    const meta = PRODUCT_META[product.n] || {};
    const legacyEvidence = TRACTION[product.n]
      ? [{
          claim:TRACTION[product.n].text,
          source:"Reflexivity via IBKR / company disclosure synthesis",
          sourceId:"reflexivity-ibkr-2026",
          locator:`Brand & Product > ${product.n}`,
          excerpt:compactText(TRACTION[product.n].text,180),
          excerptType:"parsed_summary",
          sourceClass:"third_party_research",
          scope:TRACTION[product.n].scope,
          confidence:"medium",
          asOf:"2025-FY to 2026-Q1",
        }]
      : [];

    Object.assign(product, {
      id:slugify(product.n),
      entityType:meta.entityType || "product",
      maturity:meta.maturity || "validated",
      position:meta.position || "challenger",
      momentum:meta.momentum || "insufficient",
      monetization:meta.monetization || ["usage"],
      motion:meta.motion || ["expand"],
      workloads:[
        ...(product.ai ? ["ai"] : []),
        ...(meta.workloads || []),
      ].filter((value,index,array) => array.indexOf(value) === index),
      moat:meta.moat || ["bundle"],
      moatConviction:meta.moatConviction || "emerging",
      moatConvictionRationale:MOAT_CONVICTION[meta.moatConviction || "emerging"].rationale,
      dcf:meta.dcf || ["nrr"],
      capabilities:meta.capabilities || [],
      canonicalCategory:meta.canonicalCategory || firstCategory[product.n],
      suiteMapping:{
        suite:suite.name,
        validFrom:"2026-Q1",
        source:"Datadog Investor Day taxonomy mapped to stable market backbone",
      },
      suiteMappings:[{
        suite:suite.name,
        validFrom:"2026-Q1",
        validTo:null,
        source:"Datadog Investor Day taxonomy mapped to stable market backbone",
      }],
      competitors:COMPETITIVE_SETS[product.n] || [],
      evidence:[...legacyEvidence,...(Q1_EVIDENCE[product.n] || [])],
      assessmentEvidence:buildAssessmentEvidence(product,meta,legacyEvidence,Q1_EVIDENCE[product.n] || []),
      boundary:BOUNDARY_CONVENTIONS[product.n],
    });
  })));
};

normalizeProducts();

window.PRODUCT_MAP = {
  categories:DATA,
  maturity:MATURITY,
  position:POSITION,
  momentum:MOMENTUM,
  moatConviction:MOAT_CONVICTION,
  entityTypes:ENTITY_TYPES,
  relatedEntities:RELATED_ENTITIES,
  platformEnablers:PLATFORM_ENABLERS,
  boundaryConventions:BOUNDARY_CONVENTIONS,
  sources:SOURCE_REGISTRY,
  productSources:PRODUCT_SOURCES,
  meta:{
    asOf:"2026-Q1",
    companyReportedProductCount:26,
    auditedSource:"FY2025 10-K",
    directionalSource:"Q1 2026 earnings call and company presentations",
  },
};
