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

// Happy path == schemas we expect to pass
describe("Full graph schema tests happy path tests", () => {
  test("Full graph schema test", () => {
    const minimalGraphSchema = readFile(
      path.resolve(__dirname, "./test-schemas/full.json")
    );
    const valid = validateSchema(JSON_SCHEMA, minimalGraphSchema);
    assert.strictEqual(valid, true);
  });
});
