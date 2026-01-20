"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth/auth-client";

export function SessionGuard({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const { data: session, isPending } = authClient.useSession();

    useEffect(() => {
        if (!isPending && !session) {
            router.replace("/auth");
        }
    }, [session, isPending, router]);

    if (isPending) return <>{children}</>;

    if (!session) return null;

    return <>{children}</>;
}