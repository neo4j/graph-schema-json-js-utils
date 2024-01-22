import {
  ConstraintType,
  EntityType,
  IndexType,
  PrimitivePropertyTypes,
} from "../../model/index.js";

export type RootSchemaJsonStruct = {
  graphSchemaRepresentation: GraphSchemaRepresentationJsonStruct;
};

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

export type NodeLabelConstraintJsonStruct = ConstraintJsonStruct & {
  entityType: "node";
  nodeLabel: { $ref: string };
  relationshipType: undefined;
};

export type RelationshipTypeConstraintJsonStruct = ConstraintJsonStruct & {
  entityType: "relationship";
  nodeLabel: undefined;
  relationshipType: { $ref: string };
};

export type IndexJsonStruct = {
  $id: string;
  name: string;
  indexType: IndexType;
  entityType: EntityType;
  nodeLabel?: { $ref: string };
  relationshipType?: { $ref: string };
  properties?: { $ref: string }[];
};

export type NodeLabelIndexJsonStruct = IndexJsonStruct & {
  indexType: Exclude<IndexType, "lookup">;
  entityType: "node";
  nodeLabel: { $ref: string };
  relationshipType: undefined;
  properties: { $ref: string }[];
};

export type RelationshipTypeIndexJsonStruct = IndexJsonStruct & {
  indexType: Exclude<IndexType, "lookup">;
  entityType: "relationship";
  nodeLabel: undefined;
  relationshipType: { $ref: string };
  properties: { $ref: string }[];
};

export type LookupIndexJsonStruct = IndexJsonStruct & {
  indexType: "lookup";
  nodeLabel: undefined;
  relationshipType: undefined;
  properties: undefined;
};

export type PropertyJsonStruct = {
  $id: string;
  token: string;
  type: PropertyTypeJsonStruct;
  nullable: boolean;
};

export type PrimitivePropertyTypesType = { type: PrimitivePropertyTypes };
export type PrimitivePropertyTypesArrayType = {
  type: "array";
  items: { type: PrimitivePropertyTypes };
};

export type PropertyTypeListJsonStruct = (PrimitivePropertyTypesType | PrimitivePropertyTypesArrayType)[]

export type PropertyTypeJsonStruct =
  | PrimitivePropertyTypesArrayType
  | PrimitivePropertyTypesType
  | PropertyTypeListJsonStruct;

export const isPropertyTypeListJsonStruct = (
  propertyType: PropertyTypeJsonStruct
): propertyType is PropertyTypeListJsonStruct => {
  return Array.isArray(propertyType);
}

export const isPrimitivePropertyTypesTypeJsonStruct = (
  propertyType: PropertyTypeJsonStruct
): propertyType is PrimitivePropertyTypesType => {
  return typeof propertyType === "object" && "type" in propertyType && propertyType.type !== "array";
}

export const isPrimitivePropertyTypesArrayTypeJsonStruct = (
  propertyType: PropertyTypeJsonStruct
): propertyType is PrimitivePropertyTypesArrayType => {
  return typeof propertyType === "object" && "type" in propertyType && propertyType.type === "array" && propertyType.items !== undefined;
}