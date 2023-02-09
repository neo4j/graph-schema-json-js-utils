export class GraphSchemaRepresentation {
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
        const graphSchema = GraphSchema.fromJsonStruct(json.graphSchemaRepresentation.graphSchema);
        return new GraphSchemaRepresentation(version, graphSchema);
    }
}
export class GraphSchema {
    constructor(nodeLabels, relationshipTypes, nodeObjectTypes, relationshipObjectTypes) {
        this.nodeLabels = nodeLabels;
        this.relationshipTypes = relationshipTypes;
        this.nodeObjectTypes = nodeObjectTypes;
        this.relationshipObjectTypes = relationshipObjectTypes;
    }
    toJsonStruct() {
        return {
            nodeLabels: this.nodeLabels.map((nodeLabel) => nodeLabel.toJsonStruct()),
            relationshipTypes: this.relationshipTypes.map((relationshipType) => relationshipType.toJsonStruct()),
            nodeObjectTypes: this.nodeObjectTypes.map((nodeObjectType) => nodeObjectType.toJsonStruct()),
            relationshipObjectTypes: this.relationshipObjectTypes.map((relationshipObjectType) => relationshipObjectType.toJsonStruct()),
        };
    }
    static fromJsonStruct(json) {
        const nodeLabels = json.nodeLabels.map((nodeLabel) => new NodeLabel(nodeLabel.$id, nodeLabel.token));
        const relationshipTypes = json.relationshipTypes.map((relationshipType) => new RelationshipType(relationshipType.$id, relationshipType.token));
        const nodeObjectTypes = json.nodeObjectTypes.map((nodeObjectType) => {
            const labels = nodeObjectType.labels
                .map((label) => nodeLabels.find((nodeLabel) => nodeLabel.$id === label.$ref.slice(1)))
                .filter((label) => label);
            if (labels.length !== nodeObjectType.labels.length) {
                throw new Error("Not all label references are defined");
            }
            return new NodeObjectType(nodeObjectType.$id, labels, nodeObjectType.properties.map((property) => new Property(property.token, PropertyType.fromJsonStruct(property.type), property.mandatory)));
        });
        const relationshipObjectTypes = json.relationshipObjectTypes.map((relationshipObjectType) => {
            const type = relationshipTypes.find((relationshipType) => relationshipType.$id === relationshipObjectType.type.$ref.slice(1));
            if (!type) {
                throw new Error("Not all relationship type references are defined");
            }
            const from = nodeObjectTypes.find((nodeObjectType) => nodeObjectType.$id === relationshipObjectType.from.$ref.slice(1));
            if (!from) {
                throw new Error("Not all node object type references in from are defined");
            }
            const to = nodeObjectTypes.find((nodeObjectType) => nodeObjectType.$id === relationshipObjectType.to.$ref.slice(1));
            if (!to) {
                throw new Error("Not all node object type references in to are defined");
            }
            return new RelationshipObjectType(relationshipObjectType.$id, type, from, to, relationshipObjectType.properties.map((property) => new Property(property.token, PropertyType.fromJsonStruct(property.type), property.mandatory)));
        });
        return new GraphSchema(nodeLabels, relationshipTypes, nodeObjectTypes, relationshipObjectTypes);
    }
}
export class NodeLabel {
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
    constructor(id, labels, properties) {
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
    constructor(id, type, from, to, properties) {
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
}
export class Property {
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
//# sourceMappingURL=index.js.map