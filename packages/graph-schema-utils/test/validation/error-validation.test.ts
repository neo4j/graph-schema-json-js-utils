import { strict as assert } from "node:assert";
import path from "path";
import { SchemaValidationError, validateSchema } from "../../src/index";
import { readFile } from "../fs.utils.js";
import { describe, test } from "vitest";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const JSON_SCHEMA = JSON.stringify(
  require("@neo4j/graph-json-schema/json-schema.json")
);

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
    //--------
    const NUM_ADDITIONAL_FIELDS_GRAPH_SCHEMA = 1;
    let allErrors = [];
    try {
      validateSchema(JSON_SCHEMA, additionalFieldsGraphSchema);
    } catch (e) {
      allErrors = e.messages;
    }
    assert.equal(allErrors.length, NUM_ADDITIONAL_FIELDS_GRAPH_SCHEMA);
    assert.equal(allErrors[0].keyword, "additionalProperties");
    
    //------------
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
    const NUM_ADDITIONAL_NODELABEL_ROOT = 1;
    let allErrorsAddittionalNodeLabelsRoot = [];
    try {
      validateSchema(JSON_SCHEMA, additionalNodeLabelRoot);
    } catch (e) {
      allErrorsAddittionalNodeLabelsRoot = e.messages;
    }
    assert.equal(
      allErrorsAddittionalNodeLabelsRoot.length,
      NUM_ADDITIONAL_NODELABEL_ROOT
    );
    assert.equal(
      allErrorsAddittionalNodeLabelsRoot[0].keyword,
      "additionalProperties"
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
    const NUM_ADDITIONAL_RELATIONSHIP_TYPES_ROOT = 1;
    let allErrorsAddittionalRelationshipTypeRoot = [];
    try {
      validateSchema(JSON_SCHEMA, additionalNodeLabelRoot);
    } catch (e) {
      allErrorsAddittionalRelationshipTypeRoot = e.messages;
    }
    assert.equal(
      allErrorsAddittionalRelationshipTypeRoot.length,
      NUM_ADDITIONAL_RELATIONSHIP_TYPES_ROOT
    );
    assert.equal(
      allErrorsAddittionalRelationshipTypeRoot[0].keyword,
      "additionalProperties"
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
    const NUM_ADDITIONAL_NODESPEC_ROOT = 1;
    let allErrorsAddittionalNodeSpecsRoot = [];
    try {
      validateSchema(JSON_SCHEMA, additionalNodeLabelRoot);
    } catch (e) {
      allErrorsAddittionalNodeSpecsRoot = e.messages;
    }
    assert.equal(
      allErrorsAddittionalNodeSpecsRoot.length,
      NUM_ADDITIONAL_NODESPEC_ROOT
    );
    assert.equal(
      allErrorsAddittionalNodeSpecsRoot[0].keyword,
      "additionalProperties"
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
    const NUM_ADDITIONAL_NODESPECS_PROPERTIRES = 1;
    let allErrorsAddittionalNodeSpecsProperties = [];
    try {
      validateSchema(JSON_SCHEMA, additionalNodeLabelRoot);
    } catch (e) {
      allErrorsAddittionalNodeSpecsProperties = e.messages;
    }
    assert.equal(
      allErrorsAddittionalNodeSpecsProperties.length,
      NUM_ADDITIONAL_NODESPECS_PROPERTIRES
    );
    assert.equal(
      allErrorsAddittionalNodeSpecsProperties[0].keyword,
      "additionalProperties"
    );

    const additionalNodeSpecsLabels = readFile(
      path.resolve(
        __dirname,
        "./test-schemas/additional-fields-nodeSpecs-labels.json"
      )
    );
    assert.throws(
      () => validateSchema(JSON_SCHEMA, additionalNodeSpecsLabels),
      SchemaValidationError
    );
    const NUM_ADDITIONAL_NODESPEC_LABELS = 1;
    let allErrorsAddittionalNodeSpecsLabels = [];
    try {
      validateSchema(JSON_SCHEMA, additionalNodeSpecsLabels);
    } catch (e) {
      allErrorsAddittionalNodeSpecsLabels = e.messages;
    }
    assert.equal(
      allErrorsAddittionalNodeSpecsLabels.length,
      NUM_ADDITIONAL_NODESPEC_LABELS
    );
    assert.equal(
      allErrorsAddittionalNodeSpecsLabels[0].keyword,
      "additionalProperties"
    );

    //RelationshipSpecs
    const additionalRelationshipSpecsLabels = readFile(
      path.resolve(
        __dirname,
        "./test-schemas/additional-fields-relationshipSpecs-type.json"
      )
    );
    assert.throws(
      () => validateSchema(JSON_SCHEMA, additionalRelationshipSpecsLabels),
      SchemaValidationError
    );
    const NUM_ADDITIONAL_RELATIONSHIP_SPECS_TYPE = 1;
    let allErrorsAddittionalRelationshipSpecsType = [];
    try {
      validateSchema(JSON_SCHEMA, additionalNodeSpecsLabels);
    } catch (e) {
      allErrorsAddittionalRelationshipSpecsType = e.messages;
    }
    assert.equal(
      allErrorsAddittionalRelationshipSpecsType.length,
      NUM_ADDITIONAL_RELATIONSHIP_SPECS_TYPE
    );
    assert.equal(
      allErrorsAddittionalRelationshipSpecsType[0].keyword,
      "additionalProperties"
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
    const NUM_ADDITIONAL_RELATIONSHIP_SPECS_PROPERTIES = 1;
    let allErrorsAddittionalRelationshipSpecsProperties = [];
    try {
      validateSchema(JSON_SCHEMA, additionalNodeSpecsLabels);
    } catch (e) {
      allErrorsAddittionalRelationshipSpecsProperties = e.messages;
    }
    assert.equal(
      allErrorsAddittionalRelationshipSpecsProperties.length,
      NUM_ADDITIONAL_RELATIONSHIP_SPECS_PROPERTIES
    );
    assert.equal(
      allErrorsAddittionalRelationshipSpecsProperties[0].keyword,
      "additionalProperties"
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
    const NUM_ADDITIONAL_RELATIONSHIP_SPECS_ROOT = 1;
    let allErrorsAddittionalRelationshipSpecsRoot = [];
    try {
      validateSchema(JSON_SCHEMA, additionalNodeSpecsLabels);
    } catch (e) {
      allErrorsAddittionalRelationshipSpecsRoot = e.messages;
    }
    assert.equal(
      allErrorsAddittionalRelationshipSpecsRoot.length,
      NUM_ADDITIONAL_RELATIONSHIP_SPECS_ROOT
    );
    assert.equal(
      allErrorsAddittionalRelationshipSpecsRoot[0].keyword,
      "additionalProperties"
    );
  });

  //check number of errors
  test("Identifies missing required fields/properties nodeSpecs", () => {
    //GraphSchema
    const missingRequireGraphSchema = readFile(
      path.resolve(__dirname, "./test-schemas/required-fields-graphSchema.json")
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
      path.resolve(__dirname, "./test-schemas/required-fields-nodeLabels.json")
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
    //--------------------------------------------------
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

    const NUM_MISSING_RELATIONSHIPTYPE_ROOT = 2;
    let allErrorsRelationshipTypeRoot = [];
    try {
      validateSchema(JSON_SCHEMA, missingRequiredRelationshipTypeRoot);
    } catch (e) {
      allErrorsRelationshipTypeRoot = e.messages;
    }
    assert.equal(
      allErrorsRelationshipTypeRoot.length,
      NUM_MISSING_RELATIONSHIPTYPE_ROOT
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
    const NUM_MISSING_NODESPECS_PROPERTIES = 7;
    let allErrorNodespecsProperties = [];
    try {
      validateSchema(JSON_SCHEMA, missingRequiredNodeSpecsProperties);
    } catch (e) {
      allErrorNodespecsProperties = e.messages;
    }
    assert.equal(
      allErrorNodespecsProperties.length,
      NUM_MISSING_NODESPECS_PROPERTIES
    );
    const missingRequiredPropertiesNodeSpecsRoot = readFile(
      path.resolve(
        __dirname,
        "./test-schemas/required-fields-nodeSpecs-root.json"
      )
    );
    assert.throws(
      () => validateSchema(JSON_SCHEMA, missingRequiredPropertiesNodeSpecsRoot),
      SchemaValidationError
    );

    const NUM_MISSING_NODESPECS_ROOT = 3;
    let allErrorNodespecsRoot = [];
    try {
      validateSchema(JSON_SCHEMA, missingRequiredPropertiesNodeSpecsRoot);
    } catch (e) {
      allErrorNodespecsRoot = e.messages;
    }
    assert.equal(allErrorNodespecsRoot.length, NUM_MISSING_NODESPECS_ROOT);
  });
});
