(() => {
  const esc = value => String(value ?? "")
    .replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
  const pretty = value => String(value || "").replace(/_/g," ").replace(/\b\w/g,letter => letter.toUpperCase());
  const list = value => Array.isArray(value) ? value : [];
  const slug = value => String(value).toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/(^-|-$)/g,"");

  const DEFAULT_MOAT_MECHANISMS = {
    data_gravity:{label:"Data gravity"},
    cross_signal:{label:"Cross-signal context"},
    integration_breadth:{label:"Integration breadth"},
    installed_base:{label:"Installed base"},
    workflow_lock_in:{label:"Workflow lock-in"},
    feedback_loop:{label:"Feedback loop"},
    developer_habit:{label:"Developer habit"},
    platform_access:{label:"Platform access"},
    bundle:{label:"Bundle / consolidation"},
  };

  const FILTERS = [
    {id:"ai_workload",label:"AI workload",purpose:"Products that observe, secure, or support AI workloads without treating AI as a separate market.",test:item=>list(item.workloads).includes("ai")},
    {id:"ai_optionality",label:"AI option",purpose:"Earlier-stage AI products whose commercial scale or durability remains unproven.",test:item=>list(item.workloads).includes("ai") && ["validated","option"].includes(item.maturity)},
    {id:"training",label:"Training",purpose:"Products used while models are trained.",test:item=>list(item.workloads).includes("training")},
    {id:"inference",label:"Inference",purpose:"Products involved when trained models run in production.",test:item=>list(item.workloads).includes("inference")},
    {id:"agent_interface",label:"Agent / interface",purpose:"Products exposed to autonomous-agent workflows or interface disintermediation.",test:item=>list(item.workloads).includes("agents") || list(item.dcf).includes("interface_risk")},
    {id:"usage",label:"Usage",purpose:"Usage-based monetization sensitive to activity, optimization, and overages.",test:item=>list(item.monetization).includes("usage")},
    {id:"seat",label:"Seat",purpose:"Seat-based monetization driven by user adoption and team penetration.",test:item=>list(item.monetization).includes("seat")},
    {id:"land",label:"Land",purpose:"Products that can win the initial customer deployment.",test:item=>list(item.motion).includes("land")},
    {id:"expand",label:"Expand",purpose:"Products that naturally cross-sell or grow with consumption.",test:item=>list(item.motion).includes("expand")},
    {id:"defend",label:"Defend",purpose:"Products that deepen workflows, retention, or consolidation.",test:item=>list(item.motion).includes("defend")},
    {id:"regulated",label:"Regulated",purpose:"Products and enablers relevant to compliance-heavy buyers.",test:item=>list(item.workloads).includes("regulated")},
    {id:"byoc",label:"BYOC",purpose:"Customer-controlled deployment support and its delivery complexity.",test:item=>list(item.capabilities).some(value=>value.toLowerCase().includes("byoc"))},
    {id:"usage_optimization",label:"Usage optimization",purpose:"Products where customers can reduce measured consumption without leaving the platform.",test:item=>list(item.dcf).includes("usage_optimization")},
    {id:"gross_margin_risk",label:"Data / hosting cost",purpose:"Data-intensive products whose compute, storage, or cloud costs can pressure margin.",test:item=>list(item.dcf).includes("gross_margin_risk")},
    {id:"r_and_d_intensity",label:"R&D burden",purpose:"Products whose value depends on sustained innovation before economics are proven.",test:item=>list(item.dcf).includes("r_and_d_intensity")},
  ];

  function mount({model, company, moatMechanisms=DEFAULT_MOAT_MECHANISMS} = {}) {
    if (!model?.categories?.length) throw new Error("Product map categories are required.");
    const root = document.getElementById("product-map-panel");
    if (!root) return null;

    const elements = {
      filters:root.querySelector("#filters"), clear:root.querySelector("#clear-filters"),
      explainer:root.querySelector("#active-explainer"), enablers:root.querySelector("#enablers"),
      legend:root.querySelector("#legend"), lanes:root.querySelector("#lanes"),
      toggle:root.querySelector("#product-scores-toggle"), hint:root.querySelector("#map-hint"),
      reader:document.getElementById("reader"), backdrop:document.getElementById("backdrop"),
      readerCat:document.getElementById("r-cat"), readerName:document.getElementById("r-name"),
      readerTags:document.getElementById("r-tags"), readerBody:document.getElementById("r-body"),
      close:document.getElementById("r-close"),
    };
    if (!elements.filters || !elements.lanes || !elements.reader) throw new Error("Product map shell is incomplete.");

    const state = {filters:new Set(),showScores:false,selected:null};
    const refs = {};
    const categoryLabels = Object.fromEntries(model.categories.map(category=>[category.id,category.catName]));
    const scorecard = [
      {id:"maturity",short:"MAT",label:"Maturity",definitions:model.maturity},
      {id:"position",short:"POS",label:"Position",definitions:model.position},
      {id:"momentum",short:"MOM",label:"Momentum",definitions:model.momentum},
      {id:"moatConviction",short:"MOAT",label:"Moat contribution",definitions:model.moatConviction},
    ];
    const availableFilters = FILTERS.filter(filter => model.categories.some(category =>
      category.suites.some(suite => suite.products.some(filter.test))
    ) || ["regulated","byoc"].includes(filter.id) && list(model.platformEnablers).some(item=>list(item.tags).includes(filter.id)));

    elements.filters.innerHTML = availableFilters.map(filter=>
      `<button class="filter" type="button" data-filter="${filter.id}" aria-pressed="false" aria-describedby="overlay-help-${filter.id}"><span>${esc(filter.label)}</span><span class="filter-info" aria-hidden="true">?</span><span class="filter-tooltip" id="overlay-help-${filter.id}" role="tooltip">${esc(filter.purpose)}</span></button>`
    ).join("");

    const tag = (label,primary=false,color="var(--txt-dim)") => `<span class="r-tag ${primary?"primary":""}" style="--tag:${color}">${esc(label)}</span>`;
    const tagList = (keys,dictionary) => `<div class="tag-list">${list(keys).map(key=>`<span class="detail-tag">${esc(dictionary[key]?.label || pretty(key))}</span>`).join("")}</div>`;
    const matches = item => [...state.filters].every(id=>availableFilters.find(filter=>filter.id===id)?.test(item));
    const relatedFor = item => list(model.relatedEntities).filter(entity=>entity.parent===item.n);

    function sourceCitation(sourceRef,compact=false) {
      const source = model.sources?.[sourceRef.id];
      if (!source) return "";
      const sourceUrl = sourceRef.url || source.url;
      const sourceLabel = sourceRef.label || source.label;
      const excerpt = sourceRef.excerpt || source.hoverText;
      const excerptType = sourceRef.excerptType || source.hoverType;
      const excerptLabels = {quote:"Verbatim quote",company_excerpt:"Company description",parsed_summary:"Parsed summary · not a quote",note:"Analytical note · not a quote"};
      const roleLabels = {direct:"Product evidence",supporting:"Supporting evidence",context:"Company context",judgment:"Map inference",limitation:"Disclosure limit"};
      const sourceLink = sourceUrl ? `<a href="${esc(sourceUrl)}" target="_blank" rel="noopener noreferrer">${esc(sourceLabel)}<span aria-hidden="true"> ↗</span></a>` : `<span class="source-name">${esc(sourceLabel)}</span>`;
      return `<details class="source-citation ${compact?"is-compact":""} role-${esc(sourceRef.role || "supporting")}"><summary><span class="evidence-role">${esc(roleLabels[sourceRef.role] || "Evidence")}</span><span class="source-summary-name">${esc(sourceLabel)}</span><span class="scope-badge">${esc(sourceRef.scope || "unspecified scope")}</span></summary><div class="source-content"><div class="source-line">${sourceLink}<span class="access-badge access-${esc(source.access)}">${esc(source.access === "subscriber" ? "Subscriber-only" : source.access)}</span></div><div class="source-locator">${esc(source.publisher)} · ${esc(source.date)} · ${esc(sourceRef.locator)}</div>${excerpt?`<div class="source-excerpt"><b>${esc(excerptLabels[excerptType] || "Source content")}</b>${excerptType === "quote"?`<q>${esc(excerpt)}</q>`:`<span>${esc(excerpt)}</span>`}</div>`:""}${sourceRef.summary?`<div class="source-interpretation"><b>Map reading</b>${esc(sourceRef.summary)}</div>`:""}${sourceRef.caveat?`<div class="source-caveat"><b>Evidence boundary</b>${esc(sourceRef.caveat)}</div>`:""}${source.rightsNote?`<div class="source-rights">${esc(source.rightsNote)}</div>`:""}</div></details>`;
    }

    function scoreMeter(item,definition) {
      const value = definition.definitions[item[definition.id]];
      const unknown = value.score === null;
      const confidence = item.evidenceConfidence?.[definition.id];
      const confidenceDefinition = model.evidenceConfidence?.[confidence];
      const segments = Array.from({length:value.max},(_,index)=>`<i class="${unknown?"unknown":index<value.score?"active":""}"></i>`).join("");
      const confidenceCopy = confidenceDefinition ? ` · evidence confidence: ${confidenceDefinition.label}` : "";
      return `<span class="score-row ${unknown?"is-unknown":""} ${confidence?`has-confidence confidence-${confidence}`:""}" title="${esc(definition.label)}: ${esc(value.label)}${esc(confidenceCopy)}" aria-label="${esc(definition.label)}: ${esc(value.label)}${esc(confidenceCopy)}" style="--score-color:${value.color}"><span class="score-label">${esc(definition.short)}</span><span class="score-track" aria-hidden="true">${segments}</span><span class="score-value">${esc(value.label)}</span>${confidenceDefinition?`<span class="evidence-confidence confidence-${esc(confidence)}" title="Evidence confidence: ${esc(confidenceDefinition.label)}">${esc(confidenceDefinition.short)}</span>`:'<span class="evidence-confidence is-unrated" aria-hidden="true"></span>'}</span>`;
    }

    const productScorecard = item => `<span class="product-scorecard">${scorecard.map(definition=>scoreMeter(item,definition)).join("")}</span>`;
    const distribution = products => {
      const counts = Object.fromEntries(Object.keys(model.maturity).map(key=>[key,0]));
      products.forEach(product=>counts[product.maturity]=(counts[product.maturity]||0)+1);
      return Object.entries(model.maturity).map(([key,definition])=>counts[key]?`<i title="${esc(definition.label)}: ${counts[key]}" style="width:${counts[key]/products.length*100}%;background:${definition.color}"></i>`:"").join("");
    };

    function renderEnablers() {
      if (!elements.enablers) return;
      elements.enablers.innerHTML = list(model.platformEnablers).map(item=>{
        const relevant = [...state.filters].filter(filter=>["regulated","byoc"].includes(filter));
        const active = !relevant.length || relevant.every(filter=>list(item.tags).includes(filter));
        return `<article class="enabler ${active?"":"is-dimmed"}"><div class="enabler-top"><h3>${esc(item.name)}</h3><span class="entity-badge">${esc(model.entityTypes[item.entityType].label)}</span></div><p>${esc(item.description)}</p></article>`;
      }).join("");
    }

    function renderLegend() {
      if (!elements.legend) return;
      elements.legend.hidden = !state.showScores;
      elements.legend.innerHTML = state.showScores ? `${scorecard.map(item=>`<span class="score-key"><b>${esc(item.short)}</b>${esc(item.label)}</span>`).join("")}<span class="confidence-key" title="Confidence in the evidence supporting the point estimate"><span class="evidence-confidence confidence-high">H</span><span class="evidence-confidence confidence-medium">M</span><span class="evidence-confidence confidence-low">L</span><span>evidence confidence</span></span>` : "";
    }

    function renderLanes() {
      Object.keys(refs).forEach(key=>delete refs[key]);
      elements.lanes.innerHTML = model.categories.map(category=>`<article class="lane" style="--c:${category.color}"><div class="spine"><div class="cat">${esc(category.catName)}</div><div class="gart">${category.gart || ""}</div><div class="anchor"><div class="val ${category.anchor?.none?"none":""}">${esc(category.anchor?.val)}</div><div class="lab">${esc(category.anchor?.lab)}</div></div></div><div class="cells">${category.suites.map(suite=>{
        const products = suite.products.map(product=>({...product,categoryId:category.id,categoryName:category.catName,categoryColor:category.color,suiteName:suite.name}));
        return `<section class="suite"><div class="suite-h"><span class="suite-name">${esc(suite.name)}</span><span class="dist" aria-label="Product maturity distribution">${distribution(products)}</span><span class="suite-count">${products.length} ${products.length===1?"leaf":"leaves"}</span><span class="suite-rule"></span></div><div class="grid">${products.map((item,index)=>{
          const key=`${category.id}-${slug(suite.name)}-${item.id}-${index}`; refs[key]=item; const match=matches(item);
          return `<button class="cell ${item.border?"border":""} ${match&&state.filters.size?"is-match":""} ${!match?"is-dimmed":""}" type="button" data-item="${esc(key)}" style="--cell-color:${item.categoryColor}" aria-label="Open ${esc(item.n)} details">${list(item.workloads).includes("ai")?'<span class="ai-dot" aria-hidden="true"></span>':""}<span class="cell-name">${esc(item.n)}</span>${item.arr?`<span class="arr">${esc(item.arr)}</span>`:""}${state.showScores?productScorecard(item):""}</button>`;
        }).join("")}</div></section>`;
      }).join("")}</div></article>`).join("");
    }

    function renderExplainer() {
      if (!elements.explainer) return;
      const active=[...state.filters].map(id=>availableFilters.find(filter=>filter.id===id)).filter(Boolean);
      elements.explainer.innerHTML=active.length?`<div class="overlay-explanations">${active.map(filter=>`<p><b>${esc(filter.label)}</b><span>${esc(filter.purpose)}</span></p>`).join("")}</div>`:'<span class="overlay-empty">Hover or focus an overlay for its purpose; select overlays to combine them.</span>';
      if (elements.clear) elements.clear.disabled = !state.filters.size;
    }

    function render() {
      renderLegend(); renderEnablers(); renderLanes(); renderExplainer();
      elements.filters.querySelectorAll("button").forEach(button=>button.setAttribute("aria-pressed",state.filters.has(button.dataset.filter)));
      elements.toggle?.setAttribute("aria-checked",String(state.showScores));
      if (elements.hint) elements.hint.textContent=state.showScores?"Bar length is the point estimate. Fill treatment and H/M/L show evidence confidence. Select a tile for sources and moat mechanics.":"Select a product tile for its assessment, sources, and moat mechanics.";
    }

    function assessmentCard(item,definition,heading) {
      const value=definition.definitions[item[definition.id]];
      const evidence=item.assessmentEvidence[definition.id];
      const confidence=model.evidenceConfidence[evidence.confidence];
      return `<article class="assessment" style="--assessment:${value.color}"><span class="assessment-label">${esc(heading)}</span><strong><i></i>${esc(value.label)}</strong><p>${esc(evidence.rationale)}</p><div class="assessment-meta"><span class="evidence-confidence confidence-${esc(evidence.confidence)}">${esc(confidence?.short || evidence.confidence.slice(0,1))}</span><span>${esc(confidence?.label || evidence.confidence)} evidence confidence</span><span>·</span><span>${esc(evidence.asOf)}</span></div><div class="assessment-sources"><span class="assessment-sources-label">Evidence & reasoning · ${evidence.sources.length}</span>${evidence.sources.map(source=>sourceCitation(source,true)).join("")}</div></article>`;
    }

    function openReader(item,cell) {
      state.selected=item;
      document.querySelectorAll(".cell.selected").forEach(node=>node.classList.remove("selected")); cell.classList.add("selected");
      elements.reader.style.setProperty("--rc",item.categoryColor);
      elements.readerCat.textContent=`${item.categoryName} · ${item.suiteName}`; elements.readerName.textContent=item.n;
      elements.readerTags.innerHTML=[tag(model.entityTypes[item.entityType]?.label||pretty(item.entityType),true,item.categoryColor),tag(model.maturity[item.maturity]?.label,true,model.maturity[item.maturity]?.color),tag(model.position[item.position]?.label,true,model.position[item.position]?.color),tag(model.momentum[item.momentum]?.label),tag(`${model.moatConviction[item.moatConviction]?.label} moat contribution`,true,model.moatConviction[item.moatConviction]?.color),list(item.workloads).includes("ai")?tag("AI layer",true,"var(--ai)"):""].join("");
      const related=relatedFor(item);
      const canonical=item.canonicalCategory!==item.categoryId?`<div class="r-callout"><b>Reference placement</b>Canonical home: ${esc(categoryLabels[item.canonicalCategory])}. This repeated leaf preserves the documented border convention without double-counting the market.</div>`:"";
      const evidence=list(item.evidence).length?item.evidence.map(record=>`<div class="evidence"><p>${esc(record.claim)}</p><div class="evidence-meta"><span>${esc(record.asOf)}</span><span>·</span><span>${esc(record.scope)}</span><span>·</span><span>${esc(record.sourceClass)}</span><span>·</span><span>${esc(record.confidence)} confidence</span></div>${record.sourceId?sourceCitation({id:record.sourceId,locator:record.locator,role:"supporting",scope:record.scope,excerpt:record.excerpt,excerptType:record.excerptType,summary:record.claim,caveat:"This record supports the stated capability or usage signal; confidence and scope remain as labeled."},true):`<div class="evidence-meta"><span>${esc(record.source)}</span></div>`}</div>`).join(""):'<div class="r-callout"><b>Evidence status</b>No product-level financial disclosure. Assessment relies on product position, competitive context, and suite logic.</div>';
      const boundary=item.boundary?`<div class="r-sec"><h4>Boundary convention</h4><div class="r-callout"><b>Canonical: ${esc(categoryLabels[item.boundary.canonicalCategory])}</b>${esc(item.boundary.reason)}</div><div class="evidence-meta"><span>Set ${esc(item.boundary.decisionDate)}</span><span>·</span><span>Review: ${esc(item.boundary.reviewTrigger)}</span></div></div>`:"";
      elements.readerBody.innerHTML=`<div class="r-sec"><h4>What it does</h4><p>${esc(item.what)}</p><div class="r-example"><b>For example</b>${esc(item.ex)}</div>${canonical}</div><div class="r-sec"><h4>Why a customer pays</h4><p>${esc(item.why)}</p></div><div class="r-sec"><h4>Product-level assessment</h4><div class="assessment-grid">${assessmentCard(item,scorecard[0],"Commercial maturity")}${assessmentCard(item,scorecard[1],"Competitive position")}${assessmentCard(item,scorecard[2],"Momentum")}${assessmentCard(item,scorecard[3],"Moat contribution")}</div></div><div class="r-sec"><h4>Competitive read</h4><p>${esc(item.edge)}</p></div>${list(item.competitors).length?`<div class="r-sec"><h4>Competitive set</h4><div class="comp-grid">${item.competitors.map(([name,type])=>`<span class="comp ${esc(type)}">${esc(name)}</span>`).join("")}</div></div>`:""}<div class="r-sec"><h4>Moat contribution</h4><div class="r-callout"><b>${esc(model.moatConviction[item.moatConviction].label)} contribution</b>${esc(item.moatConvictionRationale)}</div><div class="moat-mechanisms"><span>Switching-cost mechanisms</span>${tagList(item.moat,moatMechanisms)}</div>${list(item.evidenceSignals).length?`<div class="moat-mechanisms"><span>Traction / validation signals · not moat</span>${tagList(item.evidenceSignals,model.evidenceSignals)}</div>`:""}</div><div class="r-sec"><h4>Commercial tags</h4><div class="tag-list">${[...list(item.monetization),...list(item.motion),...list(item.workloads)].map(value=>`<span class="detail-tag">${esc(pretty(value))}</span>`).join("")}</div></div><div class="r-sec"><h4>Underwriting sensitivities</h4><div class="underwriting-list">${list(item.dcf).map(key=>{const sensitivity=model.underwriting[key];return `<div class="underwriting-item group-${esc(sensitivity?.group||"other")}"><b>${esc(sensitivity?.label||pretty(key))}</b><span>${esc(sensitivity?.description||"")}</span></div>`;}).join("")}</div></div>${(list(item.capabilities).length||related.length)?`<div class="r-sec"><h4>Capabilities & solution overlays</h4>${list(item.capabilities).map(value=>`<div class="r-callout"><b>${esc(value)}</b>Nested under the product; not counted as a separate market category.</div>`).join("")}${related.map(entity=>`<div class="r-callout"><b>${esc(entity.name)} · ${esc(model.entityTypes[entity.entityType].label)}</b>${esc(entity.description)}</div>`).join("")}</div>`:""}<div class="r-sec"><h4>Evidence ledger</h4>${evidence}</div>${boundary}${item.arr?`<div class="r-sec"><h4>Directional product metric</h4><div class="r-callout"><b>${esc(item.arr)}</b>Company-stated product or combined-suite figure; not audited segment data.</div></div>`:""}`;
      elements.readerBody.scrollTop=0; document.body.classList.add("reader-open"); elements.reader.setAttribute("aria-hidden","false"); elements.close?.focus({preventScroll:true});
    }

    function close() {
      document.body.classList.remove("reader-open"); elements.reader.setAttribute("aria-hidden","true");
      document.querySelectorAll(".cell.selected").forEach(node=>node.classList.remove("selected")); state.selected=null;
    }

    elements.filters.addEventListener("click",event=>{const button=event.target.closest("[data-filter]");if(!button)return;const id=button.dataset.filter;state.filters.has(id)?state.filters.delete(id):state.filters.add(id);close();render();});
    elements.clear?.addEventListener("click",()=>{state.filters.clear();close();render();});
    elements.toggle?.addEventListener("click",()=>{state.showScores=!state.showScores;close();render();});
    elements.lanes.addEventListener("click",event=>{const cell=event.target.closest("[data-item]");if(cell)openReader(refs[cell.dataset.item],cell);});
    elements.close?.addEventListener("click",close); elements.backdrop?.addEventListener("click",close);
    document.addEventListener("keydown",event=>{if(event.key==="Escape")close();});
    render();
    return {render,close,companySlug:company?.slug || null};
  }

  window.HYPOTHESIS_PRODUCT_MAP = {mount};
})();
