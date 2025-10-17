import { readFileSync } from 'fs';
import yaml from 'js-yaml';

export function loadYaml(filePath: string): any {
  const fileContents = readFileSync(filePath, 'utf8');
  return yaml.load(fileContents);
}
