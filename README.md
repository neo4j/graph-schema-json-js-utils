# graph-schema-json-js-utils
Title
Graph Schema JSON util.

Introduction
The contents of this repot allow you to validate a graph schema to see if it follows the correct graph specification. The purpose is to allow you to extract the relationships that exist in the database. The result is displayed in the form of a JSON schema, which should also be able to be translated into a .js object and then back into a JSON schema.

Technologies 
The monorepository consists of the following packages:

json-schema 
The package contains the description against which the graph schema will be validated. 

Test
Unit testing uses the Vitest framework to get fast results. The package consists of tests divided into two groups.
One group 'model' tests the structure of the graph schema when it is parsed and so that it is parsed correctly. 
The second group 'validation' tests the validation on the different levels of the JSON schema to see if the validation works correctly. 

The package also consists of the file 'fs.utils.js'. It is a function that reads the file to be validated. 
