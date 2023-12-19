import { strict as assert } from "node:assert";
import { describe, expect, test } from "vitest";
import { model } from "../../src/index.js";
import {
  PropertyTypes,
  isLookupIndex,
  isNodeLabelConstraint,
  isNodeLabelIndex,
  isRelationshipTypeIndex,
} from "../../src/model/index.js";

describe("Programatic model tests", () => {
  test("Can be created programatically", () => {
    const personProperties = [
      new model.Property(
        "p:Person.name",
        "name",
        new model.PropertyBaseType("string"),
        false
      ),
    ];
    const labels = [
      new model.NodeLabel("l1", "Person", personProperties),
      new model.NodeLabel("l2", "Movie"),
      new model.NodeLabel("l3", "Genre"),
    ];
    const actedInProperties = [
      new model.Property(
        "p:ACTED_IN.roles",
        "roles",
        new model.PropertyArrayType(new model.PropertyBaseType("string")),
        false
      ),
    ];
    const relationshipTypes = [
      new model.RelationshipType("rt1", "ACTED_IN", actedInProperties),
      new model.RelationshipType("rt2", "DIRECTED"),
      new model.RelationshipType("rt3", "IS_GENRE"),
    ];

    const nodeObjectTypes = [
      new model.NodeObjectType("n1", [labels[0]]),
      new model.NodeObjectType("n2", [labels[1]]),
      new model.NodeObjectType("n3", [labels[2]]),
    ];

    const relationshipObjectTypes = [
      new model.RelationshipObjectType(
        "r1",
        relationshipTypes[0],
        nodeObjectTypes[0],
        nodeObjectTypes[1]
      ),
      new model.RelationshipObjectType(
        "r2",
        relationshipTypes[1],
        nodeObjectTypes[0],
        nodeObjectTypes[1]
      ),
      new model.RelationshipObjectType(
        "r3",
        relationshipTypes[2],
        nodeObjectTypes[1],
        nodeObjectTypes[2]
      ),
    ];

    const nodeConstraint = new model.NodeLabelConstraint(
      "c1",
      "unique",
      "uniqueness",
      labels[0],
      personProperties
    );
    const relationshipConstraint = new model.RelationshipTypeConstraint(
      "c2",
      "existence",
      "propertyExistence",
      relationshipTypes[0],
      actedInProperties
    );
    const constraints = [nodeConstraint, relationshipConstraint];

    const nodeLabelIndex = new model.NodeLabelIndex(
      "i1",
      "node-index",
      "default",
      labels[0],
      personProperties
    );

    const relationshipTypeIndex = new model.RelationshipTypeIndex(
      "i2",
      "relationship-index",
      "range",
      relationshipTypes[0],
      actedInProperties
    );

    const lookupIndex = new model.LookupIndex("i3", "lookup-index", "node");

    const indexes = [nodeLabelIndex, relationshipTypeIndex, lookupIndex];

    const graphSchema = new model.GraphSchema(
      nodeObjectTypes,
      relationshipObjectTypes,
      constraints,
      indexes
    );

    assert.strictEqual(graphSchema.nodeLabels.length, 3);
    assert.strictEqual(graphSchema.relationshipTypes.length, 3);
    assert.strictEqual(graphSchema.nodeObjectTypes.length, 3);
    assert.strictEqual(graphSchema.relationshipObjectTypes.length, 3);
    assert.strictEqual(graphSchema.nodeObjectTypes[0].labels[0].$id, "l1");
    assert.strictEqual(
      graphSchema.nodeObjectTypes[0].labels[0],
      graphSchema.nodeLabels[0]
    );
    assert.strictEqual(
      graphSchema.nodeObjectTypes[0].labels[0].properties.length,
      1
    );
    assert.strictEqual(
      graphSchema.nodeObjectTypes[0].labels[0].properties[0].token,
      "name"
    );
    assert.strictEqual(graphSchema.relationshipObjectTypes[0].type.$id, "rt1");
    assert.strictEqual(graphSchema.relationshipObjectTypes[0].from.$id, "n1");
    assert.strictEqual(
      graphSchema.relationshipObjectTypes[0].from,
      nodeObjectTypes[0]
    );
    assert.strictEqual(graphSchema.relationshipObjectTypes[0].to.$id, "n2");
    assert.strictEqual(
      graphSchema.relationshipObjectTypes[0].to,
      nodeObjectTypes[1]
    );

    assert.strictEqual(
      graphSchema.relationshipObjectTypes[0].type.properties.length,
      1
    );
    assert.strictEqual(
      graphSchema.relationshipObjectTypes[0].type.properties[0].token,
      "roles"
    );
    assert.strictEqual(
      (
        graphSchema.relationshipObjectTypes[0].type.properties[0]
          .type as PropertyTypes
      ).type,
      "array"
    );

    // Constraints
    assert.strictEqual(graphSchema.constraints[0].properties.length, 1);
    assert.strictEqual(graphSchema.constraints[0].properties[0].token, "name");
    assert.strictEqual(graphSchema.constraints[0].name, "unique");
    assert.strictEqual(graphSchema.constraints[0].$id, "c1");
    assert.strictEqual(graphSchema.constraints[0].constraintType, "uniqueness");
    assert.strictEqual(graphSchema.constraints[0].entityType, "node");
    assert.strictEqual(isNodeLabelConstraint(graphSchema.constraints[0]), true);
    if (isNodeLabelConstraint(graphSchema.constraints[0])) {
      assert.strictEqual(graphSchema.constraints[0].nodeLabel, labels[0]);
    }
    assert.strictEqual(
      (graphSchema.constraints[0].properties[0].type as PropertyTypes).type,
      "string"
    );
    assert.strictEqual(graphSchema.constraints[1].name, "existence");
    assert.strictEqual(graphSchema.constraints[1].$id, "c2");
    assert.strictEqual(
      graphSchema.constraints[1].constraintType,
      "propertyExistence"
    );
    assert.strictEqual(graphSchema.constraints[1].entityType, "relationship");

    // Indexes
    assert.strictEqual(graphSchema.indexes.length, 3);
    assert.strictEqual(graphSchema.indexes[0].$id, "i1");
    assert.strictEqual(graphSchema.indexes[0].name, "node-index");
    assert.strictEqual(graphSchema.indexes[0].indexType, "default");
    assert.strictEqual(graphSchema.indexes[0].entityType, "node");
    assert.strictEqual(isNodeLabelIndex(graphSchema.indexes[0]), true);
    if (isNodeLabelIndex(graphSchema.indexes[0])) {
      assert.strictEqual(graphSchema.indexes[0].nodeLabel, labels[0]);
      assert.strictEqual(graphSchema.indexes[0].properties.length, 1);
      assert.strictEqual(
        (graphSchema.indexes[0].properties[0].type as PropertyTypes).type,
        "string"
      );
    }

    assert.strictEqual(graphSchema.indexes[1].$id, "i2");
    assert.strictEqual(graphSchema.indexes[1].name, "relationship-index");
    assert.strictEqual(graphSchema.indexes[1].indexType, "range");
    assert.strictEqual(graphSchema.indexes[1].entityType, "relationship");
    assert.strictEqual(isRelationshipTypeIndex(graphSchema.indexes[1]), true);
    if (isRelationshipTypeIndex(graphSchema.indexes[1])) {
      assert.strictEqual(
        graphSchema.indexes[1].relationshipType,
        relationshipTypes[0]
      );
      assert.strictEqual(graphSchema.indexes[1].properties.length, 1);
      assert.strictEqual(
        (graphSchema.indexes[1].properties[0].type as PropertyTypes).type,
        "array"
      );
    }

    assert.strictEqual(graphSchema.indexes[2].$id, "i3");
    assert.strictEqual(graphSchema.indexes[2].name, "lookup-index");
    assert.strictEqual(graphSchema.indexes[2].indexType, "lookup");
    assert.strictEqual(graphSchema.indexes[2].entityType, "node");
    assert.strictEqual(isLookupIndex(graphSchema.indexes[2]), true);
  });

  test("getAllLabelTokes returns all label tokens", () => {
    // call getAllLabelTokens on a graph schema with 3 labels
    const labels = [
      new model.NodeLabel("l1", "Person"),
      new model.NodeLabel("l2", "Movie"),
      new model.NodeLabel("l3", "Genre"),
    ];
    const nodes = [
      new model.NodeObjectType("n1", [labels[0]]),
      new model.NodeObjectType("n2", [labels[1]]),
      new model.NodeObjectType("n3", [labels[2]]),
    ];
    const schema = new model.GraphSchema(nodes, []);

    const tokens = schema.getAllNodeLabelTokens();
    expect(tokens).toMatchInlineSnapshot(`
      [
        "Person",
        "Movie",
        "Genre",
      ]
    `);
  });
  test("getAllRelationshipTypeTokens returns all relationship type tokens", () => {
    // call getAllRelationshipTypeTokens on a graph schema with 3 relationship types
    const relationshipTypes = [
      new model.RelationshipType("rt1", "ACTED_IN"),
      new model.RelationshipType("rt2", "DIRECTED"),
      new model.RelationshipType("rt3", "IS_GENRE"),
    ];
    const nodes = [
      new model.NodeObjectType("n1", []),
      new model.NodeObjectType("n2", []),
    ];
    const rels = [
      new model.RelationshipObjectType(
        "r1",
        relationshipTypes[0],
        nodes[0],
        nodes[1]
      ),
      new model.RelationshipObjectType(
        "r2",
        relationshipTypes[1],
        nodes[0],
        nodes[1]
      ),
      new model.RelationshipObjectType(
        "r3",
        relationshipTypes[2],
        nodes[0],
        nodes[1]
      ),
    ];
    const schema = new model.GraphSchema(nodes, rels);
    const tokens = schema.getAllRelationshipTypeTokens();
    expect(tokens).toMatchInlineSnapshot(`
      [
        "ACTED_IN",
        "DIRECTED",
        "IS_GENRE",
      ]
    `);
  });
  test("getAllPropertyTokens returns all unique property tokens", () => {
    // call getAllPropertyTokens on a graph schema with 3 node object types and 3 relationship object types
    const properties = [
      new model.Property(
        "p:Person.name",
        "name",
        new model.PropertyBaseType("string"),
        false
      ),
      new model.Property(
        "p:Dog.name",
        "name",
        new model.PropertyBaseType("string"),
        false
      ),
      new model.Property(
        "p:ACTED_IN.roles",
        "roles",
        new model.PropertyArrayType(new model.PropertyBaseType("string")),
        false
      ),
    ];
    const labels = [
      new model.NodeLabel("l1", "Person", [properties[0]]),
      new model.NodeLabel("l2", "Dog", [properties[1]]),
      new model.NodeLabel("l3", "Movie"),
    ];
    const relationshipTypes = [
      new model.RelationshipType("rt1", "ACTED_IN", [properties[2]]),
    ];

    const nodeObjectTypes = [
      new model.NodeObjectType("n1", [labels[0]]),
      new model.NodeObjectType("n2", [labels[1]]),
      new model.NodeObjectType("n3", [labels[2]]),
    ];

    const relationshipObjectTypes = [
      new model.RelationshipObjectType(
        "r1",
        relationshipTypes[0],
        nodeObjectTypes[0],
        nodeObjectTypes[2]
      ),
      new model.RelationshipObjectType(
        "r2",
        relationshipTypes[0],
        nodeObjectTypes[1],
        nodeObjectTypes[2]
      ),
    ];

    const schema = new model.GraphSchema(
      nodeObjectTypes,
      relationshipObjectTypes
    );
    const tokens = schema.getAllPropertyTokens();
    expect(tokens).toMatchInlineSnapshot(`
      [
        "name",
        "roles",
      ]
    `);
  });
});
