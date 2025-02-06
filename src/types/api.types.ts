// types/api.types.ts
export interface RespData {
  status: number;
  type: 'application/json' | 'text/plain';
  body: unknown;
}

export interface QueryRequest {
    query: string;
    params?: Record<string, string>;
    showMetadata?: boolean;
}

export interface QueryResponse {
    data: unknown[];
    metadata?: {
      operation: {
        startTime: string;
        endTime: string;
        duration: string;
        status: string;
      };
      result: {
        rowCount: number;
      };
      request: {
        query: string;
        params?: Record<string, string>;
        renderedQuery: string;
      };
    };
}
  
export interface ErrorResponse {
    error: string;
}
    