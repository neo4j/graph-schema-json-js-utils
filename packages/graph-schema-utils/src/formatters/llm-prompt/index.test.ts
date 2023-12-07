import { describe, expect, test } from "vitest";
import { toOskars, toTomaz } from "./index.js";
import { fromJson } from "../json/extensions.js";
import fullSchemaObj from "./test-schemas/full.json";

describe("Prompt tests", () => {
  const schema = fromJson(JSON.stringify(fullSchemaObj));
  test("Can generate a prompt format of a graph schema, in Oskars format", () => {
    const prompt = toOskars(schema);
    expect(prompt).toMatchInlineSnapshot(`
      "Node types with their properties + types
        (:Movie {tagline: string (nullable), title: string, released: integer})
        (:Person {name: string, born: integer (nullable)})
      Relationship types with properties + types
        [:ACTED_IN {roles: string[]}]
        [:REVIEWED {summary: string, rating: integer}]
      Paths (all combinations of node types and relationship types and the direction of the relationship)
        (:Person)-[:ACTED_IN]->(:Movie)
        (:Person)-[:DIRECTED]->(:Movie)
        (:Person)-[:FOLLOWS]->(:Person)
        (:Person)-[:PRODUCED]->(:Movie)
        (:Person)-[:REVIEWED]->(:Movie)
        (:Person)-[:WROTE]->(:Movie)"
    `);
  });
  test("Can generate a prompt format of a graph schema, in Tomaz format", () => {
    const prompt = toTomaz(schema);
    expect(prompt).toMatchInlineSnapshot(`
      "Node properties are the following:
      [{\\"properties\\":[{\\"property\\":\\"tagline\\",\\"type\\":\\"string\\",\\"nullable\\":true},{\\"property\\":\\"title\\",\\"type\\":\\"string\\"},{\\"property\\":\\"released\\",\\"type\\":\\"integer\\"}],\\"labels\\":[\\"Movie\\"]}]
      [{\\"properties\\":[{\\"property\\":\\"name\\",\\"type\\":\\"string\\"},{\\"property\\":\\"born\\",\\"type\\":\\"integer\\",\\"nullable\\":true}],\\"labels\\":[\\"Person\\"]}]
      Relationship properties are the following:
      [{\\"labels\\":[\\"ACTED_IN\\"],\\"properties\\":[{\\"property\\":\\"roles\\",\\"type\\":\\"string[]\\"}]}]
      [{\\"labels\\":[\\"REVIEWED\\"],\\"properties\\":[{\\"property\\":\\"summary\\",\\"type\\":\\"string\\"},{\\"property\\":\\"rating\\",\\"type\\":\\"integer\\"}]}]
      The relationships are the following:
      [\\"(:Person)-[:ACTED_IN]->(:Movie)\\",\\"(:Person)-[:DIRECTED]->(:Movie)\\",\\"(:Person)-[:FOLLOWS]->(:Person)\\",\\"(:Person)-[:PRODUCED]->(:Movie)\\",\\"(:Person)-[:REVIEWED]->(:Movie)\\",\\"(:Person)-[:WROTE]->(:Movie)\\"]"
    `);
  });
});
