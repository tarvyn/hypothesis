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

  const SCORECARD = [
    {id:"maturity",short:"MAT",label:"Maturity",definitions:model.maturity},
    {id:"position",short:"POS",label:"Position",definitions:model.position},
    {id:"momentum",short:"MOM",label:"Momentum",definitions:model.momentum},
    {id:"moatConviction",short:"MOAT",label:"Moat conviction",definitions:model.moatConviction},
  ];

  const FILTERS = [
    {
      id:"ai",
      label:"AI",
      purpose:"Shows products exposed to AI workloads or enhanced by AI. Use it to test AI relevance across the existing map—not to create a separate TAM.",
      test:item => item.workloads.includes("ai"),
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
      id:"agents",
      label:"Agents",
      purpose:"Finds products used by, monitoring, or enabling autonomous agents. Use it to assess new usage, workflow lock-in, and interface risk.",
      test:item => item.workloads.includes("agents"),
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
  ];

  const state = {filters:new Set(),selected:null};
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
        <div class="enabler-links">${item.dcf.map(key => `<span class="micro-tag">${esc(DCF[key]?.label || pretty(key))}</span>`).join("")}</div>
      </article>`;
    }).join("");
  }

  function renderLegend(){
    legend.innerHTML = SCORECARD.map(item =>
      `<span class="score-key"><b>${esc(item.short)}</b>${esc(item.label)}</span>`
    ).join("");
  }

  function scoreMeter(item,definition){
    const value = definition.definitions[item[definition.id]];
    const unknown = value.score === null;
    const segments = Array.from({length:value.max},(_,index) =>
      `<i class="${unknown ? "unknown" : index < value.score ? "active" : ""}"></i>`
    ).join("");
    return `<span class="score-row ${unknown ? "is-unknown" : ""}"
      title="${esc(definition.label)}: ${esc(value.label)}"
      aria-label="${esc(definition.label)}: ${esc(value.label)}"
      style="--score-color:${value.color}">
      <span class="score-label">${esc(definition.short)}</span>
      <span class="score-track" aria-hidden="true">${segments}</span>
      <span class="score-value">${esc(value.label)}</span>
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
                    ${productScorecard(item)}
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
    renderLegend();
    renderEnablers();
    renderLanes();
    renderExplainer();
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

  function sourceCitation(sourceRef,compact=false){
    const source = model.sources[sourceRef.id];
    if(!source) return "";
    const excerpt = sourceRef.excerpt || source.hoverText;
    const excerptType = sourceRef.excerptType || source.hoverType;
    const excerptLabels = {
      quote:"Verbatim quote",
      parsed_summary:"Parsed summary · not a quote",
      note:"Source note",
    };
    const label = source.url
      ? `<a href="${esc(source.url)}" target="_blank" rel="noopener noreferrer">${esc(source.label)}<span aria-hidden="true"> ↗</span></a>`
      : `<span class="source-name">${esc(source.label)}</span>`;
    return `<div class="source-citation ${compact ? "is-compact" : ""} ${excerpt ? "has-preview" : ""}">
      <div class="source-line">
        ${label}
        <span class="access-badge access-${esc(source.access)}">${esc(source.access === "subscriber" ? "Subscriber-only" : source.access)}</span>
      </div>
      <div class="source-locator">${esc(source.publisher)} · ${esc(source.date)} · ${esc(sourceRef.locator)}</div>
      ${source.rightsNote && !compact ? `<div class="source-rights">${esc(source.rightsNote)}</div>` : ""}
      ${excerpt ? `<div class="source-quote" role="tooltip">
        <b>${esc(excerptLabels[excerptType] || "Source excerpt")}</b>
        ${excerptType === "quote" ? `<q>${esc(excerpt)}</q>` : `<span>${esc(excerpt)}</span>`}
        <small>${esc(source.label)} · ${esc(sourceRef.locator)}</small>
      </div>` : ""}
    </div>`;
  }

  function assessmentCard(item,definition,heading){
    const value = definition.definitions[item[definition.id]];
    const evidence = item.assessmentEvidence[definition.id];
    return `<article class="assessment" style="--assessment:${value.color}">
      <span class="assessment-label">${esc(heading)}</span>
      <strong><i></i>${esc(value.label)}</strong>
      <p>${esc(evidence.rationale)}</p>
      <div class="assessment-meta">${esc(evidence.asOf)} · ${esc(evidence.confidence)} confidence</div>
      <div class="assessment-sources">${evidence.sources.map(source => sourceCitation(source,true)).join("")}</div>
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
      tag(`${model.moatConviction[item.moatConviction]?.label} moat`,true,model.moatConviction[item.moatConviction]?.color),
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
                excerpt:record.excerpt,
                excerptType:record.excerptType,
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
          ${assessmentCard(item,SCORECARD[3],"Moat conviction")}
        </div>
      </div>
      <div class="r-sec">
        <h4>Competitive read</h4>
        <p>${esc(item.edge)}</p>
      </div>
      ${item.competitors.length ? `<div class="r-sec"><h4>Competitive set</h4><div class="comp-grid">${item.competitors.map(([name,type]) => `<span class="comp ${esc(type)}">${esc(name)}</span>`).join("")}</div></div>` : ""}
      <div class="r-sec"><h4>Moat assessment</h4>
        <div class="r-callout"><b>${esc(model.moatConviction[item.moatConviction].label)} conviction</b>${esc(item.moatConvictionRationale)}</div>
        <div class="moat-mechanisms"><span>Mechanisms</span>${tagList(item.moat,MOAT)}</div>
      </div>
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
