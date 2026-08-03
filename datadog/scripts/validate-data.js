#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import {fileURLToPath} from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const source = fs.readFileSync(path.join(root, "data", "product-map-data.js"), "utf8");
const sandbox = {window:{}};
vm.createContext(sandbox);
vm.runInContext(source, sandbox, {filename:"product-map-data.js"});

const model = sandbox.window.PRODUCT_MAP;
const failures = [];
const assert = (condition, message) => {
  if(!condition) failures.push(message);
};
const isOfficialDatadogSource = url => /^https:\/\/(www\.)?(sec\.gov|investors\.datadoghq\.com)\//.test(url || "");
const isChronological = rows => rows.every((row,index) => index === 0 || rows[index-1][0] < row[0]);

assert(model, "window.PRODUCT_MAP must be exported");
if(!model){
  console.error("Validation failed:\n- " + failures.join("\n- "));
  process.exit(1);
}

const kpiSource = fs.readFileSync(path.join(root, "data", "kpi-data.js"), "utf8");
vm.runInContext(kpiSource, sandbox, {filename:"kpi-data.js"});
const kpis = sandbox.window.KPI_DATA;
assert(kpis, "window.KPI_DATA must be exported");
if(kpis){
  assert(kpis.quarterly.length === 27, "KPI history must contain 27 quarterly financial periods");
  assert(kpis.annualFcfEconomics?.length === 5, "FCF economics history must contain FY2021 through FY2025");
  assert(kpis.annualOperations?.length === 7, "Annual operations history must contain FY2019 through FY2025");
  assert(kpis.annualCapital?.length === 8, "Annual capital history must contain FY2019 through Q1 2026");
  assert(kpis.adoption.length === 24, "Product adoption history must contain 24 periods");
  assert(kpis.quarterly.at(-1)?.[0] === "2026Q1", "Latest financial KPI period must be 2026Q1");
  assert(kpis.adoption.at(-1)?.[0] === "2026Q1", "Latest adoption KPI period must be 2026Q1");
  assert(kpis.quarterly.every(row => row.length === 6 && row[5]?.startsWith("https://")), "Every financial KPI row needs an official source URL");
  assert(kpis.annualFcfEconomics?.every(row => row.length === 5 && row[4]?.startsWith("https://")), "Every FCF economics row needs an official source URL");
  assert(kpis.annualOperations?.every(row => row.length === 11 && row[10]?.startsWith("https://")), "Every annual operations row needs an official source URL");
  assert(kpis.annualCapital?.every(row => row.length === 8 && row[7]?.startsWith("https://")), "Every annual capital row needs an official source URL");
  assert(kpis.adoption.every(row => row.length === 9 && row[7]?.startsWith("https://")), "Every adoption KPI row needs an official source URL");
  assert(kpis.milestones.every(row => row.length === 5 && row[3]?.startsWith("https://")), "Every product milestone needs an official source URL");
  assert(kpis.totalCustomers.every(row => row.length >= 3 && row[2]?.startsWith("https://")), "Every total-customer KPI row needs an official source URL");
  assert(kpis.millionCustomers.every(row => row.length === 4 && row[2]?.startsWith("https://")), "Every $1M-customer KPI row needs an official source URL");
  assert(kpis.nrr.every(row => row.length === 5 && row[3]?.startsWith("https://")), "Every NRR disclosure needs an official source URL");
  assert(kpis.grr.every(row => row.length === 5 && row[3]?.startsWith("https://")), "Every GRR disclosure needs an official source URL");
  assert(kpis.aiIntegrationCustomers.every(row => row.length === 4 && row[2]?.startsWith("https://")), "Every AI customer KPI needs an official source URL");
  assert(kpis.aiActivity.every(row => row.length === 5 && row[4]?.startsWith("https://")), "Every AI activity KPI needs an official source URL");
  assert(kpis.productPortfolio?.bands?.reduce((sum,row)=>sum+row[1],0) === kpis.productPortfolio?.totalProducts, "Product portfolio bands must tie to total products");
  assert(kpis.productPortfolio?.sourceUrl?.startsWith("https://"), "Product portfolio needs an official source URL");
  assert(kpis.coreEngineScale?.length === 3, "Core product-engine scale view must contain three disclosed engines");
  assert(kpis.coreEngineScale?.every(engine =>
    typeof engine.scopeComparable === "boolean" &&
    isOfficialDatadogSource(engine.fromSourceUrl) && isOfficialDatadogSource(engine.toSourceUrl)
  ), "Every core product-engine trajectory needs comparability status and official endpoint sources");
  assert(kpis.nrr.every(row => row[1] >= 1 && row[1] <= 1.5), "NRR visualization values must be stored as 1.00-based percentages");
  assert(kpis.grr.every(row => row[1] >= .9 && row[1] <= 1), "GRR visualization values must be stored as 1.00-based percentages");
  const auditableSeries = [
    ["quarterly",kpis.quarterly,5],["adoption",kpis.adoption,7],["total customers",kpis.totalCustomers,2],
    ["annual FCF economics",kpis.annualFcfEconomics,4],["annual operations",kpis.annualOperations,10],["annual capital",kpis.annualCapital,7],
    ["$1M customers",kpis.millionCustomers,2],["NRR",kpis.nrr,3],["GRR",kpis.grr,3],["AI customers",kpis.aiIntegrationCustomers,2],
  ];
  auditableSeries.forEach(([label,rows,urlIndex]) => {
    assert(isChronological(rows), `${label} series must be chronological with unique periods`);
    assert(rows.every(row => isOfficialDatadogSource(row[urlIndex])), `${label} series must use SEC or Datadog IR sources`);
  });
  assert(kpis.aiActivity.every(row => isOfficialDatadogSource(row[4])), "AI activity must use SEC or Datadog IR sources");
  assert(isOfficialDatadogSource(kpis.productPortfolio?.sourceUrl), "Product portfolio must use an SEC or Datadog IR source");
  const latest = kpis.quarterly.at(-1);
  assert(Math.abs(latest[1] - 1006.426) < 0.001, "Q1 2026 revenue tie-out failed");
  assert(Math.abs(latest[2] / latest[1] - 0.792091) < 0.001, "Q1 2026 GAAP gross-margin tie-out failed");
  assert(Math.abs(latest[3] / latest[1] - 0.802072) < 0.001, "Q1 2026 non-GAAP gross-margin tie-out failed");
  assert(latest[4] === 4550, "Q1 2026 large-customer tie-out failed");
  const latestFcf = kpis.annualFcfEconomics.at(-1);
  assert(latestFcf[0] === "2025", "Latest annual FCF economics period must be FY2025");
  assert(Math.abs(latestFcf[2] - latestFcf[3] - 140.575) < 0.001, "FY2025 owner-FCF tie-out failed");
  assert(Math.abs((latestFcf[2] - latestFcf[3]) / latestFcf[1] - 0.041018) < 0.001, "FY2025 owner-FCF margin tie-out failed");
  const latestOperations = kpis.annualOperations.at(-1);
  assert(latestOperations[0] === "2025", "Latest annual operations period must be FY2025");
  assert(Math.abs(latestOperations[6] / latestOperations[1] - -0.012947) < 0.001, "FY2025 operating-margin tie-out failed");
  assert(Math.abs(latestOperations[9] / kpis.annualOperations.at(-2)[9] - 1 - 0.030420) < 0.001, "FY2025 year-end share-growth tie-out failed");
  const latestCapital = kpis.annualCapital.at(-1);
  const latestAnnualCapital = kpis.annualCapital.at(-2);
  assert(latestCapital[0] === "2026Q1", "Latest capital period must be Q1 2026");
  assert(Math.abs(latestCapital[1] + latestCapital[2] - 4758.617) < 0.001, "Q1 2026 liquidity tie-out failed");
  assert(Math.abs(latestAnnualCapital[5] - 3242.653) < 0.001, "FY2025 three-year R&D-adjusted capital tie-out failed");
  assert(Math.abs(latestAnnualCapital[6] - 0.151731) < 0.001, "FY2025 three-year R&D-adjusted ROIC tie-out failed");
  assert(Math.abs(latestCapital[5] - 3355.831) < 0.001, "Q1 2026 three-year R&D-adjusted capital tie-out failed");
}

