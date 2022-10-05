//ajv is for validating your data by comparing to
//JSON schema object you made with typescript-json-schema
import Ajv from "ajv";
//const Ajv = require("ajv");

const ajv = new Ajv();


function main2() {
    const descriptionString = fs.readFileSync("/.formatDescription.json", { encoding: "utf-8" });
    console.log(descriptionString)
    
}


function main() {
    const contentMoviesSchema = fs.readFileSync("./moviesSchema.json", { encoding: "utf-8" });
    console.log(contentMoviesSchema);

}

//const validate = ajv.compile(GraphSchema.json); //JSONschemat från fil. Oklart om detta ska vara med...
/*
const data = {
    name: "Keanu Reeves",
    born: "1964",
};
*/

const validate = ajv.compile(main2.descriptionString);
const valid = validate(main.contentMoviesSchema);
if (!valid) console.log(validate.errors);
else console.log(main2.descriptionString);