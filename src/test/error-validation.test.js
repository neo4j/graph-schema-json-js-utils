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
        const unsupportedNodeSpecs = readFile(
            path.resolve(
                __dirname,
                "./test-schemas/unsupported-data-type-nodeSpecs.json"
            )
        );
        assert.throws(
            () => validateSchema(JSON_SCHEMA, unsupportedNodeSpecs),
            SchemaValidationError
        );

        const unsupportedRelationshipSpecs = readFile(
            path.resolve(
                __dirname,
                "./test-schemas/unsupported-data-type-relationshipSpecs.json"
            )
        );
        assert.throws(
            () => validateSchema(JSON_SCHEMA, unsupportedRelationshipSpecs),
            SchemaValidationError
        );
    });

    //Dessa två kan slås ihop och göras ännu bredare,
    //så att det testas om extra fields överallt och inte bara på ett ställe i json-filen.
    test("Identifies additional fields/properties", () => {
        const additionalNodeSpecs = readFile(
            path.resolve(
                __dirname,
                "./test-schemas/additional-fields-nodeSpecs.json"
            )
        );
        assert.throws(
            () => validateSchema(JSON_SCHEMA, additionalNodeSpecs),
            SchemaValidationError
        );

        const additionalNodeSpecs2 = readFile(
            path.resolve(
                __dirname,
                "./test-schemas/additional-fields-nodeSpecs2.json"
            )
        );
        assert.throws(
            () => validateSchema(JSON_SCHEMA, additionalNodeSpecs2),
            SchemaValidationError
        );

        const additionalNodeSpecs3 = readFile(
            path.resolve(
                __dirname,
                "./test-schemas/additional-fields-nodeSpecs3.json"
            )
        );
        assert.throws(
            () => validateSchema(JSON_SCHEMA, additionalNodeSpecs3),
            SchemaValidationError
        );

        const additionalProperties = readFile(
            path.resolve(__dirname, "./test-schemas/additional-properties.json")
        );

        assert.throws(
            () => validateSchema(JSON_SCHEMA, additionalProperties),
            SchemaValidationError
        );
    });

    test("TEST", () => {
        const testSchema = readFile(
            path.resolve(
                __dirname,
                "./test-schemas/required-fields-relationshipType2.json"
            )
        );

        assert.throws(
            () => validateSchema(JSON_SCHEMA, testSchema),
            SchemaValidationError
        );
    });

    //inkludera fler borttagna fält
    test("Identifies missing required fields/properties nodeSpecs", () => {
        //nodeLabels
        const missingRequiredNodeLabels = readFile(
            path.resolve(
                __dirname,
                "./test-schemas/required-fields-nodeLabels.json"
            )
        );
        assert.throws(
            () => validateSchema(JSON_SCHEMA, missingRequiredNodeLabels),
            SchemaValidationError
        );

        const missingRequiredNodeLabels2 = readFile(
            path.resolve(
                __dirname,
                "./test-schemas/required-fields-nodeLabels2.json"
            )
        );
        assert.throws(
            () => validateSchema(JSON_SCHEMA, missingRequiredNodeLabels2),
            SchemaValidationError
        );

        //nodeLabels
        const missingRequiredRelationshipType = readFile(
            path.resolve(
                __dirname,
                "./test-schemas/required-fields-relationshipType.json"
            )
        );
        assert.throws(
            () =>
                validateSchema(
                    JSON_SCHEMA,
                    missingRequiredRelationshipType
                ),
            SchemaValidationError
        );

        const missingRequiredRelationshipType2 = readFile(
            path.resolve(
                __dirname,
                "./test-schemas/required-fields-relationshipType2.json"
            )
        );
        assert.throws(
            () =>
                validateSchema(
                    JSON_SCHEMA,
                    missingRequiredRelationshipType2
                ),
            SchemaValidationError
        );

        //nodeSpecs
        const missingRequiredNodeSpecs = readFile(
            path.resolve(
                __dirname,
                "./test-schemas/required-fields-nodeSpecs.json"
            )
        );
        assert.throws(
            () => validateSchema(JSON_SCHEMA, missingRequiredNodeSpecs),
            SchemaValidationError
        );

        const missingRequiredNodeSpecs2 = readFile(
            path.resolve(
                __dirname,
                "./test-schemas/required-fields-nodeSpecs2.json"
            )
        );
        assert.throws(
            () => validateSchema(JSON_SCHEMA, missingRequiredNodeSpecs2),
            SchemaValidationError
        );

        const missingRequiredNodeSpecs3 = readFile(
            path.resolve(
                __dirname,
                "./test-schemas/required-fields-nodeSpecs3.json"
            )
        );
        assert.throws(
            () =>
                validateSchema(
                    JSON_SCHEMA,
                    missingRequiredNodeSpecs3
                ),
            SchemaValidationError
        );

        const missingRequiredPropertiesNodeSpecs = readFile(
            path.resolve(
                __dirname,
                "./test-schemas/required-properties-nodeSpecs.json"
            )
        );
        assert.throws(
            () =>
                validateSchema(JSON_SCHEMA, missingRequiredPropertiesNodeSpecs),
            SchemaValidationError
        );
    });
});
