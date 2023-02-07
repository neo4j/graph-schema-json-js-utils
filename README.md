# Graph Schema JSON util.

## Install
```
npm install @neo4j/graph-schema-utils
```

## Consume
There are two parts to this repo:

1. A JSON schema that describes how a graph schema should be expressed in JSON.
2. Utility functions that help the consumers to validate and work with a graph schema. 

This allows the user to validate a graph schema to see if it follows the correct graph specification. The result is displayed in the form of a JSON schema, which should also be able to be translated into a .js object and into a JSON string.

## Use
json-schema.json
The file contains of the description against which the graph schema will be validated. The JSON schema serves as a template or as the structure that the graph schema is expected to have.

## The validation 
This function is needed to perform a validation on a graph schema. The validateSchema function compares the output against the JSON schema. 
```js
import { SchemaValidationError, validateSchema } from "../../src/index.js";
```

The SchemaValidationError class captures the error message that occurs if an error is detected during validation.
```js
export function validateSchema(jsonSchema, graphSchema) 
```

## Parser
Since the references in the JSON document are references by id:s, there's a parser utility that hydrates the references and makes it easy to work with the schema.
```js
import { model } from "../../src";

const parsed = model.GraphSchemaRepresentation.parseJson(myModel);
```

## Serializer
If you need to transport or persist the schema, you can serialize the model.
```js
const serialized = myModel.toJson();
```

## Run test
```npm run test ``` 
Run ```npm run test:watch``` to let the test watch the users file changes live.

 
