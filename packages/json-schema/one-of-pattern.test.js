import { describe, it, expect, beforeAll } from "vitest";

const Ajv = require("ajv");
const fs = require("fs");
const path = require("path");

describe("json-schema pattern and one_of support", () => {
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
        nodeObjectTypes: [{ $id: "n:Node", labels: [{ $ref: "#nl:Node" }] }],
        relationshipObjectTypes: [
          {
            $id: "r:REL",
            type: { $ref: "#rt:REL" },
            from: { $ref: "#n:Node" },
            to: { $ref: "#n:Node" },
          },
        ],
        constraints: [],
        indexes: [],
      },
    },
  });

  const fields = { pattern: "^[A-Z]+$", one_of: ["A", "B"] };

  it("accepts pattern and one_of on a node property", () => {
    expect(validate(baseGraphSchema({ nodeProperty: fields }))).toBe(true);
  });

  it("accepts pattern and one_of on an array property", () => {
    expect(validate(baseGraphSchema({ relationshipProperty: fields }))).toBe(
      true
    );
  });

  it("accepts pattern and one_of on a vector property", () => {
    expect(validate(baseGraphSchema({ vectorProperty: fields }))).toBe(true);
  });

  it("accepts an empty one_of array", () => {
    expect(validate(baseGraphSchema({ nodeProperty: { one_of: [] } }))).toBe(
      true
    );
  });

  it("rejects a non-string pattern", () => {
    expect(validate(baseGraphSchema({ nodeProperty: { pattern: 123 } }))).toBe(
      false
    );
  });

  it("rejects a non-array one_of", () => {
    expect(
      validate(baseGraphSchema({ relationshipProperty: { one_of: "A" } }))
    ).toBe(false);
  });

  it("rejects a non-string item in one_of", () => {
    expect(
      validate(baseGraphSchema({ nodeProperty: { one_of: ["A", 1] } }))
    ).toBe(false);
  });

  it("rejects camelCase oneOf", () => {
    expect(validate(baseGraphSchema({ nodeProperty: { oneOf: ["A"] } }))).toBe(
      false
    );
  });
});
