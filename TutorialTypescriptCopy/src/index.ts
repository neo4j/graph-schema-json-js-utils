//ajv is for validating your data by comparing to 
//JSON schema object you made with typescript-json-schema
import Ajv, {JSONSchemaType} from 'ajv'
const ajv = new Ajv()

interface MyData {
    age: number
    name: string
}

//define a schema
const schema: JSONSchemaType<MyData> = {
    type: 'object',
    properties: {
        age: { type: 'integer'},
        name: { type: 'string', nullable: true}
    },
    required: ['age'],
    additionalProperties: false
}

const validate = ajv.compile(schema)

const data = {
    age: 1,
    name: 'abc'
}

if (validate(data)) {
    //data is MyData here
    console.log(data.age)
} else {
    console.log(validate.errors)

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

