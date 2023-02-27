import { strict as assert} from "node:assert";
import { describe, test } from "vitest";
import { model } from "../../src";

describe("Validate 'mandatory' on properties", () => {
  test("Identifies if mandatory is non required", () => {
    const notSetProp = new model.Property(
      "name",
      new model.PropertyBaseType("string")
    );
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
    
    
    assert.strictEqual(
      notSetProp.mandatory, false
    );

    assert.strictEqual(
      falseSetProp.mandatory, false
    );

    assert.strictEqual(
      trueSetProp.mandatory, true
    );

  });
});
