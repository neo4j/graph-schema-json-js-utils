//ajv is for validating your data by comparing to
//JSON schema object you made with typescript-json-schema
import Ajv from "ajv";

//const Ajv = require("ajv");

const ajv = new Ajv();

const schema = {
        "type" : "object",
        "properties" : {
            "graphDescription" : {
                "type" : "object",
                "properties" : {
                    "version" : { "type" : "string"},
                    "name" : { "type" : "string"},
                    "nodeSpaces" : { "type" : "array", "item" : {"$ref" : "#/$defs/Node"} },
                    "relationshipSpecs" : { "type" : "array", "items" : { "$ref" : "#/$defs/Relationship"} }
    
                },
                "additionalProperties" : "falce",
                "required" : ["nodeSpecs"]
            },
            "extensions" : {
                "type" : "object",
                "properties" : {
                    "indexes" : { "type" : "array", "items" : { "$ref" : "#/$defs/Index"} },
                    "constraints" : { "type" : "array", "items" : { "$ref" : "#/$defs/Constraint"} }
                }
            }
        },
        "additionalProperties" : false,
    
        "$defs" : {
            "Node" : {
                "type" : "object",
                "properties" : {
                    "ref" : {"type" : "string"},
                    "lableRefs" : { "type" : "array", "items" : { "type" : "string"} },
                    "properties" : { "$ref" : "#/defs/properties" }
                },
                "additionalProperties" : false, 
                "required" : ["ref", "lableRefs"]
            },
            "Relationship" : {
                "type" : "object",
                "properties" : { 
                    "ref" : {"type" : "string"},
                    "typeRef" : { "type" : "string" },
                    "properties" : { "$ref" : "#/$defs/Properties" },
                    "fromNodeRef" : { "type" : "string" },
                    "toNodeRef" : { "type" : "string" }
                },
                "additionalProperties" : false,
                "required" : ["ref", "typeRef", "fromNodeRef", "toNodeRef"]
            },
            "Index" : {
                "type" : "object",
                "propersies" : {
                    "ref" : { "type" : "string" },
                    "name" : { "type" : "string" },
                    "type" : { "enum" : ["BTREE", "FULLTEXT", "TEXT", "LOOKUP", "RANGE", "POINT"] },
                    "options" : {"type" : "object" },
                    "entityType" : { "enum" : ["LABEL"] },
                    "entityRef" : { "type" : "string"},
                    "propersties" : { "type" : "array", "items" : { "type" : "string"} },
                    "uniqueness" : { "type" : "boolean"}
    
                },
                "additionalProperties" : false,
                "required" : ["ref", "name", "type", "entityType", "entityRef", "propersies"]
            }, 
            "Constraint" : {
                "type" : "object", 
                "properties" : {
                    "name" : { "type" : "string" },
                    "type" : {
                        "enum" : ["UNIQUENESS", "NODE_PROPERTY_EXISTENCE", "NODE_KEY", "RELATIONSHIP_PROPERTY_EXISTENCE"]
                    },
                    "options" : { "type" : "object" },
                    "entityType" : { "enum" : ["LABEL", "RELATIONSHIP_TYPE"] },
                    "entityRef" : { "type" : "string" },
                    "properties" : { "type" : "array", "items" : { "type" : "string"} },
                    "indesRef" : { "type" : ["string", "null"] }
                },
                "additionalProperties" : false,
                "required" : ["name", "type", "entityType", "entityRef", "propersies", "indexRef"]
            },
            "Properties" : {
                "type" : "object",
                "properties" : {
                    "type" : "object",
                    "properties" : {
                        "type" : {
                            "enum": [
                                "integer",
                                "string",
                                "float",
                                "boolean",
                                "point",
                                "date",
                                "datetime",
                                "time",
                                "localtime",
                                "localdatetime",
                                "duration"
                            ]
                        },
                        "optional" : "boolean"
                    },
                    "additionalProperties" : false,
                    "required" : ["type"]
                }
            }
        }
};

//const validate = ajv.compile(GraphSchema.json); //JSONschemat från fil. Oklart om detta ska vara med...
/*
const data = {
    name: "Keanu Reeves",
    born: "1964",
};
*/

const data = {
        "graphDescription": {
            "version": "1.0.0",
            "name": "MovieDB",
            "nodeSpecs": [
                {
                    "ref": "nr1",
                    "lables": ["Person"],
                    "properties": {
                        "name": {
                            "type": "string"
                        },
                        "born": {
                            "type": "integer" 
                        }
                    }
                },
                {
                    "ref": "nr2",
                    "lables": ["Movie"],
                    "propersies": {
                        "title": {
                            "type": "string"
                        }
                    }
                },
                {
                    "ref": "nr3",
                    "lables": ["Genre"],
                    "properties": {
                        "type": "string"
                    }
                }
            ],
            "relationshipSpecs": [
               { "ref": "r1", "type": "DIRECTED", "fromNodeRef": "n1", "toNodeRef": "n2" },
               { "ref": "r1", "type": "DIRECTOR", "fromNodeRef": "n1", "toNodeRef": "n2" },
               { "ref": "r1", "type": "ACTOR", "fromNodeRef": "n1", "toNodeRef": "n2" },
               { "ref": "r1", "type": "WROTE", "fromNodeRef": "n1", "toNodeRef": "n2" },
               { "ref": "r1", "type": "PRODUCED", "fromNodeRef": "n1", "toNodeRef": "n2" },
               { "ref": "r1", "type": "REVIEWED", "fromNodeRef": "n1", "toNodeRef": "n2" },
               { "ref": "r1", "type": "ACTED_IN", "fromNodeRef": "n1", "toNodeRef": "n2" },
               { "ref": "r1", "type": "GENRE", "fromNodeRef": "n2", "toNodeRef": "n3" },
               { "ref": "r1", "type": "FOLLOWS", "fromNodeRef": "n1", "toNodeRef": "n1" }
    
            ]
            
        },
        "extensions" : {
            "indexes" : [
                {
                    "ref" : "i1",
                    "name" : "index1",
                    "type" : "TEXT", 
                    "entityType" : "LABEL",
                    "entity" : "Person",
                    "properties" : ["name"],
                    "uniqueness" : false
                },
                {
                    "ref" : "i2",
                    "name" : "index2",
                    "type" : "TEXT",
                    "entityType" : "LABEL",
                    "entity" : "Movie",
                    "properties" : ["title"],
                    "uniqueness" : false
    
                },
                {
                    "ref" : "i3",
                    "name" : "index3",
                    "type" : "TEXT", 
                    "entityType" : "LABEL",
                    "entity" : "Gender",
                    "uniqueness" : false
                }
            ],
            "constraints" : [
                {
                    "name" : "c1",
                    "type" : "UNIQUENESS",
                    "entityType" : "LABEL",
                    "entity" : " ",
                    "propersties" : ["name"]
                }
            ]
        }    
    
};

const validate = ajv.compile(schema);
const valid = validate(data);
if (!valid) console.log(validate.errors);
else console.log(data + "data-test");

/*
function validate() {
    if (data) {
        //data is MyData here
        console.log(data.name);^^
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
