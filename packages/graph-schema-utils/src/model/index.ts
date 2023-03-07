export class GraphSchemaRepresentation {
  version: string;
  graphSchema: GraphSchema;

  constructor(version: string, graphSchema: GraphSchema) {
    this.version = version;
    this.graphSchema = graphSchema;
  }

  toJson() {
    return JSON.stringify(this.toJsonStruct());
  }

  toJsonStruct() {
    return {
      graphSchemaRepresentation: {
        version: this.version,
        graphSchema: this.graphSchema.toJsonStruct(),
      },
    };
  }

  static parseJson(jsonString) {
    const json = JSON.parse(jsonString);
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

  constructor(
    nodeLabels: NodeLabel[],
    relationshipTypes: RelationshipType[],
    nodeObjectTypes: NodeObjectType[],
    relationshipObjectTypes: RelationshipObjectType[]
  ) {
    this.nodeLabels = nodeLabels;
    this.relationshipTypes = relationshipTypes;
    this.nodeObjectTypes = nodeObjectTypes;
    this.relationshipObjectTypes = relationshipObjectTypes;
  }
  toJsonStruct() {
    return {
      nodeLabels: this.nodeLabels.map((nodeLabel) => nodeLabel.toJsonStruct()),
      relationshipTypes: this.relationshipTypes.map((relationshipType) =>
        relationshipType.toJsonStruct()
      ),
      nodeObjectTypes: this.nodeObjectTypes.map((nodeObjectType) =>
        nodeObjectType.toJsonStruct()
      ),
      relationshipObjectTypes: this.relationshipObjectTypes.map(
        (relationshipObjectType) => relationshipObjectType.toJsonStruct()
      ),
    };
  }

  static fromJsonStruct(json) {
    const nodeLabels = json.nodeLabels.map(
      (nodeLabel) => new NodeLabel(nodeLabel.$id, nodeLabel.token)
    );
    const relationshipTypes = json.relationshipTypes.map(
      (relationshipType) =>
        new RelationshipType(relationshipType.$id, relationshipType.token)
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
      return new NodeObjectType(
        nodeObjectType.$id,
        labels,
        nodeObjectType.properties.map(
          (property) =>
            new Property(
              property.token,
              PropertyType.fromJsonStruct(property.type),
              property.nullable,
              property.$id
            )
        )
      );
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
          to,
          relationshipObjectType.properties.map(
            (property) =>
              new Property(
                property.token,
                PropertyType.fromJsonStruct(property.type),
                property.nullable,
                property.$id
              )
          )
        );
      }
    );
    return new GraphSchema(
      nodeLabels,
      relationshipTypes,
      nodeObjectTypes,
      relationshipObjectTypes
    );
  }
}

export class NodeLabel {
  $id: string;
  token: string;

  constructor(id: string, token: string) {
    this.$id = id;
    this.token = token;
  }
  toJsonStruct() {
    return {
      $id: this.$id,
      token: this.token,
    };
  }
  toRef() {
    return {
      $ref: `#${this.$id}`,
    };
  }
}

export class RelationshipType {
  $id: string;
  token: string;

  constructor(id: string, token: string) {
    this.$id = id;
    this.token = token;
  }
  toJsonStruct() {
    return {
      $id: this.$id,
      token: this.token,
    };
  }
  toRef() {
    return {
      $ref: `#${this.$id}`,
    };
  }
}

export class NodeObjectType {
  $id: string;
  labels: NodeLabel[];
  properties: Property[];

  constructor(id: string, labels: NodeLabel[], properties: Property[] = []) {
    this.$id = id;
    this.labels = labels;
    this.properties = properties;
  }
  toJsonStruct() {
    const brokenLabels = this.labels.filter((label) => !label);
    if (brokenLabels.length > 0) {
      throw new Error("Not all labels are defined");
    }
    return {
      $id: this.$id,
      labels: this.labels.map((label) => label.toRef()),
      properties: this.properties.map((property) => property.toJsonStruct()),
    };
  }
  toRef() {
    return {
      $ref: `#${this.$id}`,
    };
  }
}

export class RelationshipObjectType {
  $id: string;
  type: RelationshipType;
  from: NodeObjectType;
  to: NodeObjectType;
  properties: Property[];

  constructor(
    id: string,
    type: RelationshipType,
    from: NodeObjectType,
    to: NodeObjectType,
    properties: Property[] = []
  ) {
    this.$id = id;
    this.type = type;
    this.from = from;
    this.to = to;
    this.properties = properties;
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
      properties: this.properties.map((property) => property.toJsonStruct()),
    };
  }
  toRef() {
    return {
      $ref: `#${this.$id}`,
    };
  }
}

export type PropertyTypes = PropertyBaseType | PropertyArrayType;
export class Property {
  token: string;
  type: PropertyTypes | PropertyTypes[];
  nullable: boolean | undefined;
  $id: string | undefined;

  constructor(
    token: string,
    type: PropertyTypes | PropertyTypes[],
    nullable: boolean,
    $id?: string
  ) {
    this.token = token;
    this.type = type;
    this.nullable = nullable;
    this.$id = $id;
  }
  toJsonStruct() {
    const typeVal = Array.isArray(this.type)
      ? this.type.map((t) => t.toJsonStruct())
      : this.type.toJsonStruct();
    const out = {
      type: typeVal,
      token: this.token,
      nullable: this.nullable,
    };
    if (this.$id !== undefined) {
      out["$id"] = this.$id;
    }
    return out;
  }
  toRef() {
    return this.$id !== undefined ? { $ref: `#${this.$id}` } : null;
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
      items: this.items,
    };
  }
}

export class PropertyType {
  static fromJsonStruct(json) {
    if (Array.isArray(json)) {
      return json.map((item) => PropertyType.fromJsonStruct(item));
    }
    if (json.type === "array") {
      return new PropertyArrayType(json.items);
    }
    return new PropertyBaseType(json.type);
  }
}

type PrimitivePropertyTypes =
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
