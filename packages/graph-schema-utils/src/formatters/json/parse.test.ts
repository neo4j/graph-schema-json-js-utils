import { strict as assert } from "node:assert";
import path from "path";
import { readFile } from "../../../test/fs.utils.js";
import { describe, test } from "vitest";
import { fromJson } from "./index.js";
import {
  PrimitiveArrayPropertyType,
  PrimitivePropertyType,
} from "../../model/index.js";

import { validateSchema } from "../../validation.js";

const JSON_SCHEMA = JSON.stringify(
  require("@neo4j/graph-json-schema/json-schema.json")
);

describe("Parser tests", () => {
  const fullSchema = readFile(
    path.resolve(__dirname, "./test-schemas/full.json")
  );

  test("Make sure full.json is valid", () => {
    assert.doesNotThrow(() => validateSchema(JSON_SCHEMA, fullSchema));
  });

  test("Can parse a graph schema and bind references", () => {
    const parsed = fromJson(fullSchema);

    // root fields
    assert.strictEqual(parsed.nodeLabels.length, 4);
    assert.strictEqual(parsed.relationshipTypes.length, 2);
    assert.strictEqual(parsed.nodeObjectTypes.length, 3);
    assert.strictEqual(parsed.relationshipObjectTypes.length, 2);

    // node object types, connected to node labels
    assert.strictEqual(parsed.nodeObjectTypes[0].labels[1].$id, "nl:Person");
    assert.strictEqual(parsed.nodeObjectTypes[1].labels[1].token, "Person");

    // relationship object types, connected to relationship types and from/to nodes -> label
    assert.strictEqual(
      parsed.relationshipObjectTypes[0].type.$id,
      "rt:ACTED_IN"
    );
    assert.strictEqual(
      parsed.relationshipObjectTypes[0].from.labels[0],
      parsed.nodeObjectTypes[0].labels[0]
    );
    assert.strictEqual(
      parsed.relationshipObjectTypes[0].from.labels[0],
      parsed.nodeLabels[0]
    );
    assert.strictEqual(
      parsed.relationshipObjectTypes[0].to.labels[0],
      parsed.nodeObjectTypes[2].labels[0]
    );
    assert.strictEqual(
      parsed.relationshipObjectTypes[0].to.labels[0],
      parsed.nodeLabels[3]
    );

    // Node labels connected to properties
    assert.strictEqual(parsed.nodeLabels[1].properties.length, 3);
    assert.strictEqual(parsed.nodeLabels[1].properties[0].nullable, false);

    // Relationship types connected to properties
    assert.strictEqual(parsed.relationshipTypes[0].properties.length, 1);
    assert.strictEqual(
      parsed.relationshipTypes[0].properties[0].token,
      "roles"
    );
    assert.strictEqual(
      (
        parsed.relationshipTypes[0].properties[0].type as
          | PrimitivePropertyType
          | PrimitiveArrayPropertyType
      ).type,
      "array"
    );
  });

  test("throws if label referece is not found", () => {
    const schema = JSON.parse(fullSchema);
    schema.graphSchemaRepresentation.graphSchema.nodeObjectTypes[0].labels[0].$ref =
      "NON_EXISTING_LABEL";
    assert.throws(() => {
      fromJson(JSON.stringify(schema));
    }, new Error("Not all label references are defined"));
  });

  test("throws if type referece is not found", () => {
    const schema = JSON.parse(fullSchema);
    schema.graphSchemaRepresentation.graphSchema.relationshipObjectTypes[0].type.$ref =
      "NON_EXISTING_TYPE";
    assert.throws(() => {
      fromJson(JSON.stringify(schema));
    }, new Error("Not all relationship type references are defined"));
  });

  test("throws if from referece is not found", () => {
    const schema = JSON.parse(fullSchema);
    schema.graphSchemaRepresentation.graphSchema.relationshipObjectTypes[0].from.$ref =
      "NON_EXISTING_NODE";
    assert.throws(() => {
      fromJson(JSON.stringify(schema));
    }, new Error("Not all node object type references in from are defined"));
  });

  test("throws if to referece is not found", () => {
    const schema = JSON.parse(fullSchema);
    schema.graphSchemaRepresentation.graphSchema.relationshipObjectTypes[0].to.$ref =
      "NON_EXISTING_NODE";
    assert.throws(() => {
      fromJson(JSON.stringify(schema));
    }, new Error("Not all node object type references in to are defined"));
  });

  test("parses vector structure", () => {
    const schema = JSON.stringify({
      graphSchemaRepresentation: {
        graphSchema: {
          nodeLabels: [
            {
              token: "TestLabel",
              $id: "nl:TestLabel",
              properties: [
                {
                  token: "vecna",
                  $id: "p:TestLabel.vec",
                  type: {
                    type: "vector",
                    items: { type: "float" },
                    dimension: 3,
                  },
                  nullable: false
                },
              ],
            },
            {
              token: "OtherLabel",
              $id: "nl:OtherLabel",
              properties: [],
            },
          ],
          relationshipTypes: [],
          nodeObjectTypes: [
            {
              $id: "n:TestLabel",
              labels: [{ $ref: "#nl:TestLabel" }]
            },
            {
              $id: "n:OtherLabel",
              labels: [{ $ref: "#nl:OtherLabel" }]
            }
          ],
          relationshipObjectTypes: [],
          constraints: [],
          indexes: [],
        },
      },
    });
    const parsed = fromJson(schema);
    assert.ok(parsed.nodeLabels[0]);
    assert.ok(Array.isArray(parsed.nodeLabels[0].properties));
    assert.ok(parsed.nodeLabels[0].properties.length > 0);
    const vecProp = parsed.nodeLabels[0].properties[0];
    assert.strictEqual(vecProp.token, "vecna");
    const vecType = vecProp.type as any;
    assert.ok(vecType.type === "vector");
    assert.strictEqual(vecType.dimension, 3);
    assert.strictEqual(vecType.items.type, "float");
  });

  test("Parses vector property without dimension", () => {
    const schema = JSON.stringify({
      graphSchemaRepresentation: {
        graphSchema: {
          nodeLabels: [
            {
              token: "VecLabelNoDim",
              $id: "nl:VecLabelNoDim",
              properties: [
                {
                  token: "vec",
                  $id: "p:VecLabelNoDim.vec",
                  type: {
                    type: "vector",
                    items: { type: "float" }
                    // dimension omitted
                  },
                  nullable: false
                }
              ]
            }
          ],
          relationshipTypes: [],
          nodeObjectTypes: [
            {
              $id: "n:VecLabelNoDim",
              labels: [{ $ref: "#nl:VecLabelNoDim" }]
            }
          ],
          relationshipObjectTypes: [],
          constraints: [],
          indexes: []
        }
      }
    });
    const parsed = fromJson(schema);
    assert.ok(parsed.nodeLabels[0]);
    assert.ok(Array.isArray(parsed.nodeLabels[0].properties));
    assert.ok(parsed.nodeLabels[0].properties.length > 0);
    const vecProp = parsed.nodeLabels[0].properties[0];
    assert.strictEqual(vecProp.token, "vec");
    const vecType = vecProp.type as any;
    assert.ok(vecType.type === "vector");
    assert.strictEqual(vecType.dimension, undefined);
    assert.strictEqual(vecType.items.type, "float");
  });

  test("Parses vector<float32> property", () => {
    const schema = JSON.stringify({
      graphSchemaRepresentation: {
        graphSchema: {
          nodeLabels: [
            {
              token: "VecFloat32Label",
              $id: "nl:VecFloat32Label",
              properties: [
                {
                  token: "embedding",
                  $id: "p:VecFloat32Label.embedding",
                  type: {
                    type: "vector",
                    items: { type: "float32" },
                    dimension: 256
                  },
                  nullable: false
                }
              ]
            }
          ],
          relationshipTypes: [],
          nodeObjectTypes: [
            {
              $id: "n:VecFloat32Label",
              labels: [{ $ref: "#nl:VecFloat32Label" }]
            }
          ],
          relationshipObjectTypes: [],
          constraints: [],
          indexes: []
        }
      }
    });
    const parsed = fromJson(schema);
    assert.ok(parsed.nodeLabels[0]);
    const vecProp = parsed.nodeLabels[0].properties[0];
    assert.strictEqual(vecProp.token, "embedding");
    const vecType = vecProp.type as any;
    assert.strictEqual(vecType.type, "vector");
    assert.strictEqual(vecType.items.type, "float32");
    assert.strictEqual(vecType.dimension, 256);
  });
});
