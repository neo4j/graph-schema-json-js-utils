import { strict as assert } from "node:assert";
import { fileURLToPath } from "url";
import path from "path";
import { readFile } from "../fs.utils.js";
import { describe, test } from "vitest";
import { model } from "../../src";

const __dirname = path.dirname(fileURLToPath(new URL(import.meta.url)));

describe("Serializer tests", () => {
  test("Can parse a graph schema and serialize it to be the same", () => {
    const fullSchema = readFile(
      path.resolve(__dirname, "./test-schemas/full.json")
    );
    const parsed = model.GraphSchemaRepresentation.parseJson(fullSchema);
    const serialized = parsed.toJson();
    assert.deepEqual(JSON.parse(serialized), JSON.parse(fullSchema));
  });
  test("Throws if label refs aren't connected", () => {
    const brokenSchema = readFile(
      path.resolve(__dirname, "./test-schemas/broken-label.json")
    );
    const parsed = model.GraphSchemaRepresentation.parseJson(brokenSchema);
    assert.throws(
      () => parsed.toJson(),
      new Error("Not all labels are defined")
    );
  });
  test("Throws if type ref aren't connected", () => {
    const brokenSchema = readFile(
      path.resolve(__dirname, "./test-schemas/broken-type.json")
    );
    const parsed = model.GraphSchemaRepresentation.parseJson(brokenSchema);
    assert.throws(
      () => parsed.toJson(),
      new Error("RelationshipObjectType.type is not defined")
    );
  });
  test("Throws if from ref aren't connected", () => {
    const brokenSchema = readFile(
      path.resolve(__dirname, "./test-schemas/broken-from.json")
    );
    const parsed = model.GraphSchemaRepresentation.parseJson(brokenSchema);
    assert.throws(
      () => parsed.toJson(),
      new Error("RelationshipObjectType.from is not defined")
    );
  });
  test("Throws if to ref aren't connected", () => {
    const brokenSchema = readFile(
      path.resolve(__dirname, "./test-schemas/broken-to.json")
    );
    const parsed = model.GraphSchemaRepresentation.parseJson(brokenSchema);
    assert.throws(
      () => parsed.toJson(),
      new Error("RelationshipObjectType.to is not defined")
    );
  });
});
