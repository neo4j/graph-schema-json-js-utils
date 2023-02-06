export class GraphSchemaRepresentation {
  /**
   * @param {string} version
   * @param {GraphSchema} graphSchema
   */
  constructor(version, graphSchema) {
    this.version = version;
    this.graphSchema = graphSchema;
  }

  toJson() {
    return JSON.stringify({
      graphSchemaRepresentation: {
        version: this.version,
        graphSchema: this.graphSchema.toJsonStruct(),
      },
    });
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
  /**
   * @param {NodeLabel[]} nodeLabels
   * @param {RelationshipType[]} relationshipTypes
   * @param {NodeObjectType[]} nodeObjectTypes
   * @param {RelationshipObjectType[]} relationshipObjectTypes
   */
  constructor(
    nodeLabels,
    relationshipTypes,
    nodeObjectTypes,
    relationshipObjectTypes
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
    const nodeObjectTypes = json.nodeObjectTypes.map(
      (nodeObjectType) =>
        new NodeObjectType(
          nodeObjectType.$id,
          nodeObjectType.labels.map((label) =>
            nodeLabels.find(
              (nodeLabel) => nodeLabel.$id === label.$ref.slice(1)
            )
          ),
          nodeObjectType.properties.map(
            (property) =>
              new Property(
                property.token,
                PropertyType.fromJsonStruct(property.type),
                property.mandatory
              )
          )
        )
    );
    const relationshipObjectTypes = json.relationshipObjectTypes.map(
      (relationshipObjectType) =>
        new RelationshipObjectType(
          relationshipObjectType.$id,
          relationshipTypes.find(
            (relationshipType) =>
              relationshipType.$id === relationshipObjectType.type.$ref.slice(1)
          ),
          nodeObjectTypes.find(
            (nodeObjectType) =>
              nodeObjectType.$id === relationshipObjectType.from.$ref.slice(1)
          ),
          nodeObjectTypes.find(
            (nodeObjectType) =>
              nodeObjectType.$id === relationshipObjectType.to.$ref.slice(1)
          ),
          relationshipObjectType.properties.map(
            (property) =>
              new Property(
                property.token,
                PropertyType.fromJsonStruct(property.type),
                property.mandatory
              )
          )
        )
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
  /**
   * @param {string} id
   * @param {string} token
   */
  constructor(id, token) {
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
  /**
   * @param {string} id
   * @param {string} token
   */
  constructor(id, token) {
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
  /**
   * @param {string} id
   * @param {NodeLabel[]} labels
   * @param {Property[]} properties
   */
  constructor(id, labels, properties) {
    this.$id = id;
    this.labels = labels;
    this.properties = properties;
  }
  toJsonStruct() {
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
  /**
   * @param {string} id
   * @param {RelationshipType} type
   * @param {NodeObjectType} from
   * @param {NodeObjectType} to
   * @param {Property[]} properties
   */
  constructor(id, type, from, to, properties) {
    this.$id = id;
    this.type = type;
    this.from = from;
    this.to = to;
    this.properties = properties;
  }
  toJsonStruct() {
    return {
      $id: this.$id,
      type: this.type.toRef(),
      from: this.from.toRef(),
      to: this.to.toRef(),
      properties: this.properties.map((property) => property.toJsonStruct()),
    };
  }
}

export class Property {
  /** @type {string} */
  token;
  /** @type {PropertyBaseType | PropertyArrayType} */
  type;
  /** @type {boolean} */
  mandatory;

  /**
   * @param {string} token
   * @param {PropertyBaseType | PropertyArrayType} type
   * @param {boolean} [mandatory]
   */
  constructor(token, type, mandatory) {
    this.token = token;
    this.type = type;
    this.mandatory = mandatory;
  }
  toJsonStruct() {
    const typeVal = Array.isArray(this.type)
      ? this.type.map((t) => t.toJsonStruct())
      : this.type.toJsonStruct();
    return {
      type: typeVal,
      token: this.token,
      mandatory: this.mandatory,
    };
  }
}

export class PropertyBaseType {
  /** @type {PropertyTypes} */
  type;

  /**
   * @param {PropertyTypes} type
   */
  constructor(type) {
    this.type = type;
  }
  toJsonStruct() {
    return {
      type: this.type,
    };
  }
}

export class PropertyArrayType {
  /** @type {PropertyBaseType} */
  items;
  /**
   * @param {PropertyBaseType} items
   */
  constructor(items) {
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

/** @typedef {"integer" | "string" | "float" | "boolean" | "point" | "date" | "datetime" | "time" | "localtime" | "localdatetime" | "duration"} PropertyTypes */
