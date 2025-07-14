import { dirname } from 'path';
import { fileURLToPath } from 'url';

// Get directory name for ES Module
export const __dirname = dirname(fileURLToPath(import.meta.url));
