import { DEV_TABLE_NAMES } from "@/app/api";
import NavBar from "@/components/layout/NavBar";
import SideBar from "@/components/layout/SideBar";
import { createDevServerSupabaseClient } from "@/libs/dev/DevSupabaseServer";
import { SafeDev } from "@/types";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { ReactNode } from "react";

export const metadata: Metadata = {
    title: "Gami Developer",
};

export default async ({ children }: { children: ReactNode }) => {

    const supabase = await createDevServerSupabaseClient()
    const { data: user, error } = await supabase.auth.getUser();
    const { data: profile } = await supabase.from(DEV_TABLE_NAMES.profiles).select<'*', SafeDev>().single();

    if (!profile) return notFound();
    return <div className="app" id="app">
        <NavBar profile={profile} />
        <SideBar profile={profile} />
        <div className="layout">
            <main className="main">
                {children}
            </main>
        </div>
    </div>
}