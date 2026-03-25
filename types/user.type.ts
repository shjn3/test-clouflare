export interface Subscription {
    isActive: boolean
    expiresAt: Date
    item_sku: string
}


export interface Dev {
    local_id: string,
    studio_name: string,
    email: string,
    avatar: number,
    country: string
    role: string
}

export type SafeDev = Omit<Dev, 'password'>


export type UserRole = "admin" | "developer";