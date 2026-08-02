(() => {
  const model = window.PRODUCT_MAP;
  if (!model) throw new Error("Product map data did not load.");
  const kpiModel = window.KPI_DATA;
  if (!kpiModel) throw new Error("KPI data did not load.");

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
    activeTab:["product-map","business-model","kpis"].includes(window.location.hash.slice(1))
      ? window.location.hash.slice(1)
      : "product-map",
    showProductScores:false,
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
  const productMilestones = document.getElementById("product-milestones");
  const kpiHistory = document.getElementById("kpi-history");
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
  let kpiChartConfigs = [];
  let kpisInitialized = false;

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
    const priorYear = financials.at(-5);
    const latestAdoption = adoption.at(-1);
    const totalCustomers = kpiModel.totalCustomers.at(-1)[1];
    const stats = [
      {label:"Quarterly revenue",value:money(latest.revenue),change:`+${pct(latest.revenueGrowth)} YoY`,note:"First quarter above $1B",color:"var(--dev)",url:latest.sourceUrl},
      {label:"GAAP gross margin",value:pct(latest.grossMargin),change:`${((latest.grossMargin-priorYear.grossMargin)*100).toFixed(1)} ppt YoY`,note:"Consolidated company margin",color:"var(--m-core)",url:latest.sourceUrl},
      {label:"Non-GAAP gross margin",value:pct(latest.nonGaapGrossMargin),change:`${((latest.nonGaapGrossMargin-priorYear.nonGaapGrossMargin)*100).toFixed(1)} ppt YoY`,note:"Company-defined adjusted KPI",color:"var(--obs)",url:latest.sourceUrl},
      {label:"Customers >$100K ARR",value:number(latest.largeCustomers),change:`+${pct(latest.customerGrowth)} YoY`,note:`${number(totalCustomers)} total customers`,color:"var(--ai)",url:latest.sourceUrl},
      {label:"Customers on 4+ products",value:pct(latestAdoption.p4,0),change:`+${((latestAdoption.p4-adoptionByPeriod.get("2025Q1").p4)*100).toFixed(0)} ppt YoY`,note:"Primary cross-sell KPI",color:"var(--sec)",url:latestAdoption.sourceUrl},
      {label:"Company ARR",value:"> $4.0B",change:"5 products >$100M",note:"3 more products at $50–100M",color:"var(--m-option)",url:kpiModel.anchors.latestTranscript},
    ];
    kpiSnapshot.innerHTML = stats.map(stat => `<article class="kpi-stat" style="--stat-color:${stat.color}">
      <span class="kpi-stat-label">${esc(stat.label)}</span>
      <strong>${esc(stat.value)}</strong>
      <span class="kpi-stat-change ${stat.change.startsWith("0.0") ? "is-flat" : ""}">${esc(stat.change)}</span>
      <p>${esc(stat.note)}</p>
      ${sourceAnchor(stat.url,"Primary source")}
    </article>`).join("");
  }

  function niceMax(value){
    const power = 10 ** Math.floor(Math.log10(value || 1));
    return Math.ceil(value / power) * power;
  }

  function renderLegend(elementId,series){
    const element = document.getElementById(elementId);
    element.innerHTML = series.map(item => `<span><i style="--legend-color:${item.color}"></i>${esc(item.label)}</span>`).join("");
  }

  function drawLineChart(config){
    const canvas = document.getElementById(config.canvasId);
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
    const step = width < 520 ? 6 : 4;
    config.labels.forEach((label,index) => {
      if(index%step && index !== config.labels.length-1) return;
      const px = x(index);
      ctx.save();ctx.translate(px,height-32);ctx.rotate(-Math.PI/4);
      ctx.fillStyle = "#70799c";ctx.textAlign = "right";ctx.fillText(label,0,0);ctx.restore();
    });

    config.series.forEach(series => {
      ctx.strokeStyle = series.color;ctx.lineWidth = series.width || 2.5;ctx.lineJoin = "round";ctx.lineCap = "round";
      let open = false;
      ctx.beginPath();
      series.values.forEach((value,index) => {
        if(value == null){open=false;return;}
        const px=x(index),py=y(value);
        if(!open){ctx.moveTo(px,py);open=true;} else ctx.lineTo(px,py);
      });
      ctx.stroke();
      series.values.forEach((value,index) => {
        if(value == null) return;
        ctx.beginPath();ctx.arc(x(index),y(value),2.2,0,Math.PI*2);ctx.fillStyle=series.color;ctx.fill();
      });
    });
    canvas._chartMeta = {config,width,height,margin,plotWidth,x};
    renderLegend(config.legendId,config.series);
  }

  function showChartTooltip(event){
    const canvas = event.currentTarget;
    const meta = canvas._chartMeta;
    if(!meta) return;
    const rect = canvas.getBoundingClientRect();
    const localX = event.clientX-rect.left;
    const ratio = Math.max(0,Math.min(1,(localX-meta.margin.left)/meta.plotWidth));
    const index = Math.round(ratio*(meta.config.labels.length-1));
    const rows = meta.config.series
      .filter(series => series.values[index] != null)
      .map(series => `<span><i style="--tip-color:${series.color}"></i>${esc(series.label)}: ${esc(meta.config.tooltipFormatter(series.values[index]))}</span>`)
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
    document.querySelector("#customer-sources>div").innerHTML = financialLinks;
    document.querySelector("#adoption-sources>div").innerHTML = adoption.map(row =>
      `<a href="${esc(row.sourceUrl)}" title="${esc(row.basis)}" target="_blank" rel="noopener noreferrer">${esc(row.period)} · ${esc(row.sourceId)}</a>`
    ).join("");
  }

  function renderKpiCharts(){
    const financialLabels = financials.map(row => row.period);
    const adoptionLabels = adoption.map(row => row.period);
    kpiChartConfigs = [
      {canvasId:"revenue-chart",legendId:"revenue-legend",labels:financialLabels,yMin:0,yMax:1100,yFormatter:value=>`$${Math.round(value)}m`,tooltipFormatter:value=>money(value),series:[{label:"Revenue",color:"#33c6e6",values:financials.map(row=>row.revenue)}]},
      {canvasId:"margin-chart",legendId:"margin-legend",labels:financialLabels,yMin:.70,yMax:.85,yFormatter:value=>pct(value,0),tooltipFormatter:value=>pct(value),series:[{label:"GAAP",color:"#2ed6a0",values:financials.map(row=>row.grossMargin)},{label:"Non-GAAP",color:"#7c6bf5",values:financials.map(row=>row.nonGaapGrossMargin)}]},
      {canvasId:"customers-chart",legendId:"customers-legend",labels:financialLabels,yMin:0,yMax:5000,yFormatter:value=>Math.round(value).toLocaleString("en-US"),tooltipFormatter:value=>number(value),series:[{label:">$100K ARR customers",color:"#f5b13f",values:financials.map(row=>row.largeCustomers)}]},
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

  function renderMilestones(){
    productMilestones.innerHTML = kpiModel.milestones.map(row => `<article class="milestone-card">
      <time>${esc(row[0])}</time><h3>${esc(row[1])}</h3><strong>${esc(row[2])}</strong><p>${esc(row[4])}</p>${sourceAnchor(row[3],"Official disclosure")}
    </article>`).join("");
  }

  function renderKpiHistory(){
    const values = value => value == null ? `<span class="kpi-na">—</span>` : pct(value,0);
    kpiHistory.innerHTML = financials.map(row => {
      const a = adoptionByPeriod.get(row.period);
      return `<tr>
        <td>${esc(row.period)}</td><td>${money(row.revenue)}</td><td>${row.revenueGrowth==null?'<span class="kpi-na">—</span>':pct(row.revenueGrowth)}</td>
        <td>${pct(row.grossMargin)}</td><td>${pct(row.nonGaapGrossMargin)}</td><td>${number(row.largeCustomers)}</td>
        <td>${values(a?.p2)}</td><td>${values(a?.p4)}</td><td>${values(a?.p6)}</td><td>${values(a?.p8)}</td><td>${values(a?.p10)}</td>
        <td><span class="kpi-source-cell">${sourceAnchor(row.sourceUrl,"Fin")}${a?sourceAnchor(a.sourceUrl,"Adoption"):""}</span></td>
      </tr>`;
    }).join("");
  }

  function renderKpis(){
    renderKpiSnapshot();
    renderSourceTrails();
    renderMilestones();
    renderKpiHistory();
    renderKpiCharts();
    document.querySelectorAll(".kpi-chart").forEach(canvas => {
      canvas.addEventListener("pointermove",showChartTooltip);
      canvas.addEventListener("pointerleave",hideChartTooltip);
    });
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
    if(state.activeTab !== "kpis" || !kpisInitialized) return;
    cancelAnimationFrame(resizeFrame);
    resizeFrame = requestAnimationFrame(renderKpiCharts);
  });

  activateTab(state.activeTab,{updateUrl:false});
  render();
})();
