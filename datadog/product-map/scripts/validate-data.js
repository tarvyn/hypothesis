#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import {fileURLToPath} from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const source = fs.readFileSync(path.join(root, "data", "product-map-data.js"), "utf8");
const sandbox = {window:{}};
vm.createContext(sandbox);
vm.runInContext(source, sandbox, {filename:"product-map-data.js"});

const model = sandbox.window.PRODUCT_MAP;
const failures = [];
const assert = (condition, message) => {
  if(!condition) failures.push(message);
};

assert(model, "window.PRODUCT_MAP must be exported");
if(!model){
  console.error("Validation failed:\n- " + failures.join("\n- "));
  process.exit(1);
}

const categoryIds = new Set(model.categories.map(category => category.id));
const maturityIds = new Set(Object.keys(model.maturity));
const positionIds = new Set(Object.keys(model.position));
const momentumIds = new Set(Object.keys(model.momentum));
const entityTypeIds = new Set(Object.keys(model.entityTypes));
const seenNames = new Map();
let references = 0;

assert(
  ["obs","sec","dev","pa"].every(id => categoryIds.has(id)) && categoryIds.size === 4,
  "Stable spine must contain exactly obs, sec, dev, and pa"
);

for(const category of model.categories){
  assert(category.anchor?.scope === "category", `${category.catName}: anchor scope must be category`);
  assert(!/arr/i.test(`${category.anchor?.val} ${category.anchor?.lab}`), `${category.catName}: spine anchor must not contain ARR`);
  assert(category.suites.length > 0, `${category.catName}: at least one suite is required`);

  for(const suite of category.suites){
    assert(suite.products.length > 0, `${category.catName} / ${suite.name}: at least one leaf is required`);
    for(const product of suite.products){
      references += 1;
      assert(Boolean(product.id), `${product.n}: stable id is required`);
      assert(maturityIds.has(product.maturity), `${product.n}: invalid maturity ${product.maturity}`);
      assert(positionIds.has(product.position), `${product.n}: invalid position ${product.position}`);
      assert(momentumIds.has(product.momentum), `${product.n}: invalid momentum ${product.momentum}`);
      assert(entityTypeIds.has(product.entityType), `${product.n}: invalid entity type ${product.entityType}`);
      assert(categoryIds.has(product.canonicalCategory), `${product.n}: invalid canonical category`);
      assert(Array.isArray(product.moat) && product.moat.length > 0, `${product.n}: moat tags are required`);
      assert(Array.isArray(product.dcf) && product.dcf.length > 0, `${product.n}: DCF tags are required`);
      assert(Array.isArray(product.suiteMappings) && product.suiteMappings.length > 0, `${product.n}: suite mapping history is required`);

      for(const mapping of product.suiteMappings || []){
        assert(Boolean(mapping.suite && mapping.validFrom && mapping.source), `${product.n}: incomplete suite mapping`);
      }
      for(const evidence of product.evidence || []){
        assert(
          ["claim","source","sourceClass","scope","confidence","asOf"].every(key => Boolean(evidence[key])),
          `${product.n}: incomplete evidence record`
        );
      }

      const prior = seenNames.get(product.n);
      if(prior){
        assert(prior.id === product.id, `${product.n}: repeated references must share one stable id`);
        assert(Boolean(product.boundary), `${product.n}: repeated reference requires a boundary convention`);
      } else {
        seenNames.set(product.n, product);
      }
    }
  }
}

for(const [name, convention] of Object.entries(model.boundaryConventions)){
  assert(seenNames.has(name), `${name}: boundary convention points to an unknown product`);
  assert(categoryIds.has(convention.canonicalCategory), `${name}: invalid boundary canonical category`);
  assert(Boolean(convention.decisionDate && convention.reviewTrigger), `${name}: boundary governance is incomplete`);
}

for(const entity of model.relatedEntities){
  assert(entityTypeIds.has(entity.entityType), `${entity.name}: invalid related entity type`);
  assert(seenNames.has(entity.parent), `${entity.name}: parent product does not exist`);
}

for(const enabler of model.platformEnablers){
  assert(entityTypeIds.has(enabler.entityType), `${enabler.name}: invalid enabler entity type`);
  assert(Array.isArray(enabler.dcf) && enabler.dcf.length > 0, `${enabler.name}: DCF linkage is required`);
}

assert(model.meta.asOf === "2026-Q1", "Dataset as-of must be 2026-Q1");
assert(model.meta.companyReportedProductCount === 26, "Company-reported product count must stay a separately labeled fact");

if(failures.length){
  console.error(`Validation failed (${failures.length}):\n- ${failures.join("\n- ")}`);
  process.exit(1);
}

console.log(`Validated ${seenNames.size} canonical mapped entities across ${references} placements, ${model.categories.length} markets, and ${model.categories.reduce((sum, category) => sum + category.suites.length, 0)} suites.`);
