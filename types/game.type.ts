export interface BuildGameRecord {
    video: File | undefined,
    cover11: File | undefined
    cover23: File | undefined
    cover169: File | undefined
    game: FileList | undefined
}


export type DevPageType = 'dashboard' | 'submit' | 'mygames' | 'analytics' | 'earnings' | 'sdk' | 'updates' | 'settings' | 'edit-game'

export type AdminPageType = 'overview' | 'review' | 'allgames' | 'developers' | 'devprofile' | 'auditlog' | 'security' | 'invitations' | 'pwresets' | 'admsettings'

export type RoleType = 'dev' | 'admin'

export interface PageConfigType {
    key: string
    label: string
    emoji: string
}

export type GameStatus = 'draft' | 'in-review' | 'approved' | 'rejected' | 'published' | 'pending-review'
export type MobileOrientation = 'portrait' | 'landscape' | 'both'
export type Badge = 'new' | 'hot' | 'updated' | 'none'
export type Tag = ""

export interface GamiGame {
    id: string
    name: string
    slug: string
    upvotes: number
    downvotes: number
    rating: number
    category: string
    description: string
    developer_id: string
    developer: string
    plays: number
    covers: {
        "1x1": string
        "2x3": string
        "16x9": string
    }
    basic_launch_on?: Date
    url: string
    external_url: string
    videos: {
        sizes: {
            location: string
        }[]
    }
    game_thumb_labels: string[]
    status: GameStatus
    mobile_orientation: string
    tag: string
    build_id: number
    icon_url: string
    cover_url: string
    screenshot_urls: string[]
    trailer_url: string
    trailer_thumb: string
    users?: { name: string } | null
    short_desc: string
}


// export interface GamiGame {
//     id: string
//     title: string
//     category: string
//     short_desc: string
//     full_desc: string

//     plays: number
//     build_url: string
//     icon_url: string
//     cover_url: string
//     screenshot_urls: string[]
//     trailer_url: string
//     trailer_thumb: string
//     dev_id: string
//     users?: { name: string } | null
// }

// }

export interface Category {
    name: string
    slug: string
    icon: string
}