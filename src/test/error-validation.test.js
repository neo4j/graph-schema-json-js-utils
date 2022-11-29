import { strict as assert } from "node:assert";
import { fileURLToPath } from "url";
import path from "path";
import { SchemaValidationError, validateSchema } from "../index.js";
import { readFile } from "../fs.utils.js";
import { describe, test } from "vitest";

const __dirname = path.dirname(fileURLToPath(new URL(import.meta.url)));
const JSON_SCHEMA_FILE = path.resolve(__dirname, "../json-schema.json");
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
        const additionalFieldsGraphSchema = readFile(
            path.resolve(
                __dirname,
                "./test-schemas/additional-fields-graphSchema.json"
            )
        );

        assert.throws(
            () => validateSchema(JSON_SCHEMA, additionalFieldsGraphSchema),
            SchemaValidationError
        );

        //NodeLabel
        const additionalNodeLabelRoot = readFile(
            path.resolve(
                __dirname,
                "./test-schemas/additional-fields-nodeLabel-root.json"
            )
        );
        assert.throws(
            () => validateSchema(JSON_SCHEMA, additionalNodeLabelRoot),
            SchemaValidationError
        );

        //RelationshipType
        const additionalRelationshipTypesRoot = readFile(
            path.resolve(
                __dirname,
                "./test-schemas/additional-fields-relationshipTypes-root.json"
            )
        );
        assert.throws(
            () => validateSchema(JSON_SCHEMA, additionalRelationshipTypesRoot),
            SchemaValidationError
        );

        //NodeSpecs
        const additionalNodeSpecsRoot = readFile(
            path.resolve(
                __dirname,
                "./test-schemas/additional-fields-nodeSpecs-root.json"
            )
        );
        assert.throws(
            () => validateSchema(JSON_SCHEMA, additionalNodeSpecsRoot),
            SchemaValidationError
        );

        const additionalNodeSpecsProperties = readFile(
            path.resolve(
                __dirname,
                "./test-schemas/additional-fields-nodeSpecs-properties.json"
            )
        );
        assert.throws(
            () => validateSchema(JSON_SCHEMA, additionalNodeSpecsProperties),
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
                "./test-schemas/additional-fields-relationshipSpecs-type.json"
            )
        );
        assert.throws(
            () =>
                validateSchema(JSON_SCHEMA, additionalRelationshipSpecsLabels),
            SchemaValidationError
        );

        const additionalRelationshipSpecsProperties = readFile(
            path.resolve(
                __dirname,
                "./test-schemas/additional-fields-relationshipSpecs-properties.json"
            )
        );
        assert.throws(
            () =>
                validateSchema(
                    JSON_SCHEMA,
                    additionalRelationshipSpecsProperties
                ),
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

        const additionalRelationshipSpecsType = readFile(
            path.resolve(
                __dirname,
                "./test-schemas/additional-fields-relationshipSpecs-type.json"
            )
        );
        assert.throws(
            () => validateSchema(JSON_SCHEMA, additionalRelationshipSpecsType),
            SchemaValidationError
        );
    });

    //check number of errors
    test("Identifies missing required fields/properties nodeSpecs", () => {
        //GraphSchema
        const missingRequireGraphSchema = readFile(
            path.resolve(
                __dirname,
                "./test-schemas/required-fields-graphSchema.json"
            )
        );
        assert.throws(
            () => validateSchema(JSON_SCHEMA, missingRequireGraphSchema),
            SchemaValidationError
        );

        const NUM_MISSING_GRAPH_SCHEMA_ITEMS = 4;
        let allErrors = [];
        try {
            validateSchema(JSON_SCHEMA, missingRequireGraphSchema);
        } catch (e) {
            allErrors = e.messages;
        }
        assert.equal(allErrors.length, NUM_MISSING_GRAPH_SCHEMA_ITEMS);

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

        const NUM_MISSING_NODELABELS = 2;
        let allErrorsNodeLabels = [];
        try {
            validateSchema(JSON_SCHEMA, missingRequiredNodeLabels);
        } catch (e) {
            allErrorsNodeLabels = e.messages;
        }
        assert.equal(allErrorsNodeLabels.length, NUM_MISSING_NODELABELS);

        //RelationshipType
        const missingRequiredRelationshipTypeRoot = readFile(
            path.resolve(
                __dirname,
                "./test-schemas/required-fields-relationshipType-root.json"
            )
        );
        assert.throws(
            () =>
                validateSchema(
                    JSON_SCHEMA,
                    missingRequiredRelationshipTypeRoot
                ),
            SchemaValidationError
        );

        const missingRequiredNodeSpecsProperties = readFile(
            path.resolve(
                __dirname,
                "./test-schemas/required-fields-nodeSpecs-properties.json"
            )
        );
        assert.throws(
            () =>
                validateSchema(JSON_SCHEMA, missingRequiredNodeSpecsProperties),
            SchemaValidationError
        );

        const missingRequiredPropertiesNodeSpecsRoot = readFile(
            path.resolve(
                __dirname,
                "./test-schemas/required-fields-nodeSpecs-root.json"
            )
        );
        assert.throws(
            () =>
                validateSchema(
                    JSON_SCHEMA,
                    missingRequiredPropertiesNodeSpecsRoot
                ),
            SchemaValidationError
        );
    });
});
