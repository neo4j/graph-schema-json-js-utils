import { strict as assert } from "node:assert";
import path from "path";
import { validateSchema } from "../../src/index.ts";
import { readFile } from "../fs.utils.js";
import { describe, test } from "vitest";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const JSON_SCHEMA = JSON.stringify(
  require("@neo4j/graph-json-schema/json-schema.json")
);

describe("Props", () => {
  test("New pros", () => {
    const dbSchema = readFile(
      path.resolve(__dirname, "./test-schemas/new-properties-format.json")
    );
    const valid = validateSchema(JSON_SCHEMA, dbSchema);
    assert.strictEqual(valid, true);
  });
});
