export class GraphSchema {
  nodeLabels: NodeLabel[] = [];
  relationshipTypes: RelationshipType[] = [];
  nodeObjectTypes: NodeObjectType[];
  relationshipObjectTypes: RelationshipObjectType[];
  constraints: Constraint[];
  indexes: Index[];

  constructor(
    nodeObjectTypes: NodeObjectType[],
    relationshipObjectTypes: RelationshipObjectType[],
    constraints: Constraint[] = [],
    indexes: Index[] = []
  ) {
    this.nodeObjectTypes = nodeObjectTypes;
    this.relationshipObjectTypes = relationshipObjectTypes;
    this.constraints = constraints;
    this.indexes = indexes;
    this.extractNodeLabels();
    this.extractRelationshipTypes();
  }
  private extractNodeLabels() {
    const nodeLabels = this.nodeObjectTypes.flatMap(
      (nodeObjectType) => nodeObjectType.labels
    );
    this.nodeLabels = [...new Set(nodeLabels)];
  }
  private extractRelationshipTypes() {
    const relationshipTypes = this.relationshipObjectTypes.flatMap(
      (relationshipObjectType) => relationshipObjectType.type
    );
    this.relationshipTypes = [...new Set(relationshipTypes)];
  }

  getAllNodeLabelTokens() {
    return this.nodeLabels.map((nodeLabel) => nodeLabel.token);
  }

  getAllRelationshipTypeTokens() {
    return this.relationshipTypes.map(
      (relationshipType) => relationshipType.token
    );
  }

  getAllPropertyTokens() {
    const nodeProperties = this.nodeObjectTypes.flatMap((nodeObjectType) =>
      nodeObjectType.getPropertyTokens()
    );
    const relationshipProperties = this.relationshipObjectTypes.flatMap(
      (relationshipObjectType) => relationshipObjectType.getPropertyTokens()
    );
    // return all tokens without duplicates
    return [...new Set([...nodeProperties, ...relationshipProperties])];
  }
}

export class NodeLabel {
  $id: string;
  token: string;
  properties: Property[];

  constructor(id: string, token: string, properties: Property[] = []) {
    this.$id = id;
    this.token = token;
    this.properties = properties;
  }

  getPropertyTokens() {
    return this.properties.map((property) => property.token);
  }
}

export class RelationshipType {
  $id: string;
  token: string;
  properties: Property[];

  constructor(id: string, token: string, properties: Property[] = []) {
    this.$id = id;
    this.token = token;
    this.properties = properties;
  }

  getPropertyTokens() {
    return this.properties.map((property) => property.token);
  }
}

export class NodeObjectType {
  $id: string;
  labels: NodeLabel[];

  constructor(id: string, labels: NodeLabel[]) {
    this.$id = id;
    this.labels = labels;
  }
  getProperties() {
    return this.labels.flatMap((l) => l.properties);
  }
  getPropertyTokens() {
    // return all tokens without duplicates
    return [...new Set(this.getProperties().map((property) => property.token))];
  }
}

export class RelationshipObjectType {
  $id: string;
  type: RelationshipType;
  from: NodeObjectType;
  to: NodeObjectType;

  constructor(
    id: string,
    type: RelationshipType,
    from: NodeObjectType,
    to: NodeObjectType
  ) {
    this.$id = id;
    this.type = type;
    this.from = from;
    this.to = to;
  }
  getProperties() {
    return this.type.properties;
  }
  getPropertyTokens() {
    // return all tokens without duplicates
    return [...new Set(this.getProperties().map((property) => property.token))];
  }
}

export type Constraint = NodeLabelConstraint | RelationshipTypeConstraint;

export type Index = NodeLabelIndex | RelationshipTypeIndex | LookupIndex;

export const isNodeLabelConstraint = (
  constraint: Constraint
): constraint is NodeLabelConstraint => {
  return constraint.entityType === "node" && "nodeLabel" in constraint;
};

export const isRelationshipTypeConstraint = (
  constraint: Constraint
): constraint is RelationshipTypeConstraint => {
  return (
    constraint.entityType === "relationship" && "relationshipType" in constraint
  );
};

export const isNodeLabelIndex = (index: Index): index is NodeLabelIndex => {
  return (
    index.entityType === "node" &&
    index.indexType !== "lookup" &&
    "nodeLabel" in index
  );
};

export const isRelationshipTypeIndex = (
  index: Index
): index is RelationshipTypeIndex => {
  return (
    index.entityType === "relationship" &&
    index.indexType !== "lookup" &&
    "relationshipType" in index
  );
};

