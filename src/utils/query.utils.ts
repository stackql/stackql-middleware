// utils/query.utils.ts
const ALLOWED_QUERY_TYPES = ['select', 'show', 'describe'];

export function validateQuery(query: string): string | null {
  if (!query) {
    return 'Query is required';
  }

  const queryType = query.trim().toLowerCase().split(' ')[0];
  if (!ALLOWED_QUERY_TYPES.includes(queryType)) {
    return `Query type '${queryType}' not allowed. Only SELECT, SHOW, and DESCRIBE are supported`;
  }

  return null;
}
