import { describe, it, expect, beforeAll } from "vitest";

const Ajv = require("ajv");
const fs = require("fs");
const path = require("path");

describe("json-schema relationship end cardinality", () => {
  let schema;
  let ajv;

  beforeAll(() => {
    const schemaPath = path.join(__dirname, "./json-schema.json");
    schema = JSON.parse(fs.readFileSync(schemaPath, "utf-8"));
    ajv = new Ajv({ allErrors: true, strict: false });
  });

  const baseGraphSchema = ({ from, to } = {}) => ({
    graphSchemaRepresentation: {
      version: "1.0.0",
      graphSchema: {
        nodeLabels: [
          {
            $id: "nl:Node",
            token: "Node",
            properties: [],
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
          },
        ],
        relationshipObjectTypes: [
          {
            $id: "r:REL",
            type: { $ref: "#rt:REL" },
            from: from ?? { $ref: "#n:Node" },
            to: to ?? { $ref: "#n:Node" },
          },
        ],
        constraints: [],
        indexes: [],
      },
    },
  });

  it("accepts relationship ends without cardinality", () => {
    const validate = ajv.compile(schema);
    expect(validate(baseGraphSchema())).toBe(true);
  });

  it("accepts an exact count", () => {
    const validate = ajv.compile(schema);
    expect(
      validate(
        baseGraphSchema({
          from: { $ref: "#n:Node", count: 1 },
        })
      )
    ).toBe(true);
  });

  it("accepts minCount and maxCount", () => {
    const validate = ajv.compile(schema);
    expect(
      validate(
        baseGraphSchema({
          to: { $ref: "#n:Node", minCount: 0, maxCount: 5 },
        })
      )
    ).toBe(true);
  });

  it("accepts count together with minCount and maxCount", () => {
    const validate = ajv.compile(schema);
    expect(
      validate(
        baseGraphSchema({
          from: { $ref: "#n:Node", count: 2, minCount: 2, maxCount: 2 },
        })
      )
    ).toBe(true);
  });

  it("rejects a negative count", () => {
    const validate = ajv.compile(schema);
    expect(
      validate(
        baseGraphSchema({
          from: { $ref: "#n:Node", count: -1 },
        })
      )
    ).toBe(false);
  });

  it("rejects a non-integer count", () => {
    const validate = ajv.compile(schema);
    expect(
      validate(
        baseGraphSchema({
          from: { $ref: "#n:Node", count: 1.5 },
        })
      )
    ).toBe(false);
  });

  it("rejects a relationship end without $ref", () => {
    const validate = ajv.compile(schema);
    expect(
      validate(
        baseGraphSchema({
          from: { count: 1 },
        })
      )
    ).toBe(false);
  });

  it("rejects unknown properties on a relationship end", () => {
    const validate = ajv.compile(schema);
    expect(
      validate(
        baseGraphSchema({
          from: { $ref: "#n:Node", label: "Node" },
        })
      )
    ).toBe(false);
  });
});
