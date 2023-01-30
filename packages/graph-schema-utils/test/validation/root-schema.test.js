import { strict as assert } from "node:assert";
import { fileURLToPath } from "url";
import path from "path";
import { SchemaValidationError, validateSchema } from "../../src/index.js";
import { readFile } from "../fs.utils.js";
import { describe, test } from "vitest";

const __dirname = path.dirname(fileURLToPath(new URL(import.meta.url)));
const JSON_SCHEMA_FILE = path.resolve(
  __dirname,
  "../../../json-schema/json-schema.json"
);
const JSON_SCHEMA = readFile(JSON_SCHEMA_FILE);

// Validate root schema, allowing root schema.
describe("Validate that root schema is allowed ", () => {
  test("Validates root schema", () => {
    const allowRootSchema = readFile(
      path.resolve(__dirname, "./test-schemas/allowing-root-schema-field.json")
    );

    const valid = validateSchema(JSON_SCHEMA, allowRootSchema);
    assert.strictEqual(valid, true);

  });
});
