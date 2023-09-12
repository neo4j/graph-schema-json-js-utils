import neo4j, { SessionMode, session } from "neo4j-driver";

export function sessionFactory(
  driver: neo4j.Driver,
  accessMode: SessionMode = session.READ,
  database: string = "neo4j"
) {
  return () => driver.session({ defaultAccessMode: accessMode, database });
}
