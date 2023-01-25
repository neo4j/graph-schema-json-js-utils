/**
 * @typedef {Object} PropertyBaseType
 * @property {string} type
 */

/**
 * @typedef {Object} PropertyArrayType
 * @property {"array"} type
 * @property {PropertyBaseType} items
 */

/**
 * @typedef {PropertyBaseType | PropertyArrayType} PropertyType
 */

/**
 * @typedef {Object} Property
 * @property {string} token
 * @property {PropertyType} type
 * @property {boolean} [mandatory]
 */

/**
 * @typedef {Object} NodeLabel
 * @property {string} id
 * @property {string} token
 */

/**
 * @typedef {Object} RelationshipType
 * @property {string} id
 * @property {string} token
 */

/**
 * @typedef {Object} NodeObjectType
 * @property {string} id
 * @property {NodeLabel[]} labels
 * @property {Property[]} properties
 */

/**
 * @typedef {Object} RelationshipObjectType
 * @property {string} id
 * @property {RelationshipType} type
 * @property {NodeObjectType} from
 * @property {NodeObjectType} to
 * @property {Property[]} properties
 */

/**
 * @typedef {Object} GraphSchema
 * @property {string} version
 * @property {NodeLabel[]} nodeLabels
 * @property {RelationshipType[]} relationshipTypes
 * @property {NodeObjectType[]} nodeObjectTypes
 * @property {RelationshipObjectType[]} relationshipObjectTypes
 */

/**
 * @typedef {Object} GraphSchemaRepresentation
 * @property {string} version
 * @property {GraphSchema} graphSchema
 */

/**
 * @param {string} jsonString
 * @return {GraphSchemaRepresentation}
 * @throws {Error} If the input is invalid
 */

export function parseJson(jsonString) {
  const json = JSON.parse(jsonString);
  const graphSchemaRepresentation = json.graphSchemaRepresentation;
  if (graphSchemaRepresentation) {
    /** @type {Partial<GraphSchemaRepresentation>} */
    const result = {
      version: graphSchemaRepresentation.version,
      graphSchema: {
        nodeLabels: [],
        relationshipTypes: [],
        nodeObjectTypes: [],
        relationshipObjectTypes: [],
      },
    };
    const graphSchema = graphSchemaRepresentation.graphSchema;
    if (graphSchema) {
      result.graphSchema.nodeLabels = graphSchema.nodeLabels.map((nl) => ({
        $id: nl.$id,
        token: nl.token,
      }));
      result.graphSchema.relationshipTypes = graphSchema.relationshipTypes.map(
        (rt) => ({
          $id: rt.$id,
          token: rt.token,
        })
      );
      result.graphSchema.nodeObjectTypes = graphSchema.nodeObjectTypes.map(
        (not) => ({
          $id: not.$id,
          labels: not.labels.map((l) =>
            result.graphSchema.nodeLabels.find(
              (nl) => nl.$id === l.$ref.substring(1)
            )
          ),
          properties: not.properties,
        })
      );
      result.graphSchema.relationshipObjectTypes =
        graphSchema.relationshipObjectTypes.map((rot) => ({
          $id: rot.$id,
          type: result.graphSchema.relationshipTypes.find(
            (rt) => rt.$id === rot.type.$ref.substring(1)
          ),
          from: result.graphSchema.nodeObjectTypes.find(
            (nl) => nl.$id === rot.from.$ref.substring(1)
          ),
          to: result.graphSchema.nodeObjectTypes.find(
            (nl) => nl.$id === rot.to.$ref.substring(1)
          ),
          properties: rot.properties,
        }));
    }
    return result;
  }
  throw new Error("Invalid input");
}
