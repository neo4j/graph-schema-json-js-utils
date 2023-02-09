export declare class GraphSchemaRepresentation {
    version: string;
    graphSchema: GraphSchema;
    constructor(version: string, graphSchema: GraphSchema);
    toJson(): string;
    static parseJson(jsonString: any): GraphSchemaRepresentation;
}
export declare class GraphSchema {
    nodeLabels: NodeLabel[];
    relationshipTypes: RelationshipType[];
    nodeObjectTypes: NodeObjectType[];
    relationshipObjectTypes: RelationshipObjectType[];
    constructor(nodeLabels: NodeLabel[], relationshipTypes: RelationshipType[], nodeObjectTypes: NodeObjectType[], relationshipObjectTypes: RelationshipObjectType[]);
    toJsonStruct(): {
        nodeLabels: {
            $id: string;
            token: string;
        }[];
        relationshipTypes: {
            $id: string;
            token: string;
        }[];
        nodeObjectTypes: {
            $id: string;
            labels: {
                $ref: string;
            }[];
            properties: {
                type: any[] | {
                    type: PropertyTypes;
                } | {
                    type: "array";
                    items: PropertyBaseType;
                };
                token: string;
                mandatory: boolean;
            }[];
        }[];
        relationshipObjectTypes: {
            $id: string;
            type: {
                $ref: string;
            };
            from: {
                $ref: string;
            };
            to: {
                $ref: string;
            };
            properties: {
                type: any[] | {
                    type: PropertyTypes;
                } | {
                    type: "array";
                    items: PropertyBaseType;
                };
                token: string;
                mandatory: boolean;
            }[];
        }[];
    };
    static fromJsonStruct(json: any): GraphSchema;
}
export declare class NodeLabel {
    $id: string;
    token: string;
    constructor(id: string, token: string);
    toJsonStruct(): {
        $id: string;
        token: string;
    };
    toRef(): {
        $ref: string;
    };
}
export declare class RelationshipType {
    $id: string;
    token: string;
    constructor(id: string, token: string);
    toJsonStruct(): {
        $id: string;
        token: string;
    };
    toRef(): {
        $ref: string;
    };
}
export declare class NodeObjectType {
    $id: string;
    labels: NodeLabel[];
    properties: Property[];
    constructor(id: string, labels: NodeLabel[], properties: Property[]);
    toJsonStruct(): {
        $id: string;
        labels: {
            $ref: string;
        }[];
        properties: {
            type: any[] | {
                type: PropertyTypes;
            } | {
                type: "array";
                items: PropertyBaseType;
            };
            token: string;
            mandatory: boolean;
        }[];
    };
    toRef(): {
        $ref: string;
    };
}
export declare class RelationshipObjectType {
    $id: string;
    type: RelationshipType;
    from: NodeObjectType;
    to: NodeObjectType;
    properties: Property[];
    constructor(id: string, type: RelationshipType, from: NodeObjectType, to: NodeObjectType, properties: Property[]);
    toJsonStruct(): {
        $id: string;
        type: {
            $ref: string;
        };
        from: {
            $ref: string;
        };
        to: {
            $ref: string;
        };
        properties: {
            type: any[] | {
                type: PropertyTypes;
            } | {
                type: "array";
                items: PropertyBaseType;
            };
            token: string;
            mandatory: boolean;
        }[];
    };
}
export declare class Property {
    token: string;
    type: PropertyBaseType | PropertyArrayType;
    mandatory: boolean;
    constructor(token: string, type: PropertyBaseType | PropertyArrayType, mandatory: boolean);
    toJsonStruct(): {
        type: any[] | {
            type: PropertyTypes;
        } | {
            type: "array";
            items: PropertyBaseType;
        };
        token: string;
        mandatory: boolean;
    };
}
export declare class PropertyBaseType {
    type: PropertyTypes;
    constructor(type: PropertyTypes);
    toJsonStruct(): {
        type: PropertyTypes;
    };
}
export declare class PropertyArrayType {
    items: PropertyBaseType;
    type: "array";
    constructor(items: PropertyBaseType);
    toJsonStruct(): {
        type: "array";
        items: PropertyBaseType;
    };
}
export declare class PropertyType {
    static fromJsonStruct(json: any): any;
}
type PropertyTypes = "integer" | "string" | "float" | "boolean" | "point" | "date" | "datetime" | "time" | "localtime" | "localdatetime" | "duration";
export {};
