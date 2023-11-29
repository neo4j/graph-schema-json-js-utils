import {
  GraphSchema,
  NodeLabel,
  NodeObjectType,
  Property,
  PropertyArrayType,
  PropertyBaseType,
  PropertyTypeRecursive,
  RelationshipObjectType,
  RelationshipType,
} from "../../model/index.js";
import {
  NodeLabelJsonStruct,
  NodeObjectTypeJsonStruct,
  PrimitivePropertyTypesArrayType,
  PrimitivePropertyTypesType,
  PropertyJsonStruct,
  PropertyTypeJsonStructRecrsive,
  RelationshipObjectTypeJsonStruct,
  RelationshipTypeJsonStruct,
  RootSchemaJsonStruct,
} from "./types.js";

export const VERSION = "0.0.1";

export function toJson(
  schema: GraphSchema,
  space: string | number | undefined = undefined
) {
  const labels = schema.nodeLabels
    .sort((a, b) => (a.$id < b.$id ? -1 : 1))
    .map(nodeLabel.extract);
  const relationshipTypes = schema.relationshipTypes
    .sort((a, b) => (a.$id < b.$id ? -1 : 1))
    .map(relationshipType.extract);
  const nodeObjectTypes = schema.nodeObjectTypes
    .sort((a, b) => (a.$id < b.$id ? -1 : 1))
    .map(nodeObjectType.extract);
  const relationshipObjectTypes = schema.relationshipObjectTypes
    .sort((a, b) => (a.$id < b.$id ? -1 : 1))
    .map(relationshipObjectType.extract);
  const out: RootSchemaJsonStruct = {
    graphSchemaRepresentation: {
      version: VERSION,
      graphSchema: {
        nodeLabels: labels,
        relationshipTypes,
        nodeObjectTypes,
        relationshipObjectTypes,
      },
    },
  };
  return JSON.stringify(out, null, space);
}

export function fromJson(schema: string): GraphSchema {
  const schemaJson = JSON.parse(schema) as RootSchemaJsonStruct;
  const { graphSchema } = schemaJson.graphSchemaRepresentation;
  const labels = graphSchema.nodeLabels.map(nodeLabel.create);
  const relationshipTypes = graphSchema.relationshipTypes.map(
    relationshipType.create
  );
  const nodeObjectTypes = graphSchema.nodeObjectTypes.map(
    (nodeObjectTypeJson) =>
      nodeObjectType.create(nodeObjectTypeJson, (ref) => {
        const found = labels.find((label) => label.$id === ref.slice(1));
        if (!found) {
          throw new Error(`Not all label references are defined`);
        }
        return found;
      })
  );
  const relationshipObjectTypes = graphSchema.relationshipObjectTypes.map(
    (relationshipObjectTypeJson: RelationshipObjectTypeJsonStruct) =>
      relationshipObjectType.create(
        relationshipObjectTypeJson,
        (ref) => {
          const found = relationshipTypes.find(
            (relType) => relType.$id === ref.slice(1)
          );
          if (!found) {
            throw new Error(`Not all relationship type references are defined`);
          }
          return found;
        },
        (ref, fieldName: string) => {
          const found = nodeObjectTypes.find(
            (nodeObjectType) => nodeObjectType.$id === ref.slice(1)
          );
          if (!found) {
            throw new Error(
              `Not all node object type references in ${fieldName} are defined`
            );
          }
          return found;
        }
      )
  );
  return new GraphSchema(nodeObjectTypes, relationshipObjectTypes);
}

const nodeLabel = {
  extract: (node: NodeLabel): NodeLabelJsonStruct => ({
    $id: node.$id,
    token: node.token,
  }),
  create: (node: NodeLabelJsonStruct) => new NodeLabel(node.$id, node.token),
  toRef: (node: NodeLabel) => {
    if (!node || !node.$id) {
      throw new Error(`Not all labels are defined`);
    }
    return { $ref: `#${node.$id}` };
  },
};

const relationshipType = {
  extract: (relType: RelationshipType): RelationshipTypeJsonStruct => ({
    $id: relType.$id,
    token: relType.token,
  }),
  create: (relType: RelationshipTypeJsonStruct) =>
    new RelationshipType(relType.$id, relType.token),
  toRef: (relType: RelationshipType) => {
    if (!relType || !relType.$id) {
      throw new Error(`RelationshipObjectType.type is not defined`);
    }
    return { $ref: `#${relType.$id}` };
  },
};

