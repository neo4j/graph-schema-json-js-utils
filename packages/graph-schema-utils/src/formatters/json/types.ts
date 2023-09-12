import { PrimitivePropertyTypes } from "../../model/index.js";

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
  type: PropertyTypeJsonStruct;
  nullable: boolean;
};

export type PropertyTypeJsonStruct =
  | { type: PrimitivePropertyTypes }
  | { type: "array"; items: { type: PrimitivePropertyTypes } }
  | (
      | { type: PrimitivePropertyTypes }
      | { type: "array"; items: { type: PrimitivePropertyTypes } }
    )[];
