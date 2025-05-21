import { useEffect, useState } from "react";
import { baseUrl } from "@/lib/urls";
import { useFetchWithAuth } from "@/hooks/useFetchWithAuth";

export default function useBootstrap() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const fetchWithAuth = useFetchWithAuth();

  useEffect(() => {
    fetchWithAuth(`${baseUrl}/system/bootstrap`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then(() => {
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to bootstrap:", err);
        setError("Failed to bootstrap");
        setLoading(false);
      });
  }, [fetchWithAuth]);

  return { loading, error };
}
