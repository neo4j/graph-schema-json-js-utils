import AjvModule from "ajv";
export declare function validateSchema(jsonSchema: string, graphSchema: string): boolean;
export declare class SchemaValidationError extends Error {
    messages: AjvModule.ErrorObject<string, Record<string, any>, unknown>[];
    constructor(inputMessages: AjvModule.ErrorObject<string, Record<string, any>, unknown>[]);
}
export declare class InputTypeError extends Error {
    constructor(message: string);
}
