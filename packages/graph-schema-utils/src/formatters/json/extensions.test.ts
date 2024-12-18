import { describe, test } from "vitest";
import { readFile } from "../../../test/fs.utils.js";
import path from "path";
import { fromJson } from "./index.js";
import { strict as assert } from "node:assert";
import {
  hasDuplicateNodeLabelIds,
  hasDuplicateNodeObjectTypeIds,
} from "./extensions.js";
import { RootSchemaJsonStruct } from "./types.js";

describe("JSON formatter", () => {
  describe("hasDuplicateNodeLabelIds", () => {
    test("Identifies duplicated node labels", () => {
      const schema = readFile(
        path.resolve(__dirname, "./test-schemas/duplicated-nodeLabel-ids.json")
      );
      const schemaJson = JSON.parse(schema) as RootSchemaJsonStruct;

      assert.strictEqual(
        hasDuplicateNodeLabelIds(
          schemaJson.graphSchemaRepresentation.graphSchema
        ),
        true
      );
    });
  });
  describe("hasDuplicateNodeObjectTypeIds", () => {
    test("Identifies duplicated node object types", () => {
      const schema = readFile(
        path.resolve(
          __dirname,
          "./test-schemas/duplicated-nodeObjectType-ids.json"
        )
      );
      const schemaJson = JSON.parse(schema) as RootSchemaJsonStruct;

      assert.strictEqual(
        hasDuplicateNodeObjectTypeIds(
          schemaJson.graphSchemaRepresentation.graphSchema
        ),
        true
      );
    });
  });
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
