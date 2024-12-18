import { strict as assert } from "node:assert";
import path from "path";
import { SchemaValidationError, validateSchema } from "../../src/index.js";
import { readFile } from "../fs.utils.js";
import { describe, test } from "vitest";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const JSON_SCHEMA = JSON.stringify(
  require("@neo4j/graph-json-schema/json-schema.json")
);

// Validate type errors == schemas we expect NOT to pass
describe("Validate type errors", () => {
  describe("Identifies duplicated node labels", () => {
    test("Duplicated node labels", () => {
      const duplicatedNodeLabels = readFile(
        path.resolve(__dirname, "./test-schemas/duplicated-node-labels.json")
      );
      assert.throws(
        () => validateSchema(JSON_SCHEMA, duplicatedNodeLabels),
        SchemaValidationError
      );
    });
  });
  describe("Identifies unsupported types", () => {
    test("Node object types", () => {
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
      //--------
      const EXPECTED_NUMBER_OF_ERRORS = 6;
      let allErrors = [];
      try {
        validateSchema(JSON_SCHEMA, unsupportedNodeSpecs);
      } catch (e) {
        allErrors = (e as unknown as SchemaValidationError).messages;
      }
      assert.equal(allErrors.length, EXPECTED_NUMBER_OF_ERRORS);
    });
    test("Relationship object types", () => {
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
      //--------
      const EXPECTED_NUMBER_OF_ERRORS = 5;
      let allErrors = [];
      try {
        validateSchema(JSON_SCHEMA, unsupportedRelationshipSpecs);
      } catch (e) {
        allErrors = (e as unknown as SchemaValidationError).messages;
      }
      assert.equal(allErrors.length, EXPECTED_NUMBER_OF_ERRORS);
    });
  });

  describe("Identifies additional fields/properties", () => {
    test("Schema properties", () => {
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
      let allErrors: SchemaValidationError["messages"] = [];
      try {
        validateSchema(JSON_SCHEMA, additionalFieldsGraphSchema);
      } catch (e) {
        allErrors = (e as unknown as SchemaValidationError).messages;
      }
      assert.equal(allErrors.length, NUM_ADDITIONAL_FIELDS_GRAPH_SCHEMA);
      assert.equal(allErrors[0].keyword, "additionalProperties");
    });

    test("Node labels", () => {
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
      let allErrorsAddittionalNodeLabelsRoot: SchemaValidationError["messages"] =
        [];
      try {
        validateSchema(JSON_SCHEMA, additionalNodeLabelRoot);
      } catch (e) {
        allErrorsAddittionalNodeLabelsRoot = (
          e as unknown as SchemaValidationError
        ).messages;
      }
      assert.equal(
        allErrorsAddittionalNodeLabelsRoot.length,
        NUM_ADDITIONAL_NODELABEL_ROOT
      );
      assert.equal(
        allErrorsAddittionalNodeLabelsRoot[0].keyword,
        "additionalProperties"
      );
    });

    test("RelationshipType", () => {
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
      let allErrorsAddittionalRelationshipTypeRoot: SchemaValidationError["messages"] =
        [];
      try {
        validateSchema(JSON_SCHEMA, additionalRelationshipTypesRoot);
      } catch (e) {
        allErrorsAddittionalRelationshipTypeRoot = (
          e as unknown as SchemaValidationError
        ).messages;
      }
      assert.equal(
        allErrorsAddittionalRelationshipTypeRoot.length,
        NUM_ADDITIONAL_RELATIONSHIP_TYPES_ROOT
      );
      assert.equal(
        allErrorsAddittionalRelationshipTypeRoot[0].keyword,
        "additionalProperties"
      );
    });

    test("Node object types", () => {
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
      let allErrorsAddittionalNodeSpecsRoot: SchemaValidationError["messages"] =
        [];
      try {
        validateSchema(JSON_SCHEMA, additionalNodeSpecsRoot);
      } catch (e) {
        allErrorsAddittionalNodeSpecsRoot = (
          e as unknown as SchemaValidationError
        ).messages;
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
      const NUM_ADDITIONAL_NODESPECS_PROPERTIRES = 5;
      let allErrorsAddittionalNodeSpecsProperties: SchemaValidationError["messages"] =
        [];
      try {
        validateSchema(JSON_SCHEMA, additionalNodeSpecsProperties);
      } catch (e) {
        allErrorsAddittionalNodeSpecsProperties = (
          e as unknown as SchemaValidationError
        ).messages;
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
      let allErrorsAddittionalNodeSpecsLabels: SchemaValidationError["messages"] =
        [];
      try {
        validateSchema(JSON_SCHEMA, additionalNodeSpecsLabels);
      } catch (e) {
        allErrorsAddittionalNodeSpecsLabels = (
          e as unknown as SchemaValidationError
        ).messages;
      }
      assert.equal(
        allErrorsAddittionalNodeSpecsLabels.length,
        NUM_ADDITIONAL_NODESPEC_LABELS
      );
      assert.equal(
        allErrorsAddittionalNodeSpecsLabels[0].keyword,
        "additionalProperties"
      );
    });

    test("Relationship object types", () => {
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
      let allErrorsAddittionalRelationshipSpecsType: SchemaValidationError["messages"] =
        [];
      try {
        validateSchema(JSON_SCHEMA, additionalRelationshipSpecsLabels);
      } catch (e) {
        allErrorsAddittionalRelationshipSpecsType = (
          e as unknown as SchemaValidationError
        ).messages;
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
        () =>
          validateSchema(JSON_SCHEMA, additionalRelationshipSpecsProperties),
        SchemaValidationError
      );
      const NUM_ADDITIONAL_RELATIONSHIP_SPECS_PROPERTIES = 6;
      let allErrorsAddittionalRelationshipSpecsProperties: SchemaValidationError["messages"] =
        [];
      try {
        validateSchema(JSON_SCHEMA, additionalRelationshipSpecsProperties);
      } catch (e) {
        allErrorsAddittionalRelationshipSpecsProperties = (
          e as unknown as SchemaValidationError
        ).messages;
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
      let allErrorsAddittionalRelationshipSpecsRoot: SchemaValidationError["messages"] =
        [];
      try {
        validateSchema(JSON_SCHEMA, additionalRelationshipSpecsRoot);
      } catch (e) {
        allErrorsAddittionalRelationshipSpecsRoot = (
          e as unknown as SchemaValidationError
        ).messages;
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
  });

  //check number of errors
  describe("Identifies missing required fields/properties", () => {
    test("GraphSchema", () => {
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

      const NUM_MISSING_GRAPH_SCHEMA_ITEMS = 6;
      let allErrors: SchemaValidationError["messages"] = [];
      try {
        validateSchema(JSON_SCHEMA, missingRequireGraphSchema);
      } catch (e) {
        allErrors = (e as unknown as SchemaValidationError).messages;
      }
      assert.equal(allErrors.length, NUM_MISSING_GRAPH_SCHEMA_ITEMS);
    });

    test("NodeLabels", () => {
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

      const NUM_MISSING_NODELABELS = 3;
      let allErrorsNodeLabels: SchemaValidationError["messages"] = [];
      try {
        validateSchema(JSON_SCHEMA, missingRequiredNodeLabels);
      } catch (e) {
        allErrorsNodeLabels = (e as unknown as SchemaValidationError).messages;
      }
      assert.equal(allErrorsNodeLabels.length, NUM_MISSING_NODELABELS);
    });

    test("RelationshipTypes", () => {
      const missingRequiredRelationshipTypeRoot = readFile(
        path.resolve(
          __dirname, // @ts-ignore
          "./test-schemas/required-fields-relationshipType-root.json"
        )
      );
      assert.throws(
        () => validateSchema(JSON_SCHEMA, missingRequiredRelationshipTypeRoot),
        SchemaValidationError
      );

      const NUM_MISSING_RELATIONSHIPTYPE_ROOT = 3;
      let allErrorsRelationshipTypeRoot: SchemaValidationError["messages"] = [];
      try {
        validateSchema(JSON_SCHEMA, missingRequiredRelationshipTypeRoot);
      } catch (e) {
        allErrorsRelationshipTypeRoot = (e as unknown as SchemaValidationError)
          .messages;
      }
      assert.equal(
        allErrorsRelationshipTypeRoot.length,
        NUM_MISSING_RELATIONSHIPTYPE_ROOT
      );

      // ----------- RelationshipType properties -----------------------------
      const missingRequiredRelationshipSpecsProperties = readFile(
        path.resolve(
          __dirname,
          "./test-schemas/required-fields-relationshipTypes-properties.json"
        )
      );
      assert.throws(
        () =>
          validateSchema(
            JSON_SCHEMA,
            missingRequiredRelationshipSpecsProperties
          ),
        SchemaValidationError
      );
      const NUM_MISSING_RELATIONSHIP_SPECS_PROPERTIES = 8;
      let allErrorRelationshipSpecsProperties: SchemaValidationError["messages"] =
        [];
      try {
        validateSchema(JSON_SCHEMA, missingRequiredRelationshipSpecsProperties);
      } catch (e) {
        allErrorRelationshipSpecsProperties = (
          e as unknown as SchemaValidationError
        ).messages;
      }
      assert.equal(
        allErrorRelationshipSpecsProperties.length,
        NUM_MISSING_RELATIONSHIP_SPECS_PROPERTIES
      );
    });

    test("NodeObjectTypes", () => {
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
      const NUM_MISSING_NODESPECS_PROPERTIES = 8;
      let allErrorNodespecsProperties: SchemaValidationError["messages"] = [];
      try {
        validateSchema(JSON_SCHEMA, missingRequiredNodeSpecsProperties);
      } catch (e) {
        allErrorNodespecsProperties = (e as unknown as SchemaValidationError)
          .messages;
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
        () =>
          validateSchema(JSON_SCHEMA, missingRequiredPropertiesNodeSpecsRoot),
        SchemaValidationError
      );

      const NUM_MISSING_NODESPECS_ROOT = 2;
      let allErrorNodespecsRoot: SchemaValidationError["messages"] = [];
      try {
        validateSchema(JSON_SCHEMA, missingRequiredPropertiesNodeSpecsRoot);
      } catch (e) {
        allErrorNodespecsRoot = (e as unknown as SchemaValidationError)
          .messages;
      }
      assert.equal(allErrorNodespecsRoot.length, NUM_MISSING_NODESPECS_ROOT);
    });

    test("RelationshipObjectTypes", () => {
      const missingRequiredPropertiesRelationshipSpecsRoot = readFile(
        path.resolve(
          __dirname,
          "./test-schemas/required-fields-relationshipSpecs-root.json"
        )
      );
      assert.throws(
        () =>
          validateSchema(
            JSON_SCHEMA,
            missingRequiredPropertiesRelationshipSpecsRoot
          ),
        SchemaValidationError
      );

      const NUM_MISSING_RELATIONSHIP_SPECS_ROOT = 4;
      let allErrorRelationshipSpecsRoot: SchemaValidationError["messages"] = [];
      try {
        validateSchema(
          JSON_SCHEMA,
          missingRequiredPropertiesRelationshipSpecsRoot
        );
      } catch (e) {
        allErrorRelationshipSpecsRoot = (e as unknown as SchemaValidationError)
          .messages;
      }
      assert.equal(
        allErrorRelationshipSpecsRoot.length,
        NUM_MISSING_RELATIONSHIP_SPECS_ROOT
      );
    });

    test("Constraints", () => {
      const NUM_MISSING_CONSTRAINTS = 8;
      const missingRequiredInConstraints = readFile(
        path.resolve(
          __dirname,
          "./test-schemas/required-fields-constraints.json"
        )
      );
      let constraintErrors: SchemaValidationError["messages"] = [];
      try {
        validateSchema(JSON_SCHEMA, missingRequiredInConstraints);
      } catch (e) {
        constraintErrors = (e as unknown as SchemaValidationError).messages;
      }
      assert.equal(constraintErrors.length, NUM_MISSING_CONSTRAINTS);

      const NUM_ERRORS_MISMATCH_NODE_CONSTRAINT = 3;
      const missingRequiredInNodeConstraints = readFile(
        path.resolve(
          __dirname,
          "./test-schemas/required-fields-constraint-node-entity.json"
        )
      );
      let nodeConstraintErrors: SchemaValidationError["messages"] = [];
      try {
        validateSchema(JSON_SCHEMA, missingRequiredInNodeConstraints);
      } catch (e) {
        nodeConstraintErrors = (e as unknown as SchemaValidationError).messages;
      }
      assert.equal(
        nodeConstraintErrors.length,
        NUM_ERRORS_MISMATCH_NODE_CONSTRAINT
      );
      assert.equal(
        nodeConstraintErrors.some(
          (e) => e.params?.missingProperty === "nodeLabel"
        ),
        true
      );
      assert.equal(
        nodeConstraintErrors.some((e) => e.params?.passingSchemas === null),
        true
      );

      const NUM_ERRORS_MISMATCH_RELATIONSHIP_CONSTRAINT = 3;
      const missingRequiredInRelationshipConstraints = readFile(
        path.resolve(
          __dirname,
          "./test-schemas/required-fields-constraint-relationship-entity.json"
        )
      );
      let relationshipConstraintErrors: SchemaValidationError["messages"] = [];
      try {
        validateSchema(JSON_SCHEMA, missingRequiredInRelationshipConstraints);
      } catch (e) {
        relationshipConstraintErrors = (e as unknown as SchemaValidationError)
          .messages;
      }
      assert.equal(
        relationshipConstraintErrors.length,
        NUM_ERRORS_MISMATCH_RELATIONSHIP_CONSTRAINT
      );
      assert.equal(
        relationshipConstraintErrors.some(
          (e) => e.params?.missingProperty === "relationshipType"
        ),
        true
      );
      assert.equal(
        relationshipConstraintErrors.some(
          (e) => e.params?.passingSchemas === null
        ),
        true
      );
    });
  });

  test("Indexes", () => {
    const NUM_MISSING_INDEXES = 4;
    const missingRequiredInIndexes = readFile(
      path.resolve(__dirname, "./test-schemas/required-fields-indexes.json")
    );
    let indexErrors: SchemaValidationError["messages"] = [];
    try {
      validateSchema(JSON_SCHEMA, missingRequiredInIndexes);
    } catch (e) {
      indexErrors = (e as unknown as SchemaValidationError).messages;
    }
    assert.equal(indexErrors.length, NUM_MISSING_INDEXES);

    const NUM_ERRORS_MISMATCH_NODE_LABEL_INDEX = 5;
    const missingRequiredInNodeLabelIndex = readFile(
      path.resolve(
        __dirname,
        "./test-schemas/required-fields-index-node-label.json"
      )
    );
    let nodeLabelIndexErrors: SchemaValidationError["messages"] = [];
    try {
      validateSchema(JSON_SCHEMA, missingRequiredInNodeLabelIndex);
    } catch (e) {
      nodeLabelIndexErrors = (e as unknown as SchemaValidationError).messages;
    }
    assert.equal(
      nodeLabelIndexErrors.length,
      NUM_ERRORS_MISMATCH_NODE_LABEL_INDEX
    );
    assert.equal(
      nodeLabelIndexErrors.some(
        (e) => e.params?.missingProperty === "nodeLabel"
      ),
      true
    );
    assert.equal(
      nodeLabelIndexErrors.some((e) => e.params?.passingSchemas === null),
      true
    );

    const NUM_ERRORS_RELATIONSHIP_TYPE_INDEX = 7;
    const missingRequiredInRelationshipTypeIndex = readFile(
      path.resolve(
        __dirname,
        "./test-schemas/required-fields-index-relationship-type.json"
      )
    );
    let relationshipTypeIndexErrors: SchemaValidationError["messages"] = [];
    try {
      validateSchema(JSON_SCHEMA, missingRequiredInRelationshipTypeIndex);
    } catch (e) {
      relationshipTypeIndexErrors = (e as unknown as SchemaValidationError)
        .messages;
    }
    assert.equal(
      relationshipTypeIndexErrors.length,
      NUM_ERRORS_RELATIONSHIP_TYPE_INDEX
    );
    assert.equal(
      relationshipTypeIndexErrors.some(
        (e) => e.params?.missingProperty === "relationshipType"
      ),
      true
    );
    assert.equal(
      relationshipTypeIndexErrors.some(
        (e) => e.params?.missingProperty === "properties"
      ),
      true
    );
    assert.equal(
      relationshipTypeIndexErrors.some(
        (e) => e.params?.passingSchemas === null
      ),
      true
    );

    const NUM_ERRORS_LOOKUP_INDEX = 3;
    const missingRequiredInLookupIndex = readFile(
      path.resolve(
        __dirname,
        "./test-schemas/required-fields-index-lookup.json"
      )
    );
    let lookupIndexErrors: SchemaValidationError["messages"] = [];
    try {
      validateSchema(JSON_SCHEMA, missingRequiredInLookupIndex);
    } catch (e) {
      lookupIndexErrors = (e as unknown as SchemaValidationError).messages;
    }
    assert.equal(lookupIndexErrors.length, NUM_ERRORS_LOOKUP_INDEX);
  });
});
