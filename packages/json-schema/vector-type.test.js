import { describe, it, expect, beforeAll } from 'vitest';

const Ajv = require("ajv");
const fs = require("fs");
const path = require("path");

describe("json-schema vector type support", () => {
  let schema;
  let ajv;

  beforeAll(() => {
    const schemaPath = path.join(__dirname, "./json-schema.json");
    schema = JSON.parse(fs.readFileSync(schemaPath, "utf-8"));
    ajv = new Ajv({ allErrors: true, strict: false });
  });

  it("accepts a valid vector property", () => {
    const data = {
      graphSchemaRepresentation: {
        version: "1.0.0",
        graphSchema: {
          nodeLabels: [
            {
              $id: "n1",
              token: "Node",
              properties: [
                {
                  $id: "embedding-id",
                  token: "embedding",
                  type: {
                    type: "vector",
                    items: { type: "float" },
                    dimension: 128
                  },
                  nullable: false
                }
              ]
            }
          ],
          relationshipTypes: [],
          nodeObjectTypes: [],
          relationshipObjectTypes: [],
          constraints: [],
          indexes: []
        }
      }
    };
    const validate = ajv.compile(schema);
    expect(validate(data)).toBe(true);
  });

  it("accepts a valid array property (control)", () => {
    const data = {
      graphSchemaRepresentation: {
        version: "1.0.0",
        graphSchema: {
          nodeLabels: [
            {
              $id: "n1",
              token: "Node",
              properties: [
                {
                  $id: "tags-id",
                  token: "tags",
                  type: {
                    type: "array",
                    items: { type: "string" }
                  },
                  nullable: false
                }
              ]
            }
          ],
          relationshipTypes: [],
          nodeObjectTypes: [],
          relationshipObjectTypes: [],
          constraints: [],
          indexes: []
        }
      }
    };
    const validate = ajv.compile(schema);
    expect(validate(data)).toBe(true);
  });

  it("rejects an invalid vector property (missing dimension)", () => {
    const data = {
      graphSchemaRepresentation: {
        version: "1.0.0",
        graphSchema: {
          nodeLabels: [
            {
              $id: "n1",
              token: "Node",
              properties: [
                {
                  token: "embedding",
                  type: {
                    type: "vector",
                    items: { type: "float" }
                    // missing dimension
                  },
                  nullable: false
                }
              ]
            }
          ],
          relationshipTypes: [],
          nodeObjectTypes: [],
          relationshipObjectTypes: [],
          constraints: [],
          indexes: []
        }
      }
    };
    const validate = ajv.compile(schema);
    expect(validate(data)).toBe(false);
  });

  it("rejects an unsupported type", () => {
    const data = {
      graphSchemaRepresentation: {
        version: "1.0.0",
        graphSchema: {
          nodeLabels: [
            {
              $id: "n1",
              token: "Node",
              properties: [
                {
                  token: "foo",
                  type: {
                    type: "unsupportedType"
                  },
                  nullable: false
                }
              ]
            }
          ],
          relationshipTypes: [],
          nodeObjectTypes: [],
          relationshipObjectTypes: [],
          constraints: [],
          indexes: []
        }
      }
    };
    const validate = ajv.compile(schema);
    expect(validate(data)).toBe(false);
  });

  it("requires PropertyTypesVector to be in the oneOf for type to allow vector properties", () => {
    // This test will fail if PropertyTypesVector is not included in the oneOf for type in PropertyTypesArrayObject
    const data = {
      graphSchemaRepresentation: {
        version: "1.0.0",
        graphSchema: {
          nodeLabels: [
            {
              $id: "n1",
              token: "Node",
              properties: [
                {
                  $id: "embedding-id",
                  token: "embedding",
                  type: {
                    type: "vector",
                    items: { type: "float" },
                    dimension: 128
                  },
                  nullable: false
                }
              ]
            }
          ],
          relationshipTypes: [],
          nodeObjectTypes: [],
          relationshipObjectTypes: [],
          constraints: [],
          indexes: []
        }
      }
    };
    const validate = ajv.compile(schema);
    expect(validate(data)).toBe(true);
  });

  it("accepts a valid vector property using PropertyTypesVectorObject (defensive)", () => {
    const data = {
      graphSchemaRepresentation: {
        version: "1.0.0",
        graphSchema: {
          nodeLabels: [
            {
              $id: "n1",
              token: "Node",
              properties: [
                // This property matches PropertyTypesVectorObject exactly
                {
                  $id: "embedding-id",
                  token: "embedding",
                  type: {
                    type: "vector",
                    items: { type: "float" },
                    dimension: 128
                  },
                  nullable: false
                }
              ]
            }
          ],
          relationshipTypes: [],
          nodeObjectTypes: [],
          relationshipObjectTypes: [],
          constraints: [],
          indexes: []
        }
      }
    };
    const validate = ajv.compile(schema);
    expect(validate(data)).toBe(true);
  });
});
