import Ajv from "ajv";

const ajv = new Ajv({ strict: false, allErrors: true });

/**
 *
 * @type {import ("./types").ValidateSchemaFunction}
 *
 */
export function validateSchema(jsonSchema, graphSchema) {
  if (typeof jsonSchema !== "string") {
    throw new InputTypeError("JSON schema should be a string");
  }
  let jsonSchemaObj;
  try {
    jsonSchemaObj = JSON.parse(jsonSchema);
  } catch (_) {

    throw new InputTypeError("Cannot JSON.parse JSON schema input");

  }

  const graphSchemaObj = JSON.parse(graphSchema);

  const validate = ajv.compile(jsonSchemaObj);
  const result = validate(graphSchemaObj);

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

export class InputTypeError extends Error {
  constructor(message) {
    super(message);
    this.name = "InputTypeError";
  }
}
