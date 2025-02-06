// utils/query.utils.ts
const ALLOWED_QUERY_TYPES = ['select', 'show', 'describe', 'registry'];

export function validateQuery(query: string): string | null {
 if (!query) {
   return 'Query is required';
 }

 const queryType = query.trim().toLowerCase().split(' ')[0];
 if (!ALLOWED_QUERY_TYPES.includes(queryType)) {
   return `Query type '${queryType}' not allowed. Only SELECT, SHOW, DESCRIBE and REGISTRY are supported`;
 }

 return null;
}

export function substituteParams(query: string, params?: Record<string, string>): string {
 if (!params) return query;
 
 let substitutedQuery = query;
 for (const [key, value] of Object.entries(params)) {
   substitutedQuery = substitutedQuery.replace(
     new RegExp(`'\\$${key}'`, 'g'), 
     `'${value}'`
   );
 }
 return substitutedQuery;
}
