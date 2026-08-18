(() => {
  const company = window.COMPANY_MANIFEST;
  const model = window.PRODUCT_MAP;
  if (!company || !model) throw new Error("Dynatrace company data did not load.");

  const requestedView = location.hash.replace(/^#/, "");
  const initialView = company.views.some(view => view.id === requestedView)
    ? requestedView
    : company.defaultView;
  const productMap = window.HYPOTHESIS_PRODUCT_MAP.mount({model,company});
  const shell = window.HYPOTHESIS_COMPANY_SHELL.create({
    manifest:company,
    initialView,
    onBeforeActivate:() => productMap?.close(),
  });
  shell.activate(initialView, {updateUrl:false});
})();
