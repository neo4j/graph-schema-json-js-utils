import { strict as assert } from "node:assert";
import path from "path";
import { readFile } from "../../../test/fs.utils.js";
import { describe, expect, test } from "vitest";
import { validateSchema } from "../../index.js";
import { createRequire } from "module";
import { fromJson, toJson } from "./index.js";
import * as model from "../../model/index.js";

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

  test("Serializes vector property correctly", () => {
    const nodeLabel = new model.NodeLabel("nl:VecTest", "VecTest", [
      new model.Property(
        "p:VecTest.vecProp",
        "vecProp",
        new model.VectorPropertyType(new model.VectorElementType("float"), 4),
        false
      )
    ]);
    const nodeObjectType = new model.NodeObjectType("n:VecTest", [nodeLabel]);
    const graphSchema = new model.GraphSchema([nodeObjectType], []);
    const serialized = toJson(graphSchema);
    const parsed = JSON.parse(serialized);
    const prop = parsed.graphSchemaRepresentation.graphSchema.nodeLabels[0].properties[0];
    expect(prop).toMatchObject({
      token: "vecProp",
      type: {
        type: "vector",
        items: { type: "float" },
        dimension: 4
      },
      nullable: false
    });
  });

  test("Vector property round-trip parse/serialize", () => {
    const schema = JSON.stringify({
      graphSchemaRepresentation: {
        graphSchema: {
          nodeLabels: [
            {
              token: "VecLabel",
              $id: "nl:VecLabel",
              properties: [
                {
                  token: "vec",
                  $id: "p:VecLabel.vec",
                  type: {
                    type: "vector",
                    items: { type: "float" },
                    dimension: 2
                  },
                  nullable: false
                }
              ]
            }
          ],
          relationshipTypes: [],
          nodeObjectTypes: [
            {
              $id: "n:VecLabel",
              labels: [{ $ref: "#nl:VecLabel" }]
            }
          ],
          relationshipObjectTypes: [],
          constraints: [],
          indexes: []
        }
      }
    });
    const parsed = fromJson(schema);
    const serialized = toJson(parsed);
    const parsedObj = JSON.parse(serialized);
    const originalObj = JSON.parse(schema);
    expect(parsedObj.graphSchemaRepresentation.graphSchema)
      .toEqual(originalObj.graphSchemaRepresentation.graphSchema);
  });

  test("Serializes vector property without dimension", () => {
    const nodeLabel = new model.NodeLabel("nl:VecTestNoDim", "VecTestNoDim", [
      new model.Property(
        "p:VecTestNoDim.vecProp",
        "vecProp",
        new model.VectorPropertyType(new model.VectorElementType("float")),
        false
      )
    ]);
    const nodeObjectType = new model.NodeObjectType("n:VecTestNoDim", [nodeLabel]);
    const graphSchema = new model.GraphSchema([nodeObjectType], []);
    const serialized = toJson(graphSchema);
    const parsed = JSON.parse(serialized);
    const prop = parsed.graphSchemaRepresentation.graphSchema.nodeLabels[0].properties[0];
    expect(prop).toMatchObject({
      token: "vecProp",
      type: {
        type: "vector",
        items: { type: "float" }
        // dimension should not be present
      },
      nullable: false
    });
    expect(prop.type.dimension).toBeUndefined();
  });

  test("Serializes vector property with dimension null/undefined", () => {
    const nodeLabel = new model.NodeLabel("nl:VecTestNullDim", "VecTestNullDim", [
      new model.Property(
        "p:VecTestNullDim.vecProp",
        "vecProp",
        new model.VectorPropertyType(new model.VectorElementType("float"), undefined),
        false
      )
    ]);
    const nodeObjectType = new model.NodeObjectType("n:VecTestNullDim", [nodeLabel]);
    const graphSchema = new model.GraphSchema([nodeObjectType], []);
    const serialized = toJson(graphSchema);
    const parsed = JSON.parse(serialized);
    const prop = parsed.graphSchemaRepresentation.graphSchema.nodeLabels[0].properties[0];
    expect(prop.type.dimension).toBeUndefined();
  });

  test("Serializes vector<float32> property correctly", () => {
    const nodeLabel = new model.NodeLabel("nl:VecFloat32Test", "VecFloat32Test", [
      new model.Property(
        "p:VecFloat32Test.vecProp",
        "vecProp",
        new model.VectorPropertyType(new model.VectorElementType("float32"), 128),
        false
      )
    ]);
    const nodeObjectType = new model.NodeObjectType("n:VecFloat32Test", [nodeLabel]);
    const graphSchema = new model.GraphSchema([nodeObjectType], []);
    const serialized = toJson(graphSchema);
    const parsed = JSON.parse(serialized);
    const prop = parsed.graphSchemaRepresentation.graphSchema.nodeLabels[0].properties[0];
    expect(prop).toMatchObject({
      token: "vecProp",
      type: {
        type: "vector",
        items: { type: "float32" },
        dimension: 128
      },
      nullable: false
    });
  });

  test("Serializes vector<integer8> property correctly", () => {
    // ARRANGE
    const nodeLabel = new model.NodeLabel("nl:VecInteger8Test", "VecInteger8Test", [
      new model.Property(
        "p:VecInteger8Test.vecProp",
        "vecProp",
        new model.VectorPropertyType(new model.VectorElementType("integer8"), 128),
        false
      )
    ]);
    const nodeObjectType = new model.NodeObjectType("n:VecInteger8Test", [nodeLabel]);
    const graphSchema = new model.GraphSchema([nodeObjectType], []);
    // ACT
    const serialized = toJson(graphSchema);
    const parsed = JSON.parse(serialized);
    const prop = parsed.graphSchemaRepresentation.graphSchema.nodeLabels[0].properties[0];
    // ASSERT
    expect(prop).toMatchObject({
      token: "vecProp",
      type: {
        type: "vector",
        items: { type: "integer8" },
        dimension: 128
      },
      nullable: false
    });
  });

  test("Serializes vector<integer16> property correctly", () => {
    // ARRANGE
    const nodeLabel = new model.NodeLabel("nl:VecInteger16Test", "VecInteger16Test", [
      new model.Property(
        "p:VecInteger16Test.vecProp",
        "vecProp",
        new model.VectorPropertyType(new model.VectorElementType("integer16"), 128),
        false
      )
    ]);
    const nodeObjectType = new model.NodeObjectType("n:VecInteger16Test", [nodeLabel]);
    const graphSchema = new model.GraphSchema([nodeObjectType], []);
    // ACT
    const serialized = toJson(graphSchema);
    const parsed = JSON.parse(serialized);
    const prop = parsed.graphSchemaRepresentation.graphSchema.nodeLabels[0].properties[0];
    // ASSERT
    expect(prop).toMatchObject({
      token: "vecProp",
      type: {
        type: "vector",
        items: { type: "integer16" },
        dimension: 128
      },
      nullable: false
    });
  });
});
