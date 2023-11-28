import { strict as assert } from "node:assert";
import path from "path";
import { readFile } from "../../../test/fs.utils.js";
import { describe, expect, test } from "vitest";
import { validateSchema } from "../../index.js";
import { createRequire } from "module";
import { fromJson, toJson } from "./index.js";

const require = createRequire(import.meta.url);
const JSON_SCHEMA = JSON.stringify(
  require("@neo4j/graph-json-schema/json-schema.json")
);

describe("Serializer tests", () => {
  const fullSchema = readFile(
    path.resolve(__dirname, "./test-schemas/full.json")
  );

  test("Serialized schema can be validated", () => {
    const parsed = fromJson(fullSchema);
    const serialized = toJson(parsed);
    const validation = validateSchema(JSON_SCHEMA, serialized);
    assert.strictEqual(validation, true);
  });

  test("Serialized schema matches snapshot", () => {
    const parsed = fromJson(fullSchema);
    const serialized = toJson(parsed, 2);
    expect(serialized).toMatchFileSnapshot(
      "./__snapshots__/serialized-full.json"
    );
  });

  test("Can parse a graph schema and serialize it to be the same string", () => {
    const parsed = fromJson(fullSchema);
    const serialized = toJson(parsed);
    assert.deepEqual(JSON.parse(serialized), JSON.parse(fullSchema));
  });

  test("Throws if label refs aren't connected", () => {
    const parsed = fromJson(fullSchema);
    // @ts-expect-error
    parsed.nodeObjectTypes[0].labels[0] = undefined;
    assert.throws(
      () => toJson(parsed),
      new Error(`Not all labels are defined`)
    );
  });

  test("Throws if type ref aren't connected", () => {
    const parsed = fromJson(fullSchema);
    // @ts-expect-error
    parsed.relationshipObjectTypes[0].type = undefined;
    assert.throws(
      () => toJson(parsed),
      new Error("RelationshipObjectType.type is not defined")
    );
  });

  test("Throws if from ref aren't connected", () => {
    const parsed = fromJson(fullSchema);
    // @ts-expect-error
    parsed.relationshipObjectTypes[0].from = undefined;
    assert.throws(
      () => toJson(parsed),
      new Error("NodeObjectType is not defined")
    );
  });

  test("Throws if to ref aren't connected", () => {
    const parsed = fromJson(fullSchema);
    // @ts-expect-error
    parsed.relationshipObjectTypes[0].to = undefined;
    assert.throws(
      () => toJson(parsed),
      new Error("NodeObjectType is not defined")
    );
  });
});
