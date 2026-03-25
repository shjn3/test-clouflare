import { createBrowserClient } from "@supabase/ssr"

const createSupabaseBrowser = () => {
    return createBrowserClient(process.env.NEXT_PUBLIC_DEV_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_DEV_SUPABASE_ANON_KEY!)
}
export default createSupabaseBrowser

