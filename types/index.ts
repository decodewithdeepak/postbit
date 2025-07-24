export interface HttpMethod {
  value: string;
  label: string;
  color: string;
}

export interface RequestData {
  method: string;
  url: string;
  headers: Record<string, string>;
  body?: string;
}

export interface ResponseData {
  status: number;
  statusText: string;
  headers: Record<string, string>;
  data: any;
  duration?: number;
}

export interface ApiRequestRecord {
  id: number;
  method: string;
  url: string;
  headers?: Record<string, string>;
  body?: string;
  response?: ResponseData;
  createdAt: string;
}