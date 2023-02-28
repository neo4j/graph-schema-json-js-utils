import { strict as assert } from "node:assert";
import { describe, test } from "vitest";
import { model } from "../../src";

describe("Validate 'nullable' on properties", () => {
  test("Identifies if nullable is non required", () => {
    const falseSetProp = new model.Property(
      "name",
      new model.PropertyBaseType("string"),
      false
    );
    const trueSetProp = new model.Property(
      "name",
      new model.PropertyBaseType("string"),
      true
    );

    assert.strictEqual(falseSetProp.nullable, false);

    assert.strictEqual(trueSetProp.nullable, true);
  });
});
