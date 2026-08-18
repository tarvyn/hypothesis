# Adding a company

Each company is an isolated research package under `companies/<slug>/`.

Required files:

- `company.js` exports `window.COMPANY_MANIFEST` and declares only the research
  views the company actually supports;
- `index.html` provides the declared view panels and loads shared view modules;
- view datasets live under `data/` and assets remain company-local;
- optional `validate.js` contains only issuer-specific analytical tie-outs.

Register the company once in `companies/registry.js`. The generic build copies
only registered company routes, and the generic validator checks manifest,
route, enabled-view, data-file, and shared product-map contracts.

A product-map-only company needs one `product-map` view in its manifest, the
shared `src/core/company-shell.js` and `src/views/product-map/product-map.js`
scripts in its page, and a dataset exporting `window.PRODUCT_MAP`. It should not
render placeholder tabs for research that has not been completed.
