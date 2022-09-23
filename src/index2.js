// or ESM/TypeScript import
import Ajv from "ajv";
// Node.js require:
//const Ajv = require("ajv");

const ajv = new Ajv(); // options can be passed, e.g. {allErrors: true}

const schema = {
    type: "object",
    properties: {
        foo: { type: "integer" },
        bar: { type: "string" },
    },
    required: ["foo"],
    additionalProperties: false,
};

const data = {
    foo: 123,
    bar: "abc",
};

const valid = ajv.validate(schema, data);
if (valid) {
    console.log("The data is valid!");
} else {
    console.log("The data is not valid!", ajv.errors);
}

/*
const validate = ajv.compile(schema);
const valid = validate(data);
if (!valid) console.log(validate.errors);
*/
