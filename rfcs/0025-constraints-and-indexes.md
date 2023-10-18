# Constraints and indexes

We want to support constraints and indexes in the schema.

## Challenge

The key challenge is that currently properties are stored on the `[node|relationship]ObjectType`s, which means a property can be defined multiple times for the same node label. Constraints and indexes are defined in the database against node labels (or relationship types) and properties. We would like constraints & indexes to be able to reference node labels, relationship types and properties all by id (for reliability, e.g. if one of those entities is renamed in a user tool).

## Proposal

- Move `properties` from `nodeObjectType` => `nodeLabel` and from `relationshipObjectType` => `relationshipType`
- Add a `constraints` array to `graphSchema`. Constraint elements have the following structure:
```
{
  constraintType: "uniqueness" | "propertyExistence" | "propertyType" | "key"
  entityType: "node" | "relationship",
  nodeLabel: { ref: string } | undefined,
  relationshipType: { $ref: string } | undefined,
  name: string,
  properties: { $ref: string }[]
}
```
- Constraint notes:
  - If the `entityType` is `node`, the `nodeLabel` field is required, and if the `entityType` is `relationship`, the `relationshipType` field is required. There is some duplication of information - the node/relationship reference could be inferred through the `properties` array, and that also implies the entity type - but these fields add clarity and align the schema with indexes which can be created without properties
- Add an `indexes` array to `graphSchema`. Index elements have the following structure:
```
{
  indexType: "range" | "lookup" | "text" | "full-text" | "point" | "default",
  entityType: "node" | "relationship",
  nodeLabel: { ref: string } | undefined,
  relationshipType: { $ref: string } | undefined,
  name: string,
  properties: { $ref: string }[] | undefined
}
```
- Index notes:
  - For `indexType`s other than `lookup`, the same note as for constraints applies regarding the `nodeLabel` and `relationshipType` fields
  - When `indexType` is `lookup` the `nodeLabel`, `relationshipType` and `properties` fields aren't required
  - The `default` `indexType` indicates that the index should be created with the `CREATE INDEX` command without explicitly setting the index type. In neo4j 4.4 this will create a `btree` index, and in neo4j 5.0 this will create a `range` index

### Example

This example shows what the schema would look like and gives a feel for the downsides of moving properties to the `nodeLabel`s and `relationshipType`s. In this example, there are `Person+Actor` and `Person+Director` nodes in the database, and there's an Actor-specific property and a Director-specific property. Issues:

