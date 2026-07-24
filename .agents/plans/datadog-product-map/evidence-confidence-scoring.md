# Datadog Product Map: Evidence Confidence Scoring

## Metadata

Author: Taras Vynnychuk <taras.vynnychuk@carbonaltdelete.com>
Created: 2026-07-24 17:30:35 CEST
Updated: 2026-07-24
Models: GPT-5
Harness: Unknown

## Summary

Roll out the hybrid product-assessment model from the six-product Security Suite pilot to every mapped product. Keep the map's point estimate separate from the credibility of the supporting evidence, while applying stricter evidence gates to factual metrics such as commercial maturity and momentum.

## Decisions

- Rename the visible `Moat conviction` label to `Moat strength`; the underlying data key remains stable.
- Add per-metric `Evidence confidence`: `High`, `Medium`, or `Low`.
- Do not add a fifth score row. Show confidence as a compact pill and through the score meter's fill treatment.
- Keep all evidence details collapsed by default.
- Apply evidence confidence to all 41 canonical mapped products.
- Treat `Maturity` and `Momentum` as evidence-gated:
  - `Proven` or `Scaled` requires at least Medium product- or suite-relevant evidence.
  - `Improving` requires dated evidence showing a change over time; absence of deterioration is not `Stable`.
- Treat `Position` and `Moat strength` as an analytical estimate plus separately visible evidence confidence.
- Company-level Morningstar research remains context and cannot increase product-level evidence confidence by itself.
- Datadog product pages support product existence and capabilities, but not adoption, momentum, competitive rank, or moat durability.

## Security Suite Pilot Calibration

| Product | Maturity | Position | Momentum | Moat strength |
| --- | --- | --- | --- | --- |
| Cloud Security | Validated early / Low | Challenger / Low | Insufficient evidence / Low | Credible / Low |
| Code Security | Validated early / Low | Challenger / Low | Insufficient evidence / Low | Emerging / Low |
| Cloud SIEM | Proven / Medium | Challenger / Low | Insufficient evidence / Low | Credible / Low |
| Data Security | Validated early / Low | Challenger / Low | Insufficient evidence / Low | Emerging / Low |
| Security: AI Guard | Preview / option / Medium | Unproven / Low | Insufficient evidence / Low | Weak / Low |
| Bits AI Security Analyst | Validated early / Low | Unproven / Low | Insufficient evidence / Low | Emerging / Low |

## Full-map rollout

- Every product receives four evidence-confidence values; no tile remains unrated.
- Product-level earnings-call disclosures and sufficiently scoped third-party research can support Medium confidence, but not High.
- Company-level 10-K and Morningstar evidence remain context unless they directly support the exact product-level claim.
- Product pages and Investor Day taxonomy support product existence, capability, and lifecycle state; they do not support adoption, growth, competitive position, or durable moat.
- `Preview / option` can carry Medium maturity confidence when the company directly documents the lifecycle state.
- `Scaled` and `Proven` are retained only where product- or tightly scoped suite-level commercial evidence reaches Medium.
- `Improving` is retained only for dated product-specific usage, customer, or growth evidence showing change over time.
- Static ARR, current customer count, deal inclusion, taxonomy presence, or the absence of negative disclosure do not establish momentum.
- Competitive position remains an analyst interpretation and therefore Low until a product-specific independent source directly supports the rank.
- Product moat strength remains Low except for Datadog's three scaled core pillars, where product scale plus company-wide switching-cost and network-effect context supports Medium.
- High confidence is intentionally unused until Datadog or a sufficiently authoritative independent source supplies direct product-level financial, retention, market-share, or comparable evidence.

## UI

- Add a compact `H`, `M`, or `L` evidence pill to the right of each score row.
- Use solid active segments for High, lightly striped segments for Medium, and muted/outlined segments for Low.
- Add a short global legend explaining that fill length is the point estimate while fill treatment and the pill represent evidence confidence.
- In the detail pane, label the existing assessment confidence explicitly as `evidence confidence`.

## Validation

- Require every product to define confidence for all four assessments.
- Prevent `Proven`/`Scaled` with Low maturity confidence anywhere in the map.
- Prevent any directional momentum rating with Low momentum confidence.
- Require confidence values to be one of `high`, `medium`, or `low`.
- Preserve the existing source-scope rules: Morningstar is company context; product pages are product capability evidence.

## Verification

- Run data validation and the production build.
- Confirm every score row renders a confidence pill.
- Confirm no product violates the maturity or momentum gates.
- Confirm repeated border products preserve the same score and confidence in every placement.
