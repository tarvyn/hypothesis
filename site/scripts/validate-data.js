#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import {spawnSync} from "node:child_process";
import {fileURLToPath} from "node:url";
import {validateProductMap} from "./lib/validate-product-map.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const failures = [];
const assert = (condition, message) => {
  if (!condition) failures.push(message);
};
const evaluate = (file, key) => {
  const sandbox = {window:{}};
  vm.createContext(sandbox);
  vm.runInContext(fs.readFileSync(file, "utf8"), sandbox, {filename:path.basename(file)});
  return sandbox.window[key];
};

const supportedViews = new Set([
  "investment-hypothesis",
  "product-map",
  "business-model",
  "economic-moat",
  "kpis",
  "financials",
  "peer-comps",
  "intrinsic-valuation",
]);
const registryPath = path.join(root, "companies", "registry.js");
const registry = evaluate(registryPath, "COMPANY_REGISTRY");

assert(registry?.companies?.length > 0, "Company registry must contain at least one company");
const companies = registry?.companies || [];
assert(new Set(companies.map(company => company.slug)).size === companies.length, "Company slugs must be unique");
assert(new Set(companies.map(company => company.href)).size === companies.length, "Company routes must be unique");

for (const company of companies) {
  const prefix = company.slug || "unknown-company";
  assert(/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(company.slug || ""), `${prefix}: invalid slug`);
  assert(company.href === `./companies/${company.slug}/`, `${prefix}: route must match its slug`);
  assert(["active", "researching", "archived"].includes(company.status), `${prefix}: invalid research status`);
  assert(Array.isArray(company.metrics) && company.metrics.length > 0, `${prefix}: landing metrics are required`);

  const companyRoot = path.join(root, "companies", company.slug);
  const manifestPath = path.join(companyRoot, "company.js");
  assert(fs.existsSync(companyRoot), `${prefix}: company directory is missing`);
  assert(fs.existsSync(path.join(companyRoot, "index.html")), `${prefix}: company route index is missing`);
  assert(fs.existsSync(manifestPath), `${prefix}: company manifest is missing`);
  if (!fs.existsSync(manifestPath)) continue;

  const manifest = evaluate(manifestPath, "COMPANY_MANIFEST");
  const views = manifest?.views || [];
  const viewIds = views.map(view => typeof view === "string" ? view : view.id);
  assert(manifest?.schemaVersion === 1, `${prefix}: unsupported manifest schema version`);
  assert(manifest?.slug === company.slug, `${prefix}: registry and manifest slugs differ`);
  assert(manifest?.name === company.name, `${prefix}: registry and manifest names differ`);
  assert(manifest?.ticker === company.ticker, `${prefix}: registry and manifest tickers differ`);
  assert(manifest?.route === company.href, `${prefix}: registry and manifest routes differ`);
  assert(viewIds.length > 0, `${prefix}: at least one research view is required`);
  assert(new Set(viewIds).size === viewIds.length, `${prefix}: research view ids must be unique`);
  assert(viewIds.includes(manifest?.defaultView), `${prefix}: default view must be enabled`);
  assert(viewIds.every(id => supportedViews.has(id)), `${prefix}: manifest declares an unsupported view`);

  for (const view of views) {
    if (typeof view === "string" || !view.data) continue;
    const dataPath = path.join(companyRoot, view.data);
    assert(fs.existsSync(dataPath), `${prefix}: missing data file for ${view.id}`);
    if (view.kind === "product-map" && fs.existsSync(dataPath)) {
      failures.push(...validateProductMap(evaluate(dataPath, "PRODUCT_MAP"), {companySlug:company.slug}));
    }
  }

  const page = fs.readFileSync(path.join(companyRoot, "index.html"), "utf8");
  for (const viewId of viewIds) {
    assert(page.includes(`data-tab="${viewId}"`), `${prefix}: page is missing the ${viewId} tab`);
    assert(page.includes(`data-panel="${viewId}"`), `${prefix}: page is missing the ${viewId} panel`);
  }

  const validator = path.join(companyRoot, "validate.js");
  if (fs.existsSync(validator)) {
    const result = spawnSync(process.execPath, [validator], {cwd:root, encoding:"utf8"});
    if (result.status !== 0) failures.push(`${prefix}: company validation failed\n${result.stderr || result.stdout}`);
    else if (result.stdout.trim()) console.log(result.stdout.trim());
  }
}

const forbiddenSharedIssuerTerms = new RegExp([
  "Data" + "dog",
  "DD" + "OG",
  "data" + "dog" + "hq\\.com",
].join("|"));
for (const relative of ["src", "scripts"]) {
  const target = path.join(root, relative);
  const files = fs.statSync(target).isDirectory()
    ? fs.readdirSync(target, {recursive:true}).filter(file => /\.(?:js|css|html)$/.test(file)).map(file => path.join(target, file))
    : [target];
  for (const file of files) {
    assert(!forbiddenSharedIssuerTerms.test(fs.readFileSync(file, "utf8")), `${path.relative(root, file)}: shared code contains issuer-specific language`);
  }
}

if (failures.length) {
  console.error(`Validation failed (${failures.length}):\n- ${failures.join("\n- ")}`);
  process.exit(1);
}

console.log(`Validated ${companies.length} registered company manifest(s) and shared contracts.`);
