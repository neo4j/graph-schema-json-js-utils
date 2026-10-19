import { describe, it, expect, beforeAll } from "vitest";

const Ajv = require("ajv");
const fs = require("fs");
const path = require("path");

describe("json-schema alias support", () => {
  let schema;
  let ajv;

  beforeAll(() => {
    const schemaPath = path.join(__dirname, "./json-schema.json");
    schema = JSON.parse(fs.readFileSync(schemaPath, "utf-8"));
    ajv = new Ajv({ allErrors: true, strict: false });
  });

  const baseGraphSchema = ({
    nodeObjectTypeAliases,
    relationshipObjectTypeAliases,
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
            ...(nodeObjectTypeAliases !== undefined
              ? { aliases: nodeObjectTypeAliases }
              : {}),
          },
        ],
        relationshipObjectTypes: [
          {
            $id: "r:REL",
            type: { $ref: "#rt:REL" },
            from: { $ref: "#n:Node" },
            to: { $ref: "#n:Node" },
            ...(relationshipObjectTypeAliases !== undefined
              ? { aliases: relationshipObjectTypeAliases }
              : {}),
          },
        ],
        constraints: [],
        indexes: [],
      },
    },
  });

  it("accepts a node object type with aliases", () => {
    const data = baseGraphSchema({
      nodeObjectTypeAliases: ["Person", "Human"],
    });
    const validate = ajv.compile(schema);
    expect(validate(data)).toBe(true);
  });

  it("accepts a relationship object type with aliases", () => {
    const data = baseGraphSchema({
      relationshipObjectTypeAliases: ["KNOWS", "FRIEND_OF"],
    });
    const validate = ajv.compile(schema);
    expect(validate(data)).toBe(true);
  });

  it("accepts an empty aliases array", () => {
    const data = baseGraphSchema({
      nodeObjectTypeAliases: [],
      relationshipObjectTypeAliases: [],
    });
    const validate = ajv.compile(schema);
    expect(validate(data)).toBe(true);
  });

  it("still accepts schemas without any aliases", () => {
    const data = baseGraphSchema();
    const validate = ajv.compile(schema);
    expect(validate(data)).toBe(true);
  });

  it("rejects a non-array aliases on a node object type", () => {
    const data = baseGraphSchema({ nodeObjectTypeAliases: "Person" });
    const validate = ajv.compile(schema);
    expect(validate(data)).toBe(false);
  });

  it("rejects a non-string item in aliases on a node object type", () => {
    const data = baseGraphSchema({ nodeObjectTypeAliases: ["Person", 123] });
    const validate = ajv.compile(schema);
    expect(validate(data)).toBe(false);
  });

  it("rejects a non-array aliases on a relationship object type", () => {
    const data = baseGraphSchema({
      relationshipObjectTypeAliases: "KNOWS",
    });
    const validate = ajv.compile(schema);
    expect(validate(data)).toBe(false);
  });

  it("rejects a non-string item in aliases on a relationship object type", () => {
    const data = baseGraphSchema({
      relationshipObjectTypeAliases: ["KNOWS", true],
    });
    const validate = ajv.compile(schema);
    expect(validate(data)).toBe(false);
  });
});
