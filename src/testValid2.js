//ajv is for validating your data by comparing to
//JSON schema object you made with typescript-json-schema
import Ajv from "ajv";

import fs from "fs";

//const Ajv = require("ajv/dist/jtd");

const ajv = new Ajv({strict: false});

let objSchema = main2();
let objData = main();

function main2() {
    const descriptionString = fs.readFileSync("./formatDescription.json", { encoding: "utf-8" });
    console.log("SCHEMA-STRING " + descriptionString)

    //let obj = JSON.parse(descriptionString);
    //console.log("SCHEMA " + obj)
    return descriptionString;
    
}


function main() {
    const contentMoviesSchema = fs.readFileSync("./moviesSchema.json", { encoding: "utf-8" });
    console.log("MOVIE-STRING " + contentMoviesSchema);

    //const obj = JSON.parse(contentMoviesSchema);
    //console.log("DATA " + obj);
    return contentMoviesSchema;

}

//const validate = ajv.compile(GraphSchema.json); //JSONschemat från fil. Oklart om detta ska vara med...
/*
const data = {
    name: "Keanu Reeves",
    born: "1964",
};
*/
//const obj = JSON.parse(objSchema);
//const obj2 = JSON.parse(objData);
const validate = ajv.compile(objSchema);
const valid = validate(objData);
if (!valid) console.log(validate.errors);
else console.log(objData);