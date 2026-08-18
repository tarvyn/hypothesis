const requiredProductFields = [
  "id", "n", "entityType", "maturity", "position", "momentum",
  "moatConviction", "evidenceConfidence", "canonicalCategory",
  "suiteMappings", "monetization", "motion", "workloads", "moat", "dcf",
  "evidence", "assessmentEvidence",
];
const assessmentIds = ["maturity", "position", "momentum", "moatConviction"];

export function validateProductMap(model, {companySlug="company"} = {}) {
  const failures = [];
  const assert = (condition, message) => {
    if (!condition) failures.push(`${companySlug} product map: ${message}`);
  };

  assert(model && typeof model === "object", "dataset is missing");
  if (!model) return failures;

  const categories = Array.isArray(model.categories) ? model.categories : [];
  const categoryIds = new Set(categories.map(category => category.id));
  const scaleIds = key => new Set(Object.keys(model[key] || {}));
  const maturityIds = scaleIds("maturity");
  const positionIds = scaleIds("position");
  const momentumIds = scaleIds("momentum");
  const moatIds = scaleIds("moatConviction");
  const confidenceIds = scaleIds("evidenceConfidence");
  const entityTypeIds = scaleIds("entityTypes");
  const underwritingIds = scaleIds("underwriting");
  const evidenceSignalIds = scaleIds("evidenceSignals");
  const seenProducts = new Map();
  const seenPlacements = new Set();

  assert(categories.length > 0, "at least one market category is required");
  assert(categoryIds.size === categories.length, "category ids must be unique");
  assert([maturityIds, positionIds, momentumIds, moatIds, entityTypeIds].every(set=>set.size>0), "assessment and entity-type registries are required");
  assert(["high", "medium", "low"].every(id=>confidenceIds.has(id)), "evidence-confidence scale must include high, medium, and low");
  assert(model.sources && Object.keys(model.sources).length > 0, "source registry is required");

  for (const category of categories) {
    assert(Boolean(category.id && category.catName), "every category needs an id and name");
    assert(Array.isArray(category.suites) && category.suites.length > 0, `${category.id}: at least one suite is required`);
    for (const suite of category.suites || []) {
      assert(Boolean(suite.name), `${category.id}: suite name is required`);
      assert(Array.isArray(suite.products) && suite.products.length > 0, `${category.id}/${suite.name}: products are required`);
      for (const product of suite.products || []) {
        const label = product.n || product.id || "unnamed product";
        requiredProductFields.forEach(field=>assert(product[field] !== undefined && product[field] !== null, `${label}: ${field} is required`));
        assert(!seenPlacements.has(`${category.id}/${suite.name}/${product.id}`), `${label}: duplicate placement in one suite`);
        seenPlacements.add(`${category.id}/${suite.name}/${product.id}`);
        assert(maturityIds.has(product.maturity), `${label}: invalid maturity`);
        assert(positionIds.has(product.position), `${label}: invalid competitive position`);
        assert(momentumIds.has(product.momentum), `${label}: invalid momentum`);
        assert(moatIds.has(product.moatConviction), `${label}: invalid moat contribution`);
        assert(entityTypeIds.has(product.entityType), `${label}: invalid entity type`);
        assert(categoryIds.has(product.canonicalCategory), `${label}: canonical category is not registered`);
        assert(Array.isArray(product.suiteMappings) && product.suiteMappings.length > 0, `${label}: suite mapping history is required`);
        assert(Array.isArray(product.dcf) && product.dcf.every(id=>underwritingIds.has(id)), `${label}: invalid underwriting sensitivity`);
        assert(Array.isArray(product.evidenceSignals) && product.evidenceSignals.every(id=>evidenceSignalIds.has(id)), `${label}: invalid evidence signal`);

        for (const assessmentId of assessmentIds) {
          const confidence = product.evidenceConfidence?.[assessmentId];
          const evidence = product.assessmentEvidence?.[assessmentId];
          assert(confidenceIds.has(confidence), `${label}: ${assessmentId} evidence confidence is invalid`);
          assert(Boolean(evidence?.rationale && evidence?.asOf), `${label}: ${assessmentId} rationale and as-of date are required`);
          assert(evidence?.confidence === confidence, `${label}: ${assessmentId} confidence must match its evidence record`);
          assert(Array.isArray(evidence?.sources) && evidence.sources.length > 0, `${label}: ${assessmentId} sources are required`);
          for (const sourceRef of evidence?.sources || []) {
            assert(Boolean(model.sources[sourceRef.id]), `${label}: ${assessmentId} references an unknown source`);
            assert(Boolean(sourceRef.locator && sourceRef.role && sourceRef.scope), `${label}: ${assessmentId} source metadata is incomplete`);
          }
        }

        assert(!(["scaled", "proven"].includes(product.maturity) && product.evidenceConfidence?.maturity === "low"), `${label}: proven or scaled maturity cannot have low evidence confidence`);
        assert(!(product.momentum !== "insufficient" && product.evidenceConfidence?.momentum === "low"), `${label}: directional momentum cannot have low evidence confidence`);

        const prior = seenProducts.get(product.id);
        if (prior) {
          assert(prior.n === product.n, `${label}: repeated ids must keep the same name`);
          assert(Boolean(product.boundary), `${label}: repeated placement requires a boundary convention`);
          assessmentIds.forEach(id=>assert(prior[id]===product[id], `${label}: repeated placements must keep the same ${id}`));
        } else {
          seenProducts.set(product.id, product);
        }
      }
    }
  }

  for (const entity of model.relatedEntities || []) {
    assert(entityTypeIds.has(entity.entityType), `${entity.name || entity.id}: invalid related-entity type`);
    assert([...seenProducts.values()].some(product=>product.n===entity.parent), `${entity.name || entity.id}: parent product is missing`);
  }
  for (const enabler of model.platformEnablers || []) {
    assert(entityTypeIds.has(enabler.entityType), `${enabler.name || enabler.id}: invalid platform-enabler type`);
    assert(Array.isArray(enabler.dcf) && enabler.dcf.every(id=>underwritingIds.has(id)), `${enabler.name || enabler.id}: invalid platform-enabler sensitivity`);
  }

  return failures;
}
