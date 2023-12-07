# Consume

## Install for consumption

```bash
npm install @neo4j/graph-schema-utils
```

## Use

### Validate

This function is needed to perform a validation on a graph schema. The validateSchema function compares the output against the JSON schema.

```js
import { validateSchema } from "@neo4j/graph-schema-utils";

validateSchema(jsonSchema, graphSchema);
```

### Model

You can also create a schema model programatically.
Example:

```js
import { model } from "@neo4j/graph-schema-utils";

const labels = [
  new model.NodeLabel("l1", "Person"),
  new model.NodeLabel("l1", "Movie"),
];

const relationshipTypes = [new model.RelationshipType("rt1", "ACTED_IN")];

const properties = [
  new model.Property("name", new model.PropertyBaseType("string"), true),
  new model.Property("title", new model.PropertyBaseType("string"), true),
  new model.Property(
    "roles",
    new model.PropertyArrayType(new model.PropertyBaseType("string")),
    false
  ),
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
  nodeObjectTypes,
  relationshipObjectTypes
);
```

# Develop / Contribute

## Install dependencies

```
npm install
```

## Run script

```
npm start
# or
node ./src/index.js
```
