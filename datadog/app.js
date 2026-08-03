(() => {
  const model = window.PRODUCT_MAP;
  if (!model) throw new Error("Product map data did not load.");
  const kpiModel = window.KPI_DATA;
  if (!kpiModel) throw new Error("KPI data did not load.");
  const peerModel = window.PEER_COMPS;
  if (!peerModel) throw new Error("Peer comps data did not load.");

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

  const state = {
    filters:new Set(),
    selected:null,
    activeTab:["product-map","business-model","kpis","financials","peer-comps"].includes(window.location.hash.slice(1))
      ? window.location.hash.slice(1)
      : "product-map",
    showProductScores:false,
    peerFilter:"all",
    peerSort:{key:"evNtmRevenue",direction:"desc"},
    peerMultiple:20.8,
  };
  const refs = {};
  const allItems = [];
  const esc = value => String(value ?? "")
    .replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
  const pretty = value => String(value).replace(/_/g," ").replace(/\b\w/g,letter => letter.toUpperCase());

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
  const companyVerdicts = document.getElementById("company-verdicts");
  const companyFacts = document.getElementById("company-facts");
  const companyWatchlist = document.getElementById("company-watchlist");
  const tabList = document.querySelector(".top-tabs");
  const tabButtons = [...document.querySelectorAll("[data-tab]")];
  const tabPanels = [...document.querySelectorAll("[data-panel]")];
  const productScoresToggle = document.getElementById("product-scores-toggle");
  const mapHint = document.getElementById("map-hint");
  const kpiSnapshot = document.getElementById("kpi-snapshot");
  const financialSnapshot = document.getElementById("financial-snapshot");
  const coreEngineScale = document.getElementById("core-engine-scale");
  const sectorScaleLanes = document.getElementById("sector-scale-lanes");
  const aiActivity = document.getElementById("ai-activity");
  const portfolioScale = document.getElementById("portfolio-scale");
  const kpiHistory = document.getElementById("kpi-history");
  const financialHistory = document.getElementById("financial-history");
  const financialSectionNav = document.querySelector(".financial-section-nav");
  const peerSectionNav = document.querySelector(".peer-section-nav");
  const peerSnapshot = document.getElementById("peer-snapshot");
  const peerTableBody = document.getElementById("peer-table-body");
  const chartTooltip = document.getElementById("chart-tooltip");

  const financials = kpiModel.quarterly.map((row,index,rows) => {
    const [period,revenue,grossProfit,nonGaapGrossProfit,largeCustomers,sourceUrl] = row;
    const priorYear = index >= 4 ? rows[index - 4] : null;
    return {
      period,revenue,grossProfit,nonGaapGrossProfit,largeCustomers,sourceUrl,
      grossMargin:grossProfit / revenue,
      nonGaapGrossMargin:nonGaapGrossProfit / revenue,
      revenueGrowth:priorYear ? revenue / priorYear[1] - 1 : null,
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
  const peerRows = peerModel.companies.map(values => {
    const row = Object.fromEntries(peerModel.fields.map((field,index) => [field,values[index]]));
    const ltmGrowth = row.ltmRevenue/row.ltmPriorRevenue-1;
    const ntmGrowth = row.currentFyGrowth*row.monthsCurrentFy/12 + row.nextFyGrowth*(12-row.monthsCurrentFy)/12;
    const standardizedFcf = row.ltmCfoLessCapex-row.ltmCapitalizedSoftware;
    const fcfMargin = standardizedFcf/row.ltmRevenue;
    const sbcMargin = row.ltmSbc/row.ltmRevenue;
    const ntmRevenue = row.ltmRevenue*(1+ntmGrowth);
    const enterpriseValue = row.marketCap+row.debt-row.cash;
    return {
      ...row,ltmGrowth,ntmGrowth,standardizedFcf,fcfMargin,sbcMargin,ntmRevenue,enterpriseValue,
      grossMargin:row.ltmGrossProfit/row.ltmRevenue,
      operatingMargin:row.ltmOperatingIncome/row.ltmRevenue,
      rule40:ltmGrowth+fcfMargin,
      fcfLessSbcMargin:fcfMargin-sbcMargin,
      economicSensitivity:ltmGrowth+fcfMargin-sbcMargin,
      gaapRule40:ltmGrowth+row.ltmOperatingIncome/row.ltmRevenue,
      dilution:row.latestBasicShares/row.priorBasicShares-1,
      evNtmRevenue:enterpriseValue/ntmRevenue,
      equityNtmFcf:row.marketCap/(ntmRevenue*fcfMargin),
      ntmFcfYield:ntmRevenue*fcfMargin/row.marketCap,
    };
  });
  const ddogPeer = peerRows.find(row => row.ticker === "DDOG");
  const broadPeers = peerRows.filter(row => row.ticker !== "DDOG");
  const directPeers = peerRows.filter(row => row.bucket === "direct");
  const peerMedian = (rows,key) => median(rows.map(row => row[key]));
  let kpiChartConfigs = [];
  let financialChartConfigs = [];
  let kpisInitialized = false;
  let financialsInitialized = false;
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
    `<span class="chip">NRR <b>low-120%</b> · TTM</span>`,
  ].join("");

  function renderCompanyLens(){
    const assessment = model.companyAssessment;
    companyVerdicts.innerHTML = assessment.verdicts.map(verdict => {
      const source = model.sources[verdict.sourceId];
      return `<article class="verdict-card tone-${esc(verdict.tone)}">
        <span class="verdict-label">${esc(verdict.label)}</span>
        <strong>${esc(verdict.value)}</strong>
        ${verdict.confidence ? `<span class="verdict-confidence">${esc(verdict.confidence)} confidence</span>` : ""}
        <p>${esc(verdict.note)}</p>
        ${source?.url ? `<a href="${esc(source.url)}" target="_blank" rel="noopener noreferrer">${esc(source.label)} ↗</a>` : ""}
      </article>`;
    }).join("");
    companyFacts.innerHTML = assessment.facts.map(fact =>
      `<div class="company-fact"><strong>${esc(fact.value)}</strong><span>${esc(fact.label)}</span></div>`
    ).join("");
    companyWatchlist.innerHTML = assessment.watchlist.map(item =>
      `<article class="watch-item">
        <h3>${esc(item.label)}</h3>
        <p class="confirm"><b>Confirm</b>${esc(item.confirmation)}</p>
        <p class="warning"><b>Warn</b>${esc(item.warning)}</p>
      </article>`
    ).join("");
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

  function methodTip(text){
    return `<button class="info-tip" type="button" aria-label="Methodology: ${esc(text)}" data-tooltip="${esc(text)}">i</button>`;
  }

  function renderKpiSnapshot(){
    const latest = financials.at(-1);
    const latestAdoption = adoption.at(-1);
    const latestTotalCustomers = totalCustomers.at(-1).value;
    const latestMillionCustomers = millionCustomers.at(-1).value;
    const latestAiCustomers = aiCustomers.at(-1).value;
    const stats = [
      {label:"TTM net retention",value:"low-120s",change:"up from ~120%",note:"Expansion net of contraction and churn",color:"var(--m-core)",url:nrr.at(-1).sourceUrl},
      {label:"Gross retention",value:"mid–high 90s",change:"stable",note:"Management disclosure band",color:"var(--dev)",url:grr.at(-1).sourceUrl},
      {label:"Total customers",value:number(latestTotalCustomers),change:"+2,700 YoY",note:"Point-in-time customer base",color:"var(--obs)",url:totalCustomers.at(-1).sourceUrl},
      {label:"Customers >$100K ARR",value:number(latest.largeCustomers),change:`+${pct(latest.customerGrowth)} YoY`,note:"~90% of company ARR",color:"var(--ai)",url:latest.sourceUrl},
      {label:"Customers on 4+ products",value:pct(latestAdoption.p4,0),change:`+${((latestAdoption.p4-adoptionByPeriod.get("2025Q1").p4)*100).toFixed(0)} ppt YoY`,note:"Primary cross-sell KPI",color:"var(--sec)",url:latestAdoption.sourceUrl},
      {label:"AI integration customers",value:number(latestAiCustomers),change:"+62.5% YoY",note:`${number(latestMillionCustomers)} customers >$1M ARR`,color:"var(--m-option)",url:aiCustomers.at(-1).sourceUrl},
    ];
    kpiSnapshot.innerHTML = stats.map(stat => `<article class="kpi-stat" style="--stat-color:${stat.color}">
      <span class="kpi-stat-label">${esc(stat.label)}</span>
      <strong>${esc(stat.value)}</strong>
      <span class="kpi-stat-change ${stat.change.startsWith("0.0") ? "is-flat" : ""}">${esc(stat.change)}</span>
      <p>${esc(stat.note)}</p>
      ${sourceAnchor(stat.url,"Primary source")}
    </article>`).join("");
  }

  function renderFinancialSnapshot(){
    const latest = financials.at(-1);
    const priorYear = financials.at(-5);
    const latestAnnual = annualOperations.at(-1);
    const latestFcf = annualFcfEconomics.at(-1);
    const latestAnnualCapital = annualCapital.find(row => row.period === "2025");
    const stats = [
      {label:"Quarterly revenue",period:"Q1 2026 · Reported",value:money(latest.revenue),change:`+${pct(latest.revenueGrowth)} YoY`,note:"First quarter above $1B",color:"var(--dev)",url:latest.sourceUrl},
      {label:"GAAP gross margin",period:"Q1 2026 · Derived",value:pct(latest.grossMargin),change:`${((latest.grossMargin-priorYear.grossMargin)*100).toFixed(1)} ppt YoY`,note:"Reported gross profit divided by revenue",color:"var(--m-core)",url:latest.sourceUrl,tooltip:"Gross margin equals reported GAAP gross profit divided by reported revenue. It excludes operating expenses such as R&D, sales and marketing, and G&A."},
      {label:"GAAP operating margin",period:"FY2025 · Derived",value:pct(latestAnnual.operatingMargin),change:`${((latestAnnual.operatingMargin-annualOperations.at(-2).operatingMargin)*100).toFixed(1)} ppt YoY`,note:"Below gross profit, after operating expenses",color:"var(--m-contested)",url:latestAnnual.sourceUrl,tooltip:"Operating margin equals reported GAAP operating income or loss divided by revenue. It includes stock-based compensation recorded in operating expenses."},
      {label:"Reported FCF margin",period:"FY2025 · Company-defined",value:pct(latestFcf.reportedMargin),change:`${((latestFcf.reportedMargin-annualFcfEconomics.at(-2).reportedMargin)*100).toFixed(1)} ppt YoY`,note:"Operating cash flow less company capex",color:"var(--obs)",url:latestFcf.sourceUrl,tooltip:"Datadog defines free cash flow as net cash from operating activities less capital expenditures and capitalized software development costs. It is non-GAAP."},
      {label:"Owner FCF margin",period:"FY2025 · Analyst-adjusted",value:pct(latestFcf.ownerMargin),change:`${((latestFcf.ownerMargin-annualFcfEconomics.at(-2).ownerMargin)*100).toFixed(1)} ppt YoY`,note:"Reported FCF less total SBC",color:"var(--ai)",url:latestFcf.sourceUrl,tooltip:"Owner FCF subtracts total expensed and capitalized stock-based compensation from company-defined FCF. It is an economic sensitivity, not a reported liquidity measure."},
      {label:"R&D-adjusted ROIC",period:"FY2025 · Analyst-adjusted",value:pct(latestAnnualCapital.rdAdjustedRoic),change:`${((latestAnnualCapital.rdAdjustedRoic-annualCapital.find(row=>row.period==="2024").rdAdjustedRoic)*100).toFixed(1)} ppt YoY`,note:"Return on capital after capitalizing R&D",color:"var(--m-option)",url:latestAnnualCapital.sourceUrl,tooltip:"Three-year straight-line R&D life. Research asset equals current R&D plus two-thirds of prior-year R&D plus one-third of R&D from two years ago. Adjusted EBIT equals reported EBIT plus current R&D less amortization. ROIC applies a 21% normalized tax rate and uses average adjusted invested capital."},
    ];
    financialSnapshot.innerHTML = stats.map(stat => `<article class="kpi-stat" style="--stat-color:${stat.color}">
      <div class="kpi-stat-top"><span class="kpi-stat-label">${esc(stat.label)}</span>${stat.tooltip?methodTip(stat.tooltip):""}</div>
      <span class="kpi-stat-period">${esc(stat.period)}</span>
      <strong>${esc(stat.value)}</strong>
      <span class="kpi-stat-change ${stat.change.startsWith("0.0") ? "is-flat" : ""}">${esc(stat.change)}</span>
      <p>${esc(stat.note)}</p>
      ${sourceAnchor(stat.url,stat.period.includes("Analyst-adjusted")?"Inputs & source":"Primary source")}
    </article>`).join("");
  }

  function niceMax(value){
    const power = 10 ** Math.floor(Math.log10(value || 1));
    return Math.ceil(value / power) * power;
  }

  function renderLegend(elementId,series){
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

    const margin = {top:12,right:16,bottom:50,left:52};
    const plotWidth = width-margin.left-margin.right;
    const plotHeight = height-margin.top-margin.bottom;
    const allValues = config.series.flatMap(series => series.values.filter(value => value != null));
    const rawMin = config.yMin ?? Math.min(...allValues);
    const rawMax = config.yMax ?? Math.max(...allValues);
    const yMin = config.yMin ?? 0;
    const yMax = config.yMax ?? niceMax(rawMax*1.06);
    const x = index => margin.left + (config.labels.length === 1 ? plotWidth/2 : index*plotWidth/(config.labels.length-1));
    const y = value => margin.top + (yMax-value)/(yMax-yMin)*plotHeight;

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
      ctx.strokeStyle = series.color;ctx.lineWidth = series.width || 2.5;ctx.lineJoin = "round";ctx.lineCap = "round";
      ctx.setLineDash(series.dash || []);
      let open = false;
      ctx.beginPath();
      series.values.forEach((value,index) => {
        if(value == null){if(!series.connectGaps) open=false;return;}
        const px=x(index),py=y(value);
        if(!open){ctx.moveTo(px,py);open=true;} else ctx.lineTo(px,py);
      });
      ctx.stroke();
      ctx.setLineDash([]);
      series.values.forEach((value,index) => {
        if(value == null) return;
        ctx.beginPath();ctx.arc(x(index),y(value),2.2,0,Math.PI*2);ctx.fillStyle=series.color;ctx.fill();
      });
    });
    canvas._chartMeta = {config,width,height,margin,plotWidth,x};
    renderLegend(config.legendId,config.series);
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
    renderLegend(config.legendId,config.series);
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
      .map(series => `<span><i style="--tip-color:${series.color}"></i>${esc(series.label)}: ${esc(series.displayValues?.[index] || meta.config.tooltipFormatter(series.values[index],index,series))}</span>`)
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
    document.querySelector("#fcf-sources>div").innerHTML = annualFcfEconomics.map(row =>
      `<article class="fcf-source-row">
        <b>${esc(row.period)}</b>
        <span>Reported FCF ${esc(signedMoney(row.reportedFcf))}</span>
        <span>Total SBC ${esc(signedMoney(row.totalSbc))}</span>
        <span>Owner FCF ${esc(signedMoney(row.ownerFcf))}</span>
        ${sourceAnchor(row.sourceUrl,"Form 10-K")}
      </article>`
    ).join("") + `<p class="fcf-definition"><b>Analyst-adjusted measure.</b> Owner FCF subtracts total expensed and capitalized SBC from company-defined FCF. It is an economic sensitivity, not a GAAP or company-reported liquidity measure.</p>`;
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
        <b>${esc(row.period === "2026Q1" ? "Q1 2026" : `FY${row.period}`)}</b>
        <span>Cash + securities ${esc(money(row.liquidity))}</span>
        <span>Deferred revenue ${esc(money(row.deferredRevenue))}</span>
        <span>${row.rdAdjustedRoic==null?"ROIC not annualized":`R&D-adjusted ROIC ${esc(pct(row.rdAdjustedRoic))}`}</span>
        ${sourceAnchor(row.sourceUrl,row.period === "2026Q1"?"Form 10-Q":"Form 10-K")}
      </article>`
    ).join("") + `<p class="financial-definition"><b>Analyst-adjusted capital framework.</b> Liquidity and deferred revenue are reported balance-sheet facts. Operating capital retains a 2% revenue cash floor; R&D is capitalized over three years; ROIC uses a 21% normalized tax rate. Q1 2026 returns are intentionally not annualized.</p>`;
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
    const capitalLabels = annualCapital.map(row => row.period === "2026Q1" ? "Q1 26" : row.period);
    const annualCapitalReturns = annualCapital.filter(row => row.period !== "2026Q1");
    const operationsByPeriod = new Map(annualOperations.map(row => [row.period,row]));
    financialChartConfigs = [
      {canvasId:"revenue-chart",legendId:"revenue-legend",labels:financialLabels,yMin:0,yMax:1100,yFormatter:value=>`$${Math.round(value)}m`,tooltipFormatter:value=>money(value),series:[{label:"Revenue",color:"#33c6e6",values:financials.map(row=>row.revenue)}]},
      {canvasId:"margin-chart",legendId:"margin-legend",labels:financialLabels,yMin:.70,yMax:.85,yFormatter:value=>pct(value,0),tooltipFormatter:value=>pct(value),series:[{label:"GAAP",color:"#2ed6a0",values:financials.map(row=>row.grossMargin)},{label:"Non-GAAP",color:"#7c6bf5",values:financials.map(row=>row.nonGaapGrossMargin)}]},
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
      ${sourceAnchor(row[4],"Q1 2026 transcript")}
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
    renderFinancialSnapshot();
    renderSourceTrails();
    renderFinancialHistory();
    renderFinancialCharts();
    document.querySelectorAll("#financials-panel .financial-chart").forEach(canvas => {
      canvas.addEventListener("pointermove",showChartTooltip);
      canvas.addEventListener("pointerleave",hideChartTooltip);
    });
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

  function renderPeerSnapshot(){
    const metrics = [
      {label:"NTM revenue growth",key:"ntmGrowth",format:value=>pct(value),note:"Calendarized proxy"},
      {label:"Standardized FCF margin",key:"fcfMargin",format:value=>pct(value),note:"CFO less capex & capitalized software"},
      {label:"Rule of 40",key:"rule40",format:value=>pct(value),note:"LTM growth + standardized FCF margin"},
      {label:"Economic sensitivity",key:"economicSensitivity",format:value=>pct(value),note:"Rule of 40 less SBC / revenue"},
      {label:"EV / NTM revenue",key:"evNtmRevenue",format:value=>multiple(value),note:"Enterprise-value multiple"},
      {label:"Equity / NTM FCF",key:"equityNtmFcf",format:value=>multiple(value),note:"Holds LTM FCF margin constant"},
    ];
    peerSnapshot.innerHTML = metrics.map(metric => {
      const broad = peerMedian(broadPeers,metric.key);
      const direct = peerMedian(directPeers,metric.key);
      return `<article class="peer-stat">
        <span>${esc(metric.label)}</span><strong>${esc(metric.format(ddogPeer[metric.key]))}</strong>
        <div><span>Broad median <b>${esc(metric.format(broad))}</b></span><span>Direct median <b>${esc(metric.format(direct))}</b></span></div>
        <p>${esc(metric.note)}</p>
      </article>`;
    }).join("");
  }

  function renderPeerGaps(){
    const fundamentals = [
      ["LTM revenue growth",ddogPeer.ltmGrowth-peerMedian(broadPeers,"ltmGrowth")],
      ["Rule of 40",ddogPeer.rule40-peerMedian(broadPeers,"rule40")],
      ["Economic sensitivity",ddogPeer.economicSensitivity-peerMedian(broadPeers,"economicSensitivity")],
    ];
    const valuations = [
      ["EV / NTM revenue · broad",ddogPeer.evNtmRevenue/peerMedian(broadPeers,"evNtmRevenue")-1],
      ["EV / NTM revenue · direct",ddogPeer.evNtmRevenue/peerMedian(directPeers,"evNtmRevenue")-1],
      ["Equity / NTM FCF · broad",ddogPeer.equityNtmFcf/peerMedian(broadPeers,"equityNtmFcf")-1],
    ];
    const bars = (rows,max,formatter) => rows.map(([label,value]) => `<div class="peer-gap-row">
      <div><span>${esc(label)}</span><b>${esc(formatter(value))}</b></div>
      <i><span style="width:${Math.max(3,Math.min(100,value/max*100))}%"></span></i>
    </div>`).join("");
    document.getElementById("peer-fundamental-gap").innerHTML = bars(fundamentals,.10,value=>signedPctPoints(value));
    document.getElementById("peer-valuation-gap").innerHTML = bars(valuations,4,value=>signedPct(value));
  }

  function drawPeerScatter(){
    const canvas = document.getElementById("peer-valuation-chart");
    if(!canvas) return;
    const width = Math.max(320,Math.floor(canvas.clientWidth));
    const height = Math.max(320,Math.floor(canvas.clientHeight));
    const dpr = Math.min(window.devicePixelRatio || 1,2);
    canvas.width = Math.floor(width*dpr);canvas.height = Math.floor(height*dpr);
    const ctx = canvas.getContext("2d");ctx.scale(dpr,dpr);ctx.clearRect(0,0,width,height);
    const margin = {top:24,right:24,bottom:52,left:58};
    const plotWidth = width-margin.left-margin.right;
    const plotHeight = height-margin.top-margin.bottom;
    const xMin = Math.max(0,Math.floor(Math.min(...peerRows.map(row=>row.ntmGrowth))*100/5)*.05-.01);
    const xMax = Math.ceil(Math.max(...peerRows.map(row=>row.ntmGrowth))*100/5)*.05+.01;
    const yMin = 0;
    const yMax = Math.ceil(Math.max(...peerRows.map(row=>row.evNtmRevenue))/5)*5;
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
    const medianX=peerMedian(broadPeers,"ntmGrowth"),medianY=peerMedian(broadPeers,"evNtmRevenue");
    ctx.setLineDash([5,5]);ctx.strokeStyle="rgba(222,226,242,.45)";ctx.lineWidth=1;
    ctx.beginPath();ctx.moveTo(x(medianX),margin.top);ctx.lineTo(x(medianX),height-margin.bottom);ctx.stroke();
    ctx.beginPath();ctx.moveTo(margin.left,y(medianY));ctx.lineTo(width-margin.right,y(medianY));ctx.stroke();ctx.setLineDash([]);
    const points = peerRows.slice().sort((a,b)=>b.marketCap-a.marketCap).map(row => {
      const px=x(row.ntmGrowth),py=y(row.evNtmRevenue);
      const radius=5+Math.sqrt(row.marketCap/1e9)*.55;
      const color=peerModel.buckets[row.bucket].color;
      ctx.beginPath();ctx.arc(px,py,radius,0,Math.PI*2);ctx.fillStyle=`${color}${row.ticker==="DDOG"?"e8":"b8"}`;ctx.fill();
      ctx.strokeStyle=row.ticker==="DDOG"?"#f4f1ff":"rgba(14,18,36,.8)";ctx.lineWidth=row.ticker==="DDOG"?2.2:1.3;ctx.stroke();
      ctx.font = `${row.ticker==="DDOG"?"700":"600"} 10px "JetBrains Mono", monospace`;
      ctx.fillStyle=row.ticker==="DDOG"?"#f4f1ff":"#aeb6d5";ctx.textAlign="center";ctx.fillText(row.ticker,px,py-radius-8);
      return {row,x:px,y:py,radius};
    });
    ctx.font='9px "JetBrains Mono", monospace';ctx.fillStyle="#70799c";ctx.textAlign="center";ctx.fillText("NTM revenue growth →",margin.left+plotWidth/2,height-8);
    ctx.save();ctx.translate(13,margin.top+plotHeight/2);ctx.rotate(-Math.PI/2);ctx.fillText("EV / NTM revenue →",0,0);ctx.restore();
    canvas._peerPoints=points;
    renderLegend("peer-valuation-legend",Object.entries(peerModel.buckets).map(([,bucket])=>({label:bucket.label,color:bucket.color})));
  }

  function showPeerTooltip(event){
    const canvas=event.currentTarget;
    const rect=canvas.getBoundingClientRect();
    const localX=event.clientX-rect.left,localY=event.clientY-rect.top;
    const point=(canvas._peerPoints||[]).map(item=>({...item,distance:Math.hypot(item.x-localX,item.y-localY)})).sort((a,b)=>a.distance-b.distance)[0];
    if(!point || point.distance>32){hideChartTooltip();return;}
    const row=point.row;
    chartTooltip.innerHTML=`<b>${esc(row.name)} · ${esc(row.ticker)}</b><span><i style="--tip-color:${peerModel.buckets[row.bucket].color}"></i>NTM growth: ${esc(pct(row.ntmGrowth))}</span><span>EV / NTM revenue: ${esc(multiple(row.evNtmRevenue))}</span><span>Market cap: ${esc(peerMoney(row.marketCap))}</span>`;
    chartTooltip.hidden=false;
    chartTooltip.style.left=`${Math.min(window.innerWidth-242,event.clientX+14)}px`;
    chartTooltip.style.top=`${Math.min(window.innerHeight-130,event.clientY+14)}px`;
  }

  function renderPeerCashQuality(){
    document.getElementById("peer-cash-read-metrics").innerHTML=`<span><b>${pct(ddogPeer.fcfLessSbcMargin)}</b> FCF less SBC margin</span><span><b>${pct(ddogPeer.dilution)}</b> basic-share dilution</span>`;
    document.getElementById("peer-cash-grid").innerHTML=peerRows.slice().sort((a,b)=>b.economicSensitivity-a.economicSensitivity).map(row=>`<article class="peer-cash-card ${row.ticker==="DDOG"?"is-target":""}" style="--peer-color:${peerModel.buckets[row.bucket].color}">
      <div><b>${esc(row.ticker)}</b><span>${esc(peerModel.buckets[row.bucket].shortLabel)}</span></div>
      <dl><div><dt>FCF margin</dt><dd>${pct(row.fcfMargin)}</dd></div><div><dt>After SBC</dt><dd class="${row.fcfLessSbcMargin<0?"is-negative":""}">${pct(row.fcfLessSbcMargin)}</dd></div><div><dt>Economic sensitivity</dt><dd>${pct(row.economicSensitivity)}</dd></div><div><dt>Dilution</dt><dd class="${row.dilution>0?"is-negative":""}">${pct(row.dilution)}</dd></div></dl>
    </article>`).join("");
  }

  function renderPeerSensitivity(){
    const slider=document.getElementById("peer-multiple-slider");
    if(slider) slider.value=state.peerMultiple;
    const shares=ddogPeer.marketCap/ddogPeer.price;
    const impliedEv=state.peerMultiple*ddogPeer.ntmRevenue;
    const impliedEquity=impliedEv+ddogPeer.cash-ddogPeer.debt;
    const impliedPrice=impliedEquity/shares;
    const impliedReturn=impliedPrice/ddogPeer.price-1;
    document.getElementById("peer-selected-multiple").textContent=multiple(state.peerMultiple);
    document.getElementById("peer-implied-price").textContent=`$${impliedPrice.toFixed(2)}`;
    const returnElement=document.getElementById("peer-implied-return");
    returnElement.textContent=signedPct(impliedReturn,1);returnElement.classList.toggle("is-negative",impliedReturn<0);
    document.getElementById("peer-implied-ev").textContent=peerMoney(impliedEv);
    document.getElementById("peer-current-reference").textContent=`$${ddogPeer.price.toFixed(2)} · ${multiple(ddogPeer.evNtmRevenue)}`;
    document.querySelectorAll("[data-peer-multiple]").forEach(button=>button.classList.toggle("is-active",Math.abs(Number(button.dataset.peerMultiple)-state.peerMultiple)<.05));
  }

  function renderPeerTable(){
    const rows=peerRows.filter(row=>state.peerFilter==="all" || row.bucket==="target" || row.bucket===state.peerFilter);
    rows.sort((a,b)=>{
      const av=a[state.peerSort.key],bv=b[state.peerSort.key];
      const comparison=typeof av==="string"?av.localeCompare(bv):av-bv;
      return state.peerSort.direction==="asc"?comparison:-comparison;
    });
    peerTableBody.innerHTML=rows.map(row=>`<tr class="${row.ticker==="DDOG"?"is-target":""}">
      <td><span class="peer-company"><i style="--peer-color:${peerModel.buckets[row.bucket].color}"></i><b>${esc(row.ticker)}</b><small>${esc(row.name)}</small></span></td>
      <td>${pct(row.ltmGrowth)}</td><td>${pct(row.ntmGrowth)}</td><td>${pct(row.grossMargin)}</td><td class="${row.operatingMargin<0?"is-negative":""}">${pct(row.operatingMargin)}</td><td>${pct(row.fcfMargin)}</td><td>${pct(row.rule40)}</td><td>${pct(row.sbcMargin)}</td><td class="${row.dilution>0?"is-negative":""}">${pct(row.dilution)}</td><td>${pct(row.economicSensitivity)}</td><td>${multiple(row.evNtmRevenue)}</td><td>${multiple(row.equityNtmFcf)}</td>
    </tr>`).join("");
    document.querySelectorAll("[data-peer-sort]").forEach(button=>{
      const active=button.dataset.peerSort===state.peerSort.key;
      button.classList.toggle("is-active",active);
      button.dataset.direction=active?state.peerSort.direction:"";
    });
  }

  function renderPeerMethodology(){
    const definitions=Object.entries(peerModel.methodology).map(([key,copy])=>`<article><b>${esc(pretty(key))}</b><p>${esc(copy)}</p></article>`).join("");
    const sources=peerRows.map(row=>`<article class="peer-source-row"><b>${esc(row.ticker)}</b><span>Actuals through ${esc(row.latestQuarter)} · forward view updated ${esc(row.forwardUpdated)}</span><span>${sourceAnchor(peerModel.sourceFor(row.ticker,"income"),"Financials")} ${sourceAnchor(peerModel.sourceFor(row.ticker,"cash-flow"),"Cash flow")} ${sourceAnchor(peerModel.sourceFor(row.ticker,"forecast"),"Forecast")}</span></article>`).join("");
    document.getElementById("peer-methodology-content").innerHTML=`<div class="peer-method-grid">${definitions}</div><div class="peer-source-note"><p><b>${esc(peerModel.meta.reliability)}.</b> Historical statements use ${esc(peerModel.meta.historicalProvider)}; forward estimates use ${esc(peerModel.meta.forwardProvider)}. Fiscal calendars, estimate timing, business mix and SBC accounting still limit comparability. This screen is for relative underwriting, not a substitute for a full model.</p>${sourceAnchor(peerModel.primaryCrosscheck,"Datadog primary cross-check")}</div><div class="peer-source-list">${sources}</div>`;
  }

  function renderPeers(){
    renderPeerSnapshot();renderPeerGaps();drawPeerScatter();renderPeerCashQuality();renderPeerSensitivity();renderPeerTable();renderPeerMethodology();
    const scatter=document.getElementById("peer-valuation-chart");
    scatter?.addEventListener("pointermove",showPeerTooltip);scatter?.addEventListener("pointerleave",hideChartTooltip);
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
    renderCompanyLens();
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
    if(tabId === "peer-comps"){
      requestAnimationFrame(() => {
        if(!peersInitialized){
          renderPeers();
          peersInitialized = true;
        } else {
          drawPeerScatter();
        }
      });
    }
    if(updateUrl){
      history.replaceState(null,"",`#${tabId}`);
    }
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

  document.querySelector(".peer-table thead")?.addEventListener("click",event => {
    const button=event.target.closest("[data-peer-sort]");
    if(!button) return;
    const key=button.dataset.peerSort;
    state.peerSort=state.peerSort.key===key?{key,direction:state.peerSort.direction==="asc"?"desc":"asc"}:{key,direction:key==="ticker"?"asc":"desc"};
    renderPeerTable();
  });

  document.getElementById("peer-multiple-slider")?.addEventListener("input",event => {
    state.peerMultiple=Number(event.target.value);renderPeerSensitivity();
  });

  document.querySelector(".peer-presets")?.addEventListener("click",event => {
    const button=event.target.closest("[data-peer-multiple]");
    if(!button) return;
    state.peerMultiple=Number(button.dataset.peerMultiple);renderPeerSensitivity();
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
    resizeFrame = requestAnimationFrame(state.activeTab === "kpis" ? renderKpiCharts : state.activeTab === "financials" ? renderFinancialCharts : drawPeerScatter);
  });

  activateTab(state.activeTab,{updateUrl:false});
  render();
})();