const property = {
  extract: (property: Property): PropertyJsonStruct => ({
    token: property.token,
    type: propertyType.extract(property.type),
    nullable: property.nullable,
  }),
  create: (property: PropertyJsonStruct) =>
    new Property(
      property.token,
      propertyType.create(property.type),
      property.nullable,
      property.$id
    ),
};

const propertyType = {
  extract: (pt: PropertyTypeRecursive): PropertyTypeJsonStructRecrsive => {
    if (Array.isArray(pt)) {
      return pt.map(propertyType.extract);
    }
    if (pt instanceof PropertyBaseType) {
      return propertyBaseType.extract(pt);
    } else if (pt instanceof PropertyArrayType) {
      return propertyArrayType.extract(pt);
    }
    throw new Error(`Unknown property type ${pt}`);
  },
  create: (
    propertyTypeJson: PropertyTypeJsonStructRecrsive
  ): PropertyTypeRecursive => {
    if (Array.isArray(propertyTypeJson)) {
      return propertyTypeJson.map((pt) => propertyType.create(pt));
    }
    if (propertyTypeJson.type === "array") {
      return propertyArrayType.create(propertyTypeJson.items.type);
    }
    return propertyBaseType.create(propertyTypeJson);
  },
};

const propertyBaseType = {
  extract: (
    propertyBaseType: PropertyBaseType
  ): PrimitivePropertyTypesType => ({
    type: propertyBaseType.type,
  }),
  create: (btype: PrimitivePropertyTypesType) =>
    new PropertyBaseType(btype.type),
};

const propertyArrayType = {
  extract: (
    propertyArrayType: PropertyArrayType
  ): PrimitivePropertyTypesArrayType => ({
    type: "array",
    items: propertyBaseType.extract(propertyArrayType.items),
  }),
  create: (type: PrimitivePropertyTypesArrayType["items"]["type"]) =>
    new PropertyArrayType(propertyBaseType.create({ type })),
};

const nodeObjectType = {
  extract: (nodeObjectType: NodeObjectType): NodeObjectTypeJsonStruct => ({
    $id: nodeObjectType.$id,
    labels: nodeObjectType.labels.map(nodeLabel.toRef),
    properties: nodeObjectType.properties
      .sort((a, b) => (a.token < b.token ? -1 : 1))
      .map(property.extract),
  }),
  create: (
    nodeObjectType: NodeObjectTypeJsonStruct,
    labelLookup: (ref: string) => NodeLabel
  ) => {
    return new NodeObjectType(
      nodeObjectType.$id,
      nodeObjectType.labels.map(({ $ref }) => labelLookup($ref)),
      nodeObjectType.properties.map(property.create)
    );
  },
  toRef: (nodeObjectType: NodeObjectType) => {
    if (!nodeObjectType || !nodeObjectType.$id) {
      throw new Error(`NodeObjectType is not defined`);
    }
    return {
      $ref: `#${nodeObjectType.$id}`,
    };
  },
};

const relationshipObjectType = {
  extract: (
    relationshipObjectType: RelationshipObjectType
  ): RelationshipObjectTypeJsonStruct => ({
    $id: relationshipObjectType.$id,
    type: relationshipType.toRef(relationshipObjectType.type),
    from: nodeObjectType.toRef(relationshipObjectType.from),
    to: nodeObjectType.toRef(relationshipObjectType.to),
    properties: relationshipObjectType.properties
      .sort((a, b) => (a.token < b.token ? -1 : 1))
      .map(property.extract),
  }),
  create: (
    relationshipObjectType: RelationshipObjectTypeJsonStruct,
    relTypeLookup: (ref: string) => RelationshipType,
    nodeObjectTypeLookup: (ref: string, fieldName: string) => NodeObjectType
  ) => {
    return new RelationshipObjectType(
      relationshipObjectType.$id,
      relTypeLookup(relationshipObjectType.type.$ref),
      nodeObjectTypeLookup(relationshipObjectType.from.$ref, "from"),
      nodeObjectTypeLookup(relationshipObjectType.to.$ref, "to"),
      relationshipObjectType.properties.map(property.create)
    );
  },
  toRef: (relationshipObjectType: RelationshipObjectType) => ({
    $ref: `#${relationshipObjectType.$id}`,
  }),
};
