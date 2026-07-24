# Datadog Product Map: Evidence Confidence Scoring

## Metadata

Author: Taras Vynnychuk <taras.vynnychuk@carbonaltdelete.com>
Created: 2026-07-24 17:30:35 CEST
Models: GPT-5
Harness: Unknown

## Summary

Pilot a hybrid product-assessment model on the six products in Security Suite. Keep the map's point estimate separate from the credibility of the supporting evidence, while applying stricter evidence gates to factual metrics such as commercial maturity and momentum.

## Decisions

- Rename the visible `Moat conviction` label to `Moat strength`; the underlying data key remains stable.
- Add per-metric `Evidence confidence`: `High`, `Medium`, or `Low`.
- Do not add a fifth score row. Show confidence as a compact pill and through the score meter's fill treatment.
- Keep all evidence details collapsed by default.
- Apply the first scoring calibration only to Security Suite so the UX and rules can be reviewed before all 41 products are changed.
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

## UI

- Add a compact `H`, `M`, or `L` evidence pill to the right of each score row.
- Use solid active segments for High, lightly striped segments for Medium, and muted/outlined segments for Low.
- Add a short legend explaining that fill length is the point estimate while fill treatment and the pill represent evidence confidence.
- In the detail pane, label the existing assessment confidence explicitly as `evidence confidence`.

## Validation

- Require each calibrated product to define confidence for all four assessments.
- Prevent `Proven`/`Scaled` with Low maturity confidence inside the calibrated pilot.
- Prevent `Improving` with Low momentum confidence inside the calibrated pilot.
- Require confidence values to be one of `high`, `medium`, or `low`.
- Preserve the existing source-scope rules: Morningstar is company context; product pages are product capability evidence.

## Verification

- Run data validation and the production build.
- Confirm every Security Suite score row renders a confidence pill.
- Confirm no Security Suite product violates the maturity or momentum gates.
- Keep the rest of the product map unchanged until the pilot is reviewed.
