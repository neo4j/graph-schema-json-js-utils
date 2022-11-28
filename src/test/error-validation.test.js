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

        const additionalNodeLabelLabel = readFile(
            path.resolve(
                __dirname,
                "./test-schemas/additional-fields-nodeLabel-label.json"
            )
        );
        assert.throws(
            () => validateSchema(JSON_SCHEMA, additionalNodeLabelLabel),
            SchemaValidationError
        );

        //RelationshipType
        const additionalRelationshipTypesRoot = readFile(
            path.resolve(
                __dirname,
                "./test-schemas/additional-fields-relationshipType-root.json"
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
                "./test-schemas/additional-fields-nodeSpecs-type.json"
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

   //check number of errors (2 errors expected)
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
                "./test-schemas/required-fields-relationshipType-root.json"
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

       
        const missingRequiredNodeSpecsProperties = readFile(
            path.resolve(
                __dirname,
                "./test-schemas/required-fields-nodeSpecs-properties.json"
            )
        );
        assert.throws(
            () => validateSchema(JSON_SCHEMA, missingRequiredNodeSpecsProperties),
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

        //RelationshipSpecs
        const missingRequiredPropertiesNodeSpecsProperties = readFile(
            path.resolve(
                __dirname,
                "./test-schemas/required-properties-nodeSpecs-properties.json"
            )
        );
        assert.throws(
            () =>
                validateSchema(JSON_SCHEMA, missingRequiredPropertiesNodeSpecsProperties),
            SchemaValidationError
        );

        const missingRequiredPropertiesNodeSpecsRoot = readFile(
            path.resolve(
                __dirname,
                "./test-schemas/required-properties-nodeSpecs-root.json"
            )
        );
        assert.throws(
            () =>
                validateSchema(JSON_SCHEMA, missingRequiredPropertiesNodeSpecsRoot),
            SchemaValidationError
        );
        
    });
});
