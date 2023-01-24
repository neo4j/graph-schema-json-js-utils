import { strict as assert } from "node:assert";
import { fileURLToPath } from "url";
import path from "path";
import { validateSchema } from "../../src/index.js";
import { readFile } from "../fs.utils.js";
import { describe, test } from "vitest";
import { InputTypeError } from "../../src/validation.js";

const __dirname = path.dirname(fileURLToPath(new URL(import.meta.url)));
const JSON_SCHEMA_FILE = path.resolve(__dirname, "../../json-schema.json");
const JSON_SCHEMA = readFile(JSON_SCHEMA_FILE);

describe("Validate if JSON-documen is a string", () => {
  test("Identifies if JSON schema is a string and is parseable to JSON", () => {
    const fullSchema = readFile(
      path.resolve(__dirname, "./test-schemas/full.json")
    );

    assert.throws(() => validateSchema(11, fullSchema), InputTypeError);
  });

  test("Identifies if graph schema is a string and is parseble JSON", () => {
    const exampleGraphSchema = readFile(
      path.resolve(__dirname, "./test-schemas/example-graph-schema.json")
    );

    assert.throws(
      () => validateSchema("}", exampleGraphSchema), InputTypeError);
  });
  
});
