import { describe, it, expect, beforeAll } from "vitest";

const Ajv = require("ajv");
const fs = require("fs");
const path = require("path");

describe("json-schema reference support", () => {
  let validate;

  beforeAll(() => {
    const schemaPath = path.join(__dirname, "./json-schema.json");
    const schema = JSON.parse(fs.readFileSync(schemaPath, "utf-8"));
    validate = new Ajv({ allErrors: true, strict: false }).compile(schema);
  });

  const baseGraphSchema = ({
    nodeProperty = {},
    relationshipProperty = {},
    vectorProperty = {},
    nodeObjectType = {},
    relationshipObjectType = {},
  } = {}) => ({
    graphSchemaRepresentation: {
      version: "1.0.0",
      graphSchema: {
        nodeLabels: [
          {
            $id: "nl:Node",
            token: "Node",
            properties: [
              {
                $id: "p:Node.name",
                token: "name",
                type: { type: "string" },
                nullable: false,
                ...nodeProperty,
              },
              {
                $id: "p:Node.embedding",
                token: "embedding",
                type: { type: "vector", items: { type: "float" }, dimension: 3 },
                nullable: false,
                ...vectorProperty,
              },
            ],
          },
        ],
        relationshipTypes: [
          {
            $id: "rt:REL",
            token: "REL",
            properties: [
              {
                $id: "p:REL.tags",
                token: "tags",
                type: { type: "array", items: { type: "string" } },
                nullable: false,
                ...relationshipProperty,
              },
            ],
          },
        ],
        nodeObjectTypes: [
          { $id: "n:Node", labels: [{ $ref: "#nl:Node" }], ...nodeObjectType },
        ],
        relationshipObjectTypes: [
          {
            $id: "r:REL",
            type: { $ref: "#rt:REL" },
            from: { $ref: "#n:Node" },
            to: { $ref: "#n:Node" },
            ...relationshipObjectType,
          },
        ],
        constraints: [],
        indexes: [],
      },
    },
  });

  const reference = { reference: "https://example.com/definition" };

  it("accepts reference on a node property", () => {
    expect(validate(baseGraphSchema({ nodeProperty: reference }))).toBe(true);
  });

  it("accepts reference on an array property", () => {
    expect(
      validate(baseGraphSchema({ relationshipProperty: reference }))
    ).toBe(true);
  });

  it("accepts reference on a vector property", () => {
    expect(validate(baseGraphSchema({ vectorProperty: reference }))).toBe(true);
  });

  it("accepts reference on node and relationship object types", () => {
    expect(
      validate(
        baseGraphSchema({
          nodeObjectType: reference,
          relationshipObjectType: reference,
        })
      )
    ).toBe(true);
  });

  it("rejects a non-string reference", () => {
    expect(
      validate(baseGraphSchema({ nodeProperty: { reference: 123 } }))
    ).toBe(false);
    expect(
      validate(baseGraphSchema({ nodeObjectType: { reference: ["x"] } }))
    ).toBe(false);
    expect(
      validate(baseGraphSchema({ relationshipObjectType: { reference: 1 } }))
    ).toBe(false);
  });
});
