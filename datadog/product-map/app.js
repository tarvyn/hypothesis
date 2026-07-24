(() => {
  const model = window.PRODUCT_MAP;
  if (!model) throw new Error("Product map data did not load.");

  const MOAT = {
    data_gravity:{label:"Data gravity",color:"#7c6bf5"},
    cross_signal:{label:"Cross-signal context",color:"#2ed6a0"},
    integration_breadth:{label:"Integration breadth",color:"#33c6e6"},
    installed_base:{label:"Installed base",color:"#4aa3e0"},
    workflow_lock_in:{label:"Workflow lock-in",color:"#f5b13f"},
    feedback_loop:{label:"Feedback loop",color:"#ff5c8a"},
    developer_habit:{label:"Developer habit",color:"#a78bfa"},
    hyperscaler_validation:{label:"Hyperscaler validation",color:"#ef8f55"},
    platform_access:{label:"Platform access",color:"#55c2a9"},
    bundle:{label:"Bundle / consolidation",color:"#6b7398"},
  };

  const DCF = {
    new_logo:{label:"New logos",color:"#33c6e6"},
    land_size:{label:"Initial land size",color:"#2ed6a0"},
    usage_growth:{label:"Usage growth",color:"#7c6bf5"},
    nrr:{label:"NRR / expansion",color:"#4aa3e0"},
    grr:{label:"GRR / retention",color:"#55c2a9"},
    growth_duration:{label:"Growth duration",color:"#f5b13f"},
    new_tam:{label:"New TAM",color:"#a78bfa"},
    tam_duration:{label:"TAM duration",color:"#9575cd"},
    gross_margin_risk:{label:"Gross-margin risk",color:"#ff7a72"},
    r_and_d_intensity:{label:"R&D intensity",color:"#ff5c8a"},
    interface_risk:{label:"Interface risk",color:"#ef8f55"},
    sales_cycle:{label:"Sales cycle",color:"#6b7398"},
  };

  const CATEGORY_LABELS = Object.fromEntries(model.categories.map(category => [category.id, category.catName]));

  const VIEW_MODES = {
    category:{
      label:"Categories",
      explainer:"Stable Gartner-linked market backbone. The color does not move when Datadog renames suites.",
    },
    maturity:{
      label:"Maturity",
      explainer:"Commercial validation only: scaled, proven, validated early, or preview/option.",
    },
    position:{
      label:"Position",
      explainer:"Relative competitive standing, kept separate from commercial maturity.",
    },
    momentum:{
      label:"Momentum",
      explainer:"Latest evidence direction. It can change each quarter without rewriting maturity.",
    },
    moat:{
      label:"Moat",
      explainer:"Primary mechanism that makes a product harder to displace or improves the platform.",
    },
    dcf:{
      label:"DCF",
      explainer:"Primary model lever informed by product evidence—never invented product revenue.",
    },
  };

  const FILTERS = [
    {id:"ai",label:"AI",test:item => item.workloads.includes("ai")},
    {id:"training",label:"Training",test:item => item.workloads.includes("training")},
    {id:"inference",label:"Inference",test:item => item.workloads.includes("inference")},
    {id:"agents",label:"Agents",test:item => item.workloads.includes("agents")},
    {id:"usage",label:"Usage",test:item => item.monetization.includes("usage")},
    {id:"seat",label:"Seat",test:item => item.monetization.includes("seat")},
    {id:"land",label:"Land",test:item => item.motion.includes("land")},
    {id:"expand",label:"Expand",test:item => item.motion.includes("expand")},
    {id:"defend",label:"Defend",test:item => item.motion.includes("defend")},
    {id:"regulated",label:"Regulated",test:item => item.workloads.includes("regulated")},
    {id:"byoc",label:"BYOC",test:item => item.capabilities.some(value => value.toLowerCase().includes("byoc"))},
  ];

  const state = {view:"category",filters:new Set(),selected:null};
  const refs = {};
  const allItems = [];
  const esc = value => String(value ?? "")
    .replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
  const pretty = value => String(value).replace(/_/g," ").replace(/\b\w/g,letter => letter.toUpperCase());

  const headlineStats = document.getElementById("headline-stats");
  const viewModes = document.getElementById("view-modes");
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

  viewModes.innerHTML = Object.entries(VIEW_MODES).map(([id,definition]) =>
    `<button type="button" data-view="${id}" aria-pressed="${state.view === id}">${esc(definition.label)}</button>`
  ).join("");

  filters.innerHTML = FILTERS.map(filter =>
    `<button class="filter" type="button" data-filter="${filter.id}" aria-pressed="false">${esc(filter.label)}</button>`
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
        <div class="enabler-links">${item.dcf.map(key => `<span class="micro-tag">${esc(DCF[key]?.label || pretty(key))}</span>`).join("")}</div>
      </article>`;
    }).join("");
  }

  function viewColor(item){
    if(state.view === "category") return item.categoryColor;
    if(state.view === "maturity") return model.maturity[item.maturity]?.color || "var(--txt-dim)";
    if(state.view === "position") return model.position[item.position]?.color || "var(--txt-dim)";
    if(state.view === "momentum") return model.momentum[item.momentum]?.color || "var(--txt-dim)";
    if(state.view === "moat") return MOAT[item.moat[0]]?.color || "var(--txt-dim)";
    if(state.view === "dcf") return DCF[item.dcf[0]]?.color || "var(--txt-dim)";
    return item.categoryColor;
  }

  function viewLabel(item){
    if(state.view === "category") return item.categoryName;
    if(state.view === "maturity") return model.maturity[item.maturity]?.label;
    if(state.view === "position") return model.position[item.position]?.label;
    if(state.view === "momentum") return model.momentum[item.momentum]?.label;
    if(state.view === "moat") return MOAT[item.moat[0]]?.label;
    if(state.view === "dcf") return DCF[item.dcf[0]]?.label;
    return "";
  }

  function legendEntries(){
    if(state.view === "category") return model.categories.map(category => ({label:category.catName,color:category.color}));
    if(state.view === "maturity") return Object.values(model.maturity).map(item => ({label:item.label,color:item.color}));
    if(state.view === "position") return Object.values(model.position).map(item => ({label:item.label,color:item.color}));
    if(state.view === "momentum") return Object.values(model.momentum).map(item => ({label:item.label,color:item.color}));
    if(state.view === "moat"){
      const used = new Set(allItems.map(item => item.moat[0]));
      return [...used].map(key => ({label:MOAT[key]?.label || pretty(key),color:MOAT[key]?.color || "var(--txt-dim)"}));
    }
    const used = new Set(allItems.map(item => item.dcf[0]));
    return [...used].map(key => ({label:DCF[key]?.label || pretty(key),color:DCF[key]?.color || "var(--txt-dim)"}));
  }

  function renderLegend(){
    legend.innerHTML = legendEntries().map(item =>
      `<span class="legend-item" style="--legend:${item.color}"><i></i>${esc(item.label)}</span>`
    ).join("");
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
                  const color = viewColor(item);
                  const positionColor = model.position[item.position]?.color || "var(--txt-dim)";
                  return `<button class="cell ${item.border ? "border" : ""} ${match && state.filters.size ? "is-match" : ""} ${!match ? "is-dimmed" : ""}"
                    type="button" data-item="${esc(key)}" style="--cell-color:${color};--position-color:${positionColor}"
                    aria-label="Open ${esc(item.n)} details">
                    ${item.workloads.includes("ai") ? '<span class="ai-dot" aria-hidden="true"></span>' : ""}
                    <span class="cell-name">${esc(item.n)}</span>
                    <span class="cell-meta"><i></i>${esc(viewLabel(item))}</span>
                    ${item.arr ? `<span class="arr">${esc(item.arr)}</span>` : ""}
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
    const filterLabels = [...state.filters].map(id => FILTERS.find(filter => filter.id === id)?.label).filter(Boolean);
    const filterCopy = filterLabels.length ? ` Active overlays: <b>${filterLabels.join(" + ")}</b>.` : " No overlay filter is active.";
    explainer.innerHTML = `<b>${esc(VIEW_MODES[state.view].label)}:</b> ${esc(VIEW_MODES[state.view].explainer)}${filterCopy}`;
    clearFilters.disabled = state.filters.size === 0;
  }

  function render(){
    renderLegend();
    renderEnablers();
    renderLanes();
    renderExplainer();
    viewModes.querySelectorAll("button").forEach(button => button.setAttribute("aria-pressed",button.dataset.view === state.view));
    filters.querySelectorAll("button").forEach(button => button.setAttribute("aria-pressed",state.filters.has(button.dataset.filter)));
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
          <div class="evidence-meta"><span>${esc(record.source)}</span></div>
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
          <div class="assessment"><span>Commercial maturity</span><strong><i style="--assessment:${model.maturity[item.maturity].color}"></i>${esc(model.maturity[item.maturity].label)}</strong></div>
          <div class="assessment"><span>Competitive position</span><strong><i style="--assessment:${model.position[item.position].color}"></i>${esc(model.position[item.position].label)}</strong></div>
          <div class="assessment"><span>Momentum</span><strong><i style="--assessment:${model.momentum[item.momentum].color}"></i>${esc(model.momentum[item.momentum].label)}</strong></div>
          <div class="assessment"><span>Suite mapping</span><strong>${esc(item.suiteMapping.suite)}</strong></div>
        </div>
      </div>
      <div class="r-sec">
        <h4>Competitive read</h4>
        <p>${esc(item.edge)}</p>
      </div>
      ${item.competitors.length ? `<div class="r-sec"><h4>Competitive set</h4><div class="comp-grid">${item.competitors.map(([name,type]) => `<span class="comp ${esc(type)}">${esc(name)}</span>`).join("")}</div></div>` : ""}
      <div class="r-sec"><h4>Moat mechanisms</h4>${tagList(item.moat,MOAT)}</div>
      <div class="r-sec"><h4>DCF linkage</h4>${tagList(item.dcf,DCF)}</div>
      <div class="r-sec"><h4>Commercial tags</h4>
        <div class="tag-list">
          ${[...item.monetization,...item.motion,...item.workloads].map(value => `<span class="detail-tag">${esc(pretty(value))}</span>`).join("")}
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

  viewModes.addEventListener("click",event => {
    const button = event.target.closest("[data-view]");
    if(!button) return;
    state.view = button.dataset.view;
    closeReader();
    render();
  });

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

  render();
})();
