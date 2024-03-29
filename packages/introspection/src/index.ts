import type { Session } from "neo4j-driver";
import { model } from "@neo4j/graph-schema-utils";
import {
  Neo4jPropertyArrayType,
  Neo4jPropertyType,
  NodeMap,
  NodeTypePropertiesRecord,
  RelationshipMap,
  RelationshipTypePropertiesRecord,
} from "./types.js";
import { toJSONType } from "./to-json-type.utils.js";

export { sessionFactory } from "./session-factory.utils.js";

export async function introspect(
  sessionFactory: () => Session,
  sample: boolean = true
) {
  const nodes = await introspectNodes(sessionFactory);
  const rels = await introspectRelationships(sessionFactory, nodes, sample);
  const myModel = new model.GraphSchema(
    Object.values(nodes),
    Object.values(rels)
  );
  return myModel;
}

async function introspectNodes(
  sessionFactory: () => Session
): Promise<NodeMap> {
  const nodes: NodeMap = {};
  const session = sessionFactory();
  const labelPropsRes = await session.executeRead((tx) =>
    tx.run(`CALL db.schema.nodeTypeProperties()
    YIELD nodeLabels, propertyName, propertyTypes, mandatory
    RETURN *`)
  );
  await session.close();
  if (!labelPropsRes?.records.length) {
    return nodes;
  }
  const nodeTypeProperties = labelPropsRes.records.map((r) =>
    r.toObject()
  ) as NodeTypePropertiesRecord[];
  new Set(nodeTypeProperties.map((nt) => nt.nodeLabels.join(":"))).forEach(
    (nodeObjectTypeId) => {
      const propertiesRows = nodeTypeProperties.filter(
        (nt) => nt.nodeLabels.join(":") === nodeObjectTypeId
      );
      if (!propertiesRows) {
        return;
      }
      const { nodeLabels } = propertiesRows[0];
      const nodeId = `n:` + nodeLabels.join(":");

      const labels = nodeLabels.map((nl) => {
        const properties = propertiesRows
          .filter((p) => p.propertyName)
          .map((p) => {
            const neo4jTypes = p.propertyTypes as Array<
              Neo4jPropertyType | Neo4jPropertyArrayType
            >;

            const types: model.PropertyType[] = neo4jTypes.map(
              createPropertyInstance
            );

            const propertyType: model.PropertyType | model.PropertyType[] =
              types.length === 1 ? types.pop() : types;

            return new model.Property(
              `${nl}_${p.propertyName}`,
              p.propertyName,
              propertyType,
              !p.mandatory
            );
          });
        return new model.NodeLabel(nl, nl, properties);
      });

      const node = new model.NodeObjectType(nodeId, labels);
      nodes[nodeObjectTypeId] = node;
    }
  );
  return nodes;
}

async function introspectRelationships(
  sessionFactory: () => Session,
  nodes: NodeMap,
  sample: boolean = true
): Promise<RelationshipMap> {
  const relSession = sessionFactory();
  const rels: RelationshipMap = {};

  // Find all relationship types and their properties (if any)
  const typePropsRes = await relSession.executeRead((tx) =>
    tx.run(`CALL db.schema.relTypeProperties() YIELD relType, propertyName, propertyTypes, mandatory
        WITH substring(relType, 2, size(relType)-3) AS relType, propertyName, propertyTypes, mandatory
        CALL {
            WITH relType, propertyName
            MATCH (n)-[r]->(m) WHERE type(r) = relType AND (r[propertyName] IS NOT NULL OR propertyName IS NULL)
            WITH n, r, m
            ${sample ? "LIMIT 100" : ""}
            WITH DISTINCT labels(n) AS from, labels(m) AS to
            RETURN from, to
        }
        RETURN DISTINCT from, to, relType, propertyName, propertyTypes, mandatory
        ORDER BY relType ASC`)
  );
  await relSession.close();
  const relTypePropertiesRecords = typePropsRes.records.map((r) =>
    r.toObject()
  ) as RelationshipTypePropertiesRecord[];
  new Set(relTypePropertiesRecords.map((nt) => nt.relType)).forEach(
    (relType) => {
      const propertiesRows = relTypePropertiesRecords.filter(
        (nt) => nt.relType === relType
      );
      if (!propertiesRows) {
        return;
      }
      const { from, to } = propertiesRows[0];
      const id = `${from.join(":")}-${relType}-${to.join(":")}`;
      const properties = propertiesRows
        .filter((p) => p.propertyName)
        .map((p) => {
          const neo4jTypes = p.propertyTypes as Array<
            Neo4jPropertyType | Neo4jPropertyArrayType
          >;

          const types = neo4jTypes.map(createPropertyInstance);
          const propertyType: model.PropertyType | model.PropertyType[] =
            types.length === 1 ? types.pop() : types;

          return new model.Property(
            `${relType}_${p.propertyName}`,
            p.propertyName,
            propertyType,
            !p.mandatory
          );
        });
      const fromNode = nodes[from.join(":")];
      const toNode = nodes[to.join(":")];
      const rel = new model.RelationshipObjectType(
        id,
        new model.RelationshipType(relType, relType, properties),
        fromNode,
        toNode
      );
      rels[relType] = rel;
    }
  );
  return rels;
}

function createPropertyInstance(t: Neo4jPropertyType | Neo4jPropertyArrayType) {
  if (t.endsWith("Array")) {
    const itemType = t.slice(0, -5) as Neo4jPropertyType;
    const type = toJSONType(itemType);
    return new model.PrimitiveArrayPropertyType(
      new model.PrimitivePropertyType(type)
    );
  }
  return new model.PrimitivePropertyType(toJSONType(t as Neo4jPropertyType));
}
