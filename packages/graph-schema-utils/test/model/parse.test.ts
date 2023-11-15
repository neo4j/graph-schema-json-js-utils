import { strict as assert } from "node:assert";
import path from "path";
import { readFile } from "../fs.utils.js";
import { describe, test } from "vitest";
import { model } from "../../src/index.js";
import { PropertyTypes } from "../../src/model/index.js";

describe("Parser tests", () => {
  const fullSchema = readFile(
    path.resolve(__dirname, "./test-schemas/full.json")
  );
  test("Can parse a graph schema and bind references", () => {
    const rawParsed = JSON.parse(fullSchema);
    const parsed = model.GraphSchemaRepresentation.parseJson(fullSchema);

    // root fields
    assert.strictEqual(parsed.version, "1.0.1");
    assert.strictEqual(parsed.graphSchema.nodeLabels.length, 4);
    assert.strictEqual(parsed.graphSchema.relationshipTypes.length, 2);
    assert.strictEqual(parsed.graphSchema.nodeObjectTypes.length, 3);
    assert.strictEqual(parsed.graphSchema.relationshipObjectTypes.length, 2);

    // node object types, connected to node labels
    assert.strictEqual(
      parsed.graphSchema.nodeObjectTypes[0].labels[1].$id,
      "nl:Person"
    );
    assert.strictEqual(
      parsed.graphSchema.nodeObjectTypes[1].labels[1].token,
      "Person"
    );
    // Node labels, connected to properties
    assert.strictEqual(parsed.graphSchema.nodeLabels[1].properties.length, 3);
    assert.strictEqual(
      parsed.graphSchema.nodeLabels[1].properties[0].nullable,
      false
    );
    // handles array of types
    assert.deepEqual(
      (
        parsed.graphSchema.nodeLabels[0].properties[1].type as PropertyTypes[]
      ).map((pbt) => pbt.toJsonStruct()),
      rawParsed.graphSchemaRepresentation.graphSchema.nodeLabels[0]
        .properties[1].type
    );

    // relationship object types, connected to relationship types and from/to nodes -> label
    assert.strictEqual(
      parsed.graphSchema.relationshipObjectTypes[0].properties.length,
      1
    );
    assert.strictEqual(
      parsed.graphSchema.relationshipObjectTypes[0].properties[0].token,
      "roles"
    );
    assert.strictEqual(
      (
        parsed.graphSchema.relationshipObjectTypes[0].properties[0]
          .type as PropertyTypes
      ).type,
      "array"
    );
    assert.strictEqual(
      parsed.graphSchema.relationshipObjectTypes[0].type.$id,
      "rt:ACTED_IN"
    );
    assert.strictEqual(
      parsed.graphSchema.relationshipObjectTypes[0].from.labels[0],
      parsed.graphSchema.nodeObjectTypes[0].labels[0]
    );
    assert.strictEqual(
      parsed.graphSchema.relationshipObjectTypes[0].from.labels[0],
      parsed.graphSchema.nodeLabels[0]
    );
    assert.strictEqual(
      parsed.graphSchema.relationshipObjectTypes[0].to.labels[0],
      parsed.graphSchema.nodeObjectTypes[2].labels[0]
    );
    assert.strictEqual(
      parsed.graphSchema.relationshipObjectTypes[0].to.labels[0],
      parsed.graphSchema.nodeLabels[3]
    );
  });
  test("throws if label referece is not found", () => {
    const schema = JSON.parse(fullSchema);
    schema.graphSchemaRepresentation.graphSchema.nodeObjectTypes[0].labels[0].$ref =
      "NON_EXISTING_LABEL";
    assert.throws(() => {
      model.GraphSchemaRepresentation.parseJsonStruct(schema);
    }, new Error("Not all label references are defined"));
  });
  test("throws if type referece is not found", () => {
    const schema = JSON.parse(fullSchema);
    schema.graphSchemaRepresentation.graphSchema.relationshipObjectTypes[0].type.$ref =
      "NON_EXISTING_TYPE";
    assert.throws(() => {
      model.GraphSchemaRepresentation.parseJsonStruct(schema);
    }, new Error("Not all relationship type references are defined"));
  });
  test("throws if from referece is not found", () => {
    const schema = JSON.parse(fullSchema);
    schema.graphSchemaRepresentation.graphSchema.relationshipObjectTypes[0].from.$ref =
      "NON_EXISTING_NODE";
    assert.throws(() => {
      model.GraphSchemaRepresentation.parseJsonStruct(schema);
    }, new Error("Not all node object type references in from are defined"));
  });
  test("throws if to referece is not found", () => {
    const schema = JSON.parse(fullSchema);
    schema.graphSchemaRepresentation.graphSchema.relationshipObjectTypes[0].to.$ref =
      "NON_EXISTING_NODE";
    assert.throws(() => {
      model.GraphSchemaRepresentation.parseJsonStruct(schema);
    }, new Error("Not all node object type references in to are defined"));
  });
});
