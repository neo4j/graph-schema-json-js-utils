//ajv is for validating your data by comparing to
//JSON schema object you made with typescript-json-schema
import Ajv from "ajv";
const ajv = new Ajv();

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
    if: { properties: { age: { maximum: 60 } } },
    then: { required: ["Salary"] },
    else: { required: ["pension"] },

    required: ["age"], //requirements on what must be filled in.
    additionalProperties: false,
};

const validate = ajv.compile(schema);

const data = {
    firstName: "Gabbi",
    lastName: "Mukanga",
    age: 35,
};

if (validate(data)) {
    //data is MyData here
    console.log(data.age);
} else {
    console.log(validate.errors);
}

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
