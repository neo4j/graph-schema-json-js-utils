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
        const unsupportedDataTypeSchemaNodeSpecs = readFile(
            path.resolve(__dirname, "./test-schemas/unsupported-data-type-nodeSpecs.json")
        );

        const unsupportedDataTypeSchemaRelationshipSpecs = readFile(
            path.resolve(__dirname, "./test-schemas/unsupported-data-type-relationshipSpecs.json")
        );

        assert.throws(
            () => validateSchema(JSON_SCHEMA, unsupportedDataTypeSchemaNodeSpecs, unsupportedDataTypeSchemaRelationshipSpecs),
            SchemaValidationError
        );
    });


    //Dessa två kan slås ihop och göras ännu bredare, 
    //så att det testas om extra fields överallt och inte bara på ett ställe i json-filen.
    test("Identifies additional fields/properties", () => {
        const additionalFieldsNodeSpecs = readFile(
            path.resolve(__dirname, "./test-schemas/additional-fields-nodeSpecs.json")
        );
    

        const AdditionalFieldsNodeSpecs2 = readFile(
            path.resolve(__dirname, "./test-schemas/additional-fields-nodeSpecs2.json")
        );


        const additionalFieldsNodeSpecsArray = readFile(
            path.resolve(__dirname, "./test-schemas/additional-fields-nodeSpecs-Array.json")
        );


        const AdditionalProperties = readFile(
            path.resolve(__dirname, "./test-schemas/additional-properties.json")
        );


        assert.throws(
            () => validateSchema(JSON_SCHEMA, additionalFieldsNodeSpecs, AdditionalFieldsNodeSpecs2, additionalFieldsNodeSpecsArray, AdditionalProperties),
            SchemaValidationError
        );
        
    });
    
    test("TEST", () => {
        const testSchema = readFile(
            path.resolve(__dirname, "./test-schemas/required-fields-nodeSpecs-Array.json")
        );
        
        assert.throws(
            () => validateSchema(JSON_SCHEMA, testSchema ),
            SchemaValidationError
        );
    });

   //inkludera fler borttagna fält
    test("Identifies missing required fields/properties nodeSpecs", () => {
        const MissingRequiredFieldsNodeSpecs = readFile(
            path.resolve(__dirname, "./test-schemas/required-fields-nodeSpecs.json")
        );

        const MissingRequiredFieldsNodeSpecs2 = readFile(
            path.resolve(__dirname, "./test-schemas/required-fields-nodeSpecs2.json")
        );

        const requiredFieldsNodeSpecsArray = readFile(
            path.resolve(__dirname, "./test-schemas/required-fields-nodeSpecs-Array.json")
        );

        const MissingRequiredPropertiesNodeSpecs = readFile(
            path.resolve(__dirname, "./test-schemas/required-properties-nodeSpecs.json")
        );

        assert.throws(
            () => validateSchema(JSON_SCHEMA, MissingRequiredFieldsNodeSpecs, MissingRequiredFieldsNodeSpecs2,requiredFieldsNodeSpecsArray, MissingRequiredPropertiesNodeSpecs),
            SchemaValidationError
        );
    });


   
    

    
});
