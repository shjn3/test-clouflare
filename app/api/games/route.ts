import { createDevServerSupabaseClient } from "@/libs/dev/DevSupabaseServer";
import { GamiGame, SafeDev } from "@/types";
import { getSlug } from "@/utils";
import { PostgrestError } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { DEV_TABLE_NAMES } from "../const";
import { FetchUserProfile } from "../user/route";

export async function POST(req: Request) {
    const input: GamiGame = await req.json()
    if (!input) {
        return NextResponse.json({
            data: null,
            error: "Missing required fields"
        })
    }
    const supabase = await createDevServerSupabaseClient();
    const { data: user, error: userError } = await supabase.auth.getUser();
    if (userError || !user) return NextResponse.json({
        data: null,
        error: userError
    })

    const { data: profiles, error: errorProfile }: {
        data: SafeDev,
        error: PostgrestError | null;
    } = await (await FetchUserProfile()).json();

    if (errorProfile) {
        if (userError || !user) return NextResponse.json({
            data: null,
            error: errorProfile
        })
    }

    const slug = getSlug(input.name);
    const { data: game } = await supabase.from(DEV_TABLE_NAMES.games).select('*').eq("slug", slug).single();
    if (game && game.id != input.id) {
        return NextResponse.json({
            data: null, error: {
                message: "This game name already exists. Please choose another name."
            }
        })
    }
    input.developer_id = user.user.id;
    input.developer = profiles.studio_name
    input.slug = slug;
    const { data: newGame, error } = await supabase.from(DEV_TABLE_NAMES.games).upsert(input).select().single();

    return NextResponse.json({
        data: newGame, error
    })
}