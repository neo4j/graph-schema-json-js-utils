import { strict as assert } from "node:assert";
import { fileURLToPath } from "url";
import path from "path";
import { readFile } from "../fs.utils.js";
import { describe, test } from "vitest";
import { model } from "../../src";

const __dirname = path.dirname(fileURLToPath(new URL(import.meta.url)));

describe("Serializer tests", () => {
  const fullSchema = readFile(
    path.resolve(__dirname, "./test-schemas/full.json")
  );
  test("Can parse a graph schema and serialize it to be the same", () => {
    const parsed = model.GraphSchemaRepresentation.parseJson(fullSchema);
    const serialized = parsed.toJson();
    assert.deepEqual(JSON.parse(serialized), JSON.parse(fullSchema));
  });
});
