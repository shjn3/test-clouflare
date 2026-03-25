import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createDevServerSupabaseClient() {
    const cookieStore = await cookies(); // ← await required

    return createServerClient(
        process.env.NEXT_PUBLIC_DEV_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_DEV_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll();
                },
                setAll(cookiesToSet) {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) =>
                            cookieStore.set(name, value, options)
                        );
                    } catch {
                        // called from Server Component — safe to ignore
                    }
                },
            },
        }
    );
}