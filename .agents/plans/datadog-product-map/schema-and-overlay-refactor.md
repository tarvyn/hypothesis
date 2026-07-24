# Datadog product map schema and overlay refactor

## Metadata

Author: Taras Vynnychuk <taras.vynnychuk@carbonaltdelete.com>
Created: 2026-07-24 08:55:51 CEST
Models: GPT-5
Harness: Codex Desktop (version unknown)

## Summary

Preserve the existing investor taxonomy of a stable Gartner market backbone,
effective-dated Datadog suite mappings, and canonical product leaves. Refactor
the implementation so product assessments, evidence, boundary conventions, and
cross-cutting investment lenses are structured data rather than prose embedded
in a single HTML file.

The default visual language and four-category backbone remain intact. Suite
summary pills are replaced with distribution bars derived from product-level
assessments.

## Scope

1. Separate the product-map data model from the renderer.
2. Add stable identifiers and entity types for products, capabilities,
   interfaces, solutions, deployment models, and GTM/compliance enablers.
3. Move commercial maturity and competitive position to product level.
4. Separate maturity, position, sales motion, momentum, moat mechanism, and DCF
   relevance into orthogonal fields.
5. Add effective-dated suite mappings, structured evidence records, and formal
   border-product conventions.
6. Make all market-spine anchors semantically consistent and keep company-level
   or product-level directional metrics out of TAM slots.
7. Add view modes for categories, maturity, position, momentum, moat, and DCF
   relevance.
8. Add composable filters for AI, training, inference, agents, usage/seat
   monetization, land/expand/defend motion, and regulated/BYOC exposure.
9. Render suite-level maturity summaries as distribution bars calculated from
   the products inside each suite.
10. Preserve and clarify the existing product explanations, commercial
    traction, and competitive sets.

## Q1 2026 evidence update

- Treat GPU Monitoring as validated early with improving momentum, supported by
  initial hyperscaler training wins, without implying a disclosed standalone
  revenue segment.
- Represent Training Observability as a solution/workload overlay across GPU,
  infrastructure, network, logs, cost, data, and security products.
- Represent Bits Assistant and APM Recommendations as capabilities or
  interfaces rather than automatically increasing the official product count.
- Represent Cloud Prem/BYOC, FedRAMP High, and regional data residency as
  deployment or GTM enablers rather than market categories or suites.
- Date quarterly adoption evidence explicitly so historical sequential growth
  metrics are not mistaken for current-quarter figures.

## Data architecture

Use structured browser-loadable JavaScript data files to keep the existing
zero-build static site easy to open locally:

```text
datadog/product-map/
├── index.html
├── styles.css
├── app.js
├── data/
│   └── product-map-data.js
└── schema/
    └── product-map.schema.json
```

The schema validates:

- stable unique entity ids;
- one canonical market category per product;
- explicit entity type;
- valid product-level maturity, position, and momentum values;
- effective dates for suite mappings;
- source class, scope, confidence, and as-of date for evidence;
- rationale for every border convention;
- consistent market anchor scope;
- separation of capabilities from official product-count claims.

## Interaction design

- Keep the category map as the default first read.
- Use one view-mode control to determine product coloring.
- Use independent filter chips to highlight cross-cutting cohorts.
- Keep position and maturity visible in the product reader.
- Replace suite status pills with a compact segmented distribution bar and
  counts derived from child products.
- Extend the reader with structured sections for entity type, suite mapping,
  momentum, moat, DCF linkage, evidence, and boundary convention.
- Preserve keyboard, touch, and responsive drawer behavior.

## Validation

1. Run schema and data-integrity validation.
2. Open the static site through a local HTTP server.
3. Verify all view modes, filters, drawer content, close behavior, keyboard
   interaction, and mobile layout.
4. Confirm no product is counted twice in a canonical category and all
   distribution bars match their product assessments.
5. Confirm the repository contains no generated temporary artifacts.
