import {
  Constraint,
  GraphSchema,
  LookupIndex,
  NodeLabel,
  NodeLabelConstraint,
  NodeLabelIndex,
  NodeObjectType,
  Property,
  PropertyArrayType,
  PropertyBaseType,
  PropertyTypeRecursive,
  RelationshipObjectType,
  RelationshipType,
  RelationshipTypeConstraint,
  RelationshipTypeIndex,
  isLookupIndex,
  isNodeLabelConstraint,
  isNodeLabelIndex,
  isRelationshipTypeConstraint,
  isRelationshipTypeIndex,
} from "../../model/index.js";
import {
  ConstraintJsonStruct,
  IndexJsonStruct,
  LookupIndexJsonStruct,
  NodeLabelConstraintJsonStruct,
  NodeLabelIndexJsonStruct,
  NodeLabelJsonStruct,
  NodeObjectTypeJsonStruct,
  PrimitivePropertyTypesArrayType,
  PrimitivePropertyTypesType,
  PropertyJsonStruct,
  PropertyTypeJsonStructRecrsive,
  RelationshipObjectTypeJsonStruct,
  RelationshipTypeConstraintJsonStruct,
  RelationshipTypeIndexJsonStruct,
  RelationshipTypeJsonStruct,
  RootSchemaJsonStruct,
  isLookupIndexJsonStruct,
  isNodeLabelConstraintJsonStruct,
  isNodeLabelIndexJsonStruct,
  isRelationshipTypeConstraintJsonStruct,
  isRelationshipTypeIndexJsonStruct,
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
  const nodeObjectTypes = schema.nodeObjectTypes.map(nodeObjectType.extract);
  const relationshipObjectTypes = schema.relationshipObjectTypes.map(
    relationshipObjectType.extract
  );
  const constraints = schema.constraints.map((constraint) => {
    if (isNodeLabelConstraint(constraint)) {
      return nodeLabelConstraint.extract(constraint);
    } else if (isRelationshipTypeConstraint(constraint)) {
      return relationshipConstraint.extract(constraint);
    }
    throw new Error(`Unknown constraint type ${constraint}`);
  });
  const indexes = schema.indexes.map((index) => {
    if (isNodeLabelIndex(index)) {
      return nodeLabelIndex.extract(index);
    } else if (isRelationshipTypeIndex(index)) {
      return relationshipTypeIndex.extract(index);
    } else if (isLookupIndex(index)) {
      return lookupIndex.extract(index);
    }
    throw new Error(`Unknown index type ${index}`);
  });
  const out: RootSchemaJsonStruct = {
    graphSchemaRepresentation: {
      version: VERSION,
      graphSchema: {
        nodeLabels: labels,
        relationshipTypes,
        nodeObjectTypes,
        relationshipObjectTypes,
        constraints,
        indexes,
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
  const labelProperties = labels.flatMap((label) => label.properties);
  const relationshipTypeProperties = relationshipTypes.flatMap(
    (relType) => relType.properties
  );
  const properties = [...labelProperties, ...relationshipTypeProperties];
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
  const constraints = graphSchema.constraints.map((constraintJson) => {
    if (isNodeLabelConstraintJsonStruct(constraintJson)) {
      return nodeLabelConstraint.create(
        constraintJson,
        (ref) => {
          const found = labels.find((label) => label.$id === ref.slice(1));
          if (!found) {
            throw new Error(`Not all label references are defined`);
          }
          return found;
        },
        (ref) => {
          const found = properties.find((p) => p.$id === ref.slice(1));
          if (!found) {
            throw new Error(
              `Not all constraint property references are defined`
            );
          }
          return found;
        }
      );
    } else if (isRelationshipTypeConstraintJsonStruct(constraintJson)) {
      return relationshipConstraint.create(
        constraintJson,
        (ref) => {
          const found = relationshipTypes.find(
            (relType) => relType.$id === ref.slice(1)
          );
          if (!found) {
            throw new Error(`Not all relationship type references are defined`);
          }
          return found;
        },
        (ref) => {
          const found = properties.find((p) => p.$id === ref.slice(1));
          if (!found) {
            throw new Error(
              `Not all constraint property references are defined`
            );
          }
          return found;
        }
      );
    }
    throw new Error(`Unknown constraint type ${constraintJson}`);
  });
  const indexes = graphSchema.indexes.map((indexJson) => {
    if (isNodeLabelIndexJsonStruct(indexJson)) {
      return nodeLabelIndex.create(
        indexJson,
        (ref) => {
          const found = labels.find((label) => label.$id === ref.slice(1));
          if (!found) {
            throw new Error(`Not all label references are defined`);
          }
          return found;
        },
        (ref) => {
          const found = properties.find((p) => p.$id === ref.slice(1));
          if (!found) {
            throw new Error(`Not all index property references are defined`);
          }
          return found;
        }
      );
    } else if (isRelationshipTypeIndexJsonStruct(indexJson)) {
      return relationshipTypeIndex.create(
        indexJson,
        (ref) => {
          const found = relationshipTypes.find(
            (relType) => relType.$id === ref.slice(1)
          );
          if (!found) {
            throw new Error(`Not all relationship type references are defined`);
          }
          return found;
        },
        (ref) => {
          const found = properties.find((p) => p.$id === ref.slice(1));
          if (!found) {
            throw new Error(`Not all index property references are defined`);
          }
          return found;
        }
      );
    } else if (isLookupIndexJsonStruct(indexJson)) {
      return lookupIndex.create(indexJson);
    } else {
      throw new Error(`Unknown index type ${indexJson}`);
    }
  });
  return new GraphSchema(
    nodeObjectTypes,
    relationshipObjectTypes,
    constraints,
    indexes
  );
}

const nodeLabel = {
  extract: (node: NodeLabel): NodeLabelJsonStruct => ({
    $id: node.$id,
    token: node.token,
    properties: node.properties.map(property.extract),
  }),
  create: (node: NodeLabelJsonStruct) =>
    new NodeLabel(node.$id, node.token, node.properties.map(property.create)),
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
    properties: relType.properties.map(property.extract),
  }),
  create: (relType: RelationshipTypeJsonStruct) =>
    new RelationshipType(
      relType.$id,
      relType.token,
      relType.properties.map(property.create)
    ),
  toRef: (relType: RelationshipType) => {
    if (!relType || !relType.$id) {
      throw new Error(`RelationshipObjectType.type is not defined`);
    }
    return { $ref: `#${relType.$id}` };
  },
};

const nodeLabelConstraint = {
  extract: (constraint: NodeLabelConstraint): ConstraintJsonStruct => ({
    $id: constraint.$id,
    name: constraint.name,
    constraintType: constraint.constraintType,
    entityType: constraint.entityType,
    nodeLabel: nodeLabel.toRef(constraint.nodeLabel),
    properties: constraint.properties.map(property.toRef),
  }),
  create: (
    constraint: NodeLabelConstraintJsonStruct,
    nodeLabelLookup: (ref: string) => NodeLabel,
    propertyLookup: (ref: string) => Property
  ) => {
    return new NodeLabelConstraint(
      constraint.$id,
      constraint.name,
      constraint.constraintType,
      nodeLabelLookup(constraint.nodeLabel.$ref),
      constraint.properties.map((p) => propertyLookup(p.$ref))
    );
  },
  toRef: (constraint: NodeLabelConstraint) => {
    if (!constraint || !constraint.$id) {
      throw new Error(`Constraint is not defined`);
    }
    return { $ref: `#${constraint.$id}` };
  },
};

const relationshipConstraint = {
  extract: (constraint: RelationshipTypeConstraint): ConstraintJsonStruct => ({
    $id: constraint.$id,
    name: constraint.name,
    constraintType: constraint.constraintType,
    entityType: constraint.entityType,
    relationshipType: relationshipType.toRef(constraint.relationshipType),
    properties: constraint.properties.map(property.toRef),
  }),
  create: (
    constraint: RelationshipTypeConstraintJsonStruct,
    relationshipTypeLookup: (ref: string) => RelationshipType,
    propertyLookup: (ref: string) => Property
  ) => {
    return new RelationshipTypeConstraint(
      constraint.$id,
      constraint.name,
      constraint.constraintType,
      relationshipTypeLookup(constraint.relationshipType.$ref),
      constraint.properties.map((p) => propertyLookup(p.$ref))
    );
  },
  toRef: (constraint: RelationshipTypeConstraint) => {
    if (!constraint || !constraint.$id) {
      throw new Error(`Constraint is not defined`);
    }
    return { $ref: `#${constraint.$id}` };
  },
};

const lookupIndex = {
  extract: (index: LookupIndex): IndexJsonStruct => ({
    $id: index.$id,
    name: index.name,
    indexType: index.indexType,
    entityType: index.entityType,
  }),
  create: (index: LookupIndexJsonStruct) => {
    return new LookupIndex(index.$id, index.name, index.entityType);
  },
  toRef: (index: LookupIndex) => {
    if (!index || !index.$id) {
      throw new Error(`Index is not defined`);
    }
    return { $ref: `#${index.$id}` };
  },
};

const nodeLabelIndex = {
  extract: (index: NodeLabelIndex): IndexJsonStruct => ({
    $id: index.$id,
    name: index.name,
    indexType: index.indexType,
    entityType: index.entityType,
    nodeLabel: nodeLabel.toRef(index.nodeLabel),
    properties: index.properties.map(property.toRef),
  }),
  create: (
    index: NodeLabelIndexJsonStruct,
    nodeLabelLookup: (ref: string) => NodeLabel,
    propertyLookup: (ref: string) => Property
  ) => {
    return new NodeLabelIndex(
      index.$id,
      index.name,
      index.indexType,
      nodeLabelLookup(index.nodeLabel.$ref),
      index.properties.map((p) => propertyLookup(p.$ref))
    );
  },
  toRef: (index: NodeLabelIndex) => {
    if (!index || !index.$id) {
      throw new Error(`Index is not defined`);
    }
    return { $ref: `#${index.$id}` };
  },
};

const relationshipTypeIndex = {
  extract: (index: RelationshipTypeIndex): IndexJsonStruct => ({
    $id: index.$id,
    name: index.name,
    indexType: index.indexType,
    entityType: index.entityType,
    relationshipType: relationshipType.toRef(index.relationshipType),
    properties: index.properties.map(property.toRef),
  }),
  create: (
    index: RelationshipTypeIndexJsonStruct,
    relationshipTypeLookup: (ref: string) => RelationshipType,
    propertyLookup: (ref: string) => Property
  ) => {
    return new RelationshipTypeIndex(
      index.$id,
      index.name,
      index.indexType,
      relationshipTypeLookup(index.relationshipType.$ref),
      index.properties.map((p) => propertyLookup(p.$ref))
    );
  },
  toRef: (index: RelationshipTypeIndex) => {
    if (!index || !index.$id) {
      throw new Error(`Index is not defined`);
    }
    return { $ref: `#${index.$id}` };
  },
};

const property = {
  extract: (property: Property): PropertyJsonStruct => ({
    $id: property.$id,
    token: property.token,
    type: propertyType.extract(property.type),
    nullable: property.nullable,
  }),
  create: (property: PropertyJsonStruct) =>
    new Property(
      property.$id,
      property.token,
      propertyType.create(property.type),
      property.nullable
    ),
  toRef: (property: Property) => {
    if (!property || !property.$id) {
      throw new Error(`Property is not defined`);
    }
    return {
      $ref: `#${property.$id}`,
    };
  },
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
  }),
  create: (
    nodeObjectType: NodeObjectTypeJsonStruct,
    labelLookup: (ref: string) => NodeLabel
  ) => {
    return new NodeObjectType(
      nodeObjectType.$id,
      nodeObjectType.labels.map(({ $ref }) => labelLookup($ref))
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
      nodeObjectTypeLookup(relationshipObjectType.to.$ref, "to")
    );
  },
  toRef: (relationshipObjectType: RelationshipObjectType) => ({
    $ref: `#${relationshipObjectType.$id}`,
  }),
};
