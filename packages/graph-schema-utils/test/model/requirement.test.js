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

    console.log(notSetProp.mandatory); // should log "false"
    console.log(falseSetProp.mandatory); // should log "false"
    console.log(trueSetProp.mandatory); // should log "true"
  });
});
