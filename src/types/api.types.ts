// types/api.types.ts
export interface QueryRequest {
    query: string;
    showMetadata?: boolean;
  }

export interface QueryResponse {
    data: unknown[];
    metadata?: {
        operation: {
            startTime?: string;
            endTime?: string;
            duration?: string;
            status?: string;
        };
        result: {
            rowCount?: number;
        };
        request: {
            query?: string;
        };
    };
}
  
export interface ErrorResponse {
    error: string;
}
  
    