export const randomChoice = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

export const buildObjectId = (prefix: string): string => `${prefix}${Date.now()}`;
