import {
  ConstraintType,
  EntityType,
  IndexType,
  PrimitivePropertyTypes,
  PropertyTypes,
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

export const isNodeLabelConstraintJsonStruct = (
  constraint: ConstraintJsonStruct
): constraint is NodeLabelConstraintJsonStruct => {
  return constraint.entityType === "node" && constraint.nodeLabel !== undefined;
};

export type RelationshipTypeConstraintJsonStruct = ConstraintJsonStruct & {
  entityType: "relationship";
  nodeLabel: undefined;
  relationshipType: { $ref: string };
};

export const isRelationshipTypeConstraintJsonStruct = (
  constraint: ConstraintJsonStruct
): constraint is RelationshipTypeConstraintJsonStruct => {
  return (
    constraint.entityType === "relationship" &&
    constraint.relationshipType !== undefined
  );
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

export const isNodeLabelIndexJsonStruct = (
  index: IndexJsonStruct
): index is NodeLabelIndexJsonStruct => {
  return index.nodeLabel !== undefined && index.indexType !== "lookup";
};

export const isRelationshipTypeIndexJsonStruct = (
  index: IndexJsonStruct
): index is RelationshipTypeIndexJsonStruct => {
  return index.relationshipType !== undefined && index.indexType !== "lookup";
};

export const isLookupIndexJsonStruct = (
  index: IndexJsonStruct
): index is LookupIndexJsonStruct => {
  return index.indexType === "lookup";
};

export type PropertyJsonStruct = {
  $id: string;
  token: string;
  type: PropertyTypeJsonStructRecrsive;
  nullable: boolean;
};

export type PrimitivePropertyTypesType = { type: PrimitivePropertyTypes };
export type PrimitivePropertyTypesArrayType = {
  type: "array";
  items: { type: PrimitivePropertyTypes };
};

export type PropertyTypeJsonStruct =
  | PrimitivePropertyTypesArrayType
  | PrimitivePropertyTypesType
  | (PrimitivePropertyTypesType | PrimitivePropertyTypesArrayType)[];

export type PropertyTypeJsonStructRecrsive =
  | PropertyTypeJsonStruct
  | Array<PropertyTypeJsonStruct | PropertyTypeJsonStructRecrsive[]>;
