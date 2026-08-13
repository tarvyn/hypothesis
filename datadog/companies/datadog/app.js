(() => {
  const model = window.PRODUCT_MAP;
  if (!model) throw new Error("Product map data did not load.");
  const kpiModel = window.KPI_DATA;
  if (!kpiModel) throw new Error("KPI data did not load.");
  const peerModel = window.PEER_COMPS;
  if (!peerModel) throw new Error("Peer comps data did not load.");
  const valuationModel = window.VALUATION_CONTEXT;
  if (!valuationModel) throw new Error("Valuation context data did not load.");
  const intrinsicModel = window.INTRINSIC_VALUATION;
  if (!intrinsicModel) throw new Error("Intrinsic valuation data did not load.");

  const MOAT = {
    data_gravity:{label:"Data gravity",color:"#7c6bf5"},
    cross_signal:{label:"Cross-signal context",color:"#2ed6a0"},
    integration_breadth:{label:"Integration breadth",color:"#33c6e6"},
    installed_base:{label:"Installed base",color:"#4aa3e0"},
    workflow_lock_in:{label:"Workflow lock-in",color:"#f5b13f"},
    feedback_loop:{label:"Feedback loop",color:"#ff5c8a"},
    developer_habit:{label:"Developer habit",color:"#a78bfa"},
    platform_access:{label:"Platform access",color:"#55c2a9"},
    bundle:{label:"Bundle / consolidation",color:"#6b7398"},
  };

  const CATEGORY_LABELS = Object.fromEntries(model.categories.map(category => [category.id, category.catName]));

  const SCORECARD = [
    {id:"maturity",short:"MAT",label:"Maturity",definitions:model.maturity},
    {id:"position",short:"POS",label:"Position",definitions:model.position},
    {id:"momentum",short:"MOM",label:"Momentum",definitions:model.momentum},
    {id:"moatConviction",short:"MOAT",label:"Moat contribution",definitions:model.moatConviction},
  ];

  const FILTERS = [
    {
      id:"ai_workload",
      label:"AI workload",
      purpose:"Shows products that observe, secure, or support AI workloads. This is operating exposure inside the existing map—not a separate TAM.",
      test:item => item.workloads.includes("ai"),
    },
    {
      id:"ai_optionality",
      label:"AI option",
      purpose:"Isolates earlier-stage AI products whose commercial scale or durability remains unproven.",
      test:item => item.workloads.includes("ai") && ["validated","option"].includes(item.maturity),
    },
    {
      id:"training",
      label:"Training",
      purpose:"Isolates products used while models are trained. It highlights the emerging GPU and heterogeneous-infrastructure opportunity.",
      test:item => item.workloads.includes("training"),
    },
    {
      id:"inference",
      label:"Inference",
      purpose:"Shows products involved when trained models run in production. It tracks the more established, recurring AI workload.",
      test:item => item.workloads.includes("inference"),
    },
    {
      id:"agent_interface",
      label:"Agent / interface",
      purpose:"Finds products exposed to autonomous-agent workflows or interface disintermediation. It combines upside from new usage with the risk that another interface captures value.",
      test:item => item.workloads.includes("agents") || item.dcf.includes("interface_risk"),
    },
    {
      id:"usage",
      label:"Usage",
      purpose:"Highlights usage-based monetization. These products are most sensitive to telemetry volume, cloud activity, optimization, and overages.",
      test:item => item.monetization.includes("usage"),
    },
    {
      id:"seat",
      label:"Seat",
      purpose:"Highlights products with a seat component. Revenue depends more on user adoption and team penetration than raw telemetry growth.",
      test:item => item.monetization.includes("seat"),
    },
    {
      id:"land",
      label:"Land",
      purpose:"Shows products that can win the initial customer deployment. Use it for new-logo conversion and initial deal-size analysis.",
      test:item => item.motion.includes("land"),
    },
    {
      id:"expand",
      label:"Expand",
      purpose:"Shows products that naturally cross-sell or grow with consumption. This is the main product-map lens for NRR and account expansion.",
      test:item => item.motion.includes("expand"),
    },
    {
      id:"defend",
      label:"Defend",
      purpose:"Highlights products that deepen workflows or consolidate tools. Use it to assess retention, switching costs, and GRR protection.",
      test:item => item.motion.includes("defend"),
    },
    {
      id:"regulated",
      label:"Regulated",
      purpose:"Finds products and enablers relevant to compliance-heavy buyers. It frames TAM unlock against longer sales cycles and GTM investment.",
      test:item => item.workloads.includes("regulated"),
    },
    {
      id:"byoc",
      label:"BYOC",
      purpose:"Shows customer-controlled deployment support. It can unlock sovereign and very large workloads, with added delivery and margin complexity.",
      test:item => item.capabilities.some(value => value.toLowerCase().includes("byoc")),
    },
    {
      id:"usage_optimization",
      label:"Usage optimization",
      purpose:"Highlights products where customers can reduce telemetry or infrastructure consumption without leaving Datadog.",
      test:item => item.dcf.includes("usage_optimization"),
    },
    {
      id:"gross_margin_risk",
      label:"Data / hosting cost",
      purpose:"Highlights data-intensive products whose compute, storage, or third-party cloud costs can pressure gross margin.",
      test:item => item.dcf.includes("gross_margin_risk"),
    },
    {
      id:"r_and_d_intensity",
      label:"R&D burden",
      purpose:"Highlights products whose value depends on sustained innovation before product-level economics are proven.",
      test:item => item.dcf.includes("r_and_d_intensity"),
    },
  ];

  const TAB_IDS = ["product-map","business-model","economic-moat","kpis","financials","intrinsic-valuation","peer-comps"];
  const chartSlug = value => String(value || "chart")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g,"-")
    .replace(/(^-|-$)/g,"");
  const chartCards = [...document.querySelectorAll(".kpi-chart-card")];
  const reservedChartIds = new Set([...document.querySelectorAll("[id]")].map(node => node.id));

  chartCards.forEach((card,index) => {
    const canvas = card.querySelector("canvas[id]");
    let targetId = card.id || canvas?.id;
    if(!targetId){
      const baseId = `chart-${chartSlug(card.querySelector("h3")?.textContent) || index+1}`;
      targetId = baseId;
      let suffix = 2;
      while(reservedChartIds.has(targetId)) targetId = `${baseId}-${suffix++}`;
      card.id = targetId;
      reservedChartIds.add(targetId);
    }
    card.dataset.shareTarget = targetId;
  });

  const initialHash = window.location.hash.slice(1);
  const initialTargetTab = document.getElementById(initialHash)?.closest("[data-panel]")?.dataset.panel;
  const state = {
    filters:new Set(),
    selected:null,
    activeTab:initialTargetTab || (TAB_IDS.includes(initialHash) ? initialHash : "product-map"),
    showProductScores:false,
    peerFilter:"all",
    peerSort:{
      fundamentals:{key:"ltmGrowth",direction:"desc"},
      valuation:{key:"evNtmRevenue",direction:"desc"},
    },
    peerGapCohort:"broad",
  };
  const refs = {};
  const allItems = [];
  const esc = value => String(value ?? "")
    .replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
  const pretty = value => String(value).replace(/_/g," ").replace(/\b\w/g,letter => letter.toUpperCase());
  const formatPeriod = period => {
    const match=String(period).match(/^(\d{4})Q([1-4])$/);
    return match ? `Q${match[2]} ${match[1]}` : `FY${period}`;
  };

  const headlineStats = document.getElementById("headline-stats");
  const filters = document.getElementById("filters");
  const clearFilters = document.getElementById("clear-filters");
  const explainer = document.getElementById("active-explainer");
  const enablers = document.getElementById("enablers");
  const legend = document.getElementById("legend");
  const lanes = document.getElementById("lanes");
  const reader = document.getElementById("reader");
  const backdrop = document.getElementById("backdrop");
  const readerCat = document.getElementById("r-cat");
  const readerName = document.getElementById("r-name");
  const readerTags = document.getElementById("r-tags");
  const readerBody = document.getElementById("r-body");
  const businessModelThesis = document.getElementById("business-model-thesis");
  const businessModelVerdicts = document.getElementById("business-model-verdicts");
  const businessModelFacts = document.getElementById("business-model-facts");
  const businessModelDrivers = document.getElementById("business-model-drivers");
  const businessModelWatchlist = document.getElementById("business-model-watchlist");
  const moatRatingGrid = document.getElementById("moat-rating-grid");
  const moatFeedbackLoop = document.getElementById("moat-feedback-loop");
  const moatComparisonBody = document.getElementById("moat-comparison-body");
  const moatSourceNote = document.getElementById("moat-source-note");
  const tabList = document.querySelector(".top-tabs");
  const tabButtons = [...document.querySelectorAll("[data-tab]")];
  const tabPanels = [...document.querySelectorAll("[data-panel]")];
  const productScoresToggle = document.getElementById("product-scores-toggle");
  const mapHint = document.getElementById("map-hint");
  const kpiSnapshot = document.getElementById("kpi-snapshot");
  const coreEngineScale = document.getElementById("core-engine-scale");
  const sectorScaleLanes = document.getElementById("sector-scale-lanes");
  const aiActivity = document.getElementById("ai-activity");
  const portfolioScale = document.getElementById("portfolio-scale");
  const kpiHistory = document.getElementById("kpi-history");
  const financialHistory = document.getElementById("financial-history");
  const quarterlyFcfSummary = document.getElementById("quarterly-fcf-summary");
  const quarterlyFcfTable = document.getElementById("quarterly-fcf-table");
  const quarterEvidence = document.getElementById("quarter-evidence");
  const financialSectionNav = document.querySelector(".financial-section-nav");
  const peerSectionNav = document.querySelector(".peer-section-nav");
  const peerFundamentalsBody = document.getElementById("peer-fundamentals-body");
  const peerValuationBody = document.getElementById("peer-valuation-body");
  const chartTooltip = document.getElementById("chart-tooltip");

  const financials = kpiModel.quarterly.map((row,index,rows) => {
    const [period,revenue,grossProfit,nonGaapGrossProfit,largeCustomers,sourceUrl] = row;
    const priorYear = index >= 4 ? rows[index - 4] : null;
    const costOfRevenue = revenue-grossProfit;
    const priorYearCostOfRevenue = priorYear ? priorYear[1]-priorYear[2] : null;
    return {
      period,revenue,grossProfit,nonGaapGrossProfit,largeCustomers,sourceUrl,
      costOfRevenue,
      grossMargin:grossProfit / revenue,
      nonGaapGrossMargin:nonGaapGrossProfit / revenue,
      revenueGrowth:priorYear ? revenue / priorYear[1] - 1 : null,
      costOfRevenueGrowth:priorYear ? costOfRevenue/priorYearCostOfRevenue-1 : null,
      grossMarginChange:priorYear ? grossProfit/revenue-priorYear[2]/priorYear[1] : null,
      customerGrowth:priorYear ? largeCustomers / priorYear[4] - 1 : null,
    };
  });
  const adoption = kpiModel.adoption.map(row => ({
    period:row[0],p2:row[1],p4:row[2],p6:row[3],p8:row[4],p10:row[5],
    sourceId:row[6],sourceUrl:row[7],basis:row[8],
  }));
  const adoptionByPeriod = new Map(adoption.map(row => [row.period,row]));
  const totalCustomers = kpiModel.totalCustomers.map(row => ({period:row[0],value:row[1],sourceUrl:row[2],basis:row[3] || "Point-in-time disclosure"}));
  const totalCustomersByPeriod = new Map(totalCustomers.map(row => [row.period,row]));
  const millionCustomers = kpiModel.millionCustomers.map(row => ({period:row[0],value:row[1],sourceUrl:row[2],basis:row[3]}));
  const millionCustomersByPeriod = new Map(millionCustomers.map(row => [row.period,row]));
  const nrr = kpiModel.nrr.map(row => ({period:row[0],value:row[1],label:row[2],sourceUrl:row[3],basis:row[4]}));
  const nrrByPeriod = new Map(nrr.map(row => [row.period,row]));
  const grr = kpiModel.grr.map(row => ({period:row[0],value:row[1],label:row[2],sourceUrl:row[3],basis:row[4]}));
  const grrByPeriod = new Map(grr.map(row => [row.period,row]));
  const aiCustomers = kpiModel.aiIntegrationCustomers.map(row => ({period:row[0],value:row[1],sourceUrl:row[2],basis:row[3]}));
  const aiCustomersByPeriod = new Map(aiCustomers.map(row => [row.period,row]));
  const financialsByPeriod = new Map(financials.map(row => [row.period,row]));
  const annualFcfEconomics = kpiModel.annualFcfEconomics.map(row => {
    const [period,revenue,reportedFcf,totalSbc,sourceUrl] = row;
    const ownerFcf = reportedFcf - totalSbc;
    return {
      period,revenue,reportedFcf,totalSbc,ownerFcf,sourceUrl,
      reportedMargin:reportedFcf / revenue,
      ownerMargin:ownerFcf / revenue,
    };
  });
  const annualFcfByPeriod = new Map(annualFcfEconomics.map(row => [row.period,row]));
  const quarterlyFcfEconomics = kpiModel.quarterlyFcfEconomics.map(row => {
    const [period,revenue,operatingCashFlow,propertyAndEquipment,capitalizedSoftware,expensedSbc,capitalizedSbc,sourceUrl] = row;
    const reportedFcf = operatingCashFlow-propertyAndEquipment-capitalizedSoftware;
    const totalSbc = expensedSbc+capitalizedSbc;
    const ownerFcf = reportedFcf-totalSbc;
    return {
      period,revenue,operatingCashFlow,propertyAndEquipment,capitalizedSoftware,expensedSbc,capitalizedSbc,sourceUrl,
      reportedFcf,totalSbc,ownerFcf,
      reportedMargin:reportedFcf/revenue,
      ownerMargin:ownerFcf/revenue,
    };
  });
  const cloudEfficiencyQuarters = financials.filter(row => row.costOfRevenueGrowth != null);
  const annualOperations = kpiModel.annualOperations.map((row,index,rows) => {
    const [period,revenue,grossProfit,researchAndDevelopment,salesAndMarketing,generalAndAdministrative,operatingIncome,netIncome,dilutedShares,yearEndShares,sourceUrl] = row;
    const priorYear = index ? rows[index-1] : null;
    return {
      period,revenue,grossProfit,researchAndDevelopment,salesAndMarketing,generalAndAdministrative,
      operatingIncome,netIncome,dilutedShares,yearEndShares,sourceUrl,
      grossMargin:grossProfit/revenue,
      researchAndDevelopmentMargin:researchAndDevelopment/revenue,
      salesAndMarketingMargin:salesAndMarketing/revenue,
      generalAndAdministrativeMargin:generalAndAdministrative/revenue,
      operatingMargin:operatingIncome/revenue,
      netMargin:netIncome/revenue,
      yearEndShareGrowth:priorYear ? yearEndShares/priorYear[9]-1 : null,
    };
  });
  const annualCapital = kpiModel.annualCapital.map(row => {
    const [period,cash,marketableSecurities,deferredRevenue,operatingCapital,rdAdjustedCapital,rdAdjustedRoic,sourceUrl] = row;
    return {
      period,cash,marketableSecurities,deferredRevenue,operatingCapital,rdAdjustedCapital,rdAdjustedRoic,sourceUrl,
      liquidity:cash+marketableSecurities,
    };
  });
  const median = values => {
    const sorted = [...values].filter(Number.isFinite).sort((a,b) => a-b);
    const middle = Math.floor(sorted.length/2);
    return sorted.length % 2 ? sorted[middle] : (sorted[middle-1]+sorted[middle])/2;
  };
  const quantile = (values,percentile) => {
    const sorted = [...values].filter(Number.isFinite).sort((a,b) => a-b);
    if(!sorted.length) return null;
    const position = (sorted.length-1)*percentile;
    const lower = Math.floor(position),upper = Math.ceil(position);
    return sorted[lower]+(sorted[upper]-sorted[lower])*(position-lower);
  };
  const peerRows = peerModel.companies.map(values => {
    const row = Object.fromEntries(peerModel.fields.map((field,index) => [field,values[index]]));
    const ltmGrowth = row.ltmRevenue/row.ltmPriorRevenue-1;
    const ntmGrowth = row.currentFyGrowth*row.monthsCurrentFy/12 + row.nextFyGrowth*(12-row.monthsCurrentFy)/12;
    const standardizedFcf = row.ltmCfoLessCapex-row.ltmCapitalizedSoftware;
    const fcfMargin = standardizedFcf/row.ltmRevenue;
    const sbcMargin = row.ltmSbc/row.ltmRevenue;
    const ntmRevenue = row.ltmRevenue*(1+ntmGrowth);
    const enterpriseValue = row.marketCap+row.debt-row.cash;
    const grossMargin = row.ltmGrossProfit/row.ltmRevenue;
    const fcfLessSbcMargin = fcfMargin-sbcMargin;
    const ntmOwnerFcf = ntmRevenue*fcfLessSbcMargin;
    return {
      ...row,ltmGrowth,ntmGrowth,standardizedFcf,fcfMargin,sbcMargin,ntmRevenue,enterpriseValue,
      grossMargin,
      operatingMargin:row.ltmOperatingIncome/row.ltmRevenue,
      rule40:ltmGrowth+fcfMargin,
      fcfLessSbcMargin,
      economicSensitivity:ltmGrowth+fcfMargin-sbcMargin,
      gaapRule40:ltmGrowth+row.ltmOperatingIncome/row.ltmRevenue,
      dilution:row.latestBasicShares/row.priorBasicShares-1,
      evLtmRevenue:enterpriseValue/row.ltmRevenue,
      evNtmRevenue:enterpriseValue/ntmRevenue,
      evNtmGrossProfit:enterpriseValue/(ntmRevenue*grossMargin),
      equityNtmFcf:row.marketCap/(ntmRevenue*fcfMargin),
      equityNtmOwnerFcf:ntmOwnerFcf>0?row.marketCap/ntmOwnerFcf:Number.POSITIVE_INFINITY,
      ntmFcfYield:ntmRevenue*fcfMargin/row.marketCap,
      ownerFcfYield:ntmRevenue*fcfLessSbcMargin/row.marketCap,
    };
  });
  const ddogPeer = peerRows.find(row => row.ticker === "DDOG");
  const broadPeers = peerRows.filter(row => row.ticker !== "DDOG");
  const directPeers = peerRows.filter(row => row.bucket === "direct");
  const peerMedian = (rows,key) => median(rows.map(row => row[key]));
  const valuationHistory = valuationModel.history.map(values => {
    const row = Object.fromEntries(valuationModel.historyFields.map((field,index) => [field,values[index]]));
    return {...row,enterpriseValue:row.marketCap+row.debt-row.cash,evLtmRevenue:(row.marketCap+row.debt-row.cash)/row.ltmRevenue};
  });
  const broadSoftwareMarket = valuationModel.market.map(values => {
    const row = Object.fromEntries(valuationModel.marketFields.map((field,index) => [field,values[index]]));
    const ltmGrowth = row.ltmRevenue/row.ltmPriorRevenue-1;
    const enterpriseValue = row.marketCap+row.debt-row.cash;
    return {...row,ltmGrowth,enterpriseValue,evLtmRevenue:enterpriseValue/row.ltmRevenue};
  });
  const highGrowthMarket = broadSoftwareMarket.filter(row=>row.ltmGrowth>=.15);
  const infrastructureSecurityDataTickers = new Set(valuationModel.segments.infrastructureSecurityData);
  const infrastructureSecurityDataMarket = broadSoftwareMarket.filter(row=>infrastructureSecurityDataTickers.has(row.ticker));
  let kpiChartConfigs = [];
  let financialChartConfigs = [];
  let kpisInitialized = false;
  let financialsInitialized = false;
  let intrinsicInitialized = false;
  let peersInitialized = false;

  model.categories.forEach(category => category.suites.forEach(suite => suite.products.forEach(product => {
    allItems.push({...product,categoryId:category.id,categoryName:category.catName,categoryColor:category.color,suiteName:suite.name});
  })));

  const uniqueMappedEntities = new Set(allItems.map(item => item.id)).size;
  const suiteCount = model.categories.reduce((sum,category) => sum + category.suites.length,0);
  headlineStats.innerHTML = [
    `<span class="chip"><b>${model.categories.length}</b> stable markets</span>`,
    `<span class="chip"><b>${suiteCount}</b> current suites</span>`,
    `<span class="chip"><b>${uniqueMappedEntities}</b> mapped entities</span>`,
    `<span class="chip"><b>${model.meta.companyReportedProductCount}</b> company-reported products</span>`,
    `<span class="chip">AI = <b>overlay</b>, not TAM</span>`,
    `<span class="chip">NRR <b>${esc(nrr.at(-1).label)}</b> · TTM</span>`,
  ].join("");

  function sourceLinks(sourceIds){
    return sourceIds.map(sourceId => {
      const source=model.sources[sourceId];
      if(!source) return "";
      const label=source.publisher === "Morningstar via IBKR" ? "Morningstar report" : source.label;
      return source.url
        ? `<a href="${esc(source.url)}" target="_blank" rel="noopener noreferrer">${esc(label)} ↗</a>`
        : `<span>${esc(label)}</span>`;
    }).filter(Boolean).join("");
  }

  function renderBusinessModel(){
    const assessment = model.businessModelAnalysis;
    businessModelThesis.innerHTML = `<b>Revenue logic</b><p>${esc(assessment.thesis)}</p>`;
    businessModelVerdicts.innerHTML = assessment.verdicts.map(verdict => {
      const source = model.sources[verdict.sourceId];
      return `<article class="verdict-card tone-${esc(verdict.tone)}">
        <span class="verdict-label">${esc(verdict.label)}</span>
        <strong>${esc(verdict.value)}</strong>
        ${verdict.confidence ? `<span class="verdict-confidence">${esc(verdict.confidence)} confidence</span>` : ""}
        <p>${esc(verdict.note)}</p>
        ${source?.url ? `<a href="${esc(source.url)}" target="_blank" rel="noopener noreferrer">${esc(source.label)} ↗</a>` : ""}
      </article>`;
    }).join("");
    businessModelFacts.innerHTML = assessment.facts.map(fact =>
      `<div class="company-fact"><strong>${esc(fact.value)}</strong><span>${esc(fact.label)}</span></div>`
    ).join("");
    businessModelDrivers.innerHTML = assessment.drivers.map(driver =>
      `<article class="business-driver-card">
        <span>${esc(driver.label)}</span>
        <h3>${esc(driver.title)}</h3>
        <p>${esc(driver.mechanism)}</p>
        <div><b>Investor read</b>${esc(driver.investorRead)}</div>
        <footer>${sourceLinks(driver.sourceIds)}</footer>
      </article>`
    ).join("");
    businessModelWatchlist.innerHTML = assessment.watchlist.map(item =>
      `<article class="watch-item">
        <h3>${esc(item.label)}</h3>
        <p class="confirm"><b>Confirm</b>${esc(item.confirmation)}</p>
        <p class="warning"><b>Warn</b>${esc(item.warning)}</p>
      </article>`
    ).join("");
  }

  function renderEconomicMoat(){
    const moat=model.economicMoatAnalysis;
    const ratingCard=(label,rating,tone) => `<article class="moat-rating-card ${esc(tone)}">
      <span>${esc(label)}</span>
      <div class="moat-rating-value">${esc(rating.value)}</div>
      ${rating.dynamics ? `<p class="moat-rating-meta">${esc(rating.dynamics)} · ${esc(rating.confidence)} confidence</p>` : ""}
      <p>${esc(rating.rationale)}</p>
      <footer>${sourceLinks(rating.sourceIds)}</footer>
    </article>`;
    moatRatingGrid.innerHTML = [
      ratingCard("Our analysis",moat.ourRating,"our-rating"),
      ratingCard("Morningstar",moat.morningstarRating,"morningstar-rating"),
    ].join("");
    const loop=moat.indirectFeedbackLoop;
    moatFeedbackLoop.innerHTML = `
      <header>
        <div><span>${esc(loop.label)}</span><h3>${esc(loop.title)}</h3></div>
        <p>${esc(loop.definition)}</p>
      </header>
      <ol>${loop.steps.map(step=>`<li><span>${esc(step.label)}</span><b>${esc(step.title)}</b><p>${esc(step.detail)}</p></li>`).join("")}</ol>
      <div class="moat-loop-interpretation">
        <p><b>Why “indirect”?</b>${esc(loop.whyIndirect)}</p>
        <p><b>Investment read</b>${esc(loop.investmentRead)}</p>
      </div>
      <footer>${sourceLinks(loop.sourceIds)}</footer>`;
    moatComparisonBody.innerHTML = moat.comparisonRows.map(row =>
      `<tr class="moat-row tone-${esc(row.tone)}">
        <th scope="row"><span>${esc(row.factor)}</span><small class="moat-row-tone">${esc(row.tone === "partial" ? "Partial agreement" : row.tone)}</small><footer>${sourceLinks(row.sourceIds)}</footer></th>
        <td>${esc(row.ourView)}</td>
        <td>${esc(row.morningstarView)}</td>
        <td><b>${esc(row.conclusion)}</b></td>
      </tr>`
    ).join("");
    moatSourceNote.innerHTML = `<b>Source boundary</b><p>${esc(moat.sourceNote)}</p>`;
  }

  function money(value){
    return value >= 1000 ? `$${(value/1000).toFixed(3)}B` : `$${value.toFixed(1)}M`;
  }

  function signedMoney(value){
    return `${value < 0 ? "−" : ""}$${Math.abs(value).toFixed(1)}M`;
  }

  function pct(value,digits=1){
    return value == null ? "—" : `${(value*100).toFixed(digits)}%`;
  }

  function number(value){
    return value == null ? "—" : Math.round(value).toLocaleString("en-US");
  }

  function sourceAnchor(url,label="Source"){
    return `<a href="${esc(url)}" target="_blank" rel="noopener noreferrer">${esc(label)} ↗</a>`;
  }

  function renderKpiSnapshot(){
    const latest = financials.at(-1);
    const latestAdoption = adoption.at(-1);
    const latestTotalCustomerRow = totalCustomers.at(-1);
    const priorYearTotalCustomers = totalCustomersByPeriod.get(`${Number(latestTotalCustomerRow.period.slice(0,4))-1}${latestTotalCustomerRow.period.slice(4)}`)?.value;
    const latestTotalCustomers = latestTotalCustomerRow.value;
    const latestMillionCustomers = millionCustomers.at(-1).value;
    const latestAiCustomers = aiCustomers.at(-1).value;
    const priorYearAdoption = adoptionByPeriod.get(`${Number(latestAdoption.period.slice(0,4))-1}${latestAdoption.period.slice(4)}`);
    const stats = [
      {label:"TTM net retention",value:nrr.at(-1).label,change:"stable QoQ",note:"Expansion net of contraction and churn",color:"var(--m-core)",url:nrr.at(-1).sourceUrl},
      {label:"Gross retention",value:grr.at(-1).label,change:"stable",note:"Management disclosure band",color:"var(--dev)",url:grr.at(-1).sourceUrl},
      {label:"Total customers",value:number(latestTotalCustomers),change:priorYearTotalCustomers?`+${number(latestTotalCustomers-priorYearTotalCustomers)} YoY`:"YoY comparison not disclosed",note:"Only +200 sequentially",color:"var(--obs)",url:latestTotalCustomerRow.sourceUrl},
      {label:"Customers >$100K ARR",value:number(latest.largeCustomers),change:`+${pct(latest.customerGrowth)} YoY`,note:"91% of company ARR",color:"var(--ai)",url:latest.sourceUrl},
      {label:"Customers on 4+ products",value:pct(latestAdoption.p4,0),change:priorYearAdoption?`+${((latestAdoption.p4-priorYearAdoption.p4)*100).toFixed(0)} ppt YoY`:"YoY not disclosed",note:"Primary cross-sell KPI",color:"var(--sec)",url:latestAdoption.sourceUrl},
      {label:"AI integration customers",value:number(latestAiCustomers),change:"Latest disclosure · Q1 2026",note:`${number(latestMillionCustomers)} customers >$1M ARR at FY2025`,color:"var(--m-option)",url:aiCustomers.at(-1).sourceUrl},
    ];
    kpiSnapshot.innerHTML = stats.map(stat => `<article class="kpi-stat" style="--stat-color:${stat.color}">
      <span class="kpi-stat-label">${esc(stat.label)}</span>
      <strong>${esc(stat.value)}</strong>
      <span class="kpi-stat-change ${stat.change.startsWith("0.0") ? "is-flat" : ""}">${esc(stat.change)}</span>
      <p>${esc(stat.note)}</p>
      ${sourceAnchor(stat.url,"Primary source")}
    </article>`).join("");
  }

  function renderQuarterlyFcfUpdate(){
    if(!quarterlyFcfSummary || !quarterlyFcfTable) return;
    const prior = quarterlyFcfEconomics[0];
    const latest = quarterlyFcfEconomics.at(-1);
    const revenueGrowth = latest.revenue/prior.revenue-1;
    const reportedFcfGrowth = latest.reportedFcf/prior.reportedFcf-1;
    const sbcGrowth = latest.totalSbc/prior.totalSbc-1;
    const ownerFcfGrowth = prior.ownerFcf>0 ? latest.ownerFcf/prior.ownerFcf-1 : null;
    const ownerMarginChange = latest.ownerMargin-prior.ownerMargin;
    const sbcMarginChange = latest.totalSbc/latest.revenue-prior.totalSbc/prior.revenue;
    quarterlyFcfSummary.innerHTML = [
      `<span><b>${esc(signedPct(revenueGrowth,1))}</b> revenue growth</span>`,
      `<span><b>${ownerFcfGrowth==null?"Negative → positive":esc(signedPct(ownerFcfGrowth,1))}</b> owner FCF</span>`,
      `<span><b>${esc(pct(latest.ownerMargin))}</b> owner FCF margin · ${esc(signedPctPoints(ownerMarginChange))}</span>`,
      `<span><b>${esc(pct(latest.totalSbc/latest.revenue))}</b> SBC / revenue · ${esc(signedPctPoints(sbcMarginChange))}</span>`,
    ].join("");
    const rows = [
      ["Revenue",money(prior.revenue),money(latest.revenue),signedPct(revenueGrowth,1),"is-positive"],
      ["Reported FCF",money(prior.reportedFcf),money(latest.reportedFcf),signedPct(reportedFcfGrowth,1),"is-positive"],
      ["Total SBC",money(prior.totalSbc),money(latest.totalSbc),signedPct(sbcGrowth,1),"is-warning"],
      ["Owner FCF",signedMoney(prior.ownerFcf),signedMoney(latest.ownerFcf),ownerFcfGrowth==null?"Negative → positive":signedPct(ownerFcfGrowth,1),"is-positive"],
      ["Owner FCF margin",pct(prior.ownerMargin),pct(latest.ownerMargin),signedPctPoints(ownerMarginChange),"is-warning"],
    ];
    quarterlyFcfTable.innerHTML = rows.map(row => `<tr><td>${esc(row[0])}</td><td>${esc(row[1])}</td><td>${esc(row[2])}</td><td class="${row[4]}">${esc(row[3])}</td></tr>`).join("");
  }

  function renderQuarterEvidence(){
    if(!quarterEvidence) return;
    const evidence=kpiModel.q2Evidence;
    const reported=evidence.reported;
    const claims=evidence.managementClaims;
    quarterEvidence.innerHTML=[
      {label:"Growth breadth",value:claims.nonAiRevenueGrowth,note:`Non-AI customer revenue growth, up from ${claims.priorQuarterNonAiRevenueGrowth} in Q1`,url:evidence.sourceUrl,source:"Management claim"},
      {label:"New-logo contribution",value:pct(claims.newCustomerGrowthContribution,0),note:"Share of Q2 growth from customers not present one year earlier",url:evidence.sourceUrl,source:"Management claim"},
      {label:"RPO",value:money(reported.rpo),note:`+${pct(reported.rpoGrowth,0)} YoY; current RPO +${pct(reported.currentRpoGrowth,0)}`,url:evidence.supplementalUrl,source:"Reported"},
      {label:"Largest-customer risk",value:"Q3 usage down",note:evidence.filingRisk,url:evidence.filingUrl,source:"Filed risk"},
    ].map(item=>`<article class="kpi-stat" style="--stat-color:var(--m-contested)"><span class="kpi-stat-label">${esc(item.label)}</span><strong>${esc(item.value)}</strong><span class="kpi-stat-change">${esc(item.source)}</span><p>${esc(item.note)}</p>${sourceAnchor(item.url,"Evidence")}</article>`).join("");
  }

  function niceMax(value){
    const power = 10 ** Math.floor(Math.log10(value || 1));
    return Math.ceil(value / power) * power;
  }

  function renderChartLegend(elementId,series){
    const element = document.getElementById(elementId);
    if(!element) return;
    element.innerHTML = series.map(item => `<span><i style="--legend-color:${item.color}"></i>${esc(item.label)}</span>`).join("");
  }

  function drawLineChart(config){
    const canvas = document.getElementById(config.canvasId);
    if(!canvas) return;
    const width = Math.max(320,Math.floor(canvas.clientWidth));
    const height = Math.max(230,Math.floor(canvas.clientHeight));
    const dpr = Math.min(window.devicePixelRatio || 1,2);
    canvas.width = Math.floor(width*dpr);
    canvas.height = Math.floor(height*dpr);
    const ctx = canvas.getContext("2d");
    ctx.scale(dpr,dpr);
    ctx.clearRect(0,0,width,height);

    const hasRightAxis = config.series.some(series => series.axis === "right");
    const margin = {top:12,right:hasRightAxis ? 54 : 16,bottom:50,left:52};
    const plotWidth = width-margin.left-margin.right;
    const plotHeight = height-margin.top-margin.bottom;
    const allValues = config.series.filter(series => series.axis !== "right").flatMap(series => series.values.filter(value => value != null));
    const rightValues = config.series.filter(series => series.axis === "right").flatMap(series => series.values.filter(value => value != null));
    const rawMin = config.yMin ?? Math.min(...allValues);
    const rawMax = config.yMax ?? Math.max(...allValues);
    const yMin = config.yMin ?? 0;
    const yMax = config.yMax ?? niceMax(rawMax*1.06);
    const yRightMin = config.yRightMin ?? 0;
    const yRightMax = config.yRightMax ?? niceMax(Math.max(...rightValues,1)*1.06);
    const x = index => margin.left + (config.labels.length === 1 ? plotWidth/2 : index*plotWidth/(config.labels.length-1));
    const y = value => margin.top + (yMax-value)/(yMax-yMin)*plotHeight;
    const yRight = value => margin.top + (yRightMax-value)/(yRightMax-yRightMin)*plotHeight;

    ctx.font = '9px "JetBrains Mono", monospace';
    ctx.textBaseline = "middle";
    for(let i=0;i<=5;i++){
      const value = yMax-(yMax-yMin)*i/5;
      const py = margin.top+plotHeight*i/5;
      ctx.beginPath();ctx.moveTo(margin.left,py);ctx.lineTo(width-margin.right,py);
      ctx.strokeStyle = "rgba(112,121,156,.23)";ctx.lineWidth = 1;ctx.stroke();
      ctx.fillStyle = "#70799c";ctx.textAlign = "right";
      ctx.fillText(config.yFormatter(value),margin.left-9,py);
      if(hasRightAxis){
        const rightValue = yRightMax-(yRightMax-yRightMin)*i/5;
        ctx.fillStyle = "#70799c";ctx.textAlign = "left";
        ctx.fillText(config.yRightFormatter(rightValue),width-margin.right+9,py);
      }
    }
    if(yMin < 0 && yMax > 0){
      const zeroY = y(0);
      ctx.beginPath();ctx.moveTo(margin.left,zeroY);ctx.lineTo(width-margin.right,zeroY);
      ctx.strokeStyle = "rgba(222,226,242,.52)";ctx.lineWidth = 1.2;ctx.stroke();
    }
    const step = config.labels.length <= 8 ? 1 : width < 520 ? 6 : 4;
    config.labels.forEach((label,index) => {
      if(index%step && index !== config.labels.length-1) return;
      const px = x(index);
      ctx.save();ctx.translate(px,height-32);ctx.rotate(-Math.PI/4);
      ctx.fillStyle = "#70799c";ctx.textAlign = "right";ctx.fillText(label,0,0);ctx.restore();
    });

    config.series.forEach(series => {
      const seriesY = series.axis === "right" ? yRight : y;
      ctx.strokeStyle = series.color;ctx.lineWidth = series.width || 2.5;ctx.lineJoin = "round";ctx.lineCap = "round";
      ctx.setLineDash(series.dash || []);
      let open = false;
      ctx.beginPath();
      series.values.forEach((value,index) => {
        if(value == null){if(!series.connectGaps) open=false;return;}
        const px=x(index),py=seriesY(value);
        if(!open){ctx.moveTo(px,py);open=true;} else ctx.lineTo(px,py);
      });
      ctx.stroke();
      ctx.setLineDash([]);
      series.values.forEach((value,index) => {
        if(value == null) return;
        ctx.beginPath();ctx.arc(x(index),seriesY(value),series.pointRadius || 2.2,0,Math.PI*2);ctx.fillStyle=series.color;ctx.fill();
      });
    });
    canvas._chartMeta = {config,width,height,margin,plotWidth,x};
    renderChartLegend(config.legendId,config.series);
  }

  function drawBarChart(config){
    const canvas = document.getElementById(config.canvasId);
    if(!canvas) return;
    const width = Math.max(320,Math.floor(canvas.clientWidth));
    const height = Math.max(230,Math.floor(canvas.clientHeight));
    const dpr = Math.min(window.devicePixelRatio || 1,2);
    canvas.width = Math.floor(width*dpr);
    canvas.height = Math.floor(height*dpr);
    const ctx = canvas.getContext("2d");
    ctx.scale(dpr,dpr);
    ctx.clearRect(0,0,width,height);

    const margin = {top:12,right:16,bottom:38,left:58};
    const plotWidth = width-margin.left-margin.right;
    const plotHeight = height-margin.top-margin.bottom;
    const yMin = config.yMin;
    const yMax = config.yMax;
    const y = value => margin.top + (yMax-value)/(yMax-yMin)*plotHeight;
    const groupWidth = plotWidth/config.labels.length;
    const barArea = Math.min(groupWidth*.72,72);
    const gap = Math.max(2,Math.min(5,barArea*.06));
    const barWidth = config.stacked ? Math.min(barArea,46) : Math.max(5,(barArea-gap*(config.series.length-1))/config.series.length);
    const baseline = y(0);

    ctx.font = '9px "JetBrains Mono", monospace';
    ctx.textBaseline = "middle";
    for(let i=0;i<=5;i++){
      const value = yMax-(yMax-yMin)*i/5;
      const py = margin.top+plotHeight*i/5;
      ctx.beginPath();ctx.moveTo(margin.left,py);ctx.lineTo(width-margin.right,py);
      ctx.strokeStyle = "rgba(112,121,156,.23)";ctx.lineWidth = 1;ctx.stroke();
      ctx.fillStyle = "#70799c";ctx.textAlign = "right";
      ctx.fillText(config.yFormatter(value),margin.left-9,py);
    }
    ctx.beginPath();ctx.moveTo(margin.left,baseline);ctx.lineTo(width-margin.right,baseline);
    ctx.strokeStyle = "rgba(222,226,242,.52)";ctx.lineWidth = 1.2;ctx.stroke();

    config.labels.forEach((label,index) => {
      const center = margin.left+groupWidth*(index+.5);
      ctx.fillStyle = "#70799c";ctx.textAlign = "center";
      ctx.fillText(label,center,height-17);
      const left = center-barArea/2;
      let positiveStack = 0;
      let negativeStack = 0;
      config.series.forEach((series,seriesIndex) => {
        const value = series.values[index];
        if(value == null) return;
        const startValue = config.stacked ? (value >= 0 ? positiveStack : negativeStack) : 0;
        const endValue = config.stacked ? startValue+value : value;
        if(config.stacked){
          if(value >= 0) positiveStack=endValue;
          else negativeStack=endValue;
        }
        const startY = y(startValue);
        const endY = y(endValue);
        const top = Math.min(startY,endY);
        const barHeight = Math.max(1,Math.abs(startY-endY));
        ctx.fillStyle = value < 0 && series.negativeColor ? series.negativeColor : series.color;
        ctx.globalAlpha = series.opacity || 1;
        ctx.fillRect(config.stacked ? left+(barArea-barWidth)/2 : left+seriesIndex*(barWidth+gap),top,barWidth,barHeight);
        ctx.globalAlpha = 1;
      });
    });

    canvas._chartMeta = {
      config,width,height,margin,plotWidth,
      indexAtX:localX => Math.max(0,Math.min(config.labels.length-1,Math.floor((localX-margin.left)/groupWidth))),
    };
    renderChartLegend(config.legendId,config.series);
  }

  function showChartTooltip(event){
    const canvas = event.currentTarget;
    const meta = canvas._chartMeta;
    if(!meta) return;
    const rect = canvas.getBoundingClientRect();
    const localX = event.clientX-rect.left;
    const ratio = Math.max(0,Math.min(1,(localX-meta.margin.left)/meta.plotWidth));
    const index = meta.indexAtX ? meta.indexAtX(localX) : Math.round(ratio*(meta.config.labels.length-1));
    const rows = meta.config.series
      .filter(series => series.values[index] != null)
      .map(series => `<span><i style="--tip-color:${series.color}"></i>${esc(series.label)}: ${esc(series.displayValues?.[index] || (series.tooltipFormatter || meta.config.tooltipFormatter)(series.values[index],index,series))}</span>`)
      .join("");
    chartTooltip.innerHTML = `<b>${esc(meta.config.labels[index])}</b>${rows || "No disclosure"}`;
    chartTooltip.hidden = false;
    const tipWidth = 230;
    chartTooltip.style.left = `${Math.min(window.innerWidth-tipWidth-12,event.clientX+14)}px`;
    chartTooltip.style.top = `${Math.min(window.innerHeight-110,event.clientY+14)}px`;
  }

  function hideChartTooltip(){chartTooltip.hidden = true;}

  function renderSourceTrails(){
    const financialLinks = financials.map(row => sourceAnchor(row.sourceUrl,row.period)).join("");
    document.querySelector("#revenue-sources>div").innerHTML = financialLinks;
    document.querySelector("#margin-sources>div").innerHTML = financialLinks;
    const fy2024 = annualOperations.find(row => row.period === "2024");
    const fy2025 = annualOperations.find(row => row.period === "2025");
    const fy2024CostRatio = (fy2024.revenue-fy2024.grossProfit)/fy2024.revenue;
    const excessCostOfRevenue = fy2025.revenue-fy2025.grossProfit-fy2025.revenue*fy2024CostRatio;
    document.querySelector("#cloud-sources>div").innerHTML = [
      `<article class="financial-source-row"><b>Q1–Q2 2021 filings</b><span>COGS grew 76% / 98% YoY versus revenue growth of 51% / 67%.</span><span>Third-party hosting + software cost increases: $18.2M / $24.7M.</span>${sourceAnchor(kpiModel.cloudCostEfficiency.q1_2021SourceUrl,"Q1 Form 10-Q")} ${sourceAnchor(kpiModel.cloudCostEfficiency.q2_2021SourceUrl,"Q2 Form 10-Q")}</article>`,
      `<article class="financial-source-row"><b>FY2025 filing</b><span>Cloud hosting + software cost increase ${esc(money(kpiModel.cloudCostEfficiency.annualCloudCostIncrease))}</span><span>COGS above constant FY2024 ratio ${esc(money(excessCostOfRevenue))}</span>${sourceAnchor(kpiModel.cloudCostEfficiency.annualSourceUrl,"Form 10-K")}</article>`,
      `<article class="financial-source-row"><b>Q1 2025 call</b><span>Management linked the cost spike to rapid usage growth at large customers and initial new-capability inefficiency.</span>${sourceAnchor(kpiModel.cloudCostEfficiency.q1ExplanationUrl,"Transcript")}</article>`,
      `<article class="financial-source-row"><b>Q2–Q3 2025 calls</b><span>Management reported savings from engineering-led cloud-efficiency projects and continued improvement.</span>${sourceAnchor(kpiModel.cloudCostEfficiency.q2EfficiencyUrl,"Q2 transcript")} ${sourceAnchor(kpiModel.cloudCostEfficiency.q3EfficiencyUrl,"Q3 transcript")}</article>`,
      `<article class="financial-source-row"><b>Q1 2026 filing</b><span>Cloud hosting + software cost increase ${esc(money(kpiModel.cloudCostEfficiency.q1CloudCostIncrease))} YoY</span><span>Revenue and provider costs described as growing in proportion.</span>${sourceAnchor(kpiModel.cloudCostEfficiency.q1SourceUrl,"Form 10-Q")}</article>`,
      `<article class="financial-source-row"><b>Q2 2026 filing</b><span>Third-party cloud infrastructure hosting + software cost increase ${esc(money(kpiModel.cloudCostEfficiency.q2CloudCostIncrease))} YoY</span><span>GAAP gross margin fell as provider costs outgrew revenue.</span>${sourceAnchor(kpiModel.cloudCostEfficiency.q2SourceUrl,"Form 10-Q")}</article>`,
    ].join("") + `<p class="financial-definition"><b>Derived proxy and limitation.</b> Quarterly COGS equals reported revenue less GAAP gross profit. The chart compares its YoY growth with revenue growth; it does not reconstruct undisclosed absolute quarterly hosting expense. The ${esc(money(excessCostOfRevenue))} FY2025 figure is actual COGS less the COGS implied by holding FY2024's cost-of-revenue ratio constant.</p>`;
    document.querySelector("#fcf-sources>div").innerHTML = annualFcfEconomics.map(row =>
      `<article class="fcf-source-row">
        <b>${esc(row.period)}</b>
        <span>Reported FCF ${esc(signedMoney(row.reportedFcf))}</span>
        <span>Total SBC ${esc(signedMoney(row.totalSbc))}</span>
        <span>Owner FCF ${esc(signedMoney(row.ownerFcf))}</span>
        ${sourceAnchor(row.sourceUrl,"Form 10-K")}
      </article>`
    ).join("") + `<p class="fcf-definition"><b>Analyst-adjusted measure.</b> Owner FCF subtracts total expensed and capitalized SBC from company-defined FCF. It is an economic sensitivity, not a GAAP or company-reported liquidity measure.</p>`;
    document.querySelector("#quarterly-fcf-sources>div").innerHTML = quarterlyFcfEconomics.map(row =>
      `<article class="financial-source-row">
        <b>${esc(formatPeriod(row.period))}</b>
        <span>OCF ${esc(money(row.operatingCashFlow))} → reported FCF ${esc(money(row.reportedFcf))}</span>
        <span>Expensed + capitalized SBC ${esc(money(row.expensedSbc))} + ${esc(money(row.capitalizedSbc))}</span>
        <span>Owner FCF ${esc(money(row.ownerFcf))} · ${esc(pct(row.ownerMargin))} margin</span>
        ${sourceAnchor(row.sourceUrl,"Form 10-Q")}
      </article>`
    ).join("") + `<p class="financial-definition"><b>Comparable-quarter bridge.</b> Reported FCF = OCF − PP&amp;E purchases − capitalized software development costs. Owner FCF then subtracts expensed and capitalized SBC. Capitalized SBC is separate from the cash capitalized-software line, so the bridge does not double count it.</p>`;
    document.querySelector("#operating-sources>div").innerHTML = annualOperations.map(row =>
      `<article class="financial-source-row">
        <b>FY${esc(row.period)}</b>
        <span>GAAP operating margin ${esc(pct(row.operatingMargin))}</span>
        <span>GAAP net margin ${esc(pct(row.netMargin))}</span>
        <span>Year-end shares ${esc(number(row.yearEndShares))}M</span>
        ${sourceAnchor(row.sourceUrl,"Form 10-K")}
      </article>`
    ).join("") + `<p class="financial-definition"><b>Derived calculations.</b> Expense and profit margins divide reported GAAP line items by reported revenue. Share growth uses year-end shares outstanding, not weighted-average diluted shares.</p>`;
    document.querySelector("#capital-sources>div").innerHTML = annualCapital.map(row =>
      `<article class="financial-source-row">
        <b>${esc(formatPeriod(row.period))}</b>
        <span>Cash + securities ${esc(money(row.liquidity))}</span>
        <span>Deferred revenue ${esc(money(row.deferredRevenue))}</span>
        <span>${row.rdAdjustedRoic==null?"ROIC not annualized":`R&D-adjusted ROIC ${esc(pct(row.rdAdjustedRoic))}`}</span>
        ${sourceAnchor(row.sourceUrl,row.period.includes("Q")?"Form 10-Q":"Form 10-K")}
      </article>`
    ).join("") + `<p class="financial-definition"><b>Analyst-adjusted capital framework.</b> Liquidity and deferred revenue are reported balance-sheet facts. Operating capital retains a 2% revenue cash floor; R&D is capitalized over three years; ROIC uses a 21% normalized tax rate. Interim-period ROIC is intentionally not annualized.</p>`;
    document.querySelector("#customer-sources>div").innerHTML = financialLinks;
    document.querySelector("#total-customer-sources>div").innerHTML = totalCustomers.map(row =>
      `<a href="${esc(row.sourceUrl)}" title="${esc(row.basis)}" target="_blank" rel="noopener noreferrer">${esc(row.period)}</a>`
    ).join("");
    document.querySelector("#million-customer-sources>div").innerHTML = millionCustomers.map(row =>
      `<a href="${esc(row.sourceUrl)}" title="${esc(row.basis)}" target="_blank" rel="noopener noreferrer">${esc(row.period)}</a>`
    ).join("");
    document.querySelector("#retention-sources>div").innerHTML = [
      ...nrr.map(row => `<a href="${esc(row.sourceUrl)}" title="${esc(row.basis)}" target="_blank" rel="noopener noreferrer">${esc(row.period)} · NRR ${esc(row.label)}</a>`),
      ...grr.map(row => `<a href="${esc(row.sourceUrl)}" title="${esc(row.basis)}" target="_blank" rel="noopener noreferrer">${esc(row.period)} · GRR ${esc(row.label)}</a>`),
    ].join("");
    document.querySelector("#ai-customer-sources>div").innerHTML = aiCustomers.map(row =>
      `<a href="${esc(row.sourceUrl)}" title="${esc(row.basis)}" target="_blank" rel="noopener noreferrer">${esc(row.period)} · ${number(row.value)}</a>`
    ).join("");
    document.querySelector("#adoption-sources>div").innerHTML = adoption.map(row =>
      `<a href="${esc(row.sourceUrl)}" title="${esc(row.basis)}" target="_blank" rel="noopener noreferrer">${esc(row.period)} · ${esc(row.sourceId)}</a>`
    ).join("");
  }

  function renderKpiCharts(){
    const financialLabels = financials.map(row => row.period);
    const adoptionLabels = adoption.map(row => row.period);
    const retentionLabels = [...new Set([...nrr.map(row=>row.period),...grr.map(row=>row.period)])].sort();
    const nrrChartByPeriod = new Map(nrr.map(row => [row.period,row]));
    const grrChartByPeriod = new Map(grr.map(row => [row.period,row]));
    kpiChartConfigs = [
      {canvasId:"retention-chart",legendId:"retention-legend",labels:retentionLabels,yMin:.90,yMax:1.40,yFormatter:value=>pct(value,0),tooltipFormatter:value=>pct(value,0),series:[
        {label:"TTM NRR disclosure",color:"#2ed6a0",connectGaps:true,values:retentionLabels.map(period=>nrrChartByPeriod.get(period)?.value ?? null),displayValues:retentionLabels.map(period=>nrrChartByPeriod.get(period)?.label ?? null)},
        {label:"GRR disclosure",color:"#33c6e6",connectGaps:true,dash:[7,5],values:retentionLabels.map(period=>grrChartByPeriod.get(period)?.value ?? null),displayValues:retentionLabels.map(period=>grrChartByPeriod.get(period)?.label ?? null)},
      ]},
      {canvasId:"total-customers-chart",legendId:"total-customers-legend",labels:totalCustomers.map(row=>row.period),yMin:0,yMax:35000,yFormatter:value=>Math.round(value).toLocaleString("en-US"),tooltipFormatter:value=>number(value),series:[{label:"Total customers",color:"#7c6bf5",values:totalCustomers.map(row=>row.value)}]},
      {canvasId:"customers-chart",legendId:"customers-legend",labels:financialLabels,yMin:0,yMax:5000,yFormatter:value=>Math.round(value).toLocaleString("en-US"),tooltipFormatter:value=>number(value),series:[{label:">$100K ARR customers",color:"#f5b13f",values:financials.map(row=>row.largeCustomers)}]},
      {canvasId:"million-customers-chart",legendId:"million-customers-legend",labels:millionCustomers.map(row=>row.period),yMin:0,yMax:700,yFormatter:value=>Math.round(value).toLocaleString("en-US"),tooltipFormatter:value=>number(value),series:[{label:">$1M ARR customers",color:"#ff5c8a",values:millionCustomers.map(row=>row.value)}]},
      {canvasId:"ai-customers-chart",legendId:"ai-customers-legend",labels:aiCustomers.map(row=>row.period),yMin:0,yMax:7000,yFormatter:value=>Math.round(value).toLocaleString("en-US"),tooltipFormatter:value=>number(value),series:[{label:"AI integration customers",color:"#a78bfa",values:aiCustomers.map(row=>row.value)}]},
      {canvasId:"adoption-chart",legendId:"adoption-legend",labels:adoptionLabels,yMin:0,yMax:.90,yFormatter:value=>pct(value,0),tooltipFormatter:value=>pct(value,0),series:[
        {label:"2+ products",color:"#33c6e6",values:adoption.map(row=>row.p2)},
        {label:"4+ products",color:"#f5b13f",values:adoption.map(row=>row.p4)},
        {label:"6+ products",color:"#2ed6a0",values:adoption.map(row=>row.p6)},
        {label:"8+ products",color:"#4aa3e0",values:adoption.map(row=>row.p8)},
        {label:"10+ products",color:"#ff5c8a",values:adoption.map(row=>row.p10)},
      ]},
    ];
    kpiChartConfigs.forEach(drawLineChart);
  }

  function renderFinancialCharts(){
    const financialLabels = financials.map(row => row.period);
    const fcfLabels = annualFcfEconomics.map(row => row.period);
    const conversionOperations = annualOperations.filter(row => annualFcfByPeriod.has(row.period));
    const capitalLabels = annualCapital.map(row => row.period.includes("Q") ? `${row.period.slice(4)} ${row.period.slice(2,4)}` : row.period);
    const annualCapitalReturns = annualCapital.filter(row => Number.isFinite(row.rdAdjustedRoic));
    const operationsByPeriod = new Map(annualOperations.map(row => [row.period,row]));
    financialChartConfigs = [
      {canvasId:"revenue-chart",legendId:"revenue-legend",labels:financialLabels,yMin:0,yMax:1200,yRightMin:0,yRightMax:1,yFormatter:value=>`$${Math.round(value)}m`,yRightFormatter:value=>pct(value,0),tooltipFormatter:value=>money(value),series:[
        {label:"Revenue · left axis",color:"#33c6e6",values:financials.map(row=>row.revenue)},
        {label:"YoY growth · right axis",color:"#ffb84d",axis:"right",width:3.5,pointRadius:3.2,dash:[8,4],tooltipFormatter:value=>pct(value),values:financials.map(row=>row.revenueGrowth)},
      ]},
      {canvasId:"margin-chart",legendId:"margin-legend",labels:financialLabels,yMin:.70,yMax:.85,yFormatter:value=>pct(value,0),tooltipFormatter:value=>pct(value),series:[{label:"GAAP",color:"#2ed6a0",values:financials.map(row=>row.grossMargin)},{label:"Non-GAAP",color:"#7c6bf5",values:financials.map(row=>row.nonGaapGrossMargin)}]},
      {canvasId:"cloud-efficiency-chart",legendId:"cloud-efficiency-legend",labels:cloudEfficiencyQuarters.map(row=>`${row.period.slice(4)} ${row.period.slice(2,4)}`),yMin:0,yMax:1,yFormatter:value=>pct(value,0),tooltipFormatter:value=>pct(value),series:[
        {label:"Revenue growth",color:"#33c6e6",values:cloudEfficiencyQuarters.map(row=>row.revenueGrowth)},
        {label:"COGS growth",color:"#f5b13f",values:cloudEfficiencyQuarters.map(row=>row.costOfRevenueGrowth)},
      ]},
      {type:"bar",stacked:true,canvasId:"expense-mix-chart",legendId:"expense-mix-legend",labels:annualOperations.map(row=>row.period),yMin:0,yMax:.90,yFormatter:value=>pct(value,0),tooltipFormatter:value=>pct(value),series:[
        {label:"R&D / revenue",color:"#7c6bf5",values:annualOperations.map(row=>row.researchAndDevelopmentMargin)},
        {label:"S&M / revenue",color:"#33c6e6",values:annualOperations.map(row=>row.salesAndMarketingMargin)},
        {label:"G&A / revenue",color:"#f5b13f",values:annualOperations.map(row=>row.generalAndAdministrativeMargin)},
      ]},
      {canvasId:"profit-conversion-chart",legendId:"profit-conversion-legend",labels:conversionOperations.map(row=>row.period),yMin:-.08,yMax:.32,yFormatter:value=>pct(value,0),tooltipFormatter:value=>pct(value),series:[
        {label:"GAAP operating margin",color:"#ff5c8a",values:conversionOperations.map(row=>row.operatingMargin)},
        {label:"GAAP net margin",color:"#f5b13f",values:conversionOperations.map(row=>row.netMargin)},
        {label:"Reported FCF margin",color:"#33c6e6",values:conversionOperations.map(row=>annualFcfByPeriod.get(row.period).reportedMargin)},
        {label:"Owner FCF margin",color:"#2ed6a0",dash:[7,5],values:conversionOperations.map(row=>annualFcfByPeriod.get(row.period).ownerMargin)},
      ]},
      {type:"bar",canvasId:"fcf-economics-chart",legendId:"fcf-economics-legend",labels:fcfLabels,yMin:-100,yMax:1000,yFormatter:value=>`${value < 0 ? "−" : ""}$${Math.abs(Math.round(value))}m`,tooltipFormatter:value=>signedMoney(value),series:[
        {label:"Reported FCF",color:"#33c6e6",values:annualFcfEconomics.map(row=>row.reportedFcf)},
        {label:"Total SBC",color:"#7c6bf5",opacity:.74,values:annualFcfEconomics.map(row=>row.totalSbc)},
        {label:"Owner FCF",color:"#2ed6a0",negativeColor:"#ff5c8a",values:annualFcfEconomics.map(row=>row.ownerFcf)},
      ]},
      {canvasId:"fcf-margin-chart",legendId:"fcf-margin-legend",labels:fcfLabels,yMin:-.05,yMax:.35,yFormatter:value=>pct(value,0),tooltipFormatter:value=>pct(value),series:[
        {label:"Reported FCF margin",color:"#33c6e6",values:annualFcfEconomics.map(row=>row.reportedMargin)},
        {label:"Owner FCF margin",color:"#2ed6a0",values:annualFcfEconomics.map(row=>row.ownerMargin)},
      ]},
      {type:"bar",canvasId:"quarterly-fcf-chart",legendId:"quarterly-fcf-legend",labels:quarterlyFcfEconomics.map(row=>`${row.period.slice(4)} ${row.period.slice(2,4)}`),yMin:-50,yMax:350,yFormatter:value=>`${value<0?"−":""}$${Math.abs(Math.round(value))}m`,tooltipFormatter:value=>signedMoney(value),series:[
        {label:"Reported FCF",color:"#33c6e6",values:quarterlyFcfEconomics.map(row=>row.reportedFcf)},
        {label:"Total SBC",color:"#7c6bf5",opacity:.74,values:quarterlyFcfEconomics.map(row=>row.totalSbc)},
        {label:"Owner FCF",color:"#2ed6a0",values:quarterlyFcfEconomics.map(row=>row.ownerFcf)},
      ]},
      {type:"bar",canvasId:"capital-base-chart",legendId:"capital-base-legend",labels:capitalLabels,yMin:0,yMax:5000,yFormatter:value=>`$${Math.round(value/100)/10}B`,tooltipFormatter:value=>money(value),series:[
        {label:"Cash + securities",color:"#33c6e6",values:annualCapital.map(row=>row.liquidity)},
        {label:"Deferred revenue",color:"#f5b13f",opacity:.82,values:annualCapital.map(row=>row.deferredRevenue)},
        {label:"R&D-adjusted capital",color:"#7c6bf5",opacity:.78,values:annualCapital.map(row=>row.rdAdjustedCapital)},
      ]},
      {canvasId:"returns-dilution-chart",legendId:"returns-dilution-legend",labels:annualCapitalReturns.map(row=>row.period),yMin:0,yMax:.35,yFormatter:value=>pct(value,0),tooltipFormatter:value=>pct(value),series:[
        {label:"R&D-adjusted ROIC",color:"#2ed6a0",values:annualCapitalReturns.map(row=>row.rdAdjustedRoic)},
        {label:"Year-end share growth",color:"#ff5c8a",dash:[7,5],values:annualCapitalReturns.map(row=>operationsByPeriod.get(row.period)?.yearEndShareGrowth ?? null)},
      ]},
    ];
    financialChartConfigs.forEach(config => config.type === "bar" ? drawBarChart(config) : drawLineChart(config));
  }

  function renderCoreEngineScale(){
    coreEngineScale.innerHTML = kpiModel.coreEngineScale.map(engine => `<article class="engine-row ${engine.scopeComparable ? "" : "scope-changed"}">
      <div class="engine-name">
        <h4>${esc(engine.name)}</h4>
        <span>${engine.scopeComparable ? "Comparable named scope" : "Scope changed"}</span>
      </div>
      <div class="engine-point">
        <time>${esc(engine.fromPeriod)}</time><strong>${esc(engine.fromLabel)}</strong>
      </div>
      <div class="engine-connector" aria-hidden="true"><i></i><span>${engine.scopeComparable ? "higher disclosed floor" : "directional only"}</span></div>
      <div class="engine-point current">
        <time>${esc(engine.toPeriod)}</time><strong>${esc(engine.toLabel)}</strong>
      </div>
      <p>${esc(engine.note)} ${sourceAnchor(engine.fromSourceUrl,"2024 source")} ${sourceAnchor(engine.toSourceUrl,"2025 source")}</p>
    </article>`).join("");
  }

  function renderSectorScaleLanes(){
    const maturityOrder = ["scaled","proven","validated","option"];
    const disclosure = {
      obs:{value:"3 named engines >$1B ARR",note:"Reported lower bounds · Q4 2025",url:kpiModel.anchors.productTranscript},
      sec:{value:"Sector ARR not disclosed",note:"One operating segment",url:kpiModel.anchors.latest10K},
      dev:{value:"Sector ARR not disclosed",note:"One operating segment",url:kpiModel.anchors.latest10K},
      pa:{value:"Sector ARR not disclosed",note:"One operating segment",url:kpiModel.anchors.latest10K},
    };
    sectorScaleLanes.innerHTML = model.categories.map(category => {
      const uniqueProducts = new Map();
      category.suites.forEach(suite => suite.products.forEach(product => {
        if(product.canonicalCategory === category.id) uniqueProducts.set(product.id,product);
      }));
      const products = [...uniqueProducts.values()].sort((a,b) => (model.maturity[b.maturity]?.score || 0)-(model.maturity[a.maturity]?.score || 0));
      const counts = Object.fromEntries(maturityOrder.map(id => [id,products.filter(product=>product.maturity===id).length]));
      const scale = disclosure[category.id];
      const productLinks = products.map(product => {
        const source = model.productSources[product.n];
        return source?.url ? `<a href="${esc(source.url)}" target="_blank" rel="noopener noreferrer">${esc(product.n)}</a>` : "";
      }).filter(Boolean).join("");
      return `<article class="sector-lane" style="--sector-color:${category.color}">
        <div class="sector-identity">
          <span>${products.length} mapped canonical entities</span>
          <h4>${esc(category.catName)}</h4>
          <p>${products.slice(0,6).map(product=>esc(product.n)).join(" · ")}${products.length>6?` · +${products.length-6} more`:""}</p>
        </div>
        <div class="sector-maturity">
          <div class="sector-maturity-bar" role="img" aria-label="${esc(category.catName)} maturity distribution: ${maturityOrder.map(id=>`${counts[id]} ${model.maturity[id].label}`).join(", ")}">
            ${maturityOrder.map(id => counts[id] ? `<i style="width:${counts[id]/products.length*100}%;--maturity-color:${model.maturity[id].color}" title="${esc(model.maturity[id].label)}: ${counts[id]}"></i>` : "").join("")}
          </div>
          <div class="sector-maturity-legend">${maturityOrder.map(id=>`<span><i style="--maturity-color:${model.maturity[id].color}"></i><b>${counts[id]}</b>${esc(model.maturity[id].label)}</span>`).join("")}</div>
        </div>
        <div class="sector-disclosure ${category.id === "obs" ? "has-scale" : ""}">
          <span>Financial disclosure</span><strong>${esc(scale.value)}</strong><p>${esc(scale.note)}</p>
          ${sourceAnchor(scale.url,category.id === "obs" ? "Q4 2025 transcript" : "FY2025 Form 10-K")}
        </div>
        <details class="sector-source-trail"><summary>Underlying official product sources</summary><div>${productLinks}</div></details>
      </article>`;
    }).join("");
  }

  function renderAiActivity(){
    aiActivity.innerHTML = kpiModel.aiActivity.map(row => `<article class="activity-card">
      <span>${esc(row[3])}</span><strong>${esc(row[2])}</strong><h3>${esc(row[0])}</h3>
      <p>Management-reported activity growth; no revenue attribution disclosed.</p>
      ${sourceAnchor(row[4],row[3].includes("Q2 2026")?"Q2 2026 transcript":"Q1 2026 transcript")}
    </article>`).join("");
  }

  function renderPortfolioScale(){
    const portfolio = kpiModel.productPortfolio;
    portfolioScale.innerHTML = `<div class="portfolio-bar" role="img" aria-label="${portfolio.totalProducts} products: ${portfolio.bands.map(band=>`${band[1]} ${band[0]}`).join(", ")}">
      ${portfolio.bands.map(band=>`<i style="width:${band[1]/portfolio.totalProducts*100}%;--portfolio-color:${band[2]}" title="${esc(band[0])}: ${band[1]}"></i>`).join("")}
    </div>
    <div class="portfolio-legend">${portfolio.bands.map(band=>`<span><i style="--portfolio-color:${band[2]}"></i><b>${band[1]}</b> ${esc(band[0])}</span>`).join("")}</div>
    <p>${esc(portfolio.note)} ${sourceAnchor(portfolio.sourceUrl,"Q1 2026 transcript")}</p>`;
  }

  function renderKpiHistory(){
    const values = value => value == null ? `<span class="kpi-na">—</span>` : pct(value,0);
    const blank = `<span class="kpi-na">—</span>`;
    const periods = [...new Set([
      ...adoption.map(row=>row.period),...financials.map(row=>row.period),...totalCustomers.map(row=>row.period),
      ...millionCustomers.map(row=>row.period),...nrr.map(row=>row.period),...grr.map(row=>row.period),...aiCustomers.map(row=>row.period),
    ])].sort();
    kpiHistory.innerHTML = periods.map(period => {
      const a = adoptionByPeriod.get(period);
      const fin = financialsByPeriod.get(period);
      const total = totalCustomersByPeriod.get(period);
      const million = millionCustomersByPeriod.get(period);
      const net = nrrByPeriod.get(period);
      const gross = grrByPeriod.get(period);
      const ai = aiCustomersByPeriod.get(period);
      const sources = new Map();
      [[fin?.sourceUrl,"Large"],[a?.sourceUrl,"Adoption"],[total?.sourceUrl,"Total"],[million?.sourceUrl,"$1M"],[net?.sourceUrl,"NRR"],[gross?.sourceUrl,"GRR"],[ai?.sourceUrl,"AI"]]
        .filter(item=>item[0]).forEach(([url,label])=>sources.set(url,label));
      return `<tr>
        <td>${esc(period)}</td><td>${total?number(total.value):blank}</td><td>${fin?number(fin.largeCustomers):blank}</td><td>${million?number(million.value):blank}</td>
        <td>${net?esc(net.label):blank}</td><td>${gross?esc(gross.label):blank}</td>
        <td>${values(a?.p2)}</td><td>${values(a?.p4)}</td><td>${values(a?.p6)}</td><td>${values(a?.p8)}</td><td>${values(a?.p10)}</td>
        <td>${ai?number(ai.value):blank}</td>
        <td><span class="kpi-source-cell">${[...sources].map(([url,label])=>sourceAnchor(url,label)).join("")}</span></td>
      </tr>`;
    }).join("");
  }

  function renderFinancialHistory(){
    financialHistory.innerHTML = financials.map(row => `<tr>
      <td>${esc(row.period)}</td><td>${money(row.revenue)}</td><td>${row.revenueGrowth==null?'<span class="kpi-na">—</span>':pct(row.revenueGrowth)}</td>
      <td>${money(row.grossProfit)}</td><td>${pct(row.grossMargin)}</td><td>${money(row.nonGaapGrossProfit)}</td><td>${pct(row.nonGaapGrossMargin)}</td>
      <td>${sourceAnchor(row.sourceUrl,"SEC")}</td>
    </tr>`).join("");
  }

  function renderKpis(){
    renderKpiSnapshot();
    renderSourceTrails();
    renderCoreEngineScale();
    renderSectorScaleLanes();
    renderAiActivity();
    renderPortfolioScale();
    renderKpiHistory();
    renderKpiCharts();
    document.querySelectorAll("#kpis-panel .kpi-chart").forEach(canvas => {
      canvas.addEventListener("pointermove",showChartTooltip);
      canvas.addEventListener("pointerleave",hideChartTooltip);
    });
  }

  function renderFinancials(){
    renderQuarterlyFcfUpdate();
    renderQuarterEvidence();
    renderSourceTrails();
    renderFinancialHistory();
    renderFinancialCharts();
    document.querySelectorAll("#financials-panel .financial-chart").forEach(canvas => {
      canvas.addEventListener("pointermove",showChartTooltip);
      canvas.addEventListener("pointerleave",hideChartTooltip);
    });
  }

  function intrinsicModelConstants(){
    const input=intrinsicModel.model;
    const costOfEquity=input.riskFreeRate+input.beta*input.equityRiskPremium;
    const wacc=costOfEquity*input.equityWeight+input.preTaxCostOfDebt*(1-input.marginalTaxRate)*input.debtWeight;
    const netCash=input.cashAndMarketableSecurities-input.convertibleDebt-input.operatingLeaseLiabilities;
    return {costOfEquity,wacc,netCash};
  }

  function runIntrinsicDcf(revenueGrowth){
    const input=intrinsicModel.model;
    const {wacc,netCash}=intrinsicModelConstants();
    let revenue=input.baseRevenue;
    let previousNwc=input.historicalNwc;
    let pvExplicit=0;
    let terminalFcff=0;
    const rows=input.forecastYears.map((year,index)=>{
      const growth=index===0?input.firstForecastGrowth:revenueGrowth;
      revenue*=1+growth;
      const ebit=revenue*input.ebitMargin[index];
      const cashTaxes=Math.max(ebit*input.cashTaxRate[index],0);
      const nopat=ebit-cashTaxes;
      const da=revenue*input.daPercentRevenue[index];
      const capex=revenue*input.capexPercentRevenue[index];
      const nwc=revenue*input.nwcPercentRevenue[index];
      const changeNwc=nwc-previousNwc;
      const fcff=nopat+da-capex-changeNwc;
      const pvFcff=fcff/Math.pow(1+wacc,index+.5);
      pvExplicit+=pvFcff;
      previousNwc=nwc;
      terminalFcff=fcff;
      return {year,growth,revenue,ebitMargin:input.ebitMargin[index],fcff,pvFcff};
    });
    const terminalValue=terminalFcff*(1+input.terminalGrowth)/(wacc-input.terminalGrowth);
    const pvTerminal=terminalValue/Math.pow(1+wacc,input.forecastYears.length);
    const enterpriseValue=pvExplicit+pvTerminal;
    const equityValue=enterpriseValue+netCash;
    return {
      revenueGrowth,rows,pvExplicit,pvTerminal,enterpriseValue,equityValue,
      valuePerShare:equityValue/input.dilutedShares,
      terminalValueShare:pvTerminal/enterpriseValue,
      terminalRevenue:rows.at(-1).revenue,
      terminalFcff:rows.at(-1).fcff,
    };
  }

  function solveIntrinsicTarget(target){
    const {netCash}=intrinsicModelConstants();
    const targetEnterpriseValue=target.price*intrinsicModel.model.dilutedShares-netCash;
    let low=-.20,high=.80;
    for(let index=0;index<180;index++){
      const midpoint=(low+high)/2;
      if(runIntrinsicDcf(midpoint).enterpriseValue<targetEnterpriseValue) low=midpoint;
      else high=midpoint;
    }
    const result=runIntrinsicDcf((low+high)/2);
    return {...target,...result,targetEnterpriseValue};
  }

  function intrinsicCases(){
    return intrinsicModel.targets.map(solveIntrinsicTarget);
  }

  function intrinsicBillions(value,digits=1){
    return `$${(value/1000).toFixed(digits)}B`;
  }

  function runCalculatorCase(calculator,growth){
    return runCalculatorSensitivity(calculator,growth,calculator.terminalPriceToFcf,calculator.discountRate);
  }

  function runCalculatorSensitivity(calculator,growth,terminalPriceToFcf,discountRate){
    const terminalFcf=calculator.currentFcf*Math.pow(1+growth,calculator.forecastYears);
    const futurePrice=terminalFcf*terminalPriceToFcf/calculator.shares;
    const fairValue=futurePrice/Math.pow(1+discountRate,calculator.forecastYears);
    return {growth,terminalFcf,futurePrice,fairValue};
  }

  function calculatorScenarioCases(calculator){
    return calculator.scenarios.map(scenario=>({
      ...scenario,
      ...runCalculatorCase(calculator,calculator.annualGrowth*calculator.caseVariance[scenario.id]),
    }));
  }

  function renderIntrinsicValuation(){
    const cases=intrinsicCases();
    const market=cases.find(item=>item.id==="market");
    const morningstar=cases.find(item=>item.id==="morningstar");
    const calculator=intrinsicModel.calculator;
    const calculatorScenarios=calculatorScenarioCases(calculator);
    const calculatorBase=calculatorScenarios.find(item=>item.id==="base");
    const calculatorWeightedValue=calculatorScenarios.reduce((sum,scenario)=>sum+scenario.fairValue*scenario.probability,0);
    const terminalRevenueGap=market.terminalRevenue/morningstar.terminalRevenue-1;
    document.getElementById("intrinsic-verdict").innerHTML=`<b>The post-earnings selloff narrowed the valuation gap, but the stock still requires exceptional growth durability.</b> At $${market.price.toFixed(2)}, the common lens requires ${esc(pct(market.revenueGrowth))} annual revenue growth from 2027–2035 and ${esc(intrinsicBillions(market.terminalRevenue))} of FY2035 revenue—${esc(pct(terminalRevenueGap))} above the path that supports Morningstar’s $200 fair value.`;
    document.getElementById("intrinsic-target-grid").innerHTML=cases.map(item=>{
      const source=intrinsicModel.sources[item.sourceId];
      const current=item.id==="market";
      const our=item.id==="our-calculator";
      if(our){
        const scenarios=calculatorScenarios.map(scenario=>`<span>${esc(scenario.label)} · ${esc(pct(scenario.growth,0))} growth<b>$${scenario.fairValue.toFixed(2)}</b></span>`).join("");
        return `<article class="intrinsic-target-card tone-${esc(item.tone)}">
          <div class="intrinsic-target-head"><div><span>${esc(item.label)}</span><strong>$${calculatorBase.fairValue.toFixed(2)}</strong></div><i>Base case</i></div>
          <div class="intrinsic-hurdle"><span>Required 2027–35 revenue growth</span><b>${esc(pct(item.revenueGrowth))}</b><small>10-year FCFF cross-check at the $${item.price.toFixed(0)} price anchor</small></div>
          <div class="intrinsic-target-metrics intrinsic-calculator-scenarios">${scenarios}<span>Current shares · held flat<b>${calculator.shares.toFixed(2)}M</b></span><span>Probability-weighted value<b>$${calculatorWeightedValue.toFixed(2)}</b></span></div>
          <p><b>${esc(calculator.metric)} · ${calculator.forecastYears}Y · ${esc(pct(calculator.annualGrowth,0))} growth · ${calculator.terminalPriceToFcf.toFixed(0)}× P/FCF · ${esc(pct(calculator.discountRate,0))} discount.</b></p>
          <span class="intrinsic-internal-source">Internal calculator cross-check · ${esc(calculator.modelDate)}</span>
        </article>`;
      }
      return `<article class="intrinsic-target-card tone-${esc(item.tone)}">
        <div class="intrinsic-target-head"><div><span>${esc(item.label)}</span><strong>$${item.price.toFixed(2)}</strong></div><i>${current?"Market data":"Analyst fair value"}</i></div>
        <div class="intrinsic-hurdle"><span>Required 2027–35 revenue growth</span><b>${esc(pct(item.revenueGrowth))}</b><small>every year for nine years</small></div>
        <div class="intrinsic-target-metrics">
          <span>FY2035 revenue <b>${esc(intrinsicBillions(item.terminalRevenue))}</b></span>
          <span>FY2035 FCFF <b>${esc(intrinsicBillions(item.terminalFcff))}</b></span>
          <span>Target enterprise value <b>${esc(intrinsicBillions(item.targetEnterpriseValue))}</b></span>
          <span>Terminal value / EV <b>${esc(pct(item.terminalValueShare))}</b></span>
        </div>
        <p>${current?`The price needs Datadog to compound near ${Math.round(item.revenueGrowth*100)}% for almost a decade while margin scales to a best-in-class level.`:"The $200 anchor still requires elite durability, but its 2030 revenue path lands close to Morningstar’s disclosed forecast."}</p>
        ${sourceAnchor(source.url,current?"Market-price source":"Morningstar access route")}
      </article>`;
    }).join("");
    const revenueGrowthCagr=calculator.revenueGrowthPath.reduce((compound,row)=>compound*(1+row.growth),1)**(1/calculator.revenueGrowthPath.length)-1;
    document.getElementById("intrinsic-dcf-growth-body").innerHTML=calculator.revenueGrowthPath.map(row=>`<tr><td>${esc(row.period)}</td><td><b>${esc(pct(row.growth,0))}</b></td></tr>`).join("");
    const variance=calculator.caseVariance;
    const probabilities=Object.fromEntries(calculator.scenarios.map(scenario=>[scenario.id,scenario.probability]));
    const finalInputs=[
      ["Metric",calculator.metric],
      ["Current FCF",intrinsicBillions(calculator.currentFcf,3)],
      ["Horizon",`${calculator.forecastYears}Y`],
      ["FCF growth",pct(calculator.annualGrowth,0)],
      ["Revenue-path CAGR",pct(revenueGrowthCagr,1)],
      ["Exit P/FCF",`${calculator.terminalPriceToFcf.toFixed(0)}×`],
      ["Discount rate",pct(calculator.discountRate,0)],
      ["Current shares",`${calculator.shares.toFixed(2)}M`],
      ["Bear / Base / Bull",`${pct(variance.bear,0)} / ${pct(variance.base,0)} / ${pct(variance.bull,0)}`],
      ["Probabilities",`${pct(probabilities.bear,0)} / ${pct(probabilities.base,0)} / ${pct(probabilities.bull,0)}`],
    ];
    document.getElementById("intrinsic-dcf-input-grid").innerHTML=finalInputs.map(([label,value])=>`<span><small>${esc(label)}</small><b>${esc(value)}</b></span>`).join("");

    const equivalent=calculator.morningstarEquivalent;
    const growthBridge=runCalculatorSensitivity(calculator,equivalent.annualGrowth,calculator.terminalPriceToFcf,calculator.discountRate);
    const discountBridge=runCalculatorSensitivity(calculator,equivalent.annualGrowth,calculator.terminalPriceToFcf,equivalent.discountRate);
    const fullBridge=runCalculatorSensitivity(calculator,equivalent.annualGrowth,equivalent.terminalPriceToFcf,equivalent.discountRate);
    const fairValueGap=fullBridge.fairValue-calculatorBase.fairValue;
    const growthImpact=growthBridge.fairValue-calculatorBase.fairValue;
    const discountImpact=discountBridge.fairValue-growthBridge.fairValue;
    const multipleImpact=fullBridge.fairValue-discountBridge.fairValue;
    const drivers=[
      {label:"Five-year growth",ours:pct(calculator.annualGrowth,0),morningstar:pct(equivalent.annualGrowth,1),delta:"+4.5 ppt",impact:growthImpact,share:growthImpact/fairValueGap,tone:"growth",note:"Faster compounding lifts Year 5 FCF before any change to the discount rate."},
      {label:"Equity discount rate",ours:pct(calculator.discountRate,0),morningstar:pct(equivalent.discountRate,1),delta:"−1.8 ppt",impact:discountImpact,share:discountImpact/fairValueGap,tone:"discount",note:"A lower required return raises the present value of the same future price."},
      {label:"Exit P/FCF",ours:`${calculator.terminalPriceToFcf.toFixed(0)}×`,morningstar:`${equivalent.terminalPriceToFcf.toFixed(1)}×`,delta:"+0.5×",impact:multipleImpact,share:multipleImpact/fairValueGap,tone:"multiple",note:"The terminal multiple is almost neutral; it is not the reason for the valuation gap."},
    ];
    document.getElementById("intrinsic-driver-grid").innerHTML=drivers.map(driver=>`<article class="intrinsic-driver-card tone-${esc(driver.tone)}">
      <span>${esc(driver.label)}</span>
      <div><small>Our base</small><b>${esc(driver.ours)}</b></div>
      <i>→</i>
      <div><small>Morningstar-equivalent</small><b>${esc(driver.morningstar)}</b></div>
      <strong>${esc(driver.delta)}</strong>
      <p>${esc(driver.note)}</p>
      <em>+$${driver.impact.toFixed(2)} / share · ${esc(pct(driver.share,1))} of the sequential gap</em>
    </article>`).join("");
    const bridgeSteps=[
      {label:"Our Base Case",detail:`${pct(calculator.annualGrowth,0)} growth · ${pct(calculator.discountRate,0)} discount`,value:calculatorBase.fairValue,delta:null,tone:"ours"},
      {label:"Apply faster growth",detail:`Growth → ${pct(equivalent.annualGrowth,1)}`,value:growthBridge.fairValue,delta:growthImpact,tone:"growth"},
      {label:"Apply lower discount",detail:`Discount → ${pct(equivalent.discountRate,1)}`,value:discountBridge.fairValue,delta:discountImpact,tone:"discount"},
      {label:"Normalize exit multiple",detail:`P/FCF → ${equivalent.terminalPriceToFcf.toFixed(1)}×`,value:fullBridge.fairValue,delta:multipleImpact,tone:"morningstar"},
    ];
    document.getElementById("intrinsic-value-bridge").innerHTML=bridgeSteps.map(step=>`<div class="intrinsic-bridge-step tone-${esc(step.tone)}"><span>${esc(step.label)}<small>${esc(step.detail)}</small></span>${step.delta==null?'':'<i>+'+step.delta.toFixed(2)+'</i>'}<b>$${step.value.toFixed(2)}</b></div>`).join("");

    const disclosed=intrinsicModel.morningstar;
    const morningstarStageOneShare=disclosed.presentValueStageOne/disclosed.firmValue;
    const morningstarStageTwoShare=disclosed.presentValueStageTwo/disclosed.firmValue;
    const morningstarTerminalShare=disclosed.presentValueStageThree/disclosed.firmValue;
    const disclosedPerShare=disclosed.equityValue/disclosed.projectedDilutedShares;
    const stageYears=Object.keys(disclosed.forecastRevenue).map(Number).sort((a,b)=>a-b);
    document.getElementById("intrinsic-morningstar-forecast-body").innerHTML=stageYears.map(year=>`<tr><td>${year}</td><td><b>${esc(intrinsicBillions(disclosed.forecastRevenue[year],3))}</b></td><td>${esc(pct(disclosed.forecastRevenueGrowth[year],1))}</td><td><b>${esc(intrinsicBillions(disclosed.forecastFcff[year],3))}</b></td><td>${esc(pct(disclosed.forecastFcffMargin[year],1))}</td></tr>`).join("");
    document.getElementById("intrinsic-stage-one-pv").innerHTML=`${esc(intrinsicBillions(disclosed.presentValueStageOne,3))}<small>present value · ${esc(pct(morningstarStageOneShare,1))} of firm value</small>`;
    document.getElementById("intrinsic-stage-two-pv").innerHTML=`${esc(intrinsicBillions(disclosed.presentValueStageTwo,3))}<small>present value · ${esc(pct(morningstarStageTwoShare,1))} of firm value</small>`;
    document.getElementById("intrinsic-stage-three-pv").innerHTML=`${esc(intrinsicBillions(disclosed.presentValueStageThree,3))}<small>present value · ${esc(pct(morningstarTerminalShare,1))} of firm value</small>`;
    const stageTwoMetrics=[
      ["Average EBI growth",pct(disclosed.stageTwoEbiGrowth,0)],
      ["Investment rate",pct(disclosed.stageTwoInvestmentRate,0)],
      ["Perpetuity year",`Year ${disclosed.perpetuityYear}`],
      ["Discount rate",`${pct(disclosed.wacc,1)} WACC`],
    ];
    document.getElementById("intrinsic-stage-two-metrics").innerHTML=stageTwoMetrics.map(([label,value])=>`<span><small>${esc(label)}</small><b>${esc(value)}</b></span>`).join("");
    const stageThreeMetrics=[
      ["Marginal RONIC",`Fades to ${pct(disclosed.wacc,1)}`],
      ["Stage III / firm value",pct(morningstarTerminalShare,1)],
      ["Cost of equity",pct(disclosed.costOfEquity,1)],
      ["WACC",pct(disclosed.wacc,1)],
    ];
    document.getElementById("intrinsic-stage-three-metrics").innerHTML=stageThreeMetrics.map(([label,value])=>`<span><small>${esc(label)}</small><b>${esc(value)}</b></span>`).join("");
    const valuationBridge=[
      ["Present value · Stage I",disclosed.presentValueStageOne],
      ["Present value · Stage II",disclosed.presentValueStageTwo],
      ["Present value · Stage III",disclosed.presentValueStageThree],
      ["Total firm value",disclosed.firmValue],
      ["Cash and equivalents",4475],
      ["Debt",-983],
      ["Other adjustments",0],
      ["Equity value",disclosed.equityValue],
    ];
    document.getElementById("intrinsic-morningstar-bridge-body").innerHTML=valuationBridge.map(([label,value],index)=>`<tr${index===3||index===valuationBridge.length-1?' class="intrinsic-comparison-total"':''}><td>${esc(label)}</td><td><b>${value<0?'−':''}${Math.abs(value).toLocaleString("en-US")}</b></td></tr>`).join("");
    const source=intrinsicModel.sources["morningstar-report"];
    document.getElementById("intrinsic-morningstar-summary").innerHTML=`
      <span><small>Projected diluted shares</small><b>${disclosed.projectedDilutedShares.toFixed(0)}M</b></span>
      <span><small>Disclosed arithmetic</small><b>$${disclosedPerShare.toFixed(2)}</b></span>
      <span class="is-published"><small>Published fair value</small><b>$${disclosed.fairValue.toFixed(2)}</b></span>
      ${sourceAnchor(source.url,"Morningstar report access")}`;
  }

  function peerMoney(value){
    if(Math.abs(value) >= 1e9) return `$${(value/1e9).toFixed(value >= 1e11 ? 0 : 1)}B`;
    return `$${(value/1e6).toFixed(0)}M`;
  }

  function multiple(value,digits=1){
    return value == null || !Number.isFinite(value) ? "—" : `${value.toFixed(digits)}×`;
  }

  function signedPctPoints(value,digits=1){
    return `${value >= 0 ? "+" : "−"}${Math.abs(value*100).toFixed(digits)} ppt`;
  }

  function signedPct(value,digits=0){
    return `${value >= 0 ? "+" : "−"}${Math.abs(value*100).toFixed(digits)}%`;
  }

  function valuationStats(rows){
    const values=rows.map(row=>row.evLtmRevenue).filter(Number.isFinite);
    return {count:values.length,min:Math.min(...values),p25:quantile(values,.25),median:median(values),p75:quantile(values,.75),max:Math.max(...values)};
  }

  function valuationDistribution(label,rows,note){
    const stats=valuationStats(rows);
    const scaleMax=50;
    const position=value=>Math.max(0,Math.min(100,value/scaleMax*100));
    const premium=ddogPeer.evLtmRevenue/stats.median-1;
    return `<div class="valuation-distribution">
      <div class="valuation-distribution-head"><div><b>${esc(label)}</b><span>${esc(note)}</span></div><strong>${esc(multiple(stats.median))}<small>median</small></strong></div>
      <div class="valuation-distribution-track" role="img" aria-label="${esc(label)}: ${multiple(stats.p25)} to ${multiple(stats.p75)} interquartile range, ${multiple(stats.median)} median, Datadog ${multiple(ddogPeer.evLtmRevenue)}">
        <i class="valuation-range" style="left:${position(stats.p25)}%;width:${Math.max(1,position(stats.p75)-position(stats.p25))}%"></i>
        <i class="valuation-median" style="left:${position(stats.median)}%"></i>
        <i class="valuation-target" style="left:${position(ddogPeer.evLtmRevenue)}%"><span>DDOG ${esc(multiple(ddogPeer.evLtmRevenue))}</span></i>
      </div>
      <div class="valuation-distribution-axis"><span>0×</span><span>10×</span><span>20×</span><span>30×</span><span>40×</span><span>50×</span></div>
      <div class="valuation-distribution-read"><span>IQR <b>${esc(multiple(stats.p25))}–${esc(multiple(stats.p75))}</b></span><span>DDOG premium <b>${esc(signedPct(premium))}</b></span></div>
    </div>`;
  }

  function renderValuationContext(){
    document.getElementById("valuation-peer-distributions").innerHTML=
      valuationDistribution("Broad peer set",broadPeers,`${broadPeers.length} companies · all comparison roles`)+
      valuationDistribution("Direct observability",directPeers,"Dynatrace + Elastic");
    document.getElementById("valuation-market-distribution").innerHTML=
      valuationDistribution("High-growth software",highGrowthMarket,`${highGrowthMarket.length} companies · growth ≥15% · market cap ≥$5B`)+
      valuationDistribution("Broad software",broadSoftwareMarket,`${broadSoftwareMarket.length} companies · same universe · no growth cutoff`)+
      valuationDistribution("Infrastructure / security / data",infrastructureSecurityDataMarket,`${infrastructureSecurityDataMarket.length} companies · disclosed thematic subset`);
    document.getElementById("valuation-market-body").innerHTML=[...broadSoftwareMarket].sort((a,b)=>b.evLtmRevenue-a.evLtmRevenue).map(row=>`<tr>
      <td><span class="valuation-cohort-company"><b>${esc(row.ticker)}</b><small>${esc(row.name)}</small></span></td>
      <td><span class="valuation-cohort-tags"><i>Broad</i>${row.ltmGrowth>=.15?"<i>High-growth</i>":""}${infrastructureSecurityDataTickers.has(row.ticker)?"<i>Infra / security / data</i>":""}</span></td>
      <td>${esc(pct(row.ltmGrowth))}</td><td>${esc(multiple(row.evLtmRevenue))}</td>
    </tr>`).join("");
    drawValuationHistory();
  }

  function drawValuationHistory(){
    const canvas=document.getElementById("valuation-history-chart");
    if(!canvas) return;
    const width=Math.max(320,Math.floor(canvas.clientWidth));
    const height=Math.max(300,Math.floor(canvas.clientHeight));
    const dpr=Math.min(window.devicePixelRatio||1,2);
    canvas.width=Math.floor(width*dpr);canvas.height=Math.floor(height*dpr);
    const ctx=canvas.getContext("2d");ctx.scale(dpr,dpr);ctx.clearRect(0,0,width,height);
    const margin={top:24,right:22,bottom:46,left:50};
    const plotWidth=width-margin.left-margin.right,plotHeight=height-margin.top-margin.bottom;
    const benchmark=valuationHistory.slice(0,-1);
    const stats=valuationStats(benchmark);
    const yMax=Math.ceil(Math.max(...valuationHistory.map(row=>row.evLtmRevenue))/5)*5;
    const x=index=>margin.left+index/(valuationHistory.length-1)*plotWidth;
    const y=value=>margin.top+(yMax-value)/yMax*plotHeight;
    ctx.fillStyle="rgba(124,107,245,.08)";ctx.fillRect(margin.left,y(stats.p75),plotWidth,y(stats.p25)-y(stats.p75));
    ctx.font='9px "JetBrains Mono", monospace';ctx.textBaseline="middle";
    for(let i=0;i<=5;i++){
      const value=yMax-yMax*i/5,py=margin.top+plotHeight*i/5;
      ctx.beginPath();ctx.moveTo(margin.left,py);ctx.lineTo(width-margin.right,py);ctx.strokeStyle="rgba(112,121,156,.22)";ctx.stroke();
      ctx.fillStyle="#70799c";ctx.textAlign="right";ctx.fillText(`${value.toFixed(0)}×`,margin.left-8,py);
    }
    ctx.setLineDash([6,5]);ctx.strokeStyle="rgba(245,177,63,.75)";ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(margin.left,y(stats.median));ctx.lineTo(width-margin.right,y(stats.median));ctx.stroke();ctx.setLineDash([]);
    ctx.beginPath();valuationHistory.forEach((row,index)=>index?ctx.lineTo(x(index),y(row.evLtmRevenue)):ctx.moveTo(x(index),y(row.evLtmRevenue)));ctx.strokeStyle="#7c6bf5";ctx.lineWidth=2;ctx.stroke();
    const points=valuationHistory.map((row,index)=>{
      const px=x(index),py=y(row.evLtmRevenue),current=index===valuationHistory.length-1;
      ctx.beginPath();ctx.arc(px,py,current?5.5:3.6,0,Math.PI*2);ctx.fillStyle=current?"#f4f1ff":"#7c6bf5";ctx.fill();ctx.strokeStyle=current?"#7c6bf5":"#141a2b";ctx.lineWidth=current?2.5:1;ctx.stroke();
      return {row,x:px,y:py,radius:current?7:6};
    });
    const labels=[0,4,8,12,16,valuationHistory.length-1].filter((index,position,array)=>index<valuationHistory.length&&array.indexOf(index)===position);
    ctx.fillStyle="#70799c";ctx.textAlign="center";ctx.font='8px "JetBrains Mono", monospace';
    labels.forEach(index=>{const date=new Date(`${valuationHistory[index].date}T00:00:00Z`);const label=index===valuationHistory.length-1?`${date.toLocaleDateString("en-US",{month:"short",timeZone:"UTC"})} ’${String(date.getUTCFullYear()).slice(-2)}`:`${["Q1","Q2","Q3","Q4"][Math.floor(date.getUTCMonth()/3)]} ’${String(date.getUTCFullYear()).slice(-2)}`;ctx.fillText(label,x(index),height-20);});
    canvas._valuationPoints=points;
    renderChartLegend("valuation-history-legend",[
      {label:"EV / LTM revenue",color:"#7c6bf5"},{label:`Historical median ${multiple(stats.median)}`,color:"#f5b13f"},{label:`IQR ${multiple(stats.p25)}–${multiple(stats.p75)}`,color:"rgba(124,107,245,.5)"},
    ]);
  }

  function showValuationHistoryTooltip(event){
    const canvas=event.currentTarget,rect=canvas.getBoundingClientRect();
    const localX=event.clientX-rect.left,localY=event.clientY-rect.top;
    const point=(canvas._valuationPoints||[]).map(item=>({...item,distance:Math.hypot(item.x-localX,item.y-localY)})).sort((a,b)=>a.distance-b.distance)[0];
    if(!point||point.distance>28){hideChartTooltip();return;}
    const date=new Date(`${point.row.date}T00:00:00Z`).toLocaleDateString("en-US",{month:"short",year:"numeric",timeZone:"UTC"});
    chartTooltip.innerHTML=`<b>Datadog · ${esc(date)}</b><span><i style="--tip-color:#7c6bf5"></i>EV / LTM revenue: ${esc(multiple(point.row.evLtmRevenue))}</span><span>Enterprise value: ${esc(peerMoney(point.row.enterpriseValue))}</span><span>LTM revenue: ${esc(peerMoney(point.row.ltmRevenue))}</span>`;
    chartTooltip.hidden=false;chartTooltip.style.left=`${Math.min(window.innerWidth-242,event.clientX+14)}px`;chartTooltip.style.top=`${Math.min(window.innerHeight-130,event.clientY+14)}px`;
  }

  function renderPeerGaps(){
    const cohort=state.peerGapCohort==="direct"?directPeers:broadPeers;
    const indexed=(key)=>ddogPeer[key]/peerMedian(cohort,key);
    const fundamentals=[
      ["NTM revenue growth",indexed("ntmGrowth")],
      ["Standardized FCF margin",indexed("fcfMargin")],
      ["SBC-adjusted Rule of 40",indexed("economicSensitivity")],
    ];
    const valuations=[
      ["EV / NTM revenue",indexed("evNtmRevenue")],
      ["P / NTM FCF",indexed("equityNtmFcf")],
    ];
    const width=value=>Math.max(0,Math.min(100,(value-1)/2.5*100));
    const rows=(items,group)=>items.map(([label,value])=>`<div class="expectation-row">
      <span>${esc(label)}</span>
      <i class="expectation-track" role="img" aria-label="${esc(label)}: ${esc(value.toFixed(2))} times the selected peer median"><b class="expectation-bar ${group}" style="width:${width(value)}%"></b></i>
      <strong>${esc(value.toFixed(2))}×</strong>
    </div>`).join("");
    document.getElementById("peer-quality-index").innerHTML=rows(fundamentals,"quality");
    document.getElementById("peer-premium-index").innerHTML=rows(valuations,"premium");
    const qualityHigh=Math.max(...fundamentals.map(([,value])=>value));
    const premiumLow=Math.min(...valuations.map(([,value])=>value));
    document.getElementById("peer-expectation-gap-value").textContent=`+${(premiumLow-qualityHigh).toFixed(1)}× gap`;
    document.getElementById("peer-expectation-gap-copy").textContent=`Measured quality tops out at ${qualityHigh.toFixed(1)}× peers; valuation starts at ${premiumLow.toFixed(1)}×.`;
    document.querySelectorAll("[data-peer-gap-cohort]").forEach(button=>button.setAttribute("aria-pressed",String(button.dataset.peerGapCohort===state.peerGapCohort)));
  }

  function drawPeerScatter({canvasId,xKey,yKey,xLabel,yLabel,legendId}){
    const canvas = document.getElementById(canvasId);
    if(!canvas) return;
    const width = Math.max(320,Math.floor(canvas.clientWidth));
    const height = Math.max(320,Math.floor(canvas.clientHeight));
    const dpr = Math.min(window.devicePixelRatio || 1,2);
    canvas.width = Math.floor(width*dpr);canvas.height = Math.floor(height*dpr);
    const ctx = canvas.getContext("2d");ctx.scale(dpr,dpr);ctx.clearRect(0,0,width,height);
    const margin = {top:24,right:24,bottom:52,left:58};
    const plotWidth = width-margin.left-margin.right;
    const plotHeight = height-margin.top-margin.bottom;
    const xMin = Math.max(0,Math.floor(Math.min(...peerRows.map(row=>row[xKey]))*100/5)*.05-.01);
    const xMax = Math.ceil(Math.max(...peerRows.map(row=>row[xKey]))*100/5)*.05+.01;
    const yMin = 0;
    const yMax = Math.ceil(Math.max(...peerRows.map(row=>row[yKey]))/5)*5;
    const x = value => margin.left+(value-xMin)/(xMax-xMin)*plotWidth;
    const y = value => margin.top+(yMax-value)/(yMax-yMin)*plotHeight;
    ctx.font = '9px "JetBrains Mono", monospace';ctx.textBaseline="middle";
    for(let i=0;i<=5;i++){
      const py=margin.top+plotHeight*i/5;const value=yMax-(yMax-yMin)*i/5;
      ctx.beginPath();ctx.moveTo(margin.left,py);ctx.lineTo(width-margin.right,py);ctx.strokeStyle="rgba(112,121,156,.23)";ctx.stroke();
      ctx.fillStyle="#70799c";ctx.textAlign="right";ctx.fillText(`${value.toFixed(0)}×`,margin.left-9,py);
    }
    for(let i=0;i<=5;i++){
      const px=margin.left+plotWidth*i/5;const value=xMin+(xMax-xMin)*i/5;
      ctx.fillStyle="#70799c";ctx.textAlign="center";ctx.fillText(pct(value,0),px,height-28);
    }
    const medianX=peerMedian(broadPeers,xKey),medianY=peerMedian(broadPeers,yKey);
    ctx.setLineDash([5,5]);ctx.strokeStyle="rgba(222,226,242,.45)";ctx.lineWidth=1;
    ctx.beginPath();ctx.moveTo(x(medianX),margin.top);ctx.lineTo(x(medianX),height-margin.bottom);ctx.stroke();
    ctx.beginPath();ctx.moveTo(margin.left,y(medianY));ctx.lineTo(width-margin.right,y(medianY));ctx.stroke();ctx.setLineDash([]);
    const points = peerRows.slice().sort((a,b)=>b.marketCap-a.marketCap).map(row => {
      const px=x(row[xKey]),py=y(row[yKey]);
      const radius=5+Math.sqrt(row.marketCap/1e9)*.55;
      const color=peerModel.buckets[row.bucket].color;
      ctx.beginPath();ctx.arc(px,py,radius,0,Math.PI*2);ctx.fillStyle=`${color}${row.ticker==="DDOG"?"e8":"b8"}`;ctx.fill();
      ctx.strokeStyle=row.ticker==="DDOG"?"#f4f1ff":"rgba(14,18,36,.8)";ctx.lineWidth=row.ticker==="DDOG"?2.2:1.3;ctx.stroke();
      ctx.font = `${row.ticker==="DDOG"?"700":"600"} 10px "JetBrains Mono", monospace`;
      ctx.fillStyle=row.ticker==="DDOG"?"#f4f1ff":"#aeb6d5";ctx.textAlign="center";ctx.fillText(row.ticker,px,py-radius-8);
      return {row,x:px,y:py,radius};
    });
    ctx.font='9px "JetBrains Mono", monospace';ctx.fillStyle="#70799c";ctx.textAlign="center";ctx.fillText(`${xLabel} →`,margin.left+plotWidth/2,height-8);
    ctx.save();ctx.translate(13,margin.top+plotHeight/2);ctx.rotate(-Math.PI/2);ctx.fillText(`${yLabel} →`,0,0);ctx.restore();
    canvas._peerPoints=points;
    canvas._peerChart={xKey,yKey,xLabel,yLabel};
    renderChartLegend(legendId,Object.entries(peerModel.buckets).map(([,bucket])=>({label:bucket.label,color:bucket.color})));
  }

  function drawPeerScatters(){
    drawPeerScatter({canvasId:"peer-valuation-chart",xKey:"ntmGrowth",yKey:"evNtmRevenue",xLabel:"NTM revenue growth",yLabel:"EV / NTM revenue",legendId:"peer-valuation-legend"});
    drawPeerScatter({canvasId:"peer-reported-valuation-chart",xKey:"ltmGrowth",yKey:"evLtmRevenue",xLabel:"LTM revenue growth",yLabel:"EV / LTM revenue",legendId:"peer-reported-valuation-legend"});
  }

  function showPeerTooltip(event){
    const canvas=event.currentTarget;
    const rect=canvas.getBoundingClientRect();
    const localX=event.clientX-rect.left,localY=event.clientY-rect.top;
    const point=(canvas._peerPoints||[]).map(item=>({...item,distance:Math.hypot(item.x-localX,item.y-localY)})).sort((a,b)=>a.distance-b.distance)[0];
    if(!point || point.distance>32){hideChartTooltip();return;}
    const row=point.row;
    const chart=canvas._peerChart;
    chartTooltip.innerHTML=`<b>${esc(row.name)} · ${esc(row.ticker)}</b><span><i style="--tip-color:${peerModel.buckets[row.bucket].color}"></i>${esc(chart.xLabel)}: ${esc(pct(row[chart.xKey]))}</span><span>${esc(chart.yLabel)}: ${esc(multiple(row[chart.yKey]))}</span><span>Market cap: ${esc(peerMoney(row.marketCap))}</span>`;
    chartTooltip.hidden=false;
    chartTooltip.style.left=`${Math.min(window.innerWidth-242,event.clientX+14)}px`;
    chartTooltip.style.top=`${Math.min(window.innerHeight-130,event.clientY+14)}px`;
  }

  function renderPeerTable(){
    const filteredRows=peerRows.filter(row=>state.peerFilter==="all" || row.bucket==="target" || row.bucket===state.peerFilter);
    const sortedRows=table=>[...filteredRows].sort((a,b)=>{
      const sort=state.peerSort[table];
      const av=a[sort.key],bv=b[sort.key];
      const comparison=typeof av==="string"?av.localeCompare(bv):av-bv;
      return sort.direction==="asc"?comparison:-comparison;
    });
    const companyCell=row=>`<span class="peer-company"><i style="--peer-color:${peerModel.buckets[row.bucket].color}"></i><b>${esc(row.ticker)}</b><small>${esc(row.name)}</small></span>`;
    const heatCell=(row,key,format,direction="higher")=>{
      const value=row[key];
      const values=peerRows.map(item=>item[key]).filter(Number.isFinite);
      const betterCount=values.filter(item=>direction==="higher"?item>value:item<value).length;
      const rank=betterCount+1;
      const min=Math.min(...values),max=Math.max(...values);
      const rangePosition=max>min?(value-min)/(max-min):.5;
      const quality=direction==="higher"?rangePosition:1-rangePosition;
      const hue=Math.round(4+quality*138);
      const strength=(.09+Math.abs(quality-.5)*.16).toFixed(3);
      const directionLabel=direction==="higher"?"higher is stronger":"lower is more attractive";
      return `<td class="peer-heat" style="--heat-hue:${hue};--heat-strength:${strength}" title="Rank ${rank} of ${values.length}; ${directionLabel}" aria-label="${esc(format(value))}; rank ${rank} of ${values.length}; ${directionLabel}">${esc(format(value))}</td>`;
    };
    const ownerMultipleCell=row=>Number.isFinite(row.equityNtmOwnerFcf)
      ? heatCell(row,"equityNtmOwnerFcf",multiple,"lower")
      : `<td class="peer-heat" style="--heat-hue:4;--heat-strength:.25" title="Not meaningful: NTM owner FCF is zero or negative" aria-label="Not meaningful; NTM owner FCF is zero or negative">NM</td>`;
    peerFundamentalsBody.innerHTML=sortedRows("fundamentals").map(row=>`<tr class="${row.ticker==="DDOG"?"is-target":""}">
      <td>${companyCell(row)}</td>
      ${heatCell(row,"ltmGrowth",pct)}${heatCell(row,"ntmGrowth",pct)}${heatCell(row,"grossMargin",pct)}${heatCell(row,"operatingMargin",pct)}${heatCell(row,"fcfMargin",pct)}${heatCell(row,"gaapRule40",pct)}${heatCell(row,"rule40",pct)}${heatCell(row,"economicSensitivity",pct)}${heatCell(row,"sbcMargin",pct,"lower")}${heatCell(row,"dilution",pct,"lower")}
    </tr>`).join("");
    peerValuationBody.innerHTML=sortedRows("valuation").map(row=>`<tr class="${row.ticker==="DDOG"?"is-target":""}">
      <td>${companyCell(row)}</td>
      ${heatCell(row,"evLtmRevenue",multiple,"lower")}${heatCell(row,"evNtmRevenue",multiple,"lower")}${heatCell(row,"evNtmGrossProfit",multiple,"lower")}${heatCell(row,"equityNtmFcf",multiple,"lower")}${ownerMultipleCell(row)}
    </tr>`).join("");
    document.querySelectorAll("[data-peer-sort]").forEach(button=>{
      const sort=state.peerSort[button.dataset.peerTable];
      const active=button.dataset.peerSort===sort.key;
      button.classList.toggle("is-active",active);
      button.dataset.direction=active?sort.direction:"";
    });
  }

  function renderPeerMethodology(){
    const definitions=Object.entries(peerModel.methodology).map(([key,copy])=>`<article><b>${esc(pretty(key))}</b><p>${esc(copy)}</p></article>`).join("");
    const sources=peerRows.map(row=>`<article class="peer-source-row"><b>${esc(row.ticker)}</b><span>Actuals through ${esc(row.latestQuarter)} · forward view updated ${esc(row.forwardUpdated)}</span><span>${sourceAnchor(peerModel.sourceFor(row.ticker,"income"),"Financials")} ${sourceAnchor(peerModel.sourceFor(row.ticker,"cash-flow"),"Cash flow")} ${sourceAnchor(peerModel.sourceFor(row.ticker,"forecast"),"Forecast")}</span></article>`).join("");
    document.getElementById("peer-methodology-content").innerHTML=`<div class="peer-method-grid">${definitions}</div><div class="peer-source-note"><p><b>${esc(peerModel.meta.reliability)}.</b> Historical statements use ${esc(peerModel.meta.historicalProvider)}; forward estimates use ${esc(peerModel.meta.forwardProvider)}. Fiscal calendars, estimate timing, business mix and SBC accounting still limit comparability. This screen is for relative underwriting, not a substitute for a full model.</p>${sourceAnchor(peerModel.primaryCrosscheck,"Datadog primary cross-check")}</div><div class="peer-source-list">${sources}</div>`;
  }

  function renderPeers(){
    renderValuationContext();renderPeerGaps();drawPeerScatters();renderPeerTable();renderPeerMethodology();
    document.querySelectorAll("#peer-comps-panel .peer-scatter").forEach(scatter=>{
      scatter.addEventListener("pointermove",showPeerTooltip);scatter.addEventListener("pointerleave",hideChartTooltip);
    });
    const historyChart=document.getElementById("valuation-history-chart");
    historyChart?.addEventListener("pointermove",showValuationHistoryTooltip);historyChart?.addEventListener("pointerleave",hideChartTooltip);
  }

  filters.innerHTML = FILTERS.map(filter =>
    `<button class="filter" type="button" data-filter="${filter.id}" aria-pressed="false" aria-describedby="overlay-help-${filter.id}">
      <span>${esc(filter.label)}</span>
      <span class="filter-info" aria-hidden="true">?</span>
      <span class="filter-tooltip" id="overlay-help-${filter.id}" role="tooltip">${esc(filter.purpose)}</span>
    </button>`
  ).join("");

  function renderEnablers(){
    enablers.innerHTML = model.platformEnablers.map(item => {
      const relevantFilters = [...state.filters].filter(filter => filter === "regulated" || filter === "byoc");
      const active = relevantFilters.length === 0 || relevantFilters.every(filter => item.tags.includes(filter));
      return `<article class="enabler ${active ? "" : "is-dimmed"}">
        <div class="enabler-top">
          <h3>${esc(item.name)}</h3>
          <span class="entity-badge">${esc(model.entityTypes[item.entityType].label)}</span>
        </div>
        <p>${esc(item.description)}</p>
      </article>`;
    }).join("");
  }

  function renderLegend(){
    if(!state.showProductScores){
      legend.innerHTML = "";
      legend.hidden = true;
      return;
    }
    legend.hidden = false;
    const scoreKeys = SCORECARD.map(item =>
      `<span class="score-key"><b>${esc(item.short)}</b>${esc(item.label)}</span>`
    ).join("");
    legend.innerHTML = `${scoreKeys}
      <span class="confidence-key" title="High, medium, or low confidence in the evidence supporting the point estimate">
        <span class="evidence-confidence confidence-high">H</span>
        <span class="evidence-confidence confidence-medium">M</span>
        <span class="evidence-confidence confidence-low">L</span>
        <span>evidence confidence</span>
      </span>`;
  }

  function scoreMeter(item,definition){
    const value = definition.definitions[item[definition.id]];
    const unknown = value.score === null;
    const confidence = item.evidenceConfidence?.[definition.id] || null;
    const confidenceDefinition = confidence ? model.evidenceConfidence[confidence] : null;
    const segments = Array.from({length:value.max},(_,index) =>
      `<i class="${unknown ? "unknown" : index < value.score ? "active" : ""}"></i>`
    ).join("");
    const confidenceCopy = confidenceDefinition
      ? ` · evidence confidence: ${confidenceDefinition.label}`
      : "";
    return `<span class="score-row ${unknown ? "is-unknown" : ""} ${confidence ? `has-confidence confidence-${confidence}` : ""}"
      title="${esc(definition.label)}: ${esc(value.label)}${esc(confidenceCopy)}"
      aria-label="${esc(definition.label)}: ${esc(value.label)}${esc(confidenceCopy)}"
      style="--score-color:${value.color}">
      <span class="score-label">${esc(definition.short)}</span>
      <span class="score-track" aria-hidden="true">${segments}</span>
      <span class="score-value">${esc(value.label)}</span>
      ${confidenceDefinition
        ? `<span class="evidence-confidence confidence-${esc(confidence)}" title="Evidence confidence: ${esc(confidenceDefinition.label)}">${esc(confidenceDefinition.short)}</span>`
        : `<span class="evidence-confidence is-unrated" aria-hidden="true"></span>`}
    </span>`;
  }

  function productScorecard(item){
    return `<span class="product-scorecard">${SCORECARD.map(definition => scoreMeter(item,definition)).join("")}</span>`;
  }

  function matchesFilters(item){
    return [...state.filters].every(id => FILTERS.find(filter => filter.id === id)?.test(item));
  }

  function distribution(products){
    const counts = Object.fromEntries(Object.keys(model.maturity).map(key => [key,0]));
    products.forEach(product => counts[product.maturity] = (counts[product.maturity] || 0) + 1);
    return Object.entries(model.maturity).map(([key,definition]) => {
      const count = counts[key] || 0;
      if(!count) return "";
      return `<i title="${esc(definition.label)}: ${count}" style="width:${(count/products.length)*100}%;background:${definition.color}"></i>`;
    }).join("");
  }

  function renderLanes(){
    Object.keys(refs).forEach(key => delete refs[key]);
    lanes.innerHTML = model.categories.map(category => `
      <article class="lane" style="--c:${category.color}">
        <div class="spine">
          <div class="cat">${esc(category.catName)}</div>
          <div class="gart">${category.gart}</div>
          <div class="anchor">
            <div class="val ${category.anchor.none ? "none" : ""}">${esc(category.anchor.val)}</div>
            <div class="lab">${esc(category.anchor.lab)}</div>
          </div>
        </div>
        <div class="cells">
          ${category.suites.map(suite => {
            const products = suite.products.map(product => ({
              ...product,
              categoryId:category.id,
              categoryName:category.catName,
              categoryColor:category.color,
              suiteName:suite.name,
            }));
            return `<section class="suite">
              <div class="suite-h">
                <span class="suite-name">${esc(suite.name)}</span>
                <span class="dist" aria-label="Product maturity distribution">${distribution(products)}</span>
                <span class="suite-count">${products.length} ${products.length === 1 ? "leaf" : "leaves"}</span>
                <span class="suite-rule"></span>
              </div>
              <div class="grid">
                ${products.map((item,index) => {
                  const key = `${category.id}-${slugKey(suite.name)}-${item.id}-${index}`;
                  refs[key] = item;
                  const match = matchesFilters(item);
                  return `<button class="cell ${item.border ? "border" : ""} ${match && state.filters.size ? "is-match" : ""} ${!match ? "is-dimmed" : ""}"
                    type="button" data-item="${esc(key)}" style="--cell-color:${item.categoryColor}"
                    aria-label="Open ${esc(item.n)} details">
                    ${item.workloads.includes("ai") ? '<span class="ai-dot" aria-hidden="true"></span>' : ""}
                    <span class="cell-name">${esc(item.n)}</span>
                    ${item.arr ? `<span class="arr">${esc(item.arr)}</span>` : ""}
                    ${state.showProductScores ? productScorecard(item) : ""}
                  </button>`;
                }).join("")}
              </div>
            </section>`;
          }).join("")}
        </div>
      </article>
    `).join("");
  }

  function slugKey(value){
    return value.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/(^-|-$)/g,"");
  }

  function renderExplainer(){
    const activeFilters = [...state.filters].map(id => FILTERS.find(filter => filter.id === id)).filter(Boolean);
    const filterCopy = activeFilters.length
      ? `<div class="overlay-explanations">${activeFilters.map(filter =>
          `<p><b>${esc(filter.label)}</b><span>${esc(filter.purpose)}</span></p>`
        ).join("")}</div>`
      : `<span class="overlay-empty">Hover or focus an overlay for its purpose; select overlays to combine them.</span>`;
    explainer.innerHTML = filterCopy;
    clearFilters.disabled = state.filters.size === 0;
  }

  function render(){
    renderBusinessModel();
    renderEconomicMoat();
    renderLegend();
    renderEnablers();
    renderLanes();
    renderExplainer();
    filters.querySelectorAll("button").forEach(button => button.setAttribute("aria-pressed",state.filters.has(button.dataset.filter)));
    productScoresToggle.setAttribute("aria-checked",String(state.showProductScores));
    mapHint.textContent = state.showProductScores
      ? "Bar length is the point estimate. Fill treatment and H/M/L show evidence confidence. Select a tile for sources and moat mechanics."
      : "Select a product tile for its assessment, sources, and moat mechanics.";
  }

  function activateTab(tabId,{focus=false,updateUrl=true}={}){
    if(!tabButtons.some(button => button.dataset.tab === tabId)) return;
    state.activeTab = tabId;
    closeReader();
    tabButtons.forEach(button => {
      const active = button.dataset.tab === tabId;
      button.classList.toggle("is-active",active);
      button.setAttribute("aria-selected",String(active));
      button.tabIndex = active ? 0 : -1;
      if(active && focus) button.focus();
    });
    const activeTabButton=tabButtons.find(button=>button.dataset.tab===tabId);
    if(activeTabButton && tabList.scrollWidth>tabList.clientWidth){
      const centeredLeft=activeTabButton.offsetLeft-(tabList.clientWidth-activeTabButton.offsetWidth)/2;
      tabList.scrollTo({left:Math.max(0,centeredLeft),behavior:focus?"smooth":"auto"});
    }
    tabPanels.forEach(panel => {
      panel.hidden = panel.dataset.panel !== tabId;
    });
    if(tabId === "kpis"){
      requestAnimationFrame(() => {
        if(!kpisInitialized){
          renderKpis();
          kpisInitialized = true;
        } else {
          renderKpiCharts();
        }
      });
    }
    if(tabId === "financials"){
      requestAnimationFrame(() => {
        if(!financialsInitialized){
          renderFinancials();
          financialsInitialized = true;
        } else {
          renderFinancialCharts();
        }
      });
    }
    if(tabId === "intrinsic-valuation"){
      requestAnimationFrame(() => {
        if(!intrinsicInitialized){
          renderIntrinsicValuation();
          intrinsicInitialized = true;
        }
      });
    }
    if(tabId === "peer-comps"){
      requestAnimationFrame(() => {
        if(!peersInitialized){
          renderPeers();
          peersInitialized = true;
        } else {
          drawPeerScatters();drawValuationHistory();
        }
      });
    }
    if(updateUrl){
      history.replaceState(null,"",`#${tabId}`);
    }
  }

  function revealDeepLink(targetId,{behavior="auto"}={}){
    const target = document.getElementById(targetId);
    const panelId = target?.closest("[data-panel]")?.dataset.panel;
    if(!target || !panelId) return;
    activateTab(panelId,{updateUrl:false});
    requestAnimationFrame(() => requestAnimationFrame(() => {
      const card = target.closest(".kpi-chart-card") || target;
      chartCards.forEach(item => item.classList.toggle("is-deep-linked",item === card));
      card.scrollIntoView({behavior,block:"start"});
    }));
  }

  async function copyText(value){
    if(navigator.clipboard?.writeText){
      try{
        await navigator.clipboard.writeText(value);
        return;
      }catch(error){
        console.warn("Clipboard API unavailable; using copy fallback",error);
      }
    }
    const input = document.createElement("textarea");
    input.value = value;
    input.setAttribute("readonly","");
    input.style.position = "fixed";
    input.style.opacity = "0";
    document.body.append(input);
    input.select();
    const copied = document.execCommand("copy");
    input.remove();
    if(!copied) throw new Error("Browser rejected the copy command.");
  }

  function installChartShareControls(){
    chartCards.forEach(card => {
      const head = card.querySelector(".kpi-card-head, .intrinsic-stage-head");
      const targetId = card.dataset.shareTarget;
      if(!head || !targetId || head.querySelector(".chart-link-copy")) return;
      head.classList.add("chart-share-head");
      const button = document.createElement("button");
      button.className = "chart-link-copy";
      button.type = "button";
      button.dataset.copyTarget = targetId;
      button.setAttribute("aria-live","polite");
      button.setAttribute("aria-label",`Copy direct link to ${card.querySelector("h3")?.textContent?.trim() || "this chart"}`);
      button.innerHTML = '<span aria-hidden="true">↗</span><b>Copy link</b>';
      head.append(button);
    });
  }

  function tag(label,primary=false,color="var(--txt-dim)"){
    return `<span class="r-tag ${primary ? "primary" : ""}" style="--tag:${color}">${esc(label)}</span>`;
  }

  function tagList(keys,dictionary){
    return `<div class="tag-list">${keys.map(key => `<span class="detail-tag">${esc(dictionary[key]?.label || pretty(key))}</span>`).join("")}</div>`;
  }

  function relatedFor(item){
    return model.relatedEntities.filter(entity => entity.parent === item.n);
  }

  function sourceCitation(sourceRef,compact=false){
    const source = model.sources[sourceRef.id];
    if(!source) return "";
    const sourceUrl = sourceRef.url || source.url;
    const sourceLabel = sourceRef.label || source.label;
    const excerpt = sourceRef.excerpt || source.hoverText;
    const excerptType = sourceRef.excerptType || source.hoverType;
    const excerptLabels = {
      quote:"Verbatim quote",
      company_excerpt:"Company description",
      parsed_summary:"Parsed summary · not a quote",
      note:"Analytical note · not a quote",
    };
    const roleLabels = {
      direct:"Product evidence",
      supporting:"Supporting evidence",
      context:"Company context",
      judgment:"Map inference",
      limitation:"Disclosure limit",
    };
    const sourceLink = sourceUrl
      ? `<a href="${esc(sourceUrl)}" target="_blank" rel="noopener noreferrer">${esc(sourceLabel)}<span aria-hidden="true"> ↗</span></a>`
      : `<span class="source-name">${esc(sourceLabel)}</span>`;
    return `<details class="source-citation ${compact ? "is-compact" : ""} role-${esc(sourceRef.role || "supporting")}">
      <summary>
        <span class="evidence-role">${esc(roleLabels[sourceRef.role] || "Evidence")}</span>
        <span class="source-summary-name">${esc(sourceLabel)}</span>
        <span class="scope-badge">${esc(sourceRef.scope || "unspecified scope")}</span>
      </summary>
      <div class="source-content">
        <div class="source-line">
          ${sourceLink}
          <span class="access-badge access-${esc(source.access)}">${esc(source.access === "subscriber" ? "Subscriber-only" : source.access)}</span>
        </div>
        <div class="source-locator">${esc(source.publisher)} · ${esc(source.date)} · ${esc(sourceRef.locator)}</div>
        ${excerpt ? `<div class="source-excerpt">
          <b>${esc(excerptLabels[excerptType] || "Source content")}</b>
          ${excerptType === "quote" ? `<q>${esc(excerpt)}</q>` : `<span>${esc(excerpt)}</span>`}
        </div>` : ""}
        ${sourceRef.summary ? `<div class="source-interpretation"><b>Map reading</b>${esc(sourceRef.summary)}</div>` : ""}
        ${sourceRef.caveat ? `<div class="source-caveat"><b>Evidence boundary</b>${esc(sourceRef.caveat)}</div>` : ""}
        ${source.rightsNote ? `<div class="source-rights">${esc(source.rightsNote)}</div>` : ""}
      </div>
    </details>`;
  }

  function assessmentCard(item,definition,heading){
    const value = definition.definitions[item[definition.id]];
    const evidence = item.assessmentEvidence[definition.id];
    const confidence = model.evidenceConfidence[evidence.confidence];
    return `<article class="assessment" style="--assessment:${value.color}">
      <span class="assessment-label">${esc(heading)}</span>
      <strong><i></i>${esc(value.label)}</strong>
      <p>${esc(evidence.rationale)}</p>
      <div class="assessment-meta">
        <span class="evidence-confidence confidence-${esc(evidence.confidence)}">${esc(confidence?.short || evidence.confidence.slice(0,1))}</span>
        <span>${esc(confidence?.label || evidence.confidence)} evidence confidence</span>
        <span>·</span>
        <span>${esc(evidence.asOf)}</span>
      </div>
      <div class="assessment-sources">
        <span class="assessment-sources-label">Evidence & reasoning · ${evidence.sources.length}</span>
        ${evidence.sources.map(source => sourceCitation(source,true)).join("")}
      </div>
    </article>`;
  }

  function openReader(item,cell){
    state.selected = item;
    document.querySelectorAll(".cell.selected").forEach(node => node.classList.remove("selected"));
    cell.classList.add("selected");
    reader.style.setProperty("--rc",item.categoryColor);
    readerCat.textContent = `${item.categoryName} · ${item.suiteName}`;
    readerName.textContent = item.n;
    readerTags.innerHTML = [
      tag(model.entityTypes[item.entityType]?.label || pretty(item.entityType),true,item.categoryColor),
      tag(model.maturity[item.maturity]?.label,true,model.maturity[item.maturity]?.color),
      tag(model.position[item.position]?.label,true,model.position[item.position]?.color),
      tag(model.momentum[item.momentum]?.label),
      tag(`${model.moatConviction[item.moatConviction]?.label} moat contribution`,true,model.moatConviction[item.moatConviction]?.color),
      item.workloads.includes("ai") ? tag("AI layer",true,"var(--ai)") : "",
    ].join("");

    const related = relatedFor(item);
    const canonicalCopy = item.canonicalCategory !== item.categoryId
      ? `<div class="r-callout"><b>Reference placement</b>Canonical home: ${esc(CATEGORY_LABELS[item.canonicalCategory])}. This repeated leaf preserves the documented border convention without double-counting the market.</div>`
      : "";

    const evidence = item.evidence.length
      ? item.evidence.map(record => `<div class="evidence">
          <p>${esc(record.claim)}</p>
          <div class="evidence-meta">
            <span>${esc(record.asOf)}</span><span>·</span><span>${esc(record.scope)}</span><span>·</span>
            <span>${esc(record.sourceClass)}</span><span>·</span><span>${esc(record.confidence)} confidence</span>
          </div>
          ${record.sourceId
            ? sourceCitation({
              id:record.sourceId,
              locator:record.locator,
              role:"supporting",
              scope:record.scope,
              excerpt:record.excerpt,
              excerptType:record.excerptType,
              summary:record.claim,
              caveat:"This evidence record supports the stated capability or usage signal; confidence and scope remain as labeled above.",
            },true)
            : `<div class="evidence-meta"><span>${esc(record.source)}</span></div>`}
        </div>`).join("")
      : `<div class="r-callout"><b>Evidence status</b>No product-level financial disclosure. Assessment relies on product position, competitive context, and suite logic.</div>`;

    const boundary = item.boundary
      ? `<div class="r-sec"><h4>Boundary convention</h4>
          <div class="r-callout"><b>Canonical: ${esc(CATEGORY_LABELS[item.boundary.canonicalCategory])}</b>${esc(item.boundary.reason)}</div>
          <div class="evidence-meta"><span>Set ${esc(item.boundary.decisionDate)}</span><span>·</span><span>Review: ${esc(item.boundary.reviewTrigger)}</span></div>
        </div>`
      : "";

    readerBody.innerHTML = `
      <div class="r-sec">
        <h4>What it does</h4>
        <p>${esc(item.what)}</p>
        <div class="r-example"><b>For example</b>${esc(item.ex)}</div>
        ${canonicalCopy}
      </div>
      <div class="r-sec">
        <h4>Why a customer pays</h4>
        <p>${esc(item.why)}</p>
      </div>
      <div class="r-sec">
        <h4>Product-level assessment</h4>
        <div class="assessment-grid">
          ${assessmentCard(item,SCORECARD[0],"Commercial maturity")}
          ${assessmentCard(item,SCORECARD[1],"Competitive position")}
          ${assessmentCard(item,SCORECARD[2],"Momentum")}
          ${assessmentCard(item,SCORECARD[3],"Moat contribution")}
        </div>
      </div>
      <div class="r-sec">
        <h4>Competitive read</h4>
        <p>${esc(item.edge)}</p>
      </div>
      ${item.competitors.length ? `<div class="r-sec"><h4>Competitive set</h4><div class="comp-grid">${item.competitors.map(([name,type]) => `<span class="comp ${esc(type)}">${esc(name)}</span>`).join("")}</div></div>` : ""}
      <div class="r-sec"><h4>Moat contribution</h4>
        <div class="r-callout"><b>${esc(model.moatConviction[item.moatConviction].label)} contribution</b>${esc(item.moatConvictionRationale)}</div>
        <div class="moat-mechanisms"><span>Switching-cost mechanisms</span>${tagList(item.moat,MOAT)}</div>
        ${item.evidenceSignals.length ? `<div class="moat-mechanisms"><span>Traction / validation signals · not moat</span>${tagList(item.evidenceSignals,model.evidenceSignals)}</div>` : ""}
      </div>
      <div class="r-sec"><h4>Commercial tags</h4>
        <div class="tag-list">
          ${[...item.monetization,...item.motion,...item.workloads].map(value => `<span class="detail-tag">${esc(pretty(value))}</span>`).join("")}
        </div>
      </div>
      <div class="r-sec"><h4>Underwriting sensitivities</h4>
        <div class="underwriting-list">
          ${item.dcf.map(key => {
            const sensitivity = model.underwriting[key];
            return `<div class="underwriting-item group-${esc(sensitivity?.group || "other")}">
              <b>${esc(sensitivity?.label || pretty(key))}</b>
              <span>${esc(sensitivity?.description || "")}</span>
            </div>`;
          }).join("")}
        </div>
      </div>
      ${(item.capabilities.length || related.length) ? `<div class="r-sec"><h4>Capabilities & solution overlays</h4>
        ${item.capabilities.map(value => `<div class="r-callout"><b>${esc(value)}</b>Nested under the product; not counted as a separate market category.</div>`).join("")}
        ${related.map(entity => `<div class="r-callout"><b>${esc(entity.name)} · ${esc(model.entityTypes[entity.entityType].label)}</b>${esc(entity.description)}</div>`).join("")}
      </div>` : ""}
      <div class="r-sec"><h4>Evidence ledger</h4>${evidence}</div>
      ${boundary}
      ${item.arr ? `<div class="r-sec"><h4>Directional product metric</h4><div class="r-callout"><b>${esc(item.arr)}</b>Company-stated product or combined-suite figure; not audited segment data.</div></div>` : ""}
    `;

    readerBody.scrollTop = 0;
    document.body.classList.add("reader-open");
    reader.setAttribute("aria-hidden","false");
    document.getElementById("r-close").focus({preventScroll:true});
  }

  function closeReader(){
    document.body.classList.remove("reader-open");
    reader.setAttribute("aria-hidden","true");
    document.querySelectorAll(".cell.selected").forEach(node => node.classList.remove("selected"));
    state.selected = null;
  }

  filters.addEventListener("click",event => {
    const button = event.target.closest("[data-filter]");
    if(!button) return;
    const id = button.dataset.filter;
    state.filters.has(id) ? state.filters.delete(id) : state.filters.add(id);
    closeReader();
    render();
  });

  clearFilters.addEventListener("click",() => {
    state.filters.clear();
    closeReader();
    render();
  });

  productScoresToggle.addEventListener("click",() => {
    state.showProductScores = !state.showProductScores;
    closeReader();
    renderLegend();
    renderLanes();
    productScoresToggle.setAttribute("aria-checked",String(state.showProductScores));
    mapHint.textContent = state.showProductScores
      ? "Bar length is the point estimate. Fill treatment and H/M/L show evidence confidence. Select a tile for sources and moat mechanics."
      : "Select a product tile for its assessment, sources, and moat mechanics.";
  });

  tabList.addEventListener("click",event => {
    const button = event.target.closest("[data-tab]");
    if(button) activateTab(button.dataset.tab);
  });

  document.addEventListener("click",async event => {
    const button = event.target.closest(".chart-link-copy");
    if(!button) return;
    const url = new URL(window.location.href);
    url.hash = button.dataset.copyTarget;
    try{
      await copyText(url.href);
      button.classList.add("is-copied");
      button.querySelector("b").textContent = "Copied";
      clearTimeout(button._copyReset);
      button._copyReset = setTimeout(() => {
        button.classList.remove("is-copied");
        button.querySelector("b").textContent = "Copy link";
      },1800);
    }catch(error){
      button.querySelector("b").textContent = "Copy failed";
      setTimeout(() => button.querySelector("b").textContent = "Copy link",1800);
      console.error("Could not copy chart link",error);
    }
  });

  window.addEventListener("hashchange",() => revealDeepLink(window.location.hash.slice(1),{behavior:"smooth"}));

  financialSectionNav?.addEventListener("click",event => {
    const button = event.target.closest("[data-financial-target]");
    if(!button) return;
    const target = document.getElementById(button.dataset.financialTarget);
    if(!target) return;
    target.scrollIntoView({behavior:window.matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth",block:"start"});
  });

  peerSectionNav?.addEventListener("click",event => {
    const button=event.target.closest("[data-peer-target]");
    if(!button) return;
    const target=document.getElementById(button.dataset.peerTarget);
    target?.scrollIntoView({behavior:window.matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth",block:"start"});
  });

  document.getElementById("peer-table-filters")?.addEventListener("click",event => {
    const button=event.target.closest("[data-peer-filter]");
    if(!button) return;
    state.peerFilter=button.dataset.peerFilter;
    document.querySelectorAll("[data-peer-filter]").forEach(item=>item.classList.toggle("is-active",item===button));
    renderPeerTable();
  });

  document.querySelector(".peer-gap-toggle")?.addEventListener("click",event=>{
    const button=event.target.closest("[data-peer-gap-cohort]");
    if(!button) return;
    state.peerGapCohort=button.dataset.peerGapCohort;
    renderPeerGaps();
  });

  document.getElementById("peer-table-section")?.addEventListener("click",event => {
    const button=event.target.closest("[data-peer-sort]");
    if(!button) return;
    const table=button.dataset.peerTable;
    const key=button.dataset.peerSort;
    const current=state.peerSort[table];
    state.peerSort[table]=current.key===key?{key,direction:current.direction==="asc"?"desc":"asc"}:{key,direction:key==="ticker"?"asc":"desc"};
    renderPeerTable();
  });

  tabList.addEventListener("keydown",event => {
    if(!["ArrowLeft","ArrowRight","Home","End"].includes(event.key)) return;
    event.preventDefault();
    const currentIndex = tabButtons.findIndex(button => button.dataset.tab === state.activeTab);
    const nextIndex = event.key === "Home"
      ? 0
      : event.key === "End"
        ? tabButtons.length - 1
        : (currentIndex + (event.key === "ArrowRight" ? 1 : -1) + tabButtons.length) % tabButtons.length;
    activateTab(tabButtons[nextIndex].dataset.tab,{focus:true});
  });

  lanes.addEventListener("click",event => {
    const cell = event.target.closest("[data-item]");
    if(!cell) return;
    openReader(refs[cell.dataset.item],cell);
  });

  document.getElementById("r-close").addEventListener("click",closeReader);
  backdrop.addEventListener("click",closeReader);
  document.addEventListener("keydown",event => {
    if(event.key === "Escape") closeReader();
  });

  let resizeFrame = 0;
  window.addEventListener("resize",() => {
    if(state.activeTab === "kpis" && !kpisInitialized) return;
    if(state.activeTab === "financials" && !financialsInitialized) return;
    if(state.activeTab === "peer-comps" && !peersInitialized) return;
    if(!["kpis","financials","peer-comps"].includes(state.activeTab)) return;
    cancelAnimationFrame(resizeFrame);
    resizeFrame = requestAnimationFrame(
      state.activeTab === "kpis"
        ? renderKpiCharts
        : state.activeTab === "financials"
          ? renderFinancialCharts
          : () => {drawPeerScatters();drawValuationHistory();}
    );
  });

  installChartShareControls();
  activateTab(state.activeTab,{updateUrl:false});
  render();
  revealDeepLink(initialHash);
})();
