# Dynatrace product map implementation

## Metadata

Author: Taras Vynnychuk <taras.vynnychuk@carbonaltdelete.com>
Created: 2026-08-16 10:06:33 EEST
Models: GPT-5
Harness: Codex Desktop (version unknown)

## Summary

Add Dynatrace as the first new issuer on the multi-company research site. The
initial Dynatrace surface is a source-backed product map only. It uses common
market lanes for cross-company comparison, Dynatrace-native solution families
inside those lanes, and a separate platform layer for shared technologies that
must not be double-counted as products or incremental TAM.

The evidence date is 13 August 2026. The map includes the latest FY2026 filing,
Q1 FY2027 results, the completed Bindplane acquisition, the integrated DevCycle
asset acquisition, current Dynatrace Platform Subscription capabilities, and
the announced but not yet completed Arize acquisition.

## Product-map ontology

Use four comparable market lanes:

1. Observability & Operations
2. Security
3. Software Delivery & Developer Experience
4. Business Observability

Within those lanes, group products by Dynatrace-native solution family. Treat a
customer-facing solution or application as a canonical leaf when it has a
distinct use case, buyer, commercial capability, or land-and-expand role.
Treat billing operations such as ingest, retain, and query as monetization
attributes rather than separate products.

Show Grail, Smartscape, OneAgent, PurePath, OpenPipeline, Bindplane, Dynatrace
Intelligence, AppEngine, and AutomationEngine in a separate platform layer.
Platform technologies can support several products but must appear only once.

Use explicit lifecycle states in the data model:

- current for commercially available product surfaces;
- integrating for acquired technology being folded into the platform;
- preview for private-preview or otherwise non-GA products;
- planned_acquisition for signed but unclosed transactions;
- legacy for classic consumption capabilities;
- reference_only for deliberate repeated placements with a boundary note.

## Evidence and assessment rules

- Use primary public sources for the issuer baseline: SEC filings, Dynatrace IR,
  Dynatrace documentation, product pages, and pricing documentation.
- Separate product existence, commercial maturity, competitive position,
  momentum, and moat contribution. A product page proves a capability exists;
  it does not prove adoption or momentum.
- Give every canonical product four assessments: maturity, competitive
  position, momentum, and moat contribution. Each assessment requires a dated
  rationale, source reference, and high/medium/low evidence confidence.
- Use Q1 FY2027 annualized logs consumption as a product-specific momentum
  signal for Log Management & Analytics. Do not infer similar momentum for
  other products without product-scoped disclosure.
- Treat Bindplane as a current, integrating telemetry-pipeline capability
  because the acquisition closed in April 2026.
- Treat Arize as planned acquisition optionality. Do not include it in current
  product counts or inflate current AI Observability assessments with expected
  post-close capabilities.
- Treat Dynatrace Bluebox as preview and exclude it from the current canonical
  product count.

## Implementation

1. Add shared product-map page styling under `site/src/styles/` so new
   product-map-only companies do not depend on Datadog-specific CSS.
2. Add `site/companies/dynatrace/company.js` with a single enabled
   `product-map` view and an exact as-of date.
3. Add `site/companies/dynatrace/data/product-map-data.js` with registries,
   sources, four market lanes, canonical products, platform enablers, lifecycle
   metadata, assessment evidence, and acquisition/preview overlays.
4. Add a minimal Dynatrace company page and bootstrap script that use the
   existing shared company shell and shared product-map renderer.
5. Add company-specific validation for lifecycle and acquisition boundaries.
6. Register Dynatrace with `Researching` status on the company index.
7. Run registry validation and the production build for Datadog and Dynatrace.
8. Keep the existing local preview route available; do not publish as part of
   this implementation.

## Acceptance criteria

- The company index displays Dynatrace with `Researching` status.
- `/companies/dynatrace/#product-map` renders without empty tabs.
- The map uses four comparable market lanes and a separate platform layer.
- Canonical products are not duplicated across lanes; references require an
  explicit boundary convention.
- Bindplane is shown as acquired/current and integrating.
- Arize is visibly labeled as planned and is excluded from current product
  counts and assessments.
- Bluebox is visibly labeled as preview and excluded from the current product
  count.
- Every product passes the generic evidence and assessment validator.
- Generic validation and production build pass for both registered companies.
- The existing Datadog route and data remain unchanged.
