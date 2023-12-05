export class GraphSchemaRepresentation {
  version: string;
  graphSchema: GraphSchema;

  constructor(version: string, graphSchema: GraphSchema) {
    this.version = version;
    this.graphSchema = graphSchema;
  }

  toJson(space: string | number | undefined = undefined) {
    return JSON.stringify(this.toJsonStruct(), null, space);
  }

  toJsonStruct() {
    return {
      graphSchemaRepresentation: {
        version: this.version,
        graphSchema: this.graphSchema.toJsonStruct(),
      },
    };
  }

  static parseJson(jsonString: string) {
    const json = JSON.parse(jsonString);
    return this.parseJsonStruct(json);
  }

  static parseJsonStruct(json: {
    graphSchemaRepresentation: GraphSchemaRepresentationJsonStruct;
  }) {
    const version = json.graphSchemaRepresentation.version;
    const graphSchema = GraphSchema.fromJsonStruct(
      json.graphSchemaRepresentation.graphSchema
    );
    return new GraphSchemaRepresentation(version, graphSchema);
  }
}

export class GraphSchema {
  nodeLabels: NodeLabel[];
  relationshipTypes: RelationshipType[];
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
  toJsonStruct() {
    return {
      nodeLabels: this.nodeLabels
        .sort((a, b) => (a.$id > b.$id ? 1 : -1))
        .map((nodeLabel) => nodeLabel.toJsonStruct()),
      relationshipTypes: this.relationshipTypes
        .sort((a, b) => (a.$id > b.$id ? 1 : -1))
        .map((relationshipType) => relationshipType.toJsonStruct()),
      nodeObjectTypes: this.nodeObjectTypes
        .sort((a, b) => (a.$id > b.$id ? 1 : -1))
        .map((nodeObjectType) => nodeObjectType.toJsonStruct()),
      relationshipObjectTypes: this.relationshipObjectTypes
        .sort((a, b) => (a.$id > b.$id ? 1 : -1))
        .map((relationshipObjectType) => relationshipObjectType.toJsonStruct()),
      constraints: this.constraints
        .sort((a, b) => (a.$id > b.$id ? 1 : -1))
        .map((constraint) => constraint.toJsonStruct()),
      indexes: this.indexes
        .sort((a, b) => (a.$id > b.$id ? 1 : -1))
        .map((index) => index.toJsonStruct()),
    };
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

  static fromJsonStruct(json: GraphSchemaJsonStruct) {
    const nodeLabels = json.nodeLabels.map(
      (nodeLabel) =>
        new NodeLabel(
          nodeLabel.$id,
          nodeLabel.token,
          nodeLabel.properties.map(
            (property) =>
              new Property(
                property.$id,
                property.token,
                PropertyType.fromJsonStruct(property.type),
                property.nullable
              )
          )
        )
    );
    const relationshipTypes = json.relationshipTypes.map(
      (relationshipType) =>
        new RelationshipType(
          relationshipType.$id,
          relationshipType.token,
          relationshipType.properties.map(
            (property) =>
              new Property(
                property.$id,
                property.token,
                PropertyType.fromJsonStruct(property.type),
                property.nullable
              )
          )
        )
    );
    const nodeObjectTypes = json.nodeObjectTypes.map((nodeObjectType) => {
      const labels = nodeObjectType.labels
        .map((label) =>
          nodeLabels.find((nodeLabel) => nodeLabel.$id === label.$ref.slice(1))
        )
        .filter((label) => label);
      if (labels.length !== nodeObjectType.labels.length) {
        throw new Error("Not all label references are defined");
      }
      return new NodeObjectType(nodeObjectType.$id, labels);
    });
    const relationshipObjectTypes = json.relationshipObjectTypes.map(
      (relationshipObjectType) => {
        const type = relationshipTypes.find(
          (relationshipType) =>
            relationshipType.$id === relationshipObjectType.type.$ref.slice(1)
        );
        if (!type) {
          throw new Error("Not all relationship type references are defined");
        }
        const from = nodeObjectTypes.find(
          (nodeObjectType) =>
            nodeObjectType.$id === relationshipObjectType.from.$ref.slice(1)
        );
        if (!from) {
          throw new Error(
            "Not all node object type references in from are defined"
          );
        }
        const to = nodeObjectTypes.find(
          (nodeObjectType) =>
            nodeObjectType.$id === relationshipObjectType.to.$ref.slice(1)
        );
        if (!to) {
          throw new Error(
            "Not all node object type references in to are defined"
          );
        }
        return new RelationshipObjectType(
          relationshipObjectType.$id,
          type,
          from,
          to
        );
      }
    );
    const constraints = json.constraints.map((constraint) => {
      if (constraint.entityType === "node") {
        if (constraint.nodeLabel === undefined) {
          throw new Error(
            "Not all node labels in node constraints are defined"
          );
        }
        const nodeLabel = nodeLabels.find(
          (nodeLabel) => nodeLabel.$id === constraint.nodeLabel.$ref.slice(1)
        );
        if (!nodeLabel) {
          throw new Error(
            "Not all node labels references in node constraints are defined"
          );
        }
        const properties = constraint.properties
          .map((property) => {
            const propertiesForLabel = nodeLabel.properties;
            return propertiesForLabel.find(
              (p) => p.$id === property.$ref.slice(1)
            );
          })
          .filter((p) => p);
        if (properties.length !== constraint.properties.length) {
          throw new Error(
            "Not all properties references in node constraints are defined"
          );
        }
        return new NodeLabelConstraint(
          constraint.$id,
          constraint.name,
          constraint.constraintType,
          nodeLabel,
          properties
        );
      } else if (constraint.entityType === "relationship") {
        if (constraint.relationshipType === undefined) {
          throw new Error(
            "Not all relationship types in relationship constraints are defined"
          );
        }
        const relationshipType = relationshipTypes.find(
          (relationshipType) =>
            relationshipType.$id === constraint.relationshipType.$ref.slice(1)
        );
        if (!relationshipType) {
          throw new Error(
            "Not all relationship types in relationship constraints are defined"
          );
        }
        const properties = constraint.properties
          .map((property) => {
            const propertiesForType = relationshipType.properties;
            return propertiesForType.find(
              (p) => p.$id === property.$ref.slice(1)
            );
          })
          .filter((p) => p);
        if (properties.length !== constraint.properties.length) {
          throw new Error(
            "Not all properties references in relationship constraints are defined"
          );
        }
        return new RelationshipTypeConstraint(
          constraint.$id,
          constraint.name,
          constraint.constraintType,
          relationshipType,
          properties
        );
      }
    });
    const indexes = json.indexes.map((index) => {
      if (index.indexType === "lookup") {
        return new LookupIndex(index.$id, index.name, index.entityType);
      } else if (index.entityType === "node") {
        if (index.nodeLabel === undefined) {
          throw new Error("Not all node labels in node indexes are defined");
        }
        const nodeLabel = nodeLabels.find(
          (nodeLabel) => nodeLabel.$id === index.nodeLabel.$ref.slice(1)
        );
        if (!nodeLabel) {
          throw new Error(
            "Not all node labels references in node indexes are defined"
          );
        }
        const properties = index.properties
          .map((property) => {
            const propertiesForLabel = nodeLabel.properties;
            return propertiesForLabel.find(
              (p) => p.$id === property.$ref.slice(1)
            );
          })
          .filter((p) => p);
        if (properties.length !== index.properties.length) {
          throw new Error(
            "Not all properties references in node indexes are defined"
          );
        }
        return new NodeLabelIndex(
          index.$id,
          index.name,
          index.indexType,
          nodeLabel,
          properties
        );
      } else if (index.entityType === "relationship") {
        if (index.relationshipType === undefined) {
          throw new Error(
            "Not all relationship types in relationship indexes are defined"
          );
        }
        const relationshipType = relationshipTypes.find(
          (relationshipType) =>
            relationshipType.$id === index.relationshipType.$ref.slice(1)
        );
        if (!relationshipType) {
          throw new Error(
            "Not all relationship types in relationship indexes are defined"
          );
        }
        const properties = index.properties
          .map((property) => {
            const propertiesForType = relationshipType.properties;
            return propertiesForType.find(
              (p) => p.$id === property.$ref.slice(1)
            );
          })
          .filter((p) => p);
        if (properties.length !== index.properties.length) {
          throw new Error(
            "Not all properties references in relationship indexes are defined"
          );
        }
        return new RelationshipTypeIndex(
          index.$id,
          index.name,
          index.indexType,
          relationshipType,
          properties
        );
      }
    });
    return new GraphSchema(
      nodeObjectTypes,
      relationshipObjectTypes,
      constraints,
      indexes
    );
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
  toJsonStruct() {
    return {
      $id: this.$id,
      token: this.token,
      properties: this.properties
        .sort((a, b) => (a.token > b.token ? 1 : -1))
        .map((property) => property.toJsonStruct()),
    };
  }
  toRef() {
    return {
      $ref: `#${this.$id}`,
    };
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
  toJsonStruct() {
    return {
      $id: this.$id,
      token: this.token,
      properties: this.properties
        .sort((a, b) => (a.token > b.token ? 1 : -1))
        .map((property) => property.toJsonStruct()),
    };
  }
  toRef() {
    return {
      $ref: `#${this.$id}`,
    };
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
  toJsonStruct() {
    const brokenLabels = this.labels.filter((label) => !label);
    if (brokenLabels.length > 0) {
      throw new Error("Not all labels are defined");
    }
    return {
      $id: this.$id,
      labels: this.labels
        .sort((a, b) => (a.$id > b.$id ? 1 : -1))
        .map((label) => label.toRef()),
    };
  }
  toRef() {
    return {
      $ref: `#${this.$id}`,
    };
  }
  getProperties() {
    return this.labels.flatMap((l) => l.properties);
  }
  getPropertyTokens() {
    return this.getProperties().map((property) => property.token);
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
  toJsonStruct() {
    if (!this.type) {
      throw new Error("RelationshipObjectType.type is not defined");
    }
    if (!this.from) {
      throw new Error("RelationshipObjectType.from is not defined");
    }
    if (!this.to) {
      throw new Error("RelationshipObjectType.to is not defined");
    }
    return {
      $id: this.$id,
      type: this.type.toRef(),
      from: this.from.toRef(),
      to: this.to.toRef(),
    };
  }
  toRef() {
    return {
      $ref: `#${this.$id}`,
    };
  }
  getProperties() {
    return this.type.properties;
  }
  getPropertyTokens() {
    return this.getProperties().map((property) => property.token);
  }
}

export type Constraint = NodeLabelConstraint | RelationshipTypeConstraint;

export type Index = NodeLabelIndex | RelationshipTypeIndex | LookupIndex;

export const isNodeLabelConstraint = (
  constraint: Constraint
): constraint is NodeLabelConstraint => {
  return constraint.entityType === "node";
};

export const isRelationshipTypeConstraint = (
  constraint: Constraint
): constraint is RelationshipTypeConstraint => {
  return constraint.entityType === "relationship";
};

export const isNodeLabelIndex = (index: Index): index is NodeLabelIndex => {
  return index.entityType === "node";
};

export const isRelationshiptypeIndex = (
  index: Index
): index is RelationshipTypeIndex => {
  return index.entityType === "relationship";
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
    properties: Property[] = []
  ) {
    this.$id = $id;
    this.name = name;
    this.constraintType = constraintType;
    this.nodeLabel = nodeLabel;
    this.properties = properties;
    this.entityType = "node";
  }

  toJsonStruct(): ConstraintJsonStruct {
    return {
      $id: this.$id,
      name: this.name,
      constraintType: this.constraintType,
      entityType: this.entityType,
      nodeLabel: this.nodeLabel.toRef(),
      properties: this.properties.map((property) => property.toRef()),
    };
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
    properties: Property[] = []
  ) {
    this.$id = $id;
    this.name = name;
    this.constraintType = constraintType;
    this.relationshipType = relationshipType;
    this.properties = properties;
    this.entityType = "relationship";
  }

  toJsonStruct(): ConstraintJsonStruct {
    return {
      $id: this.$id,
      name: this.name,
      constraintType: this.constraintType,
      entityType: this.entityType,
      relationshipType: this.relationshipType.toRef(),
      properties: this.properties.map((property) => property.toRef()),
    };
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

  toJsonStruct(): IndexJsonStruct {
    return {
      $id: this.$id,
      name: this.name,
      indexType: this.indexType,
      entityType: this.entityType,
      nodeLabel: this.nodeLabel.toRef(),
      properties: this.properties.map((property) => property.toRef()),
    };
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

  toJsonStruct(): IndexJsonStruct {
    return {
      $id: this.$id,
      name: this.name,
      indexType: this.indexType,
      entityType: this.entityType,
      relationshipType: this.relationshipType.toRef(),
      properties: this.properties.map((property) => property.toRef()),
    };
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

  toJsonStruct() {
    return {
      $id: this.$id,
      name: this.name,
      constraintType: this.indexType,
      entityType: this.entityType,
    };
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
  | "full-text"
  | "point"
  | "default";

export type EntityType = "node" | "relationship";

export type PropertyTypes = PropertyBaseType | PropertyArrayType;
export class Property {
  $id: string;
  token: string;
  type: PropertyTypes | PropertyTypes[];
  nullable: boolean;

  constructor(
    $id: string,
    token: string,
    type: PropertyTypes | PropertyTypes[],
    nullable: boolean
  ) {
    this.$id = $id;
    this.token = token;
    this.type = type;
    this.nullable = nullable;
  }
  toJsonStruct() {
    const typeVal = Array.isArray(this.type)
      ? this.type
          .sort((a, b) => (a.type > b.type ? 1 : -1))
          .map((t) => t.toJsonStruct())
      : this.type.toJsonStruct();
    return {
      $id: this.$id,
      type: typeVal,
      token: this.token,
      nullable: this.nullable,
    };
  }
  toRef() {
    return { $ref: `#${this.$id}` };
  }
}

export class PropertyBaseType {
  type: PrimitivePropertyTypes;
  constructor(type: PrimitivePropertyTypes) {
    this.type = type;
  }
  toJsonStruct() {
    return {
      type: this.type,
    };
  }
}

export class PropertyArrayType {
  items: PropertyBaseType;
  type: "array";

  constructor(items: PropertyBaseType) {
    this.type = "array";
    this.items = items;
  }
  toJsonStruct() {
    return {
      type: this.type,
      items: this.items.toJsonStruct(),
    };
  }
}

export class PropertyType {
  static fromJsonStruct(json: PropertyTypeJsonStruct) {
    if (Array.isArray(json)) {
      return json.map((item) => PropertyType.fromJsonStruct(item));
    }
    if (json.type === "array") {
      return new PropertyArrayType(new PropertyBaseType(json.items.type));
    }
    return new PropertyBaseType(json.type);
  }
}

export type PrimitivePropertyTypes =
  | "integer"
  | "string"
  | "float"
  | "boolean"
  | "point"
  | "date"
  | "datetime"
  | "time"
  | "localtime"
  | "localdatetime"
  | "duration";

export type GraphSchemaRepresentationJsonStruct = {
  version: string;
  graphSchema: GraphSchemaJsonStruct;
};

export type GraphSchemaJsonStruct = {
  nodeLabels: NodeLabelJsonStruct[];
  relationshipTypes: RelationshipTypeJsonStruct[];
  nodeObjectTypes: NodeObjectTypeJsonStruct[];
  relationshipObjectTypes: RelationshipObjectTypeJsonStruct[];
  constraints: ConstraintJsonStruct[];
  indexes: IndexJsonStruct[];
};

export type NodeLabelJsonStruct = {
  $id: string;
  token: string;
  properties: PropertyJsonStruct[];
};

export type RelationshipTypeJsonStruct = {
  $id: string;
  token: string;
  properties: PropertyJsonStruct[];
};

export type NodeObjectTypeJsonStruct = {
  $id: string;
  labels: { $ref: string }[];
};

export type RelationshipObjectTypeJsonStruct = {
  $id: string;
  type: { $ref: string };
  from: { $ref: string };
  to: { $ref: string };
};

export type ConstraintJsonStruct = {
  $id: string;
  name: string;
  constraintType: ConstraintType;
  entityType: EntityType;
  nodeLabel?: { $ref: string };
  relationshipType?: { $ref: string };
  properties: { $ref: string }[];
};

export type IndexJsonStruct = {
  $id: string;
  name: string;
  indexType: IndexType;
  entityType: EntityType;
  nodeLabel?: { $ref: string };
  relationshipType?: { $ref: string };
  properties: { $ref: string }[];
};

export type PropertyJsonStruct = {
  $id?: string;
  token: string;
  type: PropertyTypeJsonStruct;
  nullable: boolean;
};

export type PropertyTypeJsonStruct =
  | { type: PrimitivePropertyTypes }
  | { type: "array"; items: { type: PrimitivePropertyTypes } }
  | (
      | { type: PrimitivePropertyTypes }
      | { type: "array"; items: { type: PrimitivePropertyTypes } }
    )[];