const peerSource = fs.readFileSync(path.join(root, "data", "peer-comps-data.js"), "utf8");
vm.runInContext(peerSource, sandbox, {filename:"peer-comps-data.js"});
const peerModel = sandbox.window.PEER_COMPS;
assert(peerModel, "window.PEER_COMPS must be exported");
if(peerModel){
  const rows = peerModel.companies.map(values => Object.fromEntries(peerModel.fields.map((field,index) => [field,values[index]])));
  const median = values => {
    const sorted = [...values].sort((a,b) => a-b);
    const middle = Math.floor(sorted.length / 2);
    return sorted.length % 2 ? sorted[middle] : (sorted[middle-1] + sorted[middle]) / 2;
  };
  const metrics = row => {
    const ltmGrowth = row.ltmRevenue / row.ltmPriorRevenue - 1;
    const ntmGrowth = row.currentFyGrowth * row.monthsCurrentFy / 12 + row.nextFyGrowth * (12-row.monthsCurrentFy) / 12;
    const standardizedFcf = row.ltmCfoLessCapex - row.ltmCapitalizedSoftware;
    const fcfMargin = standardizedFcf / row.ltmRevenue;
    const sbcMargin = row.ltmSbc / row.ltmRevenue;
    const enterpriseValue = row.marketCap + row.debt - row.cash;
    const ntmRevenue = row.ltmRevenue * (1+ntmGrowth);
    return {
      ltmGrowth, ntmGrowth, fcfMargin, sbcMargin,
      grossMargin: row.ltmGrossProfit / row.ltmRevenue,
      operatingMargin: row.ltmOperatingIncome / row.ltmRevenue,
      dilution: row.latestBasicShares / row.priorBasicShares - 1,
      rule40: ltmGrowth + fcfMargin,
      economicSensitivity: ltmGrowth + fcfMargin - sbcMargin,
      evNtmRevenue: enterpriseValue / ntmRevenue,
      equityNtmFcf: row.marketCap / (ntmRevenue * fcfMargin),
    };
  };
  const enriched = rows.map(row => ({...row,...metrics(row)}));
  const ddog = enriched.find(row => row.ticker === "DDOG");
  const broad = enriched.filter(row => row.ticker !== "DDOG");
  const direct = enriched.filter(row => row.bucket === "direct");
  assert(peerModel.meta.valuationDate === "2026-07-31", "Peer valuation date must be 2026-07-31");
  assert(rows.length === 9, "Peer set must contain Datadog and eight comparison companies");
  assert(rows.filter(row => row.bucket === "target").length === 1, "Peer set must contain one target company");
  assert(direct.map(row => row.ticker).sort().join(",") === "DT,ESTC", "Direct peer set must contain DT and ESTC");
  assert(rows.every(row => peerModel.buckets[row.bucket]), "Every peer must use a registered comparison bucket");
  assert(rows.every(row => row.price > 0 && row.marketCap > 0 && row.ltmRevenue > 0 && row.ltmPriorRevenue > 0), "Every peer needs valid market and LTM revenue inputs");
  assert(rows.every(row => row.latestBasicShares > 0 && row.priorBasicShares > 0), "Every peer needs comparable basic-share inputs");
  assert(rows.every(row => ["overview","forecast","income","cash-flow","balance-sheet"].every(statement => peerModel.sourceFor(row.ticker,statement).startsWith("https://stockanalysis.com/"))), "Every peer needs valid source URLs");
  assert(Math.abs(ddog.ltmGrowth - .295443) < .00001, "DDOG LTM growth tie-out failed");
  assert(Math.abs(ddog.ntmGrowth - .2368) < .00001, "DDOG NTM growth proxy tie-out failed");
  assert(Math.abs(ddog.fcfMargin - .261277) < .00001, "DDOG standardized FCF margin tie-out failed");
  assert(Math.abs(ddog.rule40 - .556720) < .00001, "DDOG Rule of 40 tie-out failed");
  assert(Math.abs(ddog.economicSensitivity - .343419) < .00001, "DDOG Economic sensitivity tie-out failed");
  assert(Math.abs(ddog.evNtmRevenue - 20.7557) < .001, "DDOG EV / NTM revenue tie-out failed");
  assert(Math.abs(median(broad.map(row => row.evNtmRevenue)) - 6.6872) < .001, "Broad-peer EV / NTM revenue median tie-out failed");
  assert(Math.abs(median(direct.map(row => row.evNtmRevenue)) - 4.2312) < .001, "Direct-peer EV / NTM revenue median tie-out failed");
  assert(ddog.evNtmRevenue / median(broad.map(row => row.evNtmRevenue)) - 1 > 2, "DDOG broad-peer valuation premium must exceed 200%");
}

