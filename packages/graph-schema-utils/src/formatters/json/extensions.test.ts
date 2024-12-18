import { describe, test } from "vitest";
import { readFile } from "../../../test/fs.utils.js";
import path from "path";
import { fromJson } from "./index.js";
import { strict as assert } from "node:assert";

describe("JSON formatter", () => {
  describe("fromJson", () => {
    const schemaWithDuplicatedNodeLabels = readFile(
      path.resolve(__dirname, "./test-schemas/duplicated-nodeLabel-ids.json")
    );
    test("Identifies duplicated node labels adn throws an error", () => {
      assert.throws(() => fromJson(schemaWithDuplicatedNodeLabels), {
        message: "Duplicate node label IDs found in schema",
      });
    });

    test("Identifies duplicated node object types and throws an error", () => {
      const schema = readFile(
        path.resolve(
          __dirname,
          "./test-schemas/duplicated-nodeObjectType-ids.json"
        )
      );
      assert.throws(() => fromJson(schema), {
        message: "Duplicate node object type IDs found in schema",
      });
    });

    test("Does not throw an error if there are no duplicated ids in node labels or node object types", () => {
      const schema = readFile(
        path.resolve(__dirname, "./test-schemas/full.json")
      );
      assert.doesNotThrow(() => fromJson(schema));
    });
  });
});
