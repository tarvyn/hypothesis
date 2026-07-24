# Product Assessment Evidence Layer

## Metadata

Author: Taras Vynnychuk <taras.vynnychuk@carbonaltdelete.com>
Created: 2026-07-24 16:15:42 CEST
Models: GPT-5
Harness: Codex (version unknown)

## Summary

Add a source-disciplined evidence layer to every product-level assessment in the
Datadog product map. Each maturity, competitive-position, momentum, and moat
conviction score must show a short explanation of why the score was assigned
and identify the evidence or judgment basis behind it.

## Implementation

1. Add a central source registry with stable IDs, source class, access level,
   public URL where permitted, date, and citation label.
2. Add one assessment-evidence record for each of the four product scores:
   `maturity`, `position`, `momentum`, and `moatConviction`.
3. Separate disclosed facts from interpretation:
   - company disclosures support product availability, adoption, and momentum;
   - third-party research can corroborate market or competitive conclusions;
   - competitive position and moat conviction remain explicitly labeled
     `Author assessment`.
4. Treat Morningstar and IBKR research as subscriber-only sources. Store
   bibliographic metadata and page/section locators, but never host or link to
   local copies of paid reports.
5. Maintain a gitignored local JSON index with PDF paths, SHA-256 fingerprints,
   page counts, and topic anchors. Do not store full extracted text.
6. Render each assessment in the detail pane with:
   - score and color;
   - one-sentence rationale;
   - source label, date/locator, access badge, and safe external link when one
     exists.
7. Extend data validation so every product has complete evidence for all four
   assessments and every source reference resolves.
8. Build and test the site, then publish the validated version with the existing
   private access policy.

## Source Policy

- SEC filings: link to the canonical SEC filing.
- Datadog IR and product pages: link to the original public page.
- Earnings call: cite the event and local page locator; link to a public Datadog
  IR source, not to a hosted transcript copy.
- Morningstar and IBKR/provider research: citation-only, subscriber access,
  no hosted PDF.
- Author assessments: identify the conclusion as internal interpretation and
  show the underlying evidence source rather than presenting it as a disclosed
  company fact.

## Acceptance Criteria

- Every product detail card explains all four assessment scores.
- Every explanation has a valid source reference and locator or a documented
  author-assessment basis.
- Subscriber-only PDFs are absent from the repository and deployment bundle.
- External links open safely in a new tab.
- Dataset validation and production build pass.
- The deployed site remains privately restricted.
