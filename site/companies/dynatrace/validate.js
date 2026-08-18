#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import {fileURLToPath} from "node:url";

const companyRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)));
const sandbox = {window:{}};
vm.createContext(sandbox);
vm.runInContext(
  fs.readFileSync(path.join(companyRoot, "data", "product-map-data.js"), "utf8"),
  sandbox,
  {filename:"product-map-data.js"}
);

const model = sandbox.window.PRODUCT_MAP;
const failures = [];
const assert = (condition, message) => { if (!condition) failures.push(message); };
const products = model.categories.flatMap(category =>
  category.suites.flatMap(suite => suite.products)
);
const productIds = new Set(products.map(product => product.id));
const related = new Map(model.relatedEntities.map(entity => [entity.id, entity]));
const enablers = new Map(model.platformEnablers.map(entity => [entity.id, entity]));

assert(model.meta.asOf === "2026-08-13", "evidence date must remain 2026-08-13");
assert(model.categories.length === 4, "the comparable market spine must contain four lanes");
assert(products.length === 19, "the current canonical product count must be 19");
assert(productIds.size === products.length, "canonical products must not be duplicated");
assert(model.meta.canonicalProductCount === products.length, "metadata product count must tie to the map");
assert(products.every(product => product.lifecycle === "current"), "canonical leaves must be current products");
assert(!productIds.has("arize"), "Arize must not be counted as a current product");
assert(!productIds.has("bluebox"), "Bluebox must not be counted as a current product");
assert(related.get("arize")?.entityType === "planned_acquisition", "Arize must remain a planned acquisition");
assert(related.get("bluebox")?.entityType === "preview", "Bluebox must remain a preview");
assert(enablers.get("bindplane")?.entityType === "acquired_technology", "Bindplane must remain acquired and integrating");
assert(model.meta.excludedFromCurrentCount.includes("Arize"), "Arize exclusion must be explicit in metadata");

if (failures.length) {
  console.error(`Dynatrace validation failed (${failures.length}):\n- ${failures.join("\n- ")}`);
  process.exit(1);
}

console.log("Dynatrace product-map lifecycle and count checks passed.");
