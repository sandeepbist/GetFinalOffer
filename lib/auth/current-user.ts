import { headers } from "next/headers";
import { cache } from "react";
import { auth } from "@/lib/auth";
import "server-only";

/**
 * The session user's `role` column is not part of better-auth's inferred
 * type (it is a server-controlled additional field), but it is always
 * present in the payload. Route handlers use this shape.
 */
export type SessionUser = {
  id: string;
  email: string;
  name: string;
  role: string;
};

export const getCurrentSession = cache(async () => {
    const headersList = await headers();
    return await auth.api.getSession({
        headers: headersList,
    });
});

export const getCurrentUserId = async () => {
    const session = await getCurrentSession();
    if (!session?.user?.id) {
        throw new Error("Unauthorized: No session found");
    }
    return session.user.id;
};

export const getCurrentUser = async (): Promise<SessionUser> => {
    const session = await getCurrentSession();
    if (!session?.user?.id) {
        throw new Error("Unauthorized: No session found");
    }
    const user = session.user as unknown as SessionUser;
    if (!user.role) {
        // input:false additional fields still return; guard the type hole.
        user.role = "candidate";
    }
    return user;
};
