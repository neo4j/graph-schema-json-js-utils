import { model } from "@neo4j/graph-schema-utils";

export type NodeMap = {
    [key: string]: model.NodeObjectType;
};
export type RelationshipMap = {
    [key: string]: model.RelationshipObjectType;
};
export type PropertyRecord = {
    propertyName: string;
    propertyTypes: string[];
    mandatory: boolean;
};
export interface NodeTypePropertiesRecord extends PropertyRecord {
    nodeType: string;
    nodeLabels: string[];
}
export interface RelationshipTypePropertiesRecord extends PropertyRecord {
    relType: string;
    from: string[];
    to: string[];
}
