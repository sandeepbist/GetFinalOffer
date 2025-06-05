export interface ApiResponse<T> {
  ok: boolean;
  status: number;
  statusText: string;
  data?: T;
  error?: any;
}
