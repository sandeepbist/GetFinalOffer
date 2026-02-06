import { NextResponse } from "next/server";

export interface ApiError {
    error: string;
    code?: string;
    details?: Record<string, unknown>;
}

export interface ApiSuccess<T = unknown> {
    success: true;
    data?: T;
    message?: string;
}

type ApiResponse<T> = ApiSuccess<T> | ApiError;

export function successResponse<T>(data?: T, message?: string, status = 200) {
    const body: ApiSuccess<T> = { success: true };
    if (data !== undefined) body.data = data;
    if (message) body.message = message;
    return NextResponse.json(body, { status });
}

export function errorResponse(
    error: string,
    status: number,
    code?: string,
    details?: Record<string, unknown>,
    headers?: Record<string, string>
) {
    const body: ApiError = { error };
    if (code) body.code = code;
    if (details) body.details = details;
    return NextResponse.json(body, { status, headers });
}

export const ApiErrors = {
    unauthorized: (message = "Authentication required") =>
        errorResponse(message, 401, "UNAUTHORIZED"),

    forbidden: (message = "Access denied") =>
        errorResponse(message, 403, "FORBIDDEN"),

    notFound: (resource = "Resource") =>
        errorResponse(`${resource} not found`, 404, "NOT_FOUND"),

    badRequest: (message: string, details?: Record<string, unknown>) =>
        errorResponse(message, 400, "BAD_REQUEST", details),

    validationError: (errors: Array<{ field: string; message: string }>) =>
        errorResponse("Validation failed", 422, "VALIDATION_ERROR", { errors }),

    rateLimited: (limit: number, remaining: number, reset: number) =>
        errorResponse("Too many requests. Please try again later.", 429, "RATE_LIMITED", undefined, {
            "X-RateLimit-Limit": limit.toString(),
            "X-RateLimit-Remaining": remaining.toString(),
            "X-RateLimit-Reset": reset.toString(),
        }),

    serverError: (message = "An unexpected error occurred") =>
        errorResponse(message, 500, "INTERNAL_ERROR"),
};
