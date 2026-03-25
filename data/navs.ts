import { AdminPageType, DevPageType } from "@/types"

export const NAVS: {
    dev: {
        key: DevPageType,
        label: string,
        emoji: string,
    }[]
    admin: {
        key: AdminPageType
        label: string,
        emoji: string,
    }[]
} = {
    dev: [{
        key: "dashboard",
        label: "Dashboard",
        emoji: "📊"
    },
    {
        key: "submit",
        label: "Submit Game",
        emoji: "⬆️"
    },
    {
        key: "mygames",
        label: "My Games",
        emoji: "🎮"
    },
    {
        key: "analytics",
        label: "Analytics",
        emoji: "📈"
    },
    {
        key: "earnings",
        label: "Earnings",
        emoji: "💰"
    },
    {
        key: "sdk",
        label: "SDK Docs",
        emoji: "🔧"
    },
    {
        key: "updates",
        label: "Game Updates",
        emoji: "🔄"
    },
    {
        key: "settings",
        label: "Settings",
        emoji: "⚙️"
    }],
    admin: [{
        key: "overview",
        label: "Overview",
        emoji: "📊"
    },
    {
        key: "review",
        label: "Review Queue",
        emoji: "⏳"
    },
    {
        key: "allgames",
        label: "All Games",
        emoji: "🎮"
    },
    {
        key: "developers",
        label: "Developers",
        emoji: "🛠️"
    },
    {
        key: "devprofile",
        label: "Dev Profile",
        emoji: "👤"
    },
    {
        key: "auditlog",
        label: "Audit Log",
        emoji: "📋"
    },
    {
        key: "security",
        label: "Security",
        emoji: "🔒"
    },
    {
        key: "invitations",
        label: "Invitations",
        emoji: "✉️"
    }, {
        key: "pwresets",
        label: "Pw Resets",
        emoji: "🔑"
    }, {
        key: "admsettings",
        label: "Settings",
        emoji: "⚙️"
    }]
}