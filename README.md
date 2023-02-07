# Graph Schema JSON util.

## Install
```
npm install @neo4j/graph-schema-utils
```

## Consume
There are two parts to this repo:

1. A JSON schema that describes how a graph schema should be expressed in JSON.
2. Utility functions that help the consumers to validate and work with a graph schema. 

### JSON-schema
The JSON that describes the shape of a graph schema is available in the source code (`packages/json-schema/json-schema.json`) and published on: https://dist.neo4j.org/json-graph-schema/

### Validate 
This function is needed to perform a validation on a graph schema. The validateSchema function compares the output against the JSON schema. 
```js
import { validateSchema } from "@neo4j/graph-schema-utils";

validateSchema(jsonSchema, graphSchema) 
```

### Parse
Since the references in the JSON document are references by id:s, there's a parser utility that hydrates the references and makes it easy to work with the schema.
```js
import { model } from "@neo4j/graph-schema-utils";

const parsed = model.GraphSchemaRepresentation.parseJson(graphSchemaJsonString);
```

### Serialize
If you need to transport or persist the schema, you can serialize the model.
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
