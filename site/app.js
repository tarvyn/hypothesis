(() => {
  const library = window.COMPANY_REGISTRY;
  if (!library) throw new Error("Company index did not load.");

  const grid = document.getElementById("company-grid");
  const emptyState = document.getElementById("empty-state");
  const search = document.getElementById("company-search");
  const filters = [...document.querySelectorAll("[data-status]")];
  const state = { query: "", status: "all" };
  const esc = value => String(value ?? "")
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

  const totalViews = library.companies.reduce((sum, company) => {
    const views = company.metrics.find(metric => metric.label === "Research views");
    return sum + Number(views?.value || 0);
  }, 0);

  document.getElementById("company-count").textContent = library.companies.length;
  document.getElementById("active-count").textContent = library.companies.filter(company => company.status === "active").length;
  document.getElementById("view-count").textContent = totalViews;
  document.getElementById("last-updated").textContent = library.updatedAt;

  const card = company => `
    <article class="company-card" style="--company-accent:${esc(company.accent)}">
      <a class="company-card-link" href="${esc(company.href)}" aria-label="${esc(company.openLabel || "Open research")} for ${esc(company.name)}">
        <div class="company-card-top">
          <span class="company-monogram" aria-hidden="true">${esc(company.initials)}</span>
          <span class="company-status status-${esc(company.status)}"><i></i>${esc(company.statusLabel)}</span>
        </div>
        <div class="company-identity">
          <div><span>${esc(company.exchange)} · ${esc(company.ticker)}</span><h3>${esc(company.name)}</h3></div>
          <span class="company-sector">${esc(company.sector)}</span>
        </div>
        <p class="company-description">${esc(company.description)}</p>
        <div class="thesis-snapshot">
          <span>Thesis snapshot</span>
          <p>${esc(company.thesis)}</p>
        </div>
        <div class="company-metrics">
          ${company.metrics.map(metric => `<div><strong>${esc(metric.value)}</strong><span>${esc(metric.label)}</span></div>`).join("")}
        </div>
        <div class="company-card-foot">
          <span>Current as of <b>${esc(company.currentAsOf)}</b> · updated ${esc(company.updatedAt)}</span>
          <strong>${esc(company.openLabel || "Open research")} <i aria-hidden="true">↗</i></strong>
        </div>
      </a>
    </article>`;

  function render() {
    const query = state.query.trim().toLowerCase();
    const matches = library.companies.filter(company => {
      const inStatus = state.status === "all" || company.status === state.status;
      const haystack = [company.name, company.ticker, company.sector, company.description, company.thesis].join(" ").toLowerCase();
      return inStatus && (!query || haystack.includes(query));
    });

    grid.innerHTML = matches.map(card).join("");
    grid.hidden = matches.length === 0;
    emptyState.hidden = matches.length !== 0;
  }

  search.addEventListener("input", event => {
    state.query = event.target.value;
    render();
  });

  filters.forEach(button => button.addEventListener("click", () => {
    state.status = button.dataset.status;
    filters.forEach(item => {
      const selected = item === button;
      item.classList.toggle("is-active", selected);
      item.setAttribute("aria-pressed", String(selected));
    });
    render();
  }));

  document.addEventListener("keydown", event => {
    if (event.key === "/" && document.activeElement !== search) {
      event.preventDefault();
      search.focus();
    }
    if (event.key === "Escape" && document.activeElement === search) {
      search.value = "";
      state.query = "";
      search.blur();
      render();
    }
  });

  render();
})();
