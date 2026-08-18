(() => {
  const normalizeViews = manifest => (manifest?.views || []).map(view =>
    typeof view === "string" ? {id:view,label:view} : view
  );

  function create({manifest, initialView, onBeforeActivate, onActivate} = {}) {
    if (!manifest?.slug) throw new Error("A company manifest with a slug is required.");

    const tabList = document.querySelector(".top-tabs");
    const declaredViews = normalizeViews(manifest);
    const declaredIds = new Set(declaredViews.map(view => view.id));
    const buttons = [...document.querySelectorAll("[data-tab]")];
    const panels = [...document.querySelectorAll("[data-panel]")];

    buttons.forEach(button => {
      const enabled = declaredIds.has(button.dataset.tab);
      button.hidden = !enabled;
      button.setAttribute("aria-hidden", String(!enabled));
    });
    panels.forEach(panel => {
      if (!declaredIds.has(panel.dataset.panel)) panel.remove();
    });

    const activeButtons = buttons.filter(button => declaredIds.has(button.dataset.tab));
    const activePanels = panels.filter(panel => declaredIds.has(panel.dataset.panel));
    if (!activeButtons.length) throw new Error(`${manifest.slug}: at least one declared view must have a tab.`);

    let activeView = declaredIds.has(initialView)
      ? initialView
      : declaredIds.has(manifest.defaultView)
        ? manifest.defaultView
        : activeButtons[0].dataset.tab;

    function activate(viewId, {focus=false, updateUrl=true} = {}) {
      if (!declaredIds.has(viewId)) return false;
      const activeButton = activeButtons.find(button => button.dataset.tab === viewId);
      if (!activeButton) return false;

      onBeforeActivate?.(viewId, activeView);
      activeView = viewId;

      activeButtons.forEach(button => {
        const active = button.dataset.tab === viewId;
        button.classList.toggle("is-active", active);
        button.setAttribute("aria-selected", String(active));
        button.tabIndex = active ? 0 : -1;
        if (active && focus) button.focus();
      });

      if (tabList && tabList.scrollWidth > tabList.clientWidth) {
        const centeredLeft = activeButton.offsetLeft - (tabList.clientWidth - activeButton.offsetWidth) / 2;
        tabList.scrollTo({left:Math.max(0, centeredLeft), behavior:focus ? "smooth" : "auto"});
      }

      activePanels.forEach(panel => {
        panel.hidden = panel.dataset.panel !== viewId;
      });

      onActivate?.(viewId);
      if (updateUrl) history.replaceState(null, "", `#${viewId}`);
      return true;
    }

    tabList?.addEventListener("click", event => {
      const button = event.target.closest("[data-tab]");
      if (button && declaredIds.has(button.dataset.tab)) activate(button.dataset.tab);
    });

    tabList?.addEventListener("keydown", event => {
      if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
      event.preventDefault();
      const currentIndex = activeButtons.findIndex(button => button.dataset.tab === activeView);
      const nextIndex = event.key === "Home"
        ? 0
        : event.key === "End"
          ? activeButtons.length - 1
          : (currentIndex + (event.key === "ArrowRight" ? 1 : -1) + activeButtons.length) % activeButtons.length;
      activate(activeButtons[nextIndex].dataset.tab, {focus:true});
    });

    return {
      activate,
      get activeView() { return activeView; },
      viewIds: declaredViews.map(view => view.id),
    };
  }

  window.HYPOTHESIS_COMPANY_SHELL = {create};
})();
