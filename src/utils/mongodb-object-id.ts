export function isValidMongoDBObjectId(id: string): boolean {
  return /^[0-9a-fA-F]{24}$/.test(id);
}
