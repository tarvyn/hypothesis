#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import {fileURLToPath} from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const companyRoot = path.join(root, "companies", "datadog");
const companyIndexSource = fs.readFileSync(path.join(root, "data", "companies.js"), "utf8");
const source = fs.readFileSync(path.join(companyRoot, "data", "product-map-data.js"), "utf8");
const sandbox = {window:{}};
vm.createContext(sandbox);
vm.runInContext(companyIndexSource, sandbox, {filename:"companies.js"});
vm.runInContext(source, sandbox, {filename:"product-map-data.js"});

const model = sandbox.window.PRODUCT_MAP;
const failures = [];
const assert = (condition, message) => {
  if(!condition) failures.push(message);
};
const isOfficialDatadogSource = url => /^https:\/\/(www\.)?(sec\.gov|investors\.datadoghq\.com)\//.test(url || "");
const isChronological = rows => rows.every((row,index) => index === 0 || rows[index-1][0] < row[0]);

const companyIndex = sandbox.window.COMPANY_INDEX;
assert(companyIndex?.companies?.length > 0, "Company index must contain at least one company");
assert(companyIndex?.companies?.some(company => company.slug === "datadog" && company.href === "./companies/datadog/"), "Company index must link to the Datadog hypothesis route");
assert(new Set(companyIndex?.companies?.map(company => company.slug)).size === companyIndex?.companies?.length, "Company slugs must be unique");

assert(model, "window.PRODUCT_MAP must be exported");
if(!model){
  console.error("Validation failed:\n- " + failures.join("\n- "));
  process.exit(1);
}

