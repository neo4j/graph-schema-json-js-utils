import { equal } from "node:assert";
import { validateSchema } from "..";
import { readFile } from "../fs.utils";

const JSON_SCHEMA_FILE = path.resolve(__dirname, "graphDescriptionNew.json");
const JSON_SCHEMA = readFile(JSON_SCHEMA_FILE);

describe("Simple hally path tests", () => {
    test("Minimal test", () => {
        const minimalGraphSchema = readFile("./test-schemas/minial.json");

        const valid = validateSchema(JSON_SCHEMA, minimalGraphSchema);
    });
});
