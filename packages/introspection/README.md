## Neo4j Schema Introspection

### Usage

```ts
import neo4j, { session } from "neo4j-driver";
import { model } from "@neo4j/graph-schema-utils";
import { introspect, sessionFactory } from "@neo4j/graph-introspection";

async function main() {
  const driver = neo4j.driver(
    "neo4j://localhost:7687",
    neo4j.auth.basic("neo4j", "password")
  );

  // We want a session factory here so we can work in multiple sessions
  const graphSchema = await introspect(sessionFactory(driver, session.READ));

  // Put it in the JSON representation wrapper
  // this is only required if the serialized representation is the end goal
  const wrappedSchema = new model.GraphSchemaRepresentation(
    "1.0.0",
    graphSchema
  );

  // outputs standard graph schema JSON representation
  console.log(wrappedSchema.toJson(2));

  await driver.close();
}

main();
```

### Testing

Running `npm run test:integration` will create a new database named `integration.tests` and delete it after the tests finish.  
This means you'd need Neo4j Enterprise to run the integration tests and put credentials in `.env` file.

To spin up a docker container for running tests, run this command:

```bash
docker run \
    --name testneo4j \
    --rm \
    -p7474:7474 -p7687:7687 \
    --env NEO4J_ACCEPT_LICENSE_AGREEMENT=eval \
    --env NEO4J_AUTH=neo4j/password \
    neo4j:enterprise
```
