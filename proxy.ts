import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";
import { DEV_TABLE_NAMES } from "./app/api";
import { UserRole } from "./types";

// Routes that require authentication
const PROTECTED_ROUTES = ["/admin", "/developer"];

// Routes only for unauthenticated users (redirect away if logged in)
const AUTH_ROUTES = ["/auth/login", "/auth/register", "/auth"];

// Role-based route prefixes
const ROLE_ROUTES: Record<UserRole, string> = {
    admin: "/admin",
    developer: "/developer",
};
export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;
    let supabaseResponse = NextResponse.next({ request });

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_DEV_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_DEV_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll();
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value }) =>
                        request.cookies.set(name, value)
                    );
                    supabaseResponse = NextResponse.next({ request });
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    );
                },
            },
        }
    );

    // Refresh session — do NOT remove this
    const {
        data: { user },
    } = await supabase.auth.getUser();

    let isProtectedRoute = PROTECTED_ROUTES.some(route => pathname.startsWith(route)) || pathname === '/';
    let isAuthRoute = AUTH_ROUTES.some(route => pathname.startsWith(route));

    if (!user && isProtectedRoute) {
        const loginUrl = request.nextUrl.clone();
        loginUrl.pathname = "/auth/login";
        return NextResponse.redirect(loginUrl);
    }

    if (user && (isAuthRoute || isProtectedRoute)) {

        const { data: profiles } = await supabase.from(DEV_TABLE_NAMES.profiles).select('role').single();
        const role = (profiles?.role as UserRole) ?? 'developer'
        const requestUrl = request.nextUrl.clone();

        if (isAuthRoute || !pathname.startsWith(ROLE_ROUTES[role])) {
            requestUrl.pathname = ROLE_ROUTES[role];
            return NextResponse.redirect(requestUrl);
        }
    }

    return supabaseResponse;
}