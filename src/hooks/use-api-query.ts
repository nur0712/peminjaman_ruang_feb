"use client";

import { useEffect, useState } from "react";

type UseApiQueryOptions = {
  enabled?: boolean;
};

type UseApiQueryResult<T> = {
  data: T | null;
  error: string | null;
  isLoading: boolean;
  refetch: () => Promise<void>;
};

export function useApiQuery<T>(url: string, options?: UseApiQueryOptions): UseApiQueryResult<T> {
  const enabled = options?.enabled ?? true;
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(enabled);
  const [nonce, setNonce] = useState(0);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const controller = new AbortController();
    let isActive = true;

    fetch(url, {
      cache: "no-store",
      signal: controller.signal,
    })
      .then(async (response) => {
        const payload = (await response.json()) as T & { message?: string };

        if (!isActive) {
          return;
        }

        if (!response.ok) {
          setError(payload.message ?? "Gagal memuat data.");
          setData(null);
          return;
        }

        setError(null);
        setData(payload);
      })
      .catch((error) => {
        if (!isActive || controller.signal.aborted) {
          return;
        }

        setError(error instanceof Error ? error.message : "Terjadi kesalahan saat memuat data.");
        setData(null);
      })
      .finally(() => {
        if (isActive && !controller.signal.aborted) {
          setIsLoading(false);
        }
      });

    return () => {
      isActive = false;
      controller.abort();
    };
  }, [url, enabled, nonce]);

  return {
    data,
    error,
    isLoading: enabled && (isLoading || (!data && !error)),
    refetch: async () => {
      setIsLoading(true);
      setError(null);
      setNonce((value) => value + 1);
    },
  };
}
