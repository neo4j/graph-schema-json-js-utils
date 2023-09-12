export class GraphSchema {
  nodeLabels: NodeLabel[];
  relationshipTypes: RelationshipType[];
  nodeObjectTypes: NodeObjectType[];
  relationshipObjectTypes: RelationshipObjectType[];

  constructor(
    nodeObjectTypes: NodeObjectType[],
    relationshipObjectTypes: RelationshipObjectType[]
  ) {
    this.nodeObjectTypes = nodeObjectTypes;
    this.relationshipObjectTypes = relationshipObjectTypes;
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

  constructor(id: string, token: string) {
    this.$id = id;
    this.token = token;
  }
}

export class RelationshipType {
  $id: string;
  token: string;

  constructor(id: string, token: string) {
    this.$id = id;
    this.token = token;
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
  getPropertyTokens() {
    return this.properties.map((property) => property.token);
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
  getPropertyTokens() {
    return this.properties.map((property) => property.token);
  }
}

export type PropertyTypes = PropertyBaseType | PropertyArrayType;
export class Property {
  token: string;
  type: PropertyTypes | PropertyTypes[];
  nullable: boolean;
  $id?: string;

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
}

export class PropertyBaseType {
  type: PrimitivePropertyTypes;
  constructor(type: PrimitivePropertyTypes) {
    this.type = type;
  }
}

export class PropertyArrayType {
  items: PropertyBaseType;
  type: "array";

  constructor(items: PropertyBaseType) {
    this.type = "array";
    this.items = items;
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
