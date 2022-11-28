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

    test("Identifies additional fields/properties", () => {
        //schema properties
        const additionalProperties = readFile(
            path.resolve(__dirname, "./test-schemas/additional-properties.json")
        );

        assert.throws(
            () => validateSchema(JSON_SCHEMA, additionalProperties),
            SchemaValidationError
        );

        //NodeSpecs
        const additionalNodeSpecs = readFile(
            path.resolve(
                __dirname,
                "./test-schemas/additional-fields-nodeSpecs-root.json"
            )
        );
        assert.throws(
            () => validateSchema(JSON_SCHEMA, additionalNodeSpecs),
            SchemaValidationError
        );

        const additionalNodeSpecs2 = readFile(
            path.resolve(
                __dirname,
                "./test-schemas/additional-fields-nodeSpecs-properties.json"
            )
        );
        assert.throws(
            () => validateSchema(JSON_SCHEMA, additionalNodeSpecs2),
            SchemaValidationError
        );

        const additionalNodeSpecs3 = readFile(
            path.resolve(
                __dirname,
                "./test-schemas/additional-fields-nodeSpecs-labels.json"
            )
        );
        assert.throws(
            () => validateSchema(JSON_SCHEMA, additionalNodeSpecs3),
            SchemaValidationError
        );

        //RelationshipSpecs
        const additionalRelationshipSpecsLabels = readFile(
            path.resolve(
                __dirname,
                "./test-schemas/additional-fields-relationshipSpecs-labels.json"
            )
        );
        assert.throws(
            () => validateSchema(JSON_SCHEMA, additionalRelationshipSpecsLabels),
            SchemaValidationError
        );


        const additionalRelationshipSpecsProperties = readFile(
            path.resolve(
                __dirname,
                "./test-schemas/additional-fields-relationshipSpecs-properties.json"
            )
        );
        assert.throws(
            () => validateSchema(JSON_SCHEMA, additionalRelationshipSpecsProperties),
            SchemaValidationError
        );

        const additionalRelationshipSpecsRoot = readFile(
            path.resolve(
                __dirname,
                "./test-schemas/additional-fields-relationshipSpecs-root.json"
            )
        );
        assert.throws(
            () => validateSchema(JSON_SCHEMA, additionalRelationshipSpecsRoot),
            SchemaValidationError
        );

        const additionalRelationshipSpecsLabelname = readFile(
            path.resolve(
                __dirname,
                "./test-schemas/additional-fields-relationshipSpecs-labelname.json"
            )
        );
        assert.throws(
            () => validateSchema(JSON_SCHEMA, additionalRelationshipSpecsLabelname),
            SchemaValidationError
        );

        //NodeLabel
        const additionalNodeLabel = readFile(
            path.resolve(
                __dirname,
                "./test-schemas/additional-fields-nodeLabel-root.json"
            )
        );
        assert.throws(
            () => validateSchema(JSON_SCHEMA, additionalNodeLabel),
            SchemaValidationError
        );
        
    });

   //check number of errors (2 errors expected)
    test("Identifies missing required fields/properties nodeSpecs", () => {
        //NodeLabels
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

        //RelationshipType
        const missingRequiredRelationshipTypeRoot = readFile(
            path.resolve(
                __dirname,
                "./test-schemas/required-fields-relationship-root.json"
            )
        );
        assert.throws(
            () => validateSchema(JSON_SCHEMA, missingRequiredRelationshipTypeRoot),
            SchemaValidationError
        );


        //nodeSpecs
        // (1 error expected)
        const missingRequiredNodeSpecs = readFile(
            path.resolve(
                __dirname,
                "./test-schemas/required-fields-nodeSpecs-labels.json"
            )
        );
        assert.throws(
            () => validateSchema(JSON_SCHEMA, missingRequiredNodeSpecs),
            SchemaValidationError
        );

       
        const missingRequiredNodeSpecs2 = readFile(
            path.resolve(
                __dirname,
                "./test-schemas/required-fields-nodeSpecs-properties.json"
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
            () => validateSchema(JSON_SCHEMA, missingRequiredNodeSpecs3),
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
