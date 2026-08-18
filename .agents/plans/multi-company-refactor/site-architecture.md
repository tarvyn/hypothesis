# Multi-company site architecture refactor

## Metadata

Author: Taras Vynnychuk <taras.vynnychuk@carbonaltdelete.com>
Created: 2026-08-15 11:05:48 EEST
Models: GPT-5
Harness: Codex Desktop (version unknown)

## Summary

Refactor the existing Datadog-specific static site into a multi-company research
platform. Preserve the current Datadog route, content, interactions, visual
behavior, and hosting project while moving company identity, enabled research
views, evidence data, and company-specific validation behind explicit company
contracts.

After the refactor, adding a company must require only a registered company
manifest plus that company's view data, content, assets, and any genuinely
company-specific validation. Shared renderers, navigation, build orchestration,
and generic validation must not contain issuer names, tickers, domains, or
product-specific assertions.

## Architecture

Use a neutral `site/` project root and retain the existing lightweight stack:
browser-native ES modules, static HTML/CSS, and Node build scripts. Do not add a
frontend framework as part of this refactor.

Organize the site into:

- `src/core/` for the company shell, navigation, routing, shared utilities, and
  view lifecycle;
- `src/views/` for independent research-view modules;
- `src/styles/` for design tokens, shell styles, and shared components;
- `companies/<slug>/` for company manifest, view data, content, assets, and
  company-only validation;
- `schemas/` for generic company and view contracts;
- `scripts/` for registry-aware build and validation orchestration.

## Implementation plan

1. Preserve the current Datadog experience as the regression baseline,
   including `/companies/datadog/`, hash navigation, tabs, drawers, source
   links, and production asset layout.
2. Rename the current site project directory from `datadog/` to `site/` while
   keeping the existing `.openai/hosting.json` project id and public routes.
3. Replace the handwritten landing-page company index with a generic company
   registry contract containing identity, status, enabled views, evidence date,
   metadata, routes, and assets.
4. Introduce a shared company-page bootstrap contract. A company manifest owns
   company identity and declares only the views it supports; shared navigation
   must not render unavailable or empty views.
5. Extract the product-map renderer, interactions, styles, and schema rules into
   a reusable view module. Market categories must be configurable rather than
   globally restricted to Datadog's four-category spine.
6. Separate the remaining research surfaces into independent view boundaries:
   investment hypothesis, business model, economic moat, KPIs, financials,
   peer comps, and intrinsic valuation.
7. Split validation into generic registry/company checks, generic view checks,
   and company-specific analytical assertions. Validation must run for every
   registered company and only for views enabled in its manifest.
8. Migrate Datadog to the new contracts without changing its analytical
   conclusions or reader-facing behavior.
9. Remove superseded legacy code after parity is established and verify the
   production build and all registered routes.

## Acceptance criteria

- The Datadog public route remains `/companies/datadog/` and existing hash links
  continue to resolve.
- Datadog's visible content and interactions remain intact.
- Shared core, shared view modules, and generic validators contain no Datadog
  issuer name, ticker, domains, or product-specific confidence allowlists.
- A company can enable only a product map without receiving empty tabs for
  unsupported research surfaces.
- A new company can be added through one company directory and one registry
  entry, without editing shared renderers or generic validators.
- The build copies every registered company and fails on missing manifests,
  duplicate slugs, invalid view declarations, missing routes, or broken data
  contracts.
- The existing Sites hosting project remains connected and the production build
  succeeds.

## Delivery sequence

Deliver the refactor first with Datadog as the migrated reference company.
Create Dynatrace as the first new-company implementation only after the shared
architecture passes the acceptance criteria above.
