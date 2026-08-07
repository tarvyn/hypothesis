# Datadog Q2 2026 Site Update Plan

## Metadata

Author: Taras Vynnychuk <taras.vynnychuk@carbonaltdelete.com>
Created: 2026-08-07 15:32:51 EEST
Models: GPT-5
Harness: Codex Desktop (version unknown)

## Summary

Update the existing Datadog investment-research site from Q1 2026 to Q2 2026 using the filed 10-Q, earnings release, supplemental financial package, official earnings-call transcript, and an August 6, 2026 market snapshot. Preserve historical snapshots and clearly separate reported facts, management claims, market data, and analyst-derived valuation outputs.

## Implementation Plan

1. Add Q2 2026 reported financials, customer metrics, adoption, retention, cash-flow quality, capital data, and authoritative source links to the site data layer.
2. Refresh the opening investment read, quarterly evidence, KPI history, financial-quality analysis, customer concentration risk, and observable falsifiers.
3. Update the product map with Q2 evidence for RUM, AI-native customers, MCP activity, Bits AI, Bits Security Analyst, BYOC, Infinite Cardinality, and GPU/neolab demand without treating engagement or launches as audited revenue.
4. Add a post-earnings valuation snapshot using the August 6 close, Q2 balance sheet, updated FY2026 guidance, refreshed LTM metrics, and a rerun reverse DCF. Keep older dated valuation snapshots historically intact where the current data model supports it.
5. Remove Q1-specific rendering assumptions, update source labels and cache versions, and extend automated data tie-outs for the new latest quarter.
6. Run repository validation/build checks, serve the site locally, and visually inspect the opening view and material downstream sections at desktop and mobile widths.

## Key Evidence and Analytical Guardrails

- Use the 10-Q and filed earnings tables for GAAP financials and balance-sheet facts.
- Use the earnings transcript for management commentary, customer usage, product demand, and Q&A evidence.
- Show GAAP and non-GAAP profitability together and retain the owner-FCF sensitivity that subtracts expensed and capitalized SBC.
- Treat the largest-customer usage reduction beginning in Q3 as the principal new thesis risk.
- Freeze price and market-derived valuation metrics to August 6, 2026; label forward estimates by their as-of date.
- Do not identify the undisclosed largest customer or convert AI engagement metrics into revenue estimates.

## Verification

- All latest-period data arrays terminate in 2026Q2 and reconcile to authoritative sources.
- Reported FCF and owner FCF tie out from operating cash flow, property and equipment purchases, capitalized software, and total SBC.
- Reverse-DCF outputs reproduce from the stored assumptions within validation tolerance.
- No visible copy still describes the site as current through Q1 2026.
- Local validation/build checks pass and browser screenshots show no clipping, overlap, broken navigation, or unreadable source labels.
