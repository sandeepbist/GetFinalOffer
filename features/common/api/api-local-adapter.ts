import type { ApiResponse } from "./api-types";

export interface ApiRequestOptions {
  signal?: AbortSignal;
}

export interface ApiAdapterInterface {
  get: <T>(url: string, params?: any, options?: ApiRequestOptions) => Promise<ApiResponse<T>>;
  post: <T>(url: string, data: any, options?: ApiRequestOptions) => Promise<ApiResponse<T>>;
  put: <T>(url: string, data: any, options?: ApiRequestOptions) => Promise<ApiResponse<T>>;
  patch: <T>(url: string, data: any, options?: ApiRequestOptions) => Promise<ApiResponse<T>>;
  delete: <T>(url: string, data?: any, options?: ApiRequestOptions) => Promise<ApiResponse<T>>;
}

export class ApiLocalAdapter implements ApiAdapterInterface {
  private baseURL: string;

  constructor(baseURL: string = "/api") {
    this.baseURL = baseURL;
  }

  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    const status = response.status;
    const statusText = response.statusText;
    const ok = response.ok;

    try {
      const json = await response.json();
      if (!ok) {
        return {
          ok,
          status,
          statusText,
          error: json.error || json,
        };
      }
      const data = json.data !== undefined ? json.data : json;
      return {
        ok,
        status,
        statusText,
        data,
      };
    } catch (error) {
      return {
        ok: false,
        status,
        statusText,
        error,
      };
    }
  }

  async get<T>(url: string, params?: any, options?: ApiRequestOptions): Promise<ApiResponse<T>> {
    const queryString = params
      ? "?" + new URLSearchParams(params).toString()
      : "";
    const response = await fetch(`${this.baseURL}${url}${queryString}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      signal: options?.signal,
    });
    return this.handleResponse<T>(response);
  }

  async post<T>(url: string, data: any, options?: ApiRequestOptions): Promise<ApiResponse<T>> {
    const isFormData = data instanceof FormData;
    const response = await fetch(`${this.baseURL}${url}`, {
      method: "POST",
      headers: isFormData ? {} : { "Content-Type": "application/json" },
      body: isFormData ? data : JSON.stringify(data),
      signal: options?.signal,
    });
    return this.handleResponse<T>(response);
  }

  async put<T>(url: string, data: any, options?: ApiRequestOptions): Promise<ApiResponse<T>> {
    const response = await fetch(`${this.baseURL}${url}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      signal: options?.signal,
    });
    return this.handleResponse<T>(response);
  }

  async patch<T>(url: string, data: any, options?: ApiRequestOptions): Promise<ApiResponse<T>> {
    const response = await fetch(`${this.baseURL}${url}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      signal: options?.signal,
    });
    return this.handleResponse<T>(response);
  }

  async delete<T>(url: string, data?: any, options?: ApiRequestOptions): Promise<ApiResponse<T>> {
    const response = await fetch(`${this.baseURL}${url}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      ...(data && { body: JSON.stringify(data) }),
      signal: options?.signal,
    });
    return this.handleResponse<T>(response);
  }
}

const apiAdapter = new ApiLocalAdapter();
export default apiAdapter;