export const isLookupIndex = (index: Index): index is LookupIndex => {
  return index.indexType === "lookup";
};

export class NodeLabelConstraint {
  $id: string;
  name: string;
  constraintType: ConstraintType;
  nodeLabel: NodeLabel;
  properties: Property[];
  entityType: EntityType;

  constructor(
    $id: string,
    name: string,
    constraintType: ConstraintType,
    nodeLabel: NodeLabel,
    properties: Property[]
  ) {
    this.$id = $id;
    this.name = name;
    this.constraintType = constraintType;
    this.nodeLabel = nodeLabel;
    this.properties = properties;
    this.entityType = "node";
  }
}

export class RelationshipTypeConstraint {
  $id: string;
  name: string;
  constraintType: ConstraintType;
  relationshipType: RelationshipType;
  properties: Property[];
  entityType: EntityType;

  constructor(
    $id: string,
    name: string,
    constraintType: ConstraintType,
    relationshipType: RelationshipType,
    properties: Property[]
  ) {
    this.$id = $id;
    this.name = name;
    this.constraintType = constraintType;
    this.relationshipType = relationshipType;
    this.properties = properties;
    this.entityType = "relationship";
  }
}

export class NodeLabelIndex {
  $id: string;
  name: string;
  indexType: Exclude<IndexType, "lookup">;
  entityType: EntityType;
  nodeLabel: NodeLabel;
  properties: Property[];

  constructor(
    $id: string,
    name: string,
    indexType: Exclude<IndexType, "lookup">,
    nodeLabel: NodeLabel,
    properties: Property[]
  ) {
    this.$id = $id;
    this.name = name;
    this.nodeLabel = nodeLabel;
    this.indexType = indexType;
    this.properties = properties;
    this.entityType = "node";
  }
}

export class RelationshipTypeIndex {
  $id: string;
  name: string;
  indexType: Exclude<IndexType, "lookup">;
  entityType: EntityType;
  relationshipType: RelationshipType;
  properties: Property[];

  constructor(
    $id: string,
    name: string,
    indexType: Exclude<IndexType, "lookup">,
    relationshipType: RelationshipType,
    properties: Property[]
  ) {
    this.$id = $id;
    this.name = name;
    this.indexType = indexType;
    this.entityType = "relationship";
    this.relationshipType = relationshipType;
    this.properties = properties;
  }
}

export class LookupIndex {
  $id: string;
  name: string;
  entityType: EntityType;
  indexType: IndexType;

  constructor($id: string, name: string, entityType: EntityType) {
    this.$id = $id;
    this.name = name;
    this.indexType = "lookup";
    this.entityType = entityType;
  }
}

export type ConstraintType =
  | "uniqueness"
  | "propertyExistence"
  | "propertyType"
  | "key";

export type IndexType =
  | "range"
  | "lookup"
  | "text"
  | "fullText"
  | "point"
  | "default";

export type EntityType = "node" | "relationship";

export type PropertyType = PrimitivePropertyType | PrimitiveArrayPropertyType;

export const isPrimitiveArrayPropertyType = (
  property: PropertyType
): property is PrimitiveArrayPropertyType => {
  return (
    property instanceof Object &&
    property.type === "array" &&
    property.items !== undefined
  );
};

export const isPrimitivePropertyType = (
  property: PropertyType
): property is PrimitivePropertyType => {
  return (
    property instanceof Object &&
    "type" in property &&
    PRIMITIVE_TYPE_OPTIONS.some((p) => property.type === p)
  );
};

export class Property {
  $id: string;
  token: string;
  type: PropertyType | PropertyType[];
  nullable: boolean;

  constructor(
    $id: string,
    token: string,
    type: PropertyType | PropertyType[],
    nullable: boolean
  ) {
    this.$id = $id;
    this.token = token;
    this.type = type;
    this.nullable = nullable;
  }
}

export class PrimitivePropertyType {
  type: PrimitivePropertyTypes;
  constructor(type: PrimitivePropertyTypes) {
    this.type = type;
  }
}

export class PrimitiveArrayPropertyType {
  items: PrimitivePropertyType;
  type: "array";

  constructor(items: PrimitivePropertyType) {
    this.type = "array";
    this.items = items;
  }
}

export const PRIMITIVE_TYPE_OPTIONS = [
  "integer",
  "string",
  "float",
  "boolean",
  "point",
  "date",
  "datetime",
  "time",
  "localtime",
  "localdatetime",
  "duration",
] as const;

export type PrimitivePropertyTypes = (typeof PRIMITIVE_TYPE_OPTIONS)[number];
