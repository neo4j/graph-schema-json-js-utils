## Neo4j Schema Introspection

### Usage

```ts
import neo4j, { session } from "neo4j-driver";
import { introspect, sessionFactory } from "@neo4j/graph-introspection";

async function main() {
  const driver = neo4j.driver(
    "neo4j://localhost:7687",
    neo4j.auth.basic("neo4j", "password")
  );

  // We want a session factory here so we can work in multiple sessions
  const graphSchema = await introspect(sessionFactory(driver, session.READ));

  // outputs JSON representation
  console.log(graphSchema.toJson(2));

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
    --env NEO4J_ACCEPT_LICENSE_AGREEMENT=yes \
    --env NEO4J_AUTH=neo4j/password \
    neo4j:enterprise
```