const kpiSource = fs.readFileSync(path.join(companyRoot, "data", "kpi-data.js"), "utf8");
vm.runInContext(kpiSource, sandbox, {filename:"kpi-data.js"});
const kpis = sandbox.window.KPI_DATA;
assert(kpis, "window.KPI_DATA must be exported");
if(kpis){
  assert(kpis.quarterly.length === 28, "KPI history must contain 28 quarterly financial periods");
  assert(kpis.annualFcfEconomics?.length === 5, "FCF economics history must contain FY2021 through FY2025");
  assert(kpis.quarterlyFcfEconomics?.length === 2, "Quarterly FCF economics must contain comparable Q2 2025 and Q2 2026 periods");
  assert(kpis.annualOperations?.length === 7, "Annual operations history must contain FY2019 through FY2025");
  assert(kpis.annualCapital?.length === 9, "Capital history must contain FY2019 through Q2 2026");
  assert(kpis.adoption.length === 25, "Product adoption history must contain 25 periods");
  assert(kpis.quarterly.at(-1)?.[0] === "2026Q2", "Latest financial KPI period must be 2026Q2");
  assert(kpis.adoption.at(-1)?.[0] === "2026Q2", "Latest adoption KPI period must be 2026Q2");
  assert(kpis.quarterly.every(row => row.length === 6 && row[5]?.startsWith("https://")), "Every financial KPI row needs an official source URL");
  assert(kpis.annualFcfEconomics?.every(row => row.length === 5 && row[4]?.startsWith("https://")), "Every FCF economics row needs an official source URL");
  assert(kpis.quarterlyFcfEconomics?.every(row => row.length === 8 && row[7]?.startsWith("https://")), "Every quarterly FCF economics row needs complete bridge inputs and an official source URL");
  assert(kpis.cloudCostEfficiency?.annualCloudCostIncrease === 149.8, "FY2025 disclosed cloud-cost increase must tie to $149.8M");
  assert(kpis.cloudCostEfficiency?.q1CloudCostIncrease === 41.8, "Q1 2026 disclosed cloud-cost increase must tie to $41.8M");
  assert(kpis.cloudCostEfficiency?.q2CloudCostIncrease === 64.1, "Q2 2026 disclosed cloud-cost increase must tie to $64.1M");
  assert(["annualSourceUrl","q1SourceUrl","q2SourceUrl","q1ExplanationUrl","q2EfficiencyUrl","q3EfficiencyUrl"].every(key => isOfficialDatadogSource(kpis.cloudCostEfficiency?.[key])), "Cloud-cost evidence must use SEC or Datadog IR sources");
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
  assert(kpis.q2Evidence?.period === "2026Q2", "Quarterly evidence must identify Q2 2026");
  assert(isOfficialDatadogSource(kpis.q2Evidence?.sourceUrl) && isOfficialDatadogSource(kpis.q2Evidence?.filingUrl), "Q2 evidence must use official transcript and filing sources");
  assert(kpis.coreEngineScale?.length === 3, "Core product-engine scale view must contain three disclosed engines");
  assert(kpis.coreEngineScale?.every(engine =>
    typeof engine.scopeComparable === "boolean" &&
    isOfficialDatadogSource(engine.fromSourceUrl) && isOfficialDatadogSource(engine.toSourceUrl)
  ), "Every core product-engine trajectory needs comparability status and official endpoint sources");
  const segmentation = kpis.segmentation;
  assert(segmentation?.period === "2026Q2", "Segmentation dashboard must identify Q2 2026");
  assert(["reported","derived","proxy","scenario"].every(type => segmentation?.evidenceTypes?.[type]), "Segmentation dashboard must define every evidence class");
  assert(segmentation?.product?.core?.length === 3 && segmentation.product.core.every(row => row.shareLabel === "Mix not disclosed" && isOfficialDatadogSource(row.sourceUrl)), "Product segmentation must preserve three reported ARR floors without presenting product shares");
  assert(segmentation?.product?.productSignals?.every(row => isOfficialDatadogSource(row.sourceUrl)), "Every nested or adjacent product signal needs an official source");
  const geographyCurrent = segmentation?.geography?.rows?.reduce((sum,row)=>sum+row.current,0);
  const geographyPrior = segmentation?.geography?.rows?.reduce((sum,row)=>sum+row.prior,0);
  assert(Math.abs(geographyCurrent-1121.454) < .001 && Math.abs(geographyPrior-826.760) < .001, "Geography rows must tie to Q2 2026 and Q2 2025 revenue");
  assert(isOfficialDatadogSource(segmentation?.geography?.sourceUrl), "Geography segmentation needs an official filing source");
  const customerSize = segmentation?.customerSize;
  assert(customerSize?.totalCustomers >= customerSize?.largeCustomers && customerSize?.largeCustomers > customerSize?.millionCustomers, "Customer-size cohorts must nest logically");
  assert(customerSize?.largeArrShare === .91 && customerSize?.priorLargeArrShare === .89, "Large-customer ARR concentration must retain disclosed rounded shares");
  const growthBridge = segmentation?.growthBridge;
  assert(Math.abs(growthBridge?.q2?.existingShare+growthBridge?.q2?.newShare-1) < .000001 && Math.abs(growthBridge?.firstHalf?.existingShare+growthBridge?.firstHalf?.newShare-1) < .000001, "Existing and new customer growth contributions must sum to 100%");
  assert(Math.abs(growthBridge?.q2?.revenueIncrease-(1121.454-826.760)) < .001, "Q2 customer growth bridge must tie to reported revenue increase");
  assert(Math.abs(growthBridge?.firstHalf?.revenueIncrease-(1006.426+1121.454-761.553-826.760)) < .001, "H1 customer growth bridge must tie to reported revenue increase");
  assert(segmentation?.multiProduct?.rows?.length === 5 && segmentation.multiProduct.rows.every(row => row.current >= row.prior), "Multi-product segmentation must contain five non-declining YoY cohorts");
  const ai = segmentation?.ai;
  const priorQuarterRevenue = 826.760;
  const currentQuarterRevenue = 1121.454;
  const impliedAiShare = nonAiGrowth => (currentQuarterRevenue-priorQuarterRevenue*(1-ai.historicalRevenueShare)*(1+nonAiGrowth))/currentQuarterRevenue;
  assert(Math.abs(impliedAiShare(ai.nonAiGrowthScenarioRange[1])-ai.scenarioRevenueShareRange[0]) < .001 && Math.abs(impliedAiShare(ai.nonAiGrowthScenarioRange[0])-ai.scenarioRevenueShareRange[1]) < .001, "AI share scenario must tie to the disclosed historical mix and stated non-AI growth assumptions");
  assert(ai.customers >= ai.customersAbove1mAnnualSpend && ai.customersAbove1mAnnualSpend >= ai.customersAbove10mAnnualSpend, "AI customer spend thresholds must nest logically");
  assert([ai.currentSourceUrl,ai.priorSourceUrl,ai.integrationSourceUrl].every(isOfficialDatadogSource), "AI segmentation needs official source routes");
  assert(kpis.nrr.every(row => row[1] >= 1 && row[1] <= 1.5), "NRR visualization values must be stored as 1.00-based percentages");
  assert(kpis.grr.every(row => row[1] >= .9 && row[1] <= 1), "GRR visualization values must be stored as 1.00-based percentages");
  const auditableSeries = [
    ["quarterly",kpis.quarterly,5],["adoption",kpis.adoption,7],["total customers",kpis.totalCustomers,2],
    ["annual FCF economics",kpis.annualFcfEconomics,4],["quarterly FCF economics",kpis.quarterlyFcfEconomics,7],["annual operations",kpis.annualOperations,10],["annual capital",kpis.annualCapital,7],
    ["$1M customers",kpis.millionCustomers,2],["NRR",kpis.nrr,3],["GRR",kpis.grr,3],["AI customers",kpis.aiIntegrationCustomers,2],
  ];
  auditableSeries.forEach(([label,rows,urlIndex]) => {
    assert(isChronological(rows), `${label} series must be chronological with unique periods`);
    assert(rows.every(row => isOfficialDatadogSource(row[urlIndex])), `${label} series must use SEC or Datadog IR sources`);
  });
  assert(kpis.aiActivity.every(row => isOfficialDatadogSource(row[4])), "AI activity must use SEC or Datadog IR sources");
  assert(isOfficialDatadogSource(kpis.productPortfolio?.sourceUrl), "Product portfolio must use an SEC or Datadog IR source");
  const latest = kpis.quarterly.at(-1);
  assert(Math.abs(latest[1] - 1121.454) < 0.001, "Q2 2026 revenue tie-out failed");
  assert(Math.abs(latest[2] / latest[1] - 0.785891) < 0.001, "Q2 2026 GAAP gross-margin tie-out failed");
  assert(Math.abs(latest[3] / latest[1] - 0.795663) < 0.001, "Q2 2026 non-GAAP gross-margin tie-out failed");
  assert(latest[4] === 4720, "Q2 2026 large-customer tie-out failed");
  const latestFcf = kpis.annualFcfEconomics.at(-1);
  assert(latestFcf[0] === "2025", "Latest annual FCF economics period must be FY2025");
  assert(Math.abs(latestFcf[2] - latestFcf[3] - 140.575) < 0.001, "FY2025 owner-FCF tie-out failed");
  assert(Math.abs((latestFcf[2] - latestFcf[3]) / latestFcf[1] - 0.041018) < 0.001, "FY2025 owner-FCF margin tie-out failed");
  const latestQuarterlyFcf = kpis.quarterlyFcfEconomics.at(-1);
  const latestQuarterlyOwnerFcf = latestQuarterlyFcf[2]-latestQuarterlyFcf[3]-latestQuarterlyFcf[4]-latestQuarterlyFcf[5]-latestQuarterlyFcf[6];
  assert(latestQuarterlyFcf[0] === "2026Q2", "Latest quarterly FCF economics period must be Q2 2026");
  assert(Math.abs(latestQuarterlyOwnerFcf - 51.571) < 0.001, "Q2 2026 owner-FCF bridge tie-out failed");
  assert(Math.abs(latestQuarterlyOwnerFcf/latestQuarterlyFcf[1] - 0.045986) < 0.001, "Q2 2026 owner-FCF margin tie-out failed");
  const latestOperations = kpis.annualOperations.at(-1);
  assert(latestOperations[0] === "2025", "Latest annual operations period must be FY2025");
  assert(Math.abs(latestOperations[6] / latestOperations[1] - -0.012947) < 0.001, "FY2025 operating-margin tie-out failed");
  assert(Math.abs(latestOperations[9] / kpis.annualOperations.at(-2)[9] - 1 - 0.030420) < 0.001, "FY2025 year-end share-growth tie-out failed");
  const latestCapital = kpis.annualCapital.at(-1);
  const latestAnnualCapital = kpis.annualCapital.find(row => row[0] === "2025");
  assert(latestCapital[0] === "2026Q2", "Latest capital period must be Q2 2026");
  assert(Math.abs(latestCapital[1] + latestCapital[2] - 4985.438) < 0.001, "Q2 2026 liquidity tie-out failed");
  assert(Math.abs(latestAnnualCapital[5] - 3242.653) < 0.001, "FY2025 three-year R&D-adjusted capital tie-out failed");
  assert(Math.abs(latestAnnualCapital[6] - 0.151731) < 0.001, "FY2025 three-year R&D-adjusted ROIC tie-out failed");
  assert(latestCapital[4] == null && latestCapital[5] == null && latestCapital[6] == null, "Q2 interim capital row must not fabricate analyst-adjusted ROIC inputs");
}

