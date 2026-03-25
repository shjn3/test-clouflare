
import { createDevServerSupabaseClient } from "@/libs/dev/DevSupabaseServer";
import { SafeDev } from "@/types";
import { PostgrestError } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { DEV_TABLE_NAMES } from "../const";



export async function FetchUserProfile() {
    const supabase = await createDevServerSupabaseClient();
    const { data, error }: {
        data: SafeDev | null,
        error: PostgrestError | null
    } = await supabase
        .from(DEV_TABLE_NAMES.profiles)
        .select().single();


    return NextResponse.json({
        data,
        error
    });
}