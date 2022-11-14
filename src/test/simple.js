import { strict as assert } from "node:assert";
import { fileURLToPath } from "url";
import path from "path";
import { validateSchema } from "../index.js";
import { readFile } from "../fs.utils.js";

const __dirname = path.dirname(fileURLToPath(new URL(import.meta.url)));
const JSON_SCHEMA_FILE = path.resolve(__dirname, "../graphDescriptionNew.json");
const JSON_SCHEMA = readFile(JSON_SCHEMA_FILE);

function describe(name, cb) {
    console.log(name);
    cb();
}
function test(name, cb) {
    try {
        cb();
        console.log(`${name} PASSED`);
    } catch (e) {
        console.error(`${name} FAILED`, e);
    }
}

describe("Simple happy path tests", () => {
    test("Minimal test", () => {
        const minimalGraphSchema = readFile(
            path.resolve(__dirname, "./test-schemas/minimal.json")
        );
        const valid = validateSchema(JSON_SCHEMA, minimalGraphSchema);
        assert.strictEqual(valid, true);
    });
});
