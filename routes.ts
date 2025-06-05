// an array of public routes that do not require authentication
export const publicRoutes = ["api/webhooks/stripe"];

/**
 * Array of routes that are used for authentication
 */
export const authRoutes = ["/auth"];

/**
 * The prefix for API Auth routes
 * these are used with this prefix are used for API authentication purposes
 */
export const apiAuthPrefix = "/api/auth";

/**
 * The default redirect path after logging in
 */
export const DEFAULT_LOGIN_REDIRECT = "/dashboard";

/**
 * Protected routes that require authentication
 * The middleware will check these routes and redirect to login if not authenticated
 */
export const protectedRoutes = ["/dashboard", "/recruiter"];
