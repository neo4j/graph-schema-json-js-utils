import { PrimitivePropertyTypes, PropertyTypes } from "../../model/index.js";

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
};

export type NodeLabelJsonStruct = { $id: string; token: string };

export type RelationshipTypeJsonStruct = { $id: string; token: string };

export type NodeObjectTypeJsonStruct = {
  $id: string;
  labels: { $ref: string }[];
  properties: PropertyJsonStruct[];
};

export type RelationshipObjectTypeJsonStruct = {
  $id: string;
  type: { $ref: string };
  from: { $ref: string };
  to: { $ref: string };
  properties: PropertyJsonStruct[];
};

export type PropertyJsonStruct = {
  $id?: string;
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
