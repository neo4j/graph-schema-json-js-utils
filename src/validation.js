import Ajv from "ajv";

const ajv = new Ajv({ strict: false, allErrors: true });

/**
 *
 * @type {import ("./types").ValidateSchemaFunction}
 *
 */
export function validateSchema(jsonSchema, graphSchema) {
  const validate = ajv.compile(jsonSchema);
  const result = validate(graphSchema);
  if (result !== true) {
    throw new SchemaValidationError(validate.errors);
  }
  return true;
}

export class SchemaValidationError extends Error {
  /**
   * @type {string[]}
   */
  messages = [];

  /**
   * @param {string[]} inputMessages
   */
  constructor(inputMessages) {
    super(inputMessages);
    this.messages = inputMessages;
    this.name = "SchemaValidationError";
  }
}
