# @neo4j/graph-schema-utils

## 1.0.0-next.17

### Patch Changes

- cc45630: fix: detect malformed graph schema with duplicated node label ids and object type ids

## 1.0.0-next.16

### Minor Changes

- ef37ac3: Changed full-text type to fullText for consistency between indexes and constaints types

## 1.0.0-next.15

### Patch Changes

- 5c29b4f: make sure json type utility functions are also exported

## 1.0.0-next.14

### Patch Changes

- 8702c18: removed recursive property type

## 1.0.0-next.13

### Patch Changes

- a4c00d6: Fix types export
- 66b813c: Move some functions to their right places

## 1.0.0-next.12

### Patch Changes

- 9ff77b6: fix: export json struct functions

## 1.0.0-next.11

### Patch Changes

- 39d2d24: exported json struct functions and types

## 1.0.0-next.10

### Patch Changes

- 1bdd0bc: Export PrimitivePropertyTypes
- bf6d3c8: Added indexes and constraints support in schema
- 2951446: Add introspection package to introspect the schema from an existing Neo4j DBMS.
- a1f50cc: keep order except for node labels and rel types
- c3f36ac: Extract JSON serializer and parser to standalone tools. Add LLM prompt serializers.

## 1.0.0-next.9

### Patch Changes

- e87db42: Improve json struct types

## 1.0.0-next.8

### Patch Changes

- b487356: Add json struct helpers

## 1.0.0-next.7

### Patch Changes

- d2237f5: Add GHA to run TS checks (incl. test files) in addition to tests and builds
- 3312196: Add model helper functions and fix Property type issues
- 31faf52: Add convenient extraction methods to GraphSchema

## 1.0.0-next.6

### Minor Changes

- 33865d9: Add required nullable field to all properties

## 1.0.0-next.5

### Patch Changes

- c0f97e3: Add support for optional $id fields on node and relationship object types

## 1.0.0-next.4

### Patch Changes

- 108665d: Fix TS errors on Property Types
- cdf7455: Update README with programatical usage example and TS build instructions

## 1.0.0-next.3

### Patch Changes

- 47542b7: Update package config for better tooling discovery

## 1.0.0-next.2

### Patch Changes

- 5eb1d0c: Convert to typescript

## 1.0.0-next.1

### Patch Changes

- 62f0601: Move JSON-schema to devDep.

## 1.0.0-next.0

### Major Changes

- dc89dd2: Add JSON serializing abilities to model

### Patch Changes

- 67daf48: Make internal dependencies rely on workspace rather than fs
