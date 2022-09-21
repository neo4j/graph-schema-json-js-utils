import Ajv, {JSONSchemaType} from "ajv"
const ajv = new Ajv()

interface MyData {
  foo: number
  bar?: string
}

const schema: JSONSchemaType<MyData> = {
  type: "object",
  properties: {
    foo: {type: "integer"},
    bar: {type: "string", nullable: true}
  },
  required: ["foo"],
  additionalProperties: false
}

// validate is a type guard for MyData - type is inferred from schema type
const validate = ajv.compile(schema)

// or, if you did not use type annotation for the schema,
// type parameter can be used to make it type guard:
// const validate = ajv.compile<MyData>(schema)

const data = {
  foo: 1,
  bar: "abc"
}

if (validate(data)) {
  // data is MyData here
  console.log(data.foo)
} else {
  console.log(validate.errors)
}