const categoryIds = new Set(model.categories.map(category => category.id));
const maturityIds = new Set(Object.keys(model.maturity));
const positionIds = new Set(Object.keys(model.position));
const momentumIds = new Set(Object.keys(model.momentum));
const moatConvictionIds = new Set(Object.keys(model.moatConviction));
const evidenceConfidenceIds = new Set(Object.keys(model.evidenceConfidence || {}));
const underwritingIds = new Set(Object.keys(model.underwriting || {}));
const evidenceSignalIds = new Set(Object.keys(model.evidenceSignals || {}));
const entityTypeIds = new Set(Object.keys(model.entityTypes));
const assessmentIds = ["maturity","position","momentum","moatConviction"];
const mediumMaturityProducts = new Set([
  "Infrastructure Monitoring","Log Management","APM",
  "Real User Monitoring","Cloud Cost Management","LLM Observability",
  "GPU Monitoring","AI Agents Console","Data Observability","Cloud SIEM",
  "Security: AI Guard","Datadog MCP Server","Bits AI Dev Agent",
  "On-Call","Bits AI SRE Agent",
]);
const mediumMomentumProducts = new Set([
  "APM","LLM Observability","GPU Monitoring",
  "Datadog MCP Server","Bits AI SRE Agent",
]);
const mediumMoatProducts = new Set([
  "Infrastructure Monitoring","Log Management","APM",
]);
const seenNames = new Map();
let references = 0;

