'use client'

import { useLoading } from "@/contexts/LoadingContext";
import { useToast } from "@/contexts/ToastContext";
import createSupabaseBrowser from "@/libs/dev/DevSupabaseBrowser";
import { SafeDev } from "@/types";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

export default ({ profile }: { profile: SafeDev }) => {
    const [origin, setOrigin] = useState("gami.gami");
    useEffect(() => {
        setOrigin(window.location.origin);
    }, [])

    const { setLoading } = useLoading();
    const { showToast } = useToast();

    // const { mode, currentPageConfig } = useApp();
    function navGo(s: string) {

    }
    function toggleNotifPanel() {

    }

    async function logout() {
        setLoading(true);
        const supabase = createSupabaseBrowser();
        const { error } = await supabase.auth.signOut();
        setLoading(false);

        if (error) {
            showToast(error.message, 'error');

        } else {
            redirect('/auth/login')
        }
    }
    // developer.bravemobiles.com
    return <nav className="topnav">
        <div className="nav-logo" onClick={() => navGo('dashboard')}>
            <div className="nav-logo-badge">G</div>
            <div className="nav-logo-name">GAMI <span>{
                // mode.charAt(0).toUpperCase() + mode.slice(1)
            }</span></div>
        </div>
        <span className="nav-sep">/</span>
        <span className="nav-section" id="navSectionLabel">{
            // currentPageConfig?.label
        }</span>
        <span className="nav-spacer"></span>
        <span className="nav-domain">{
            origin
        }</span>

        <div className="notif-bell-wrap" onClick={toggleNotifPanel}>
            <div className="notif-bell">🔔</div>
            <div className="notif-bell-badge" id="notifBadge" style={{ display: 'none' }}>0</div>
        </div>
        <div className="nav-user">
            <div className="nav-avatar" id="navAvatar">{
                !profile ? 'E' : (profile.studio_name?.length > 0 ? profile.studio_name[0].toLocaleLowerCase() : 'E')
            }</div>
            <div>
                <div className="nav-name" id="navName">{profile?.studio_name}</div>
                <div className="nav-role" id="navRole">{profile.role == 'admin' ? "admin" : "developer"}</div>
            </div>
            <button className="btn btn-ghost" onClick={logout}>Sign Out</button>
        </div>
    </nav>

}