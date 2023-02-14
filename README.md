# Graph Schema JSON utility library

## Install

```
npm install @neo4j/graph-schema-utils
```

## How to consume

There are two parts to this repo:

1. A JSON schema that describes how a graph schema should be expressed in JSON.
2. Utility functions that help the consumers to validate and work with a graph schema.

### JSON-schema

The JSON that describes the shape of a graph schema is available in the source code (`packages/json-schema/json-schema.json`) and published on: https://dist.neo4j.org/json-graph-schema/ (to be published, not in place yet)

### Validate

This function is needed to perform a validation on a graph schema. The validateSchema function compares the output against the JSON schema.

```js
import { validateSchema } from "@neo4j/graph-schema-utils";

validateSchema(jsonSchema, graphSchema);
```

### Parse

Since the references in the JSON document are references by id:s, there's a parser utility that hydrates the references and makes it easy to work with the schema.

```js
import { model } from "@neo4j/graph-schema-utils";

const parsed = model.GraphSchemaRepresentation.parseJson(graphSchemaJsonString);
```

### Model

You can also create a schema model programatically.
Example:

```js
import { model } from "@neo4j/graph-schema-utils"

const labels = [
    new model.NodeLabel("l1", "Person"),
    new model.NodeLabel("l1", "Movie"),
  ];
  
  const relationshipTypes = [new model.RelationshipType("rt1", "ACTED_IN")];
  
  const properties = [
    new model.Property("name", new model.PropertyBaseType("string"), true),
    new model.Property("title", new model.PropertyBaseType("string"), true),
    new model.Property("roles", new model.PropertyArrayType(new model.PropertyBaseType("string")), false),
  ];
  
  const nodeObjectTypes = [
    new model.NodeObjectType("n1", [labels[0]], [properties[0]]), // (:Person {name}) node type
    new model.NodeObjectType("n2", [labels[1]], [properties[1]]), // (:Movie {title}) node type
  ];
  
  const relationshipObjectTypes = [
    // (:Person {name})-[:ACTED_IN {roles}]->(:Movie {title})
    new model.RelationshipObjectType(
      "r1",
      relationshipTypes[0],
      nodeObjectTypes[0],
      nodeObjectTypes[1],
      [properties[2]]
    ),
  ];
  
  const graphSchema = new model.GraphSchema(
    labels,
    relationshipTypes,
    nodeObjectTypes,
    relationshipObjectTypes
  );

const myModel = new model.GraphSchemaRepresentation("1.0.0", graphSchema);
```

### Serialize

If you need to transport or persist the schema, you can serialize the model into the JSON represenation.

```js
const serialized = myModel.toJson();
```

## Contribute

We welcome contributions to this repo. Fork this repo and open a PR!

### Run test

To run a single test run:

```bash
npm run test
```

To watch for changes and run tests on change:

```bash
npm run test:watch
```

### Build

To build the TypeScript:

```bash
npm run build
```
