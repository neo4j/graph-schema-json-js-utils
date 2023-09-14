import {
  GraphSchema,
  NodeObjectType,
  PropertyArrayType,
  PropertyBaseType,
  PropertyTypes,
  RelationshipObjectType,
} from "../../model/index.js";
import { ElementPropertyObject } from "./types.js";

export function toTomaz(schema: GraphSchema): string {
  let out: string[] = [].concat(
    [`Node properties are the following:`],
    schema.nodeObjectTypes.map(nodeObjectTypes).filter(Boolean),
    [`Relationship properties are the following:`],
    schema.relationshipObjectTypes.map(relationshipObjectTypes).filter(Boolean),
    [`The relationships are the following:`],
    JSON.stringify(schema.relationshipObjectTypes.map(paths))
  );

  function nodeObjectTypes(nodeObjectType: NodeObjectType): string {
    const out = [];
    const properties = nodeObjectType.properties.map((property) => {
      const base: ElementPropertyObject = {
        property: property.token,
        type: formatPropertyType(property.type),
      };
      if (property.nullable) {
        base.nullable = true;
      }
      return base;
    });
    if (!properties.length) {
      return;
    }
    out.push({
      properties: properties,
      labels: nodeObjectType.labels.map((label) => label.token),
    });
    return JSON.stringify(out);
  }

  function relationshipObjectTypes(
    relationshipObjectType: RelationshipObjectType
  ): string {
    const out = [];
    const properties = relationshipObjectType.properties.map((property) => {
      const base: ElementPropertyObject = {
        property: property.token,
        type: formatPropertyType(property.type),
      };
      if (property.nullable) {
        base.nullable = true;
      }
      return base;
    });
    if (!properties.length) {
      return;
    }
    out.push({
      labels: [relationshipObjectType.type.token],
      properties: properties,
    });

    return JSON.stringify(out);
  }
  function paths(relationshipObjectType: RelationshipObjectType): string {
    return `(:${relationshipObjectType.from.labels
      .map((label) => label.token)
      .join(":")})-[:${
      relationshipObjectType.type.token
    }]->(:${relationshipObjectType.to.labels
      .map((label) => label.token)
      .join(":")})`;
  }
  return out.join("\n");
}

export function toOskars(schema: GraphSchema): string {
  let out: string[] = [].concat(
    [`Node types with their properties + types`],
    schema.nodeObjectTypes.map(nodeObjectTypes),
    [`Relationship types with properties + types`],
    schema.relationshipObjectTypes.map(relationshipObjectTypes).filter(Boolean),
    [
      `Paths (all combinations of node types and relationship types and the direction of the relationship)`,
    ],
    schema.relationshipObjectTypes.map(paths)
  );

  function nodeObjectTypes(nodeObjectType: NodeObjectType): string {
    const out = [];
    const properties = nodeObjectType.properties.map((property) => {
      return `${property.token}: ${formatPropertyType(property.type)}${
        property.nullable ? " (nullable)" : ""
      }`;
    });
    out.push(
      `  (:${nodeObjectType.labels.map((label) => label.token).join(":")}${
        properties.length > 0 ? ` {${properties.join(", ")}}` : ""
      })`
    );
    return out.join("\n");
  }
  function relationshipObjectTypes(
    relationshipObjectType: RelationshipObjectType
  ): string {
    const out = [];
    const properties = relationshipObjectType.properties.map((property) => {
      return `${property.token}: ${formatPropertyType(property.type)}${
        property.nullable ? " (nullable)" : ""
      }`;
    });
    if (!properties.length) {
      return;
    }
    out.push(
      `  [:${relationshipObjectType.type.token}${
        properties.length > 0 ? ` {${properties.join(", ")}}` : ""
      }]`
    );

    return out.join("\n");
  }
  function paths(relationshipObjectType: RelationshipObjectType): string {
    const out = [];
    out.push(
      `  (:${relationshipObjectType.from.labels
        .map((label) => label.token)
        .join(":")})-[:${
        relationshipObjectType.type.token
      }]->(:${relationshipObjectType.to.labels
        .map((label) => label.token)
        .join(":")})`
    );

    return out.join("\n");
  }
  return out.join("\n");
}

function formatPropertyType(type: PropertyTypes | PropertyTypes[]): string {
  if (Array.isArray(type)) {
    return type.map(formatPropertyType).join("|");
  }
  if (type instanceof PropertyBaseType) {
    return type.type;
  } else if (type instanceof PropertyArrayType) {
    return `${type.items.type}[]`;
  }
}
