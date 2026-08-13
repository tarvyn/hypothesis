---
name: investment-hypothesis-prompt-enricher
description: Enrich a generalized public-equity investment-hypothesis prompt with reusable catalyst-quality and thesis-based exit-trigger instructions. Use when asked to improve, extend, or prepare an investment hypothesis prompt while preserving its original wording, especially prompts containing Catalysts and RISKS & EXIT STRATEGY sections.
---

# Investment Hypothesis Prompt Enricher

Add exactly two universal instruction blocks to the supplied prompt. Keep them company-agnostic and applicable across industries.

## Workflow

1. Treat the supplied prompt as immutable source text.
2. Find the instruction that defines `Catalysts` by meaning, even if capitalization or numbering differs. Insert the catalyst block immediately after that instruction and before the next section.
3. Find `RISKS & EXIT STRATEGY` or its semantic equivalent. Insert the exit-trigger block after the section's existing instructions and examples, but before the next top-level section.
4. Preserve all original wording, ordering, headings, examples, company placeholders, and formatting. Add only the two blocks below plus the minimum blank lines needed for readability.
5. Do not tailor the additions to the named company, sector, business model, or currently available KPIs.
6. Do not add thresholds, examples, metrics, dates, research findings, or a third enrichment block.
7. Do not duplicate a block that is already present. If it is partially present, replace only the partial added material with the complete canonical block while leaving the original prompt untouched.
8. Return the complete enriched prompt by default. Return only the inserted text or a diff when the user explicitly requests that format.

## Canonical catalyst block

Insert this text immediately after the existing `Catalysts` instruction:

```text
Catalyst test: Each catalyst must answer: “Why will the market notice, and when?”

For every catalyst, specify:

- the concrete event or process;
- the expected date or time window;
- the new information the market will receive;
- the expectation or uncertainty it may resolve;
- the mechanism through which it could change estimates, perceived risk, or the valuation multiple.

Do not classify a desired KPI outcome as a catalyst unless it is tied to a specific event or disclosure. If several events test the same underlying uncertainty, combine them into one catalyst path rather than treating them as independent catalysts.
```

## Canonical exit-trigger block

Insert this text into the existing `RISKS & EXIT STRATEGY` section after its current instructions and examples:

```text
Derive each exit trigger directly from a core thesis assumption, driver, or moat condition. Each trigger must answer:

“What observable fact in a future filing or company disclosure would prove that the original investment thesis is wrong?”

For every trigger, specify:

- which thesis assumption has broken;
- the observable indicator or event;
- the threshold;
- the required persistence, unless the event is immediately irreversible;
- the required action: re-underwrite, reduce, or exit.

Exit triggers must be specific, measurable, preferably leading, and based on information that is realistically observable for this company. Do not force the use of metrics that the company does not disclose and do not invent false precision.

Separate warning signals that require re-underwriting from definitive exit triggers that invalidate the thesis.

A decline in the stock price, by itself, is not an exit trigger. Price-based stop-loss rules and valuation-based trim rules must be treated separately from thesis-invalidating exit triggers.
```

## Quality check

Before returning the result, verify that:

- every original sentence remains present and unchanged;
- the catalyst block appears only once and directly follows the catalyst instruction;
- the exit-trigger block appears only once inside the risk and exit-strategy section;
- the additions contain no company-specific content;
- no unrelated improvement was made.
