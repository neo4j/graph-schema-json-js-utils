import { strict as assert } from "node:assert";
import { fileURLToPath } from "url";
import path from "path";
import { readFile } from "../fs.utils.js";
import { describe, test } from "vitest";
import { model } from "../../src";

const __dirname = path.dirname(fileURLToPath(new URL(import.meta.url)));

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
      parsed.graphSchema.nodeObjectTypes[1].properties.length,
      3
    );
    assert.strictEqual(
      parsed.graphSchema.nodeObjectTypes[1].properties[0].mandatory,
      false
    );
    assert.strictEqual(
      parsed.graphSchema.nodeObjectTypes[0].labels[0].$id,
      "nl:Person"
    );
    assert.strictEqual(
      parsed.graphSchema.nodeObjectTypes[0].labels[0].token,
      "Person"
    );
    // handles array of types
    assert.deepEqual(
      // the map here is just to make it a plain object to pass the comparison
      parsed.graphSchema.nodeObjectTypes[0].properties[0].type.map((pbt) => ({
        ...pbt,
      })),
      rawParsed.graphSchemaRepresentation.graphSchema.nodeObjectTypes[0]
        .properties[0].type
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
      parsed.graphSchema.relationshipObjectTypes[0].properties[0].type.type,
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
});
