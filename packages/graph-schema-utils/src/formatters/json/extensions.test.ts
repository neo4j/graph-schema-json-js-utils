import { describe, test } from "vitest";
import { readFile } from "../../../test/fs.utils.js";
import path from "path";
import { fromJson } from "./index.js";
import { strict as assert } from "node:assert";

describe("JSON formatter", () => {
  describe("fromJsonStruct", () => {
    const schemaWithDuplicatedNodeLabels = readFile(
      path.resolve(__dirname, "./test-schemas/duplicated-nodeLabel-ids.json")
    );
    test("Identifies duplicated node labels adn throws an error", () => {
      assert.throws(() => fromJson(schemaWithDuplicatedNodeLabels));
    });
  });
});
