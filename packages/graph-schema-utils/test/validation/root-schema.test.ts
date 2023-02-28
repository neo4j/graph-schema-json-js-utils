import { strict as assert } from "node:assert";
import path from "path";
import { validateSchema } from "../../src/index";
import { readFile } from "../fs.utils.js";
import { describe, test } from "vitest";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const JSON_SCHEMA = JSON.stringify(
  require("@neo4j/graph-json-schema/json-schema.json")
);

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
