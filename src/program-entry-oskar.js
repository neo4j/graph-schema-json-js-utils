import { fileURLToPath } from "url";
import path from "path";
import { readFile } from "./fs.utils.js";
import { validateSchema } from "./index.js";

const __dirname = path.dirname(fileURLToPath(new URL(import.meta.url)));

const JSON_SCHEMA_FILE = path.resolve(__dirname, "graphDescriptionNew.json");
const DB_SCHEMA_FILE = path.resolve(
    __dirname,
    "graphSchemaRepresentation.json"
);

function main() {
    let jsonSchema = readFile(JSON_SCHEMA_FILE);
    let dbSchema = readFile(DB_SCHEMA_FILE);
    const valid = validateSchema(jsonSchema, dbSchema);

    if (!valid) {
        console.log(validate.errors);
    } else {
        console.log(dbSchema);
        console.log("SCHEMA IN STRING " + JSON.stringify(dbSchema, null, 2));
    }
}

main();
