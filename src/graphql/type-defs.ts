import { readFileSync } from 'fs';
import { join } from 'path';
import { __dirname } from '../utils/path.js';

export const typeDefs = readFileSync(join(__dirname, 'schemas', 'challenges.gql'), 'utf-8');
