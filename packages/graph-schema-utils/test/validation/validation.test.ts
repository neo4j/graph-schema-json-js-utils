import { strict as assert } from "node:assert";
import path from "path";
import { validateSchema } from "../../src/index.js";
import { readFile } from "../fs.utils.js";
import { describe, test } from "vitest";
import { InputTypeError } from "../../src/validation.js";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const JSON_SCHEMA = JSON.stringify(
  require("@neo4j/graph-json-schema/json-schema.json")
);

describe("Validate if JSON-documen is a string", () => {
  const NON_STRING = 11;
  const NON_JSON = "}";

  test("Identifies if JSON schema is a string and is parseable to JSON", () => {
    const fullSchema = readFile(
      path.resolve(__dirname, "./test-schemas/full.json")
    );
    // @ts-expect-error
    assert.throws(() => validateSchema(NON_STRING, fullSchema), InputTypeError);
    assert.throws(() => validateSchema(NON_JSON, fullSchema), InputTypeError);
  });

  test("Identifies if graph schema is a string and is parseble JSON", () => {
    assert.throws(
      // @ts-expect-error
      () => validateSchema(JSON_SCHEMA, NON_STRING),
      InputTypeError
    );
    assert.throws(() => validateSchema(JSON_SCHEMA, NON_JSON), InputTypeError);
  });
  test("Handles optional id:s on properties", () => {
    const schema = readFile(
      path.resolve(__dirname, "./test-schemas/optional-id.json")
    );
    validateSchema(JSON_SCHEMA, schema);
    assert.doesNotThrow(() => validateSchema(JSON_SCHEMA, schema));
  });
});

describe("Validate no errors in example", () => {
  test("Validates no error in example-graph-schema.json", () => {
    const schema = readFile(
      path.resolve(__dirname, "./test-schemas/example-graph-schema.json")
    );
    validateSchema(JSON_SCHEMA, schema);
    assert.doesNotThrow(() => validateSchema(JSON_SCHEMA, schema));
  });
});
