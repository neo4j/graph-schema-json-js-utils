//ajv is for validating your data by comparing to
//JSON schema object you made with typescript-json-schema
import Ajv from "ajv";
import { fileURLToPath } from "url";
import path from "path";
import fs from "fs";

const __dirname = path.dirname(fileURLToPath(new URL(import.meta.url)));

const ajv = new Ajv({ strict: false });

const JSON_SCHEMA_FILE = path.resolve(__dirname, "formatDescription.json");
const DB_SCHEMA_FILE = path.resolve(__dirname, "moviesSchema.json");

function readFile(filename) {
    const contents = fs.readFileSync(filename, { encoding: "utf-8" });
    let obj = JSON.parse(contents);
    return obj;
}

function main() {
    let jsonSchema = readFile(JSON_SCHEMA_FILE);
    let dbSchema = readFile(DB_SCHEMA_FILE);

    const validate = ajv.compile(jsonSchema);
    const valid = validate(dbSchema);

    if (!valid) {
        console.log(validate.errors);
    } else {
        console.log(dbSchema);
    }
}

main();