assert(model.sources && Object.keys(model.sources).length > 0, "Source registry is required");
assert(model.productSources && Object.keys(model.productSources).length > 0, "Product source registry is required");
assert(model.companyAssessment, "Company-level investor assessment is required");
assert(underwritingIds.size > 0, "Underwriting sensitivity registry is required");
assert(
  ["high","medium","low"].every(id => evidenceConfidenceIds.has(id)) && evidenceConfidenceIds.size === 3,
  "Evidence-confidence scale must contain exactly high, medium, and low"
);
for(const [id, sourceRecord] of Object.entries(model.sources || {})){
  assert(
    ["label","publisher","date","sourceClass","access","hoverText","hoverType"].every(key => Boolean(sourceRecord[key])),
    `${id}: incomplete source registry record`
  );
  assert(["public","subscriber","internal"].includes(sourceRecord.access), `${id}: invalid access level`);
  assert(["quote","parsed_summary","note"].includes(sourceRecord.hoverType), `${id}: invalid hover excerpt type`);
  assert(sourceRecord.access === "internal" || Boolean(sourceRecord.url), `${id}: external source URL is required`);
}

assert(
  ["obs","sec","dev","pa"].every(id => categoryIds.has(id)) && categoryIds.size === 4,
  "Stable spine must contain exactly obs, sec, dev, and pa"
);