const peerSource = fs.readFileSync(path.join(companyRoot, "data", "peer-comps-data.js"), "utf8");
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
    const grossMargin = row.ltmGrossProfit / row.ltmRevenue;
    const ownerFcf = ntmRevenue * (fcfMargin-sbcMargin);
    return {
      ltmGrowth, ntmGrowth, fcfMargin, sbcMargin,
      grossMargin,
      operatingMargin: row.ltmOperatingIncome / row.ltmRevenue,
      dilution: row.latestBasicShares / row.priorBasicShares - 1,
      rule40: ltmGrowth + fcfMargin,
      economicSensitivity: ltmGrowth + fcfMargin - sbcMargin,
      evLtmRevenue: enterpriseValue / row.ltmRevenue,
      evNtmRevenue: enterpriseValue / ntmRevenue,
      evNtmGrossProfit: enterpriseValue / (ntmRevenue * grossMargin),
      equityNtmFcf: row.marketCap / (ntmRevenue * fcfMargin),
      equityNtmOwnerFcf: ownerFcf > 0 ? row.marketCap / ownerFcf : Number.POSITIVE_INFINITY,
      ntmFcfYield: ntmRevenue * fcfMargin / row.marketCap,
      ownerFcfYield: ntmRevenue * (fcfMargin-sbcMargin) / row.marketCap,
    };
  };
  const enriched = rows.map(row => ({...row,...metrics(row)}));
  const ddog = enriched.find(row => row.ticker === "DDOG");
  const broad = enriched.filter(row => row.ticker !== "DDOG");
  const direct = enriched.filter(row => row.bucket === "direct");
  assert(peerModel.meta.valuationDate === "2026-08-06", "Peer valuation date must be 2026-08-06");
  assert(rows.length === 9, "Peer set must contain Datadog and eight comparison companies");
  assert(rows.filter(row => row.bucket === "target").length === 1, "Peer set must contain one target company");
  assert(direct.map(row => row.ticker).sort().join(",") === "DT,ESTC", "Direct peer set must contain DT and ESTC");
  assert(rows.every(row => peerModel.buckets[row.bucket]), "Every peer must use a registered comparison bucket");
  assert(rows.every(row => row.price > 0 && row.marketCap > 0 && row.ltmRevenue > 0 && row.ltmPriorRevenue > 0), "Every peer needs valid market and LTM revenue inputs");
  assert(rows.every(row => row.latestBasicShares > 0 && row.priorBasicShares > 0), "Every peer needs comparable basic-share inputs");
  assert(rows.every(row => ["overview","forecast","income","cash-flow","balance-sheet"].every(statement => peerModel.sourceFor(row.ticker,statement).startsWith("https://stockanalysis.com/"))), "Every peer needs valid source URLs");
  assert(Math.abs(ddog.ltmGrowth - .315203) < .00001, "DDOG LTM growth tie-out failed");
  assert(Math.abs(ddog.ntmGrowth - .251558) < .00001, "DDOG NTM growth proxy tie-out failed");
  assert(Math.abs(ddog.fcfMargin - .270442) < .00001, "DDOG standardized FCF margin tie-out failed");
  assert(Math.abs(ddog.rule40 - .585644) < .00001, "DDOG Rule of 40 tie-out failed");
  assert(Math.abs(ddog.economicSensitivity - .378159) < .00001, "DDOG Economic sensitivity tie-out failed");
  assert(Math.abs(ddog.evLtmRevenue - 19.5678) < .001, "DDOG EV / LTM revenue tie-out failed");
  assert(Math.abs(ddog.evNtmRevenue - 15.6348) < .001, "DDOG EV / NTM revenue tie-out failed");
  assert(Math.abs(ddog.evLtmRevenue - ddog.evNtmRevenue*(1+ddog.ntmGrowth)) < .00001, "DDOG LTM and NTM revenue multiples must reconcile");
  assert(Math.abs(ddog.evNtmGrossProfit*ddog.grossMargin-ddog.evNtmRevenue) < .00001, "DDOG gross-profit multiple must reconcile to revenue multiple and gross margin");
  assert(Math.abs(ddog.ntmFcfYield*ddog.equityNtmFcf-1) < .00001, "DDOG NTM FCF yield must reconcile to Equity / NTM FCF");
  assert(ddog.ownerFcfYield > 0 && ddog.ownerFcfYield < ddog.ntmFcfYield, "DDOG owner FCF yield must remain positive and below standardized FCF yield");
  assert(Math.abs(ddog.ownerFcfYield*ddog.equityNtmOwnerFcf-1) < .00001, "DDOG owner FCF yield must reconcile to P / Owner FCF");
  assert(enriched.filter(row => row.ownerFcfYield <= 0).every(row => !Number.isFinite(row.equityNtmOwnerFcf)), "Non-positive owner FCF must produce an NM owner multiple");
  assert(Math.abs(median(broad.map(row => row.evNtmRevenue)) - 7.2751) < .001, "Broad-peer EV / NTM revenue median tie-out failed");
  assert(Math.abs(median(direct.map(row => row.evNtmRevenue)) - 4.5389) < .001, "Direct-peer EV / NTM revenue median tie-out failed");
  assert(ddog.evNtmRevenue / median(broad.map(row => row.evNtmRevenue)) - 1 > 1, "DDOG broad-peer valuation premium must exceed 100%");
}

