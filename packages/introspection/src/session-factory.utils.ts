import neo4j, { SessionMode, session } from "neo4j-driver";

export function sessionFactory(
  driver: neo4j.Driver,
  accessMode: SessionMode = session.READ
) {
  return () => driver.session({ defaultAccessMode: accessMode });
}
