import { useMemo } from "react";
import { useAuth } from "@clerk/nextjs";
import { createClient } from "@supabase/supabase-js";

// Create a client-side Supabase client with auth
export function useSupabaseClient() {
  return useMemo(
    () =>
      createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_KEY!,
        {
          global: {
            headers: {
              // Headers will be set dynamically when needed
            },
          },
          auth: {
            persistSession: false,
            autoRefreshToken: false,
            detectSessionInUrl: false,
          },
          realtime: {
            params: {
              eventsPerSecond: 10,
            },
          },
        }
      ),
    []
  );
}

// Helper to create client with auth token
export function useCreateClientWithAuth() {
  const { getToken } = useAuth();
  const token = useMemo(async () => {
    const token = await getToken();
    return token;
  }, [getToken]);

  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_KEY!,
    {
      global: {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      },
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
      realtime: {
        params: {
          eventsPerSecond: 10,
        },
      },
    }
  );
}
