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

export type Neo4jPropertyType = UCFirst<
  model.PropertyBaseType["type"] | "Long" | "Double"
>;

export type Neo4jPropertyArrayType = `${Neo4jPropertyType}Array`;

type UCFirst<S extends string> = S extends `${infer F}${infer R}`
  ? `${Uppercase<F>}${R}`
  : S;
