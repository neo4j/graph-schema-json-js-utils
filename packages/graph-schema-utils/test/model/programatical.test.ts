import { strict as assert } from "node:assert";
import { describe, expect, test } from "vitest";
import { model } from "../../src/index.js";
import { PropertyTypes } from "../../src/model/index.js";

describe("Programatic model tests", () => {
  test("Can be created programatically", () => {
    const labels = [
      new model.NodeLabel("l1", "Person"),
      new model.NodeLabel("l2", "Movie"),
      new model.NodeLabel("l3", "Genre"),
    ];
    const relationshipTypes = [
      new model.RelationshipType("rt1", "ACTED_IN"),
      new model.RelationshipType("rt2", "DIRECTED"),
      new model.RelationshipType("rt3", "IS_GENRE"),
    ];
    const personProperties = [
      new model.Property("name", new model.PropertyBaseType("string"), false),
    ];
    const nodeObjectTypes = [
      new model.NodeObjectType("n1", [labels[0]], personProperties),
      new model.NodeObjectType("n2", [labels[1]]),
      new model.NodeObjectType("n3", [labels[2]]),
    ];

    const actedInProperties = [
      new model.Property(
        "roles",
        new model.PropertyArrayType(new model.PropertyBaseType("string")),
        false
      ),
    ];
    const relationshipObjectTypes = [
      new model.RelationshipObjectType(
        "r1",
        relationshipTypes[0],
        nodeObjectTypes[0],
        nodeObjectTypes[1],
        actedInProperties
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

    const graphSchema = new model.GraphSchema(
      nodeObjectTypes,
      relationshipObjectTypes
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
    assert.strictEqual(graphSchema.nodeObjectTypes[0].properties.length, 1);
    assert.strictEqual(
      graphSchema.nodeObjectTypes[0].properties[0].token,
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
      graphSchema.relationshipObjectTypes[0].properties.length,
      1
    );
    assert.strictEqual(
      graphSchema.relationshipObjectTypes[0].properties[0].token,
      "roles"
    );
    assert.strictEqual(
      (
        graphSchema.relationshipObjectTypes[0].properties[0]
          .type as PropertyTypes
      ).type,
      "array"
    );
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
    const labels = [
      new model.NodeLabel("l1", "Person"),
      new model.NodeLabel("l2", "Dog"),
      new model.NodeLabel("l3", "Movie"),
    ];
    const relationshipTypes = [new model.RelationshipType("rt1", "ACTED_IN")];
    const properties = [
      new model.Property("name", new model.PropertyBaseType("string"), false),
      new model.Property("name", new model.PropertyBaseType("string"), false),
      new model.Property(
        "roles",
        new model.PropertyArrayType(new model.PropertyBaseType("string")),
        false
      ),
    ];
    const nodeObjectTypes = [
      new model.NodeObjectType("n1", [labels[0]], [properties[0]]),
      new model.NodeObjectType("n2", [labels[1]], [properties[1]]),
      new model.NodeObjectType("n3", [labels[2]]),
    ];

    const relationshipObjectTypes = [
      new model.RelationshipObjectType(
        "r1",
        relationshipTypes[0],
        nodeObjectTypes[0],
        nodeObjectTypes[2],
        [properties[2]]
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
