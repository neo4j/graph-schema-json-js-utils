//ajv is for validating your data by comparing to
//JSON schema object you made with typescript-json-schema
import Ajv from "ajv";

//const Ajv = require("ajv");

const ajv = new Ajv();
//import "./GraphSchema.json" assert { type: "json" };

const schema = {
    title: "Example Schema",
    type: "object",
    properties: {
        firstName: {
            type: "string",
        },
        lastName: {
            type: "string",
        },
        age: {
            description: "age in years",
            type: "integer",
            minimum: 5,
            maximum: 100,
        },
        hairColor: {
            enum: ["black", "red", "brown"],
            type: "string",
        },
    },

    required: ["age"], //requirements on what must be filled in.
    additionalProperties: false,
};

//const validate = ajv.compile(GraphSchema.json); //JSONschemat från fil. Oklart om detta ska vara med...
/*
const data = {
    name: "Keanu Reeves",
    born: "1964",
};
*/

const data = {
    firstName: "Gabbi",
    lastName: "Mukanga",
    age: 1,
};

const validate = ajv.compile(schema);
const valid = validate(data);
if (!valid) console.log(validate.errors);
else console.log(data + "data-test");

/*
function validate() {
    if (data) {
        //data is MyData here
        console.log(data.name);
    } else {
        console.log(validate.errors);
    }
}
*/

//define a schema
/*const schema = {
    type: 'object',
    additionalProperties: false,
    requierd: ['hello'],
    properties: { hello: 
        { type: 'string' } 
    }

};

const obj = {hello: 'my name is starting with a M'};
const test = ajv.compile(schema);
const isValide = test(obj);
console.log(isValide ? obj : {obj, error: test.errors});*/
