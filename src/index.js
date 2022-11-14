import Ajv from "ajv";

const ajv = new Ajv({ strict: false });

export function validateSchema(jsonSchema, graphSchema) {
    const validate = ajv.compile(jsonSchema);
    return validate(graphSchema);
}
