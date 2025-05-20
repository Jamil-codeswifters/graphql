// schema/index.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { mergeTypeDefs } from '@graphql-tools/merge';
import { gql } from 'apollo-server';

// Re-create __filename and __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

// Read all your .graphql files
const typesArray = fs
  .readdirSync(__dirname)
  .filter(f => f.endsWith('.graphql'))
  .map(f => gql(fs.readFileSync(path.join(__dirname, f), 'utf8')));

// Merge into one typeDefs
export const typeDefs = mergeTypeDefs(typesArray);
