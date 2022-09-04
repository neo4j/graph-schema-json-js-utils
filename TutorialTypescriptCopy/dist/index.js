"use strict";
const Ajv = require("ajv/dist/jtd");
const ajv = new Ajv({ allErrors: true });
console.log(ajv);
const schema = {
    type: 'object',
    additionalProperties: false,
    requierd: ['hello'],
    properties: { hello: { type: 'string' }
    }
};
const obj = { hello: 'my name is starting with a M' };
const test = ajv.compile(schema);
const isValide = test(obj);
console.log(isValide ? obj : { obj, error: test.errors });
//# sourceMappingURL=index.js.map