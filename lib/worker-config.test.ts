import assert from "node:assert/strict";
import test from "node:test";
import { getWorkerDrainDelaySeconds } from "@/lib/worker-config";

const DRAIN_DELAY_ENV = "WORKER_DRAIN_DELAY_SECONDS";

function withDrainDelayEnv(
  value: string | undefined,
  fn: () => void
): void {
  const original = process.env[DRAIN_DELAY_ENV];

  if (value === undefined) {
    delete process.env[DRAIN_DELAY_ENV];
  } else {
    process.env[DRAIN_DELAY_ENV] = value;
  }

  try {
    fn();
  } finally {
    if (original === undefined) {
      delete process.env[DRAIN_DELAY_ENV];
    } else {
      process.env[DRAIN_DELAY_ENV] = original;
    }
  }
}

test("getWorkerDrainDelaySeconds uses default when env is missing", () => {
  withDrainDelayEnv(undefined, () => {
    assert.equal(getWorkerDrainDelaySeconds(), 300);
  });
});

test("getWorkerDrainDelaySeconds accepts valid integer values", () => {
  withDrainDelayEnv("300", () => {
    assert.equal(getWorkerDrainDelaySeconds(), 300);
  });

  withDrainDelayEnv("600", () => {
    assert.equal(getWorkerDrainDelaySeconds(), 600);
  });
});

test("getWorkerDrainDelaySeconds falls back for invalid or out-of-range values", () => {
  const invalidValues = ["0", "-1", "abc", "30.5", "1000"];

  for (const value of invalidValues) {
    withDrainDelayEnv(value, () => {
      assert.equal(getWorkerDrainDelaySeconds(), 300);
    });
  }
});