- We can't see as easily what properties the `nodeObjectType`s have (in fact, the `nodeObjectType`s have lost a lot of their value as they now only show the `nodeLabel` combinations)
- The actor-specific properties are repeated twice (assuming that the graph schema inference algorithm wouldn't reasonably be able to infer anything cleverer than "this property appears on the Person label and Actor label"), the director-specific property is also repeated twice, and the person-specific properties are repeated three times. In each case, this is one more time than in the previous iteration of the graph schema (properties on the `nodeObjectType`s)
- It's not clear how user tools which import data and support multi-label nodes will be able to specify different sets of properties depending on the node label combo

```
{
  "graphSchemaRepresentation": {
    "version": "1.0.1",
    "graphSchema": {
      "nodeLabels": [
        {
          "$id": "nl:Person",
          "token": "Person",
          "properties": [
            { "$id": "p:Person:id", "token": "id", "type": { "type": "string" }, "nullable": false },
            { "$id": "p:Person:name", "token": "name", "type": { "type": "string" }, "nullable": false },
            { "$id": "p:Person:born", "token": "born", "type": { "type": "string" }, "nullable": false },
            { "$id": "p:Person:acting-school", "token": "born", "type": { "type": "string" }, "nullable": true },
            { "$id": "p:Person:directing-school", "token": "born", "type": { "type": "string" }, "nullable": true},
          ]
        },
        {
          "$id": "nl:Actor",
          "token": "Actor",
          "properties": [
            { "$id": "p:Actor:id", "token": "id", "type": { "type": "string" }, "nullable": false },
            { "$id": "p:Actor:name", "token": "name", "type": { "type": "string" }, "nullable": false },
            { "$id": "p:Actor:born", "token": "born", "type": { "type": "string" }, "nullable": false },
            { "$id": "p:Actor:acting-school", "token": "born", "type": { "type": "string" }, "nullable": false }
          ]
        },
        {
          "$id": "nl:Director",
          "token": "Director",
          "properties": [
            { "$id": "p:Director:id", "token": "id", "type": { "type": "string" }, "nullable": false },
            { "$id": "p:Director:name", "token": "name", "type": { "type": "string" }, "nullable": false },
            { "$id": "p:Director:born", "token": "born", "type": { "type": "string" }, "nullable": false },
            { "$id": "p:Director:directing-school", "token": "born", "type": { "type": "string" }, "nullable": false }
          ]
        },
        {
          "$id": "nl:Movie",
          "token": "Movie",
          "properties": [
            { "$id": "p:Movie:id1", "token": "id1", "type": { "type": "string" }, "nullable": false },
            { "$id": "p:Movie:id2", "token": "id2", "type": { "type": "string" }, "nullable": false },
            { "$id": "p:Movie:title", "token": "title", "type": { "type": "string" }, "nullable": false },
            { "$id": "p:Movie:release", "token": "release", "type": { "type": "date" }, "nullable": false },
            { "$id": "p:Movie:point", "token": "point", "type": { "type": "point" }, "nullable": true }
          ]
        }
      ],
      "relationshipTypes": [
        {
          "$id": "rt:ACTED_IN",
          "token": "ACTED_IN",
          "properties": [
            { "$id": "p:ACTED_IN:roles", "token": "roles", "type": { "type": "string" }, "nullable": false }
          ]
        },
        {
          "$id": "rt:DIRECTED",
          "token": "DIRECTED",
          "properties": []
        }
      ],
      "nodeObjectTypes": [
        {
          "$id": "n:Actor:Person",
          "labels": [{ "$ref": "#nl:Person" }, { "$ref": "#nl:Actor" }]
        },
        {
          "$id": "n:Director:Person",
          "labels": [{ "$ref": "#nl:Person" }, { "$ref": "#nl:Director" }]
        },
        {
          "$id": "n:Movie",
          "labels": [{ "$ref": "#nl:Movie" }]
        }
      ],
      "relationshipObjectTypes": [
        {
          "$id": "r:ACTED_IN",
          "type": { "$ref": "#rt:ACTED_IN" },
          "from": { "$ref": "#n:Actor:Person" },
          "to": { "$ref": "#n:Movie" }
        },
        {
          "$id": "r:DIRECTED",
          "type": { "$ref": "#rt:DIRECTED" },
          "from": { "$ref": "#n:Director:Person" },
          "to": { "$ref": "#n:Movie" }
        }
      ],
      "constraints": [
        {
          "constraintType": "uniqueness",
          "entityType": "node",
          "nodeLabel": { "$ref": "#nl:Person" },
          "name": "uniq_person_id",
          "properties": [{ "$ref": "#p:Person:id" }]
        },
        {
          "constraintType": "property_existence",
          "entityType": "node",
          "nodeLabel": { "$ref": "#nl:Actor" },
          "name": "exists_actor_school",
          "properties": [{ "$ref": "#p:Actor:acting-school" }]
        },
        {
          "constraintType": "property_type",
          "entityType": "node",
          "nodeLabel": { "$ref": "#nl:Person" },
          "name": "type_person_birth_date",
          "properties": [{ "$ref": "#p:Person:born" }],
          "propertyType": "date"
        },
        {
          "constraintType": "key",
          "entityType": "node",
          "nodeLabel": { "$ref": "#nl:Movie" },
          "name": "key_movie_id",
          "properties": [{ "$ref": "#p:Movie:id1" }, { "$ref": "#p:Movie:id2" }]
        },
        {
          "constraintType": "property_existence",
          "entityType": "relationship",
          "relationshipType": { "$ref": "#rt:ACTED_IN" },
          "name": "exists_acted_in_roles",
          "properties": [{ "$ref": "#p:ACTED_IN:roles" }]
        }
      ],
      "indexes": [
        {
          "indexType": "range",
          "entityType": "node",
          "nodeLabel": { "$ref": "#nl:Person" },
          "name": "range_person_id",
          "properties": [{ "$ref": "#p:Person:id" }]
        },
        {
          "indexType": "default",
          "entityType": "node",
          "nodeLabel": { "$ref": "#nl:Movie" },
          "name": "default_movie_id",
          "properties": [{ "$ref": "#p:Movie:id1" }, { "$ref": "#p:Movie:id2" }]
        },
        {
          "indexType": "lookup",
          "entityType": "node",
          "name": "index_lookup_node",
          "properties": undefined
        },
        {
          "indexType": "text",
          "entityType": "node",
          "nodeLabel": { "$ref": "#nl:Director" },
          "name": "text_index_directing-school",
          "properties": [{ "$ref": "#p:Director:directing-school" }]
        },
        {
          "indexType": "full-text",
          "entityType": "node",
          "nodeLabel": { "$ref": "#nl:Movie" },
          "name": "full-text_index_movie-title",
          "properties": [{ "$ref": "#p:Movie:title" }]
        },
        {
          "indexType": "point",
          "entityType": "node",
          "nodeLabel": { "$ref": "#nl:Movie" },
          "name": "point_index_movie-point",
          "properties": [{ "$ref": "#p:Movie:point" }]
        },
        {
          "indexType": "lookup",
          "entityType": "relationship",
          "name": "index_lookup_relationship",
          "properties": undefined
        }
      ]
    }
  }
}
```

## Other ideas

### Pull properties out as an array, but continue to store them against nodeObjectType

We considered pulling the `properties` out as an array at the root level, which could be referenced by the `constraints`, `indexes`, `nodeObjectTypes` and `relationshipObjectTypes`. Example:

```
{
  "graphSchemaRepresentation": {
    "version": "1.0.1",
    "graphSchema": {
      "properties": [
        { "$id": "p:Person:id", "token": "id", "type": { "type": "string" }, "nullable": false },
        { "$id": "p:Person:name", "token": "name", "type": { "type": "string" }, "nullable": false },
        { "$id": "p:Person:born", "token": "born", "type": { "type": "string" }, "nullable": false },
      ]
      "nodeLabels": [
        { "$id": "nl:Person", "token": "Person" }
      ],
      "relationshipTypes": [],
      "nodeObjectTypes": [
        {
          "$id": "n:Person",
          "labels": [{ "$ref": "#nl:Person" }, { "$ref": "#nl:Actor" }],
          "properties": [
            { "$ref": "#p:Person:id" },
            { "$ref": "#p:Person:name" },
            { "$ref": "#p:Person:born" }
          ]
        }
      ],
      "relationshipObjectTypes": [],
      "constraints": [
        {
          "constraintType": "uniqueness",
          "entityType": "node",
          "nodeLabel": { "$ref": "#nl:Person" },
          "name": "uniq_person_id",
          "properties": [{ "$ref": "#p:Person:id" }]
        },
      ],
      "indexes": [
        {
          "indexType": "range",
          "entityType": "node",
          "nodeLabel": { "$ref": "#nl:Person" },
          "name": "range_person_id",
          "properties": [{ "$ref": "#p:Person:id" }]
        }
      ]
    }
  }
}
```

Issue:

- Once multiple labels have properties with the same name this breaks down. E.g. if we had `Person`, `Person+Actor` and `Actor` node label comboas which all had properties with the name `id`, these would have to be 3 separate properties for each `nodeObjectType`, and a constraint on `Person.id` wouldn't have a clear `id` property to reference

### Properties live on nodeObjectType, and constraints/indexes reference a property multiple times

Another idea is that constraints & indexes could reference a property multiple times, for each `nodeObjectType` they existed on. Example:

```
{
  "graphSchemaRepresentation": {
    "version": "1.0.1",
    "graphSchema": {
      "nodeLabels": [
        { "$id": "nl:Person", "token": "Person" },
        { "$id": "nl:Actor", "token": "Actor" },
        { "$id": "nl:Director", "token": "Director" }
      ],
      "relationshipTypes": [],
      "nodeObjectTypes": [
        {
          "$id": "n:Actor:Person",
          "labels": [{ "$ref": "#nl:Person" }, { "$ref": "#nl:Actor" }],
          "properties": [
            { "$id": "p:PersonActor:id", "token": "id", "type": { "type": "string" }, "nullable": false },
            { "$id": "p:PersonActor:name", "token": "name", "type": { "type": "string" }, "nullable": false },
            { "$id": "p:PersonActor:born", "token": "born", "type": { "type": "string" }, "nullable": false },
            { "$id": "p:PersonActor:acting-school", "token": "born", "type": { "type": "string" }, "nullable": false }
          ]
        },
        {
          "$id": "n:Director:Person",
          "labels": [{ "$ref": "#nl:Person" }, { "$ref": "#nl:Director" }],
          "properties": [
            { "$id": "p:PersonDirector:id", "token": "id", "type": { "type": "string" }, "nullable": false },
            { "$id": "p:PersonDirector:name", "token": "name", "type": { "type": "string" }, "nullable": false },
            { "$id": "p:PersonDirector:born", "token": "born", "type": { "type": "string" }, "nullable": false },
            { "$id": "p:PersonDirector:directing-school", "token": "born", "type": { "type": "string" }, "nullable": false }
          ]
        }
      ],
      "relationshipObjectTypes": [],
      "constraints": [
        {
          "constraintType": "uniqueness",
          "entityType": "node",
          "nodeLabel": { "$ref": "#nl:Person" },
          "name": "uniq_person_id",
          "properties": [
            [{ "$ref": "#p:PersonActor:id" }, { "$ref": "#p:PersonDirector:id" }]
          ]
        }
      ],
      "indexes": [
        {
          "indexType": "range",
          "entityType": "node",
          "nodeLabel": { "$ref": "#nl:Person" },
          "name": "range_person_id",
          "properties": [{ "$ref": "#p:Person:id" }]
          "properties": [
            [{ "$ref": "#p:PersonActor:name" }, { "$ref": "#p:PersonDirector:name" }],
            [{ "$ref": "#p:PersonActor:born" }, { "$ref": "#p:PersonDirector:born" }]
          ]
        }
      ]
    }
  }
}
```

The downsides are:

- It's quite cumbersome
- It doesn't reflect what's happening in the database as clearly as when the constraint / index references a property on the node label / relationship type

### Store properties against nodeLabel, nodeObjectType, relationshipType and relationshipObjectType

This feels pretty heavy-handed, but would be a way to both correctly reflect how constraints & indexes are defined in the database while also getting the benefit of the *ObjectType property definitions.
