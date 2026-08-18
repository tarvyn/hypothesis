window.COMPANY_MANIFEST = {
  schemaVersion: 1,
  slug: "dynatrace",
  name: "Dynatrace",
  legalName: "Dynatrace, Inc.",
  ticker: "DT",
  exchange: "NYSE",
  route: "./companies/dynatrace/",
  accent: "#8f73ff",
  defaultView: "product-map",
  asOf: "2026-08-13",
  sourceDomains: [
    "sec.gov",
    "ir.dynatrace.com",
    "dynatrace.com",
    "docs.dynatrace.com",
  ],
  views: [
    { id: "product-map", label: "Product map", kind: "product-map", data: "./data/product-map-data.js" },
  ],
};
