import { describe, it, expect, beforeAll } from "vitest";

const Ajv = require("ajv");
const fs = require("fs");
const path = require("path");

describe("json-schema description support", () => {
  let schema;
  let ajv;

  beforeAll(() => {
    const schemaPath = path.join(__dirname, "./json-schema.json");
    schema = JSON.parse(fs.readFileSync(schemaPath, "utf-8"));
    ajv = new Ajv({ allErrors: true, strict: false });
  });

  const baseGraphSchema = ({
    propertyDescription,
    nodeObjectTypeDescription,
    relationshipObjectTypeDescription,
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
                ...(propertyDescription !== undefined
                  ? { description: propertyDescription }
                  : {}),
              },
            ],
          },
        ],
        relationshipTypes: [
          {
            $id: "rt:REL",
            token: "REL",
            properties: [],
          },
        ],
        nodeObjectTypes: [
          {
            $id: "n:Node",
            labels: [{ $ref: "#nl:Node" }],
            ...(nodeObjectTypeDescription !== undefined
              ? { description: nodeObjectTypeDescription }
              : {}),
          },
        ],
        relationshipObjectTypes: [
          {
            $id: "r:REL",
            type: { $ref: "#rt:REL" },
            from: { $ref: "#n:Node" },
            to: { $ref: "#n:Node" },
            ...(relationshipObjectTypeDescription !== undefined
              ? { description: relationshipObjectTypeDescription }
              : {}),
          },
        ],
        constraints: [],
        indexes: [],
      },
    },
  });

  it("accepts a property with a description", () => {
    const data = baseGraphSchema({ propertyDescription: "The node's name" });
    const validate = ajv.compile(schema);
    expect(validate(data)).toBe(true);
  });

  it("accepts a node object type with a description", () => {
    const data = baseGraphSchema({
      nodeObjectTypeDescription: "A node object type",
    });
    const validate = ajv.compile(schema);
    expect(validate(data)).toBe(true);
  });

  it("accepts a relationship object type with a description", () => {
    const data = baseGraphSchema({
      relationshipObjectTypeDescription: "A relationship object type",
    });
    const validate = ajv.compile(schema);
    expect(validate(data)).toBe(true);
  });

  it("still accepts schemas without any description", () => {
    const data = baseGraphSchema();
    const validate = ajv.compile(schema);
    expect(validate(data)).toBe(true);
  });

  it("rejects a non-string description on a property", () => {
    const data = baseGraphSchema({ propertyDescription: 123 });
    const validate = ajv.compile(schema);
    expect(validate(data)).toBe(false);
  });
});
