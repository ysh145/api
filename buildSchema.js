import fs from 'fs';
import path from 'path';
import { graphql } from 'graphql';
import { introspectionQuery, printSchema } from 'graphql/utilities';
import { getOssurNames, resolveOssurPath } from './config';

async function buildSchema(schemaPath) {
  const Schema = require(`${schemaPath}/graphqlSchema`).default;
  const result = await (graphql(Schema, introspectionQuery));
  if (result.errors) {
    console.error(
      'ERROR introspecting schema: ',
      JSON.stringify(result.errors, null, 2)
    );
  } else {
    fs.writeFileSync(
      path.join(schemaPath, './data/schema.graphql.json'),
      JSON.stringify(result, null, 2)
    );
    console.log(`  write file ${path.join(schemaPath, './data/schema.graphql.json')}`);
  }

  // Save user readable type system shorthand of schema
  fs.writeFileSync(
    path.join(schemaPath, './data/schema.graphql.txt'),
    printSchema(Schema)
  );
  console.log(`  write file ${path.join(schemaPath, './data/schema.graphql.txt')}`);
}

async function run() {
  const Names = getOssurNames();
  for (let name of Names) {
    console.log(`Building schema for '${name}'...`);
    await buildSchema(resolveOssurPath(name));
  }

  console.log('Building schemas competed!');
};

run().catch(e => {
  console.log(e);
  process.exit(0);
});
