import { strict as assert } from "node:assert";
import { fileURLToPath } from "url";
import path from "path";
import { SchemaValidationError, validateSchema } from "../index.js";
import { readFile } from "../fs.utils.js";
import { describe, test } from "./utils/helpers.utils.js";


const __dirname = path.dirname(fileURLToPath(new URL(import.meta.url)));
const JSON_SCHEMA_FILE = path.resolve(__dirname, "../graphDescriptionNew.json");
const JSON_SCHEMA = readFile(JSON_SCHEMA_FILE);

// Validate type errors == schemas we expect NOT to pass
describe("Validate type errors", () => {

    test("Identifies unsupported types", () => {
        const unsupportedDataTypeSchema = readFile(
            path.resolve(__dirname, "./test-schemas/unsupported-label-no-id.json")
        );

        assert.throws(
            () => validateSchema(JSON_SCHEMA, unsupportedDataTypeSchema),
            SchemaValidationError
        );
    });
});
