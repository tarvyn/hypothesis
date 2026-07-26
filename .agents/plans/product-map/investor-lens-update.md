# Datadog Product Map — Investor Lens Update

## Metadata

Author: Taras Vynnychuk <taras.vynnychuk@carbonaltdelete.com>
Created: 2026-07-26 14:06:46 CEST
Models: GPT-5
Harness: Codex Desktop (version unknown)

## Summary

Align the Datadog product map with the final July 2026 Business Model and Economic Moat analyses while preserving the existing market → suite → product architecture and evidence-confidence discipline.

## Agreed changes

1. Add a company-level investor lens above the product map:
   - Business model: Strong.
   - Operational scalability: Proven.
   - Per-share scalability: Conditional.
   - Economic moat: Narrow.
   - Moat dynamics: Strengthening, medium confidence.
2. Reframe the product score from independent “Moat strength” to “Moat contribution,” because switching costs emerge primarily from the integrated customer deployment.
3. Use the internal Economic Moat Analysis as the primary company-level moat context. Retain Morningstar’s wide-moat view as explicitly labeled external contrast rather than product-level proof.
4. Expose existing underwriting/DCF sensitivities in the reader and add practical risk overlays for:
   - usage optimization;
   - gross-margin/data intensity;
   - recurring R&D burden;
   - agent/interface risk.
5. Split the generic AI overlay into distinct lenses for AI workloads, AI product optionality, and agent/interface exposure.
6. Reclassify hyperscaler validation from a moat mechanism to an evidence/traction signal.
7. Add a compact investor watchlist with confirmation and warning thresholds for retention, product depth, gross margin, ROIC/dilution, OpenTelemetry, and AI concentration.
8. Extend the schema and validation checks so the new investor lens, underwriting taxonomy, and evidence-signal classification remain governed.

## Files expected to change

- `datadog/product-map/data/product-map-data.js`
- `datadog/product-map/app.js`
- `datadog/product-map/index.html`
- `datadog/product-map/styles.css`
- `datadog/product-map/schema/product-map.schema.json`
- `datadog/product-map/scripts/validate-data.js`

## Verification

1. Run the product-map data validator.
2. Build the static site.
3. Inspect the rendered map at desktop and mobile widths.
4. Confirm the company verdict, moat terminology, risk overlays, source boundaries, and reader details are visible and consistent.
