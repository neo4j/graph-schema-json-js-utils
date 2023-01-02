import Ajv from "ajv";

const ajv = new Ajv({ strict: false, allErrors: true });

export function validateSchema(jsonSchema, graphSchema) {
  const validate = ajv.compile(jsonSchema);
  const result = validate(graphSchema);
  if (result !== true) {
    throw new SchemaValidationError(validate.errors);
  }
  return true;
}

export class SchemaValidationError extends Error {
  messages = [];
  constructor(messages) {
    super(messages);
    this.messages = messages;
    this.name = "SchemaValidationError";
  }
}
