# Graph Schema JSON util.

## Consume
The contents of this repot allow you to validate a graph schema to see if it follows the correct graph specification. The purpose is to allow you to extract the relationships that exist in the database. The result is displayed in the form of a JSON schema, which should also be able to be translated into a .js object and then back into a JSON schema.

## Use
json-schema.json
The file contains of the description against which the graph schema will be validated. The JSON schema serves as a template or as the structure that the graph schema is expected to have.

## The validation 
This function is needed to perform validation on a graph schema. The validateSchema function compares the output against the JSON schema. 
```js
export {validateSchema, SchemaValidationError};
```

The SchemaValidationError class captures the error message that occurs if an error is detected during validation.
```js
export function validateSchema(jsonSchema, graphSchema) 
```

## Parser
To make it easy to work with the schema.
```js
const parsed = model.GraphSchemaRepresentation.parseJson(myModel);
```

## Serializer
To make it easier to save the schema or to send it to someone else.
```js
const serialized = myModel.toJson();
```

## Test
Unit testing uses the Vitest framework to get fast results. The package consists of tests divided into two groups.
One group 'model' tests the structure of the graph schema when it is parsed and so that it is parsed correctly. 
The second group 'validation' tests the validation on the different levels of the JSON schema to see if the validation works correctly. 

The package also consists of the file 'fs.utils.js'. It is a function that reads the file to be validated. 
