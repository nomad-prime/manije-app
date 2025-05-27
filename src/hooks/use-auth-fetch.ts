"use client";

import { useAuth } from "@clerk/nextjs";
import { useCallback } from "react";

export function useAuthFetch() {
  const { getToken } = useAuth();

  return useCallback(
    async (input: RequestInfo, init?: RequestInit): Promise<Response> => {
      const token = await getToken();

      return fetch(input, {
        ...init,
        headers: {
          ...init?.headers,
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
    },
    [getToken],
  );
}