const valuationSource = fs.readFileSync(path.join(companyRoot, "data", "valuation-context-data.js"), "utf8");
vm.runInContext(valuationSource, sandbox, {filename:"valuation-context-data.js"});
const valuationModel = sandbox.window.VALUATION_CONTEXT;
assert(valuationModel, "window.VALUATION_CONTEXT must be exported");
if(valuationModel){
  const history = valuationModel.history.map(values => Object.fromEntries(valuationModel.historyFields.map((field,index) => [field,values[index]])));
  const market = valuationModel.market.map(values => Object.fromEntries(valuationModel.marketFields.map((field,index) => [field,values[index]])));
  const evLtmRevenue = row => (row.marketCap+row.debt-row.cash)/row.ltmRevenue;
  const ltmGrowth = row => row.ltmRevenue/row.ltmPriorRevenue-1;
  const highGrowthMarket = market.filter(row => ltmGrowth(row) >= .15);
  const infrastructureTickers = valuationModel.segments.infrastructureSecurityData;
  const infrastructureMarket = market.filter(row => infrastructureTickers.includes(row.ticker));
  assert(valuationModel.meta.valuationDate === "2026-08-06", "Valuation-context date must match the peer snapshot");
  assert(history.length >= 16 && isChronological(history.map(row => [row.date])), "DDOG valuation history must be chronological and span at least four years");
  assert(history.at(-1)?.date === valuationModel.meta.valuationDate, "DDOG valuation history must end on the valuation date");
  assert(Math.abs(evLtmRevenue(history.at(-1))-19.5678) < .001, "Current DDOG historical-context multiple must tie to peer comps");
  assert(market.length === valuationModel.meta.broadSoftwareConstituentCount, "Broad-software count must tie to metadata");
  assert(highGrowthMarket.length === valuationModel.meta.highGrowthConstituentCount, "High-growth software count must tie to metadata");
  assert(infrastructureMarket.length === valuationModel.meta.infrastructureSecurityDataConstituentCount, "Infrastructure / security / data count must tie to metadata");
  assert(new Set(infrastructureTickers).size === infrastructureTickers.length, "Infrastructure / security / data membership must not contain duplicates");
  assert(!market.some(row => row.ticker === "DDOG"), "Datadog must be excluded from every software-market benchmark");
  assert(market.every(row => row.marketCap >= 5e9), "Every broad-software constituent must have at least $5B market capitalization");
  assert(highGrowthMarket.every(row => ltmGrowth(row) >= .15), "Every high-growth market constituent must have at least 15% LTM revenue growth");
  assert(market.some(row => ltmGrowth(row) < .15), "Broad software must retain slower-growing companies omitted by the high-growth screen");
  assert(market.every(row => row.ltmRevenue > 0 && row.ltmPriorRevenue > 0 && Number.isFinite(evLtmRevenue(row))), "Every software-market constituent needs valid EV / LTM revenue inputs");
  assert(market.every(row => ["income","balance","market-cap"].every(statement => valuationModel.sourceFor(row.ticker,statement).startsWith("https://stockanalysis.com/"))), "Every software-market constituent needs valid source URLs");
  assert(Object.values(valuationModel.sources).every(url => url.startsWith("https://")), "Valuation-context source registry must contain valid URLs");
}

