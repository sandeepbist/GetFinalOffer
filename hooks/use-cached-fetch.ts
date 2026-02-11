"use client";

import { useEffect, useRef, useState, useCallback } from "react";

type CacheEntry<T = unknown> = {
    data: T;
    timestamp: number;
};

const store = new Map<string, CacheEntry>();
const DEFAULT_STALE_MS = 30_000;

export function useCachedFetch<T>(
    key: string,
    fetcher: () => Promise<T>,
    options?: { staleMs?: number }
) {
    const staleMs = options?.staleMs ?? DEFAULT_STALE_MS;
    const existing = store.get(key) as CacheEntry<T> | undefined;

    const [data, setData] = useState<T | null>(existing?.data ?? null);
    const [loading, setLoading] = useState(!existing);
    const fetcherRef = useRef(fetcher);
    fetcherRef.current = fetcher;

    const refresh = useCallback(
        async (background = false) => {
            if (!background) setLoading(true);
            try {
                const result = await fetcherRef.current();
                store.set(key, { data: result, timestamp: Date.now() });
                setData(result);
            } finally {
                if (!background) setLoading(false);
            }
        },
        [key]
    );

    useEffect(() => {
        const entry = store.get(key) as CacheEntry<T> | undefined;

        if (entry) {
            setData(entry.data);
            setLoading(false);

            if (Date.now() - entry.timestamp > staleMs) {
                refresh(true);
            }
            return;
        }

        refresh(false);
    }, [key, staleMs, refresh]);

    return { data, loading, refresh: () => refresh(false) };
}

export function invalidateCache(key: string) {
    store.delete(key);
}

export function invalidateCacheByPrefix(prefix: string) {
    for (const k of store.keys()) {
        if (k.startsWith(prefix)) store.delete(k);
    }
}
