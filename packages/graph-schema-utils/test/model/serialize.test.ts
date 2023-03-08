import { strict as assert } from "node:assert";
import path from "path";
import { readFile } from "../fs.utils.js";
import { describe, test } from "vitest";
import { model, validateSchema } from "../../src/index.js";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const JSON_SCHEMA = JSON.stringify(
  require("@neo4j/graph-json-schema/json-schema.json")
);

describe("Serializer tests", () => {
  const fullSchema = readFile(
    path.resolve(__dirname, "./test-schemas/full.json")
  );

  test("Serialized schema can be validated", () => {
    const parsed = model.GraphSchemaRepresentation.parseJson(fullSchema);
    const serialized = parsed.toJson();
    const validation = validateSchema(serialized, JSON_SCHEMA);
    assert.strictEqual(validation, true);
  });

  test("Can parse a graph schema and serialize it to be the same", () => {
    const parsed = model.GraphSchemaRepresentation.parseJson(fullSchema);
    const serialized = parsed.toJson();
    assert.deepEqual(JSON.parse(serialized), JSON.parse(fullSchema));
  });

  test("Throws if label refs aren't connected", () => {
    const parsed = model.GraphSchemaRepresentation.parseJson(fullSchema);
    parsed.graphSchema.nodeObjectTypes[0].labels[0] = undefined;
    assert.throws(
      () => parsed.toJson(),
      new Error("Not all labels are defined")
    );
  });

  test("Throws if type ref aren't connected", () => {
    const parsed = model.GraphSchemaRepresentation.parseJson(fullSchema);
    parsed.graphSchema.relationshipObjectTypes[0].type = undefined;
    assert.throws(
      () => parsed.toJson(),
      new Error("RelationshipObjectType.type is not defined")
    );
  });

  test("Throws if from ref aren't connected", () => {
    const parsed = model.GraphSchemaRepresentation.parseJson(fullSchema);
    parsed.graphSchema.relationshipObjectTypes[0].from = undefined;
    assert.throws(
      () => parsed.toJson(),
      new Error("RelationshipObjectType.from is not defined")
    );
  });

  test("Throws if to ref aren't connected", () => {
    const parsed = model.GraphSchemaRepresentation.parseJson(fullSchema);
    parsed.graphSchema.relationshipObjectTypes[0].to = undefined;
    assert.throws(
      () => parsed.toJson(),
      new Error("RelationshipObjectType.to is not defined")
    );
  });
});
