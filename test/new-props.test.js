import { strict as assert } from "node:assert";
import { fileURLToPath } from "url";
import path from "path";
import { validateSchema } from "../src/index.js";
import { readFile } from "./fs.utils.js";
import { describe, test } from "vitest";

const __dirname = path.dirname(fileURLToPath(new URL(import.meta.url)));
const JSON_SCHEMA_FILE = path.resolve(__dirname, "../json-schema.json");
const JSON_SCHEMA = readFile(JSON_SCHEMA_FILE);

describe("Props", () => {
  test("New pros", () => {
    const dbSchema = readFile(
      path.resolve(__dirname, "./test-schemas/new-properties-format.json")
    );
    const valid = validateSchema(JSON_SCHEMA, dbSchema);
    assert.strictEqual(valid, true);
  });
});
