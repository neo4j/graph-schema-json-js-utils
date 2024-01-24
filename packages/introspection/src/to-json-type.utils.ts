import { model } from "@neo4j/graph-schema-utils";
import { Neo4jPropertyType } from "./types.js";

export function toJSONType(
  inType: Neo4jPropertyType
): model.PrimitivePropertyType["type"] {
  switch (inType) {
    case "Long":
      return "integer";
    case "Double":
      return "float";
    default:
      return inType.toLowerCase() as model.PrimitivePropertyType["type"];
  }
}
