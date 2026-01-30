import { headers } from "next/headers";
import { cache } from "react";
import { auth } from "@/lib/auth";
import "server-only";

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