const intrinsicSource = fs.readFileSync(path.join(companyRoot, "data", "intrinsic-valuation-data.js"), "utf8");
vm.runInContext(intrinsicSource, sandbox, {filename:"intrinsic-valuation-data.js"});
const intrinsicModel = sandbox.window.INTRINSIC_VALUATION;
assert(intrinsicModel, "window.INTRINSIC_VALUATION must be exported");
if(intrinsicModel){
  const input=intrinsicModel.model;
  const costOfEquity=input.riskFreeRate+input.beta*input.equityRiskPremium;
  const wacc=costOfEquity*input.equityWeight+input.preTaxCostOfDebt*(1-input.marginalTaxRate)*input.debtWeight;
  const netCash=input.cashAndMarketableSecurities-input.convertibleDebt-input.operatingLeaseLiabilities;
  const runDcf=revenueGrowth=>{
    let revenue=input.baseRevenue,previousNwc=input.historicalNwc,pvExplicit=0,terminalFcff=0;
    input.forecastYears.forEach((year,index)=>{
      const growth=index===0?input.firstForecastGrowth:revenueGrowth;
      revenue*=1+growth;
      const ebit=revenue*input.ebitMargin[index];
      const cashTaxes=Math.max(ebit*input.cashTaxRate[index],0);
      const da=revenue*input.daPercentRevenue[index];
      const capex=revenue*input.capexPercentRevenue[index];
      const nwc=revenue*input.nwcPercentRevenue[index];
      const fcff=ebit-cashTaxes+da-capex-(nwc-previousNwc);
      pvExplicit+=fcff/Math.pow(1+wacc,index+.5);
      previousNwc=nwc;terminalFcff=fcff;
    });
    const pvTerminal=terminalFcff*(1+input.terminalGrowth)/(wacc-input.terminalGrowth)/Math.pow(1+wacc,input.forecastYears.length);
    return {enterpriseValue:pvExplicit+pvTerminal,terminalRevenue:revenue,terminalFcff};
  };
  const solveTarget=target=>{
    const targetEv=target.price*input.dilutedShares-netCash;
    let low=-.2,high=.8;
    for(let index=0;index<180;index++){
      const midpoint=(low+high)/2;
      if(runDcf(midpoint).enterpriseValue<targetEv) low=midpoint; else high=midpoint;
    }
    const growth=(low+high)/2;
    return {growth,targetEv,...runDcf(growth)};
  };
  const marketTarget=intrinsicModel.targets.find(target=>target.id==="market");
  const morningstarTarget=intrinsicModel.targets.find(target=>target.id==="morningstar");
  const market=solveTarget(marketTarget);
  const morningstar=solveTarget(morningstarTarget);
  assert(intrinsicModel.meta.modelDate === "2026-08-07", "Intrinsic-valuation model date must be 2026-08-07");
  assert(marketTarget?.price === 229.29, "Current-price reverse DCF must use the 6 August 2026 $229.29 close");
  assert(morningstarTarget?.price === 200, "Morningstar reverse DCF must use the $200 fair value");
  assert(input.forecastYears.length === 10 && input.forecastYears[0] === 2026 && input.forecastYears.at(-1) === 2035, "Reverse DCF must span FY2026 through FY2035");
  ["ebitMargin","cashTaxRate","daPercentRevenue","capexPercentRevenue","nwcPercentRevenue"].forEach(key=>assert(input[key].length===input.forecastYears.length, `Intrinsic-valuation ${key} must match the forecast horizon`));
  assert(Math.abs(wacc-.097977)<.000001, "Reverse DCF WACC tie-out failed");
  assert(Math.abs(netCash-3707.637)<.001, "Reverse DCF net-cash bridge tie-out failed");
  assert(Math.abs(market.growth-.2685053)<.000001, "Current-price implied revenue growth tie-out failed");
  assert(Math.abs(morningstar.growth-.2481750)<.000001, "Morningstar-price implied revenue growth tie-out failed");
  assert(Math.abs(market.terminalRevenue-37928.477)<.01, "Current-price FY2035 revenue tie-out failed");
  assert(Math.abs(morningstar.terminalRevenue-32795.484)<.01, "Morningstar-price FY2035 revenue tie-out failed");
  assert(Math.abs(market.enterpriseValue-market.targetEv)<.01 && Math.abs(morningstar.enterpriseValue-morningstar.targetEv)<.01, "Reverse DCF enterprise values must tie to both target prices");
  assert(intrinsicModel.morningstar.fairValue===morningstarTarget.price, "Morningstar disclosed fair value must tie to the reverse-DCF target");
  assert(intrinsicModel.morningstar.forecastRevenue[2030]===10256 && intrinsicModel.morningstar.wacc===.086, "Morningstar disclosed model cross-check failed");
  const calculator = intrinsicModel.calculator;
  const calculatorValue = growth => {
    const terminalFcf = calculator.currentFcf*Math.pow(1+growth,calculator.forecastYears);
    const futurePrice = terminalFcf*calculator.terminalPriceToFcf/calculator.shares;
    return futurePrice/Math.pow(1+calculator.discountRate,calculator.forecastYears);
  };
  const scenarioValues = calculator.scenarios.map(scenario => ({
    ...scenario,
    fairValue: calculatorValue(calculator.annualGrowth*calculator.caseVariance[scenario.id]),
  }));
  const weightedValue = scenarioValues.reduce((sum,scenario) => sum+scenario.fairValue*scenario.probability,0);
  const baseValue = scenarioValues.find(scenario => scenario.id === "base")?.fairValue;
  const equivalent = calculator.morningstarEquivalent;
  const equivalentTerminalFcf = calculator.currentFcf*Math.pow(1+equivalent.annualGrowth,calculator.forecastYears);
  const equivalentFairValue = equivalentTerminalFcf*equivalent.terminalPriceToFcf/calculator.shares/Math.pow(1+equivalent.discountRate,calculator.forecastYears);
  const growthBridgeValue = equivalentTerminalFcf*calculator.terminalPriceToFcf/calculator.shares/Math.pow(1+calculator.discountRate,calculator.forecastYears);
  const discountBridgeValue = equivalentTerminalFcf*calculator.terminalPriceToFcf/calculator.shares/Math.pow(1+equivalent.discountRate,calculator.forecastYears);
  const morningstarTerminalShare = intrinsicModel.morningstar.presentValueStageThree/intrinsicModel.morningstar.firmValue;
  assert(Math.abs(calculator.currentFcf-959) < 0.001, "Calculator current FCF must match the $959M screenshot input");
  assert(Math.abs(calculator.shares-355.96018500008676) < 0.000001, "Calculator shares must match the current 355.96M screenshot input");
  assert(Math.abs(baseValue-151.1792255649367) < 0.001, "Calculator base fair value must tie to $151.18");
  assert(Math.abs(weightedValue-157.83348132342923) < 0.001, "Calculator probability-weighted fair value must tie to $157.83");
  assert(Math.abs(growthBridgeValue-181.73251766282678) < 0.001, "Growth sensitivity bridge must tie to $181.73");
  assert(Math.abs(discountBridgeValue-197.21245765571052) < 0.001, "Discount-rate sensitivity bridge must tie to $197.21");
  assert(Math.abs(equivalentFairValue-equivalent.fairValue) < 0.001, "Morningstar-equivalent inputs must tie to $200.00");
  assert(Math.abs(morningstarTerminalShare-0.5227221748687811) < 0.000001, "Morningstar Stage III share must tie to 52.3% of firm value");
  const disclosedYears = Object.keys(intrinsicModel.morningstar.forecastRevenue);
  assert(disclosedYears.length === 5 && disclosedYears.every(year => intrinsicModel.morningstar.forecastRevenueGrowth[year] != null && intrinsicModel.morningstar.forecastFcff[year] != null && intrinsicModel.morningstar.forecastFcffMargin[year] != null), "Morningstar Stage I table must have complete 2026-2030 growth, FCFF, and margin inputs");
  assert(Object.values(intrinsicModel.sources).every(source=>source.url?.startsWith("https://") && source.date), "Every intrinsic-valuation source needs a dated HTTPS route");
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
assert(model.businessModelAnalysis, "Standalone business-model analysis is required");
assert(model.economicMoatAnalysis, "Standalone economic-moat analysis is required");
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

assert(model.businessModelAnalysis.asOf === model.meta.asOf, "Business-model analysis and dataset as-of must match");
assert(model.businessModelAnalysis.verdicts.length === 3, "Business model must keep its three operating verdicts separate from moat judgment");
assert(model.businessModelAnalysis.drivers.length >= 4, "Business model must explain the complete revenue and scaling engine");
for(const verdict of model.businessModelAnalysis.verdicts){
  assert(Boolean(model.sources[verdict.sourceId]), `${verdict.label}: business-model verdict source is unknown`);
  assert(!/moat/i.test(`${verdict.label} ${verdict.value} ${verdict.note}`), `${verdict.label}: business-model verdict must not contain a moat assessment`);
}
for(const driver of model.businessModelAnalysis.drivers){
  assert(driver.sourceIds.length > 0, `${driver.label}: business-model driver sources are required`);
  driver.sourceIds.forEach(sourceId => assert(Boolean(model.sources[sourceId]), `${driver.label}: unknown source ${sourceId}`));
}
assert(model.businessModelAnalysis.watchlist.length >= 4, "Business-model watchlist must include all monitoring dimensions");

assert(model.economicMoatAnalysis.asOf === model.meta.asOf, "Economic-moat analysis and dataset as-of must match");
const requiredMoatRows = new Set([
  "overall-moat-rating","switching-costs","network-effects","product-feedback-loop","toto-data-flywheel",
  "opentelemetry","multi-product-adoption","cloud-neutrality","cost-advantage",
]);
const actualMoatRows = new Set(model.economicMoatAnalysis.comparisonRows.map(row => row.id));
assert(requiredMoatRows.size === actualMoatRows.size && [...requiredMoatRows].every(id => actualMoatRows.has(id)), "Economic-moat comparison must contain all nine required factors exactly once");
assert(model.economicMoatAnalysis.ourRating.value === "Narrow", "Our moat rating must remain conservative");
assert(model.economicMoatAnalysis.morningstarRating.value === "Wide", "Morningstar's moat rating must be represented as Wide");
const indirectLoop = model.economicMoatAnalysis.indirectFeedbackLoop;
assert(indirectLoop.steps.length === 4, "Indirect feedback loop must explain all four mechanism steps");
assert(/does not directly/i.test(indirectLoop.definition), "Indirect feedback loop must distinguish direct customer-to-customer value creation");
assert(/R&D|product/i.test(indirectLoop.whyIndirect), "Indirect feedback loop must identify Datadog's execution layer");
indirectLoop.sourceIds.forEach(sourceId => assert(Boolean(model.sources[sourceId]), `Indirect feedback loop: unknown source ${sourceId}`));
for(const row of model.economicMoatAnalysis.comparisonRows){
  assert(["agree","partial","disagree"].includes(row.tone), `${row.factor}: invalid comparison tone`);
  assert(row.sourceIds.length > 0, `${row.factor}: moat comparison sources are required`);
  row.sourceIds.forEach(sourceId => assert(Boolean(model.sources[sourceId]), `${row.factor}: unknown source ${sourceId}`));
}
const totoRow = model.economicMoatAnalysis.comparisonRows.find(row => row.id === "toto-data-flywheel");
assert(/open/i.test(totoRow.ourView) && /Apache 2\.0/i.test(totoRow.ourView), "Toto must be identified as open-weights under Apache 2.0");
assert(!/proprietary moat/i.test(totoRow.ourView.replace(/not proprietary moat/i,"")), "Toto model must not be represented as proprietary moat");

assert(model.meta.asOf === "2026-Q2", "Dataset as-of must be 2026-Q2");
assert(model.meta.companyReportedProductCount === 26, "Company-reported product count must stay a separately labeled fact");

if(failures.length){
  console.error(`Validation failed (${failures.length}):\n- ${failures.join("\n- ")}`);
  process.exit(1);
}

console.log(`Validated ${seenNames.size} canonical mapped entities across ${references} placements, ${model.categories.length} markets, and ${model.categories.reduce((sum, category) => sum + category.suites.length, 0)} suites.`);