for(const category of model.categories){
  assert(category.anchor?.scope === "category", `${category.catName}: anchor scope must be category`);
  assert(!/arr/i.test(`${category.anchor?.val} ${category.anchor?.lab}`), `${category.catName}: spine anchor must not contain ARR`);
  assert(category.suites.length > 0, `${category.catName}: at least one suite is required`);

  for(const suite of category.suites){
    assert(suite.products.length > 0, `${category.catName} / ${suite.name}: at least one leaf is required`);
    for(const product of suite.products){
      references += 1;
      const productSource = model.productSources?.[product.n];
      assert(Boolean(product.id), `${product.n}: stable id is required`);
      assert(Boolean(productSource?.label && productSource?.url && productSource?.quote), `${product.n}: specific Datadog product source is required`);
      assert(
        productSource?.url !== model.sources["datadog-product-site"]?.url,
        `${product.n}: generic Datadog product portfolio URL is not allowed`
      );
      assert(
        /^https:\/\/(www\.)?(datadoghq\.com|docs\.datadoghq\.com)\//.test(productSource?.url || ""),
        `${product.n}: product source must use an official Datadog URL`
      );
      assert(maturityIds.has(product.maturity), `${product.n}: invalid maturity ${product.maturity}`);
      assert(positionIds.has(product.position), `${product.n}: invalid position ${product.position}`);
      assert(momentumIds.has(product.momentum), `${product.n}: invalid momentum ${product.momentum}`);
      assert(moatConvictionIds.has(product.moatConviction), `${product.n}: invalid moat conviction ${product.moatConviction}`);
      assert(Boolean(product.moatConvictionRationale), `${product.n}: moat conviction rationale is required`);
      assert(entityTypeIds.has(product.entityType), `${product.n}: invalid entity type ${product.entityType}`);
      assert(categoryIds.has(product.canonicalCategory), `${product.n}: invalid canonical category`);
      assert(Array.isArray(product.moat) && product.moat.length > 0, `${product.n}: moat tags are required`);
      assert(Array.isArray(product.dcf) && product.dcf.length > 0, `${product.n}: DCF tags are required`);
      assert(
        product.dcf.every(id => underwritingIds.has(id)),
        `${product.n}: unknown underwriting sensitivity`
      );
      assert(Array.isArray(product.evidenceSignals), `${product.n}: evidence signals must be an array`);
      assert(
        product.evidenceSignals.every(id => evidenceSignalIds.has(id)),
        `${product.n}: unknown evidence signal`
      );
      assert(
        !product.moat.includes("hyperscaler_validation"),
        `${product.n}: hyperscaler validation must be evidence, not a moat mechanism`
      );
      assert(Array.isArray(product.suiteMappings) && product.suiteMappings.length > 0, `${product.n}: suite mapping history is required`);
      assert(Boolean(product.assessmentEvidence), `${product.n}: assessment evidence is required`);

      const expectedConfidence = {
        maturity:mediumMaturityProducts.has(product.n) ? "medium" : "low",
        position:"low",
        momentum:mediumMomentumProducts.has(product.n) ? "medium" : "low",
        moatConviction:mediumMoatProducts.has(product.n) ? "medium" : "low",
      };
      for(const assessmentId of assessmentIds){
        assert(
          evidenceConfidenceIds.has(product.evidenceConfidence?.[assessmentId]),
          `${product.n}: ${assessmentId} evidence confidence is required`
        );
        assert(
          product.evidenceConfidence?.[assessmentId] === expectedConfidence[assessmentId],
          `${product.n}: ${assessmentId} confidence must be ${expectedConfidence[assessmentId]}`
        );
      }
      if(["strong","credible"].includes(product.moatConviction)){
        const moatSourceIds = new Set(product.assessmentEvidence.moatConviction.sources.map(source => source.id));
        assert(
          moatSourceIds.has("internal-moat-analysis"),
          `${product.n}: meaningful moat contribution requires the internal Narrow + Strengthening company context`
        );
        assert(
          moatSourceIds.has("morningstar-ddog-2026"),
          `${product.n}: external wide-moat contrast must remain explicitly available`
        );
      }
      assert(
        !(["scaled","proven"].includes(product.maturity) && product.evidenceConfidence.maturity === "low"),
        `${product.n}: proven or scaled maturity cannot carry low evidence confidence`
      );
      assert(
        !(product.momentum !== "insufficient" && product.evidenceConfidence.momentum === "low"),
        `${product.n}: directional momentum cannot carry low evidence confidence`
      );

      for(const mapping of product.suiteMappings || []){
        assert(Boolean(mapping.suite && mapping.validFrom && mapping.source), `${product.n}: incomplete suite mapping`);
      }
      for(const evidence of product.evidence || []){
        assert(
          ["claim","source","sourceClass","scope","confidence","asOf"].every(key => Boolean(evidence[key])),
          `${product.n}: incomplete evidence record`
        );
        if(evidence.sourceId){
          assert(Boolean(model.sources[evidence.sourceId]), `${product.n}: unknown evidence source ${evidence.sourceId}`);
          assert(Boolean(evidence.locator), `${product.n}: evidence locator is required for ${evidence.sourceId}`);
          assert(Boolean(evidence.excerpt && evidence.excerptType), `${product.n}: evidence hover excerpt is required`);
        }
      }
      for(const assessmentId of assessmentIds){
        const assessment = product.assessmentEvidence?.[assessmentId];
        assert(Boolean(assessment?.rationale), `${product.n}: ${assessmentId} rationale is required`);
        assert(Boolean(assessment?.asOf && assessment?.confidence), `${product.n}: ${assessmentId} metadata is incomplete`);
        assert(
          evidenceConfidenceIds.has(assessment?.confidence),
          `${product.n}: ${assessmentId} evidence confidence is invalid`
        );
        if(product.evidenceConfidence){
          assert(
            assessment.confidence === product.evidenceConfidence[assessmentId],
            `${product.n}: ${assessmentId} card confidence must match the score-row confidence`
          );
        }
        assert(Array.isArray(assessment?.sources) && assessment.sources.length > 0, `${product.n}: ${assessmentId} sources are required`);
        for(const sourceRef of assessment?.sources || []){
          assert(Boolean(model.sources[sourceRef.id]), `${product.n}: ${assessmentId} has unknown source ${sourceRef.id}`);
          assert(Boolean(sourceRef.locator), `${product.n}: ${assessmentId} source locator is required`);
          assert(
            ["direct","supporting","context","judgment","limitation"].includes(sourceRef.role),
            `${product.n}: ${assessmentId} source role is required`
          );
          assert(Boolean(sourceRef.scope), `${product.n}: ${assessmentId} source scope is required`);
          assert(
            ["quote","company_excerpt","parsed_summary","note"].includes(sourceRef.excerptType),
            `${product.n}: ${assessmentId} source excerpt type is invalid`
          );
          assert(
            Boolean(sourceRef.excerpt || model.sources[sourceRef.id]?.hoverText),
            `${product.n}: ${assessmentId} hover excerpt is required`
          );
          if(sourceRef.role === "context"){
            assert(Boolean(sourceRef.caveat), `${product.n}: ${assessmentId} context source must state its evidence boundary`);
          }
          if(sourceRef.id === "morningstar-ddog-2026"){
            assert(
              sourceRef.role === "context" && sourceRef.scope === "company",
              `${product.n}: Morningstar company research cannot be presented as product-level proof`
            );
          }
          if(sourceRef.id === "author-assessment"){
            assert(sourceRef.role === "judgment", `${product.n}: map analysis must be labeled as judgment`);
            assert(sourceRef.excerpt.length >= 80, `${product.n}: ${assessmentId} analytical basis is too thin`);
          }
          if(sourceRef.id === "datadog-product-site"){
            assert(sourceRef.url === productSource?.url, `${product.n}: ${assessmentId} must use its specific Datadog URL`);
            assert(Boolean(sourceRef.label), `${product.n}: ${assessmentId} product source label is required`);
            assert(sourceRef.role === "direct" && sourceRef.scope === "product", `${product.n}: product page evidence scope is invalid`);
            assert(Boolean(sourceRef.summary && sourceRef.caveat), `${product.n}: ${assessmentId} product evidence needs a reading and boundary`);
          }
        }
      }

      const prior = seenNames.get(product.n);
      if(prior){
        assert(prior.id === product.id, `${product.n}: repeated references must share one stable id`);
        assert(Boolean(product.boundary), `${product.n}: repeated reference requires a boundary convention`);
        for(const assessmentId of assessmentIds){
          assert(
            prior[assessmentId] === product[assessmentId],
            `${product.n}: repeated references must share the same ${assessmentId} score`
          );
          assert(
            prior.evidenceConfidence?.[assessmentId] === product.evidenceConfidence?.[assessmentId],
            `${product.n}: repeated references must share the same ${assessmentId} confidence`
          );
        }
      } else {
        seenNames.set(product.n, product);
      }
    }
  }
}

