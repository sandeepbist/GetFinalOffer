import { ApiResponse } from "./api-local-adapter";

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number,
    public readonly code?: string,
    public readonly details?: any
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export const handleApiError = (error: any): never => {
  if (error instanceof ApiError) {
    throw error;
  }

  // Handle network errors
  if (error.message === "Failed to fetch") {
    throw new ApiError("Network error", 500);
  }

  try {
    // Try to parse error from ApiLocalAdapter
    const errorData = JSON.parse(error.message);
    throw new ApiError(
      errorData.statusText || "An error occurred",
      errorData.status,
      errorData.code,
      errorData.details
    );
  } catch (parseError) {
    // If parsing fails, throw generic error
    throw new ApiError(error.message || "An unexpected error occurred", 500);
  }
};

export const validateResponse = <T>(response: ApiResponse<T>): T => {
  if (!response.ok) {
    throw new ApiError(
      response.statusText || "An error occurred",
      response.status,
      response.error?.code,
      response.error?.details
    );
  }

  if (!response.data) {
    throw new ApiError("Invalid response format", 500);
  }

  return response.data;
};
