import { strict as assert } from "node:assert";
import { describe, expect, test } from "vitest";
import { model } from "../../src/index.js";
import {
  Property,
  PropertyTypes,
  isLookupIndex,
  isNodeLabelConstraint,
  isNodeLabelIndex,
  isRelationshiptypeIndex,
} from "../../src/model/index.js";

describe("Programatic model tests", () => {
  test("Can be created programatically", () => {
    const personProperties = [
      new model.Property(
        "p1",
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
        "p2",
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

    const gRep = new model.GraphSchemaRepresentation("1.0.1", graphSchema);

    assert.strictEqual(gRep.graphSchema.nodeLabels.length, 3);
    assert.strictEqual(gRep.graphSchema.relationshipTypes.length, 3);
    assert.strictEqual(gRep.graphSchema.nodeObjectTypes.length, 3);
    assert.strictEqual(gRep.graphSchema.relationshipObjectTypes.length, 3);
    assert.strictEqual(gRep.graphSchema.constraints.length, 2);

    assert.strictEqual(gRep.graphSchema.nodeObjectTypes[0].labels[0].$id, "l1");
    assert.strictEqual(
      gRep.graphSchema.nodeObjectTypes[0].labels[0],
      gRep.graphSchema.nodeLabels[0]
    );
    assert.strictEqual(gRep.graphSchema.nodeLabels[0].properties.length, 1);
    assert.strictEqual(
      gRep.graphSchema.nodeLabels[0].properties[0].token,
      "name"
    );
    assert.strictEqual(
      gRep.graphSchema.relationshipObjectTypes[0].type.$id,
      "rt1"
    );
    assert.strictEqual(
      gRep.graphSchema.relationshipObjectTypes[0].from.$id,
      "n1"
    );
    assert.strictEqual(
      gRep.graphSchema.relationshipObjectTypes[0].from,
      nodeObjectTypes[0]
    );
    assert.strictEqual(
      gRep.graphSchema.relationshipObjectTypes[0].to.$id,
      "n2"
    );
    assert.strictEqual(
      gRep.graphSchema.relationshipObjectTypes[0].to,
      nodeObjectTypes[1]
    );
    assert.deepEqual(gRep.graphSchema.relationshipObjectTypes[0].toRef(), {
      $ref: "#r1",
    });
    assert.strictEqual(
      gRep.graphSchema.relationshipTypes[0].properties.length,
      1
    );
    assert.strictEqual(
      gRep.graphSchema.relationshipTypes[0].properties[0].token,
      "roles"
    );
    assert.strictEqual(
      gRep.graphSchema.relationshipTypes[0].properties[0].$id,
      "p2"
    );
    assert.strictEqual(
      (
        gRep.graphSchema.relationshipTypes[0].properties[0]
          .type as PropertyTypes
      ).type,
      "array"
    );

    // Constraints
    assert.strictEqual(gRep.graphSchema.constraints[0].properties.length, 1);
    assert.strictEqual(
      gRep.graphSchema.constraints[0].properties[0].token,
      "name"
    );
    assert.strictEqual(gRep.graphSchema.constraints[0].name, "unique");
    assert.strictEqual(gRep.graphSchema.constraints[0].$id, "c1");
    assert.strictEqual(
      gRep.graphSchema.constraints[0].constraintType,
      "uniqueness"
    );
    assert.strictEqual(gRep.graphSchema.constraints[0].entityType, "node");
    assert.strictEqual(
      isNodeLabelConstraint(gRep.graphSchema.constraints[0]),
      true
    );
    if (isNodeLabelConstraint(gRep.graphSchema.constraints[0])) {
      assert.strictEqual(gRep.graphSchema.constraints[0].nodeLabel, labels[0]);
    }
    assert.strictEqual(
      (gRep.graphSchema.constraints[0].properties[0].type as PropertyTypes)
        .type,
      "string"
    );
    assert.strictEqual(gRep.graphSchema.constraints[1].name, "existence");
    assert.strictEqual(gRep.graphSchema.constraints[1].$id, "c2");
    assert.strictEqual(
      gRep.graphSchema.constraints[1].constraintType,
      "propertyExistence"
    );
    assert.strictEqual(
      gRep.graphSchema.constraints[1].entityType,
      "relationship"
    );

    // Indexes
    assert.strictEqual(gRep.graphSchema.indexes.length, 3);
    assert.strictEqual(gRep.graphSchema.indexes[0].$id, "i1");
    assert.strictEqual(gRep.graphSchema.indexes[0].name, "node-index");
    assert.strictEqual(gRep.graphSchema.indexes[0].indexType, "default");
    assert.strictEqual(gRep.graphSchema.indexes[0].entityType, "node");
    assert.strictEqual(isNodeLabelIndex(gRep.graphSchema.indexes[0]), true);
    if (isNodeLabelIndex(gRep.graphSchema.indexes[0])) {
      assert.strictEqual(gRep.graphSchema.indexes[0].nodeLabel, labels[0]);
      assert.strictEqual(gRep.graphSchema.indexes[0].properties.length, 1);
      assert.strictEqual(
        (gRep.graphSchema.indexes[0].properties[0].type as PropertyTypes).type,
        "string"
      );
    }

    assert.strictEqual(gRep.graphSchema.indexes[1].$id, "i2");
    assert.strictEqual(gRep.graphSchema.indexes[1].name, "relationship-index");
    assert.strictEqual(gRep.graphSchema.indexes[1].indexType, "range");
    assert.strictEqual(gRep.graphSchema.indexes[1].entityType, "relationship");
    assert.strictEqual(
      isRelationshiptypeIndex(gRep.graphSchema.indexes[1]),
      true
    );
    if (isRelationshiptypeIndex(gRep.graphSchema.indexes[1])) {
      assert.strictEqual(
        gRep.graphSchema.indexes[1].relationshipType,
        relationshipTypes[0]
      );
      assert.strictEqual(gRep.graphSchema.indexes[1].properties.length, 1);
      assert.strictEqual(
        (gRep.graphSchema.indexes[1].properties[0].type as PropertyTypes).type,
        "array"
      );
    }

    assert.strictEqual(gRep.graphSchema.indexes[2].$id, "i3");
    assert.strictEqual(gRep.graphSchema.indexes[2].name, "lookup-index");
    assert.strictEqual(gRep.graphSchema.indexes[2].indexType, "lookup");
    assert.strictEqual(gRep.graphSchema.indexes[2].entityType, "node");
    assert.strictEqual(isLookupIndex(gRep.graphSchema.indexes[2]), true);
  });
  test("Allows creation of properties with complicated types", () => {
    const properties = [
      new model.Property(
        "p1",
        "name",
        new model.PropertyArrayType(new model.PropertyBaseType("string")),
        false
      ),
      new model.Property(
        "p2",
        "id",
        [
          new model.PropertyBaseType("integer"),
          new model.PropertyBaseType("string"),
        ],
        false
      ),
      new model.Property(
        "p3",
        "another",
        [
          new model.PropertyBaseType("float"),
          new model.PropertyArrayType(new model.PropertyBaseType("datetime")),
        ],
        false
      ),
    ];
    const serialized = properties.map((p) => p.toJsonStruct());
    expect(serialized).toMatchInlineSnapshot(`
      [
        {
          "$id": "p1",
          "nullable": false,
          "token": "name",
          "type": {
            "items": {
              "type": "string",
            },
            "type": "array",
          },
        },
        {
          "$id": "p2",
          "nullable": false,
          "token": "id",
          "type": [
            {
              "type": "integer",
            },
            {
              "type": "string",
            },
          ],
        },
        {
          "$id": "p3",
          "nullable": false,
          "token": "another",
          "type": [
            {
              "items": {
                "type": "datetime",
              },
              "type": "array",
            },
            {
              "type": "float",
            },
          ],
        },
      ]
    `);
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
        "p1",
        "name",
        new model.PropertyBaseType("string"),
        false
      ),
      new model.Property(
        "p2",
        "name",
        new model.PropertyBaseType("string"),
        false
      ),
      new model.Property(
        "p3",
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
