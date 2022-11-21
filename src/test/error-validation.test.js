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

    test("Identifies unsupported types nodeSpecs", () => {
        const unsupportedDataTypeSchema = readFile(
            path.resolve(__dirname, "./test-schemas/unsupported-data-type-nodeSpecs.json")
        );

        assert.throws(
            () => validateSchema(JSON_SCHEMA, unsupportedDataTypeSchema),
            SchemaValidationError
        );
    });


    test("Identifies unsupported types rel.specs", () => {
        const unsupportedDataTypeSchema = readFile(
            path.resolve(__dirname, "./test-schemas/unsupporter-data-type-rel.specs.json")
        );

        assert.throws(
            () => validateSchema(JSON_SCHEMA, unsupportedDataTypeSchema),
            SchemaValidationError
        );
    });


    test("Identifies additional fields nodeSpecs", () => {
        const testSchema = readFile(
            path.resolve(__dirname, "./test-schemas/additional-fields-nodeSpecs.json")
        );

        assert.throws(
            () => validateSchema(JSON_SCHEMA, testSchema),
            SchemaValidationError
        );
    });

    test("Identifies additional properties", () => {
        const testSchema = readFile(
            path.resolve(__dirname, "./test-schemas/additional-properties.json")
        );

        assert.throws(
            () => validateSchema(JSON_SCHEMA, testSchema),
            SchemaValidationError
        );
    });

    test("Identifies missing required fields nodeSpecs", () => {
        const testSchema = readFile(
            path.resolve(__dirname, "./test-schemas/required-fields-nodeSpecs.json")
        );

        assert.throws(
            () => validateSchema(JSON_SCHEMA, testSchema),
            SchemaValidationError
        );
    });

    test("Identifies missing required properties nodeSpecs", () => {
        const testSchema = readFile(
            path.resolve(__dirname, "./test-schemas/required-properties-nodeSpecs.json")
        );

        assert.throws(
            () => validateSchema(JSON_SCHEMA, testSchema),
            SchemaValidationError
        );
    });

    test("Identifies missing required label id nodeSpecs", () => {
        const testSchema = readFile(
            path.resolve(__dirname, "./test-schemas/unsupported-label-id-nodeSpecs.json")
        );

        assert.throws(
            () => validateSchema(JSON_SCHEMA, testSchema),
            SchemaValidationError
        );
    });

    test("Identifies missing required label id rel.specs", () => {
        const testSchema = readFile(
            path.resolve(__dirname, "./test-schemas/unsupported-label-id-rel.specs.json")
        );

        assert.throws(
            () => validateSchema(JSON_SCHEMA, testSchema),
            SchemaValidationError
        );
    });

   
    

    
});
