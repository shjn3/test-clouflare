import { UserRole } from "@/types";

export const AUTH_ROUTES: Record<UserRole, string> = {
    "admin": "/admin",
    "developer": "/developer"
}