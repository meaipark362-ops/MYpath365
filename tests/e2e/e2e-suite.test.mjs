import test from 'node:test';
import assert from 'node:assert/strict';
import { e2eTestScenarios } from './user-flows.spec.mjs';

test('E2E Specification: All 5 critical user journeys defined', () => {
  assert.equal(e2eTestScenarios.length, 5);
  for (const scenario of e2eTestScenarios) {
    assert.ok(scenario.id, 'Scenario must have id');
    assert.ok(scenario.name, 'Scenario must have name');
    assert.ok(Array.isArray(scenario.steps) && scenario.steps.length >= 4, 'Must have at least 4 verification steps');
    assert.ok(scenario.expectedOutcome, 'Must specify expected outcome');
  }
});