for(const [name, convention] of Object.entries(model.boundaryConventions)){
  assert(seenNames.has(name), `${name}: boundary convention points to an unknown product`);
  assert(categoryIds.has(convention.canonicalCategory), `${name}: invalid boundary canonical category`);
  assert(Boolean(convention.decisionDate && convention.reviewTrigger), `${name}: boundary governance is incomplete`);
}

for(const entity of model.relatedEntities){
  assert(entityTypeIds.has(entity.entityType), `${entity.name}: invalid related entity type`);
  assert(seenNames.has(entity.parent), `${entity.name}: parent product does not exist`);
}

for(const enabler of model.platformEnablers){
  assert(entityTypeIds.has(enabler.entityType), `${enabler.name}: invalid enabler entity type`);
  assert(Array.isArray(enabler.dcf) && enabler.dcf.length > 0, `${enabler.name}: DCF linkage is required`);
}

assert(model.companyAssessment.asOf === model.meta.asOf, "Company assessment and dataset as-of must match");
assert(model.companyAssessment.verdicts.length >= 5, "Company assessment must include all five agreed verdicts");
for(const verdict of model.companyAssessment.verdicts){
  assert(Boolean(model.sources[verdict.sourceId]), `${verdict.label}: company verdict source is unknown`);
}
assert(model.companyAssessment.watchlist.length >= 4, "Investor watchlist must include all four monitoring dimensions");

assert(model.meta.asOf === "2026-Q1", "Dataset as-of must be 2026-Q1");
assert(model.meta.companyReportedProductCount === 26, "Company-reported product count must stay a separately labeled fact");

if(failures.length){
  console.error(`Validation failed (${failures.length}):\n- ${failures.join("\n- ")}`);
  process.exit(1);
}

console.log(`Validated ${seenNames.size} canonical mapped entities across ${references} placements, ${model.categories.length} markets, and ${model.categories.reduce((sum, category) => sum + category.suites.length, 0)} suites.`);
