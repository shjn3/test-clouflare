import { HTTP_STATUS } from "@/const/httpStatus";
import { SUBMIT_FORM_TITLES } from "@/const/submitFormTitle";
import { createDevServerSupabaseClient } from "@/libs/dev/DevSupabaseServer";
import { GamiGame, SafeDev } from "@/types";
import { getSlug } from "@/utils";
import { PostgrestError } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import { DEV_TABLE_NAMES } from "../const";
import { FetchUserProfile } from "../user/route";

export async function POST(req: NextRequest) {
    const formData = await req.formData()
    const gameInput = JSON.parse(formData.get(SUBMIT_FORM_TITLES.game) as string) as GamiGame;

    if (!gameInput) {
        return new NextResponse(JSON.stringify({
            error: {
                message: "Missing required field."
            }
        }), {
            status: HTTP_STATUS.BAD_REQUEST
        })
    }

    const slug = getSlug(gameInput.name);

    //--------------------- Check Authenticated ---------------------
    const { data: profile, error: errProfile }: {
        data: SafeDev | null;
        error: PostgrestError | null;
    } = await (await FetchUserProfile()).json();
    if (errProfile || !profile) {
        return new NextResponse(JSON.stringify({
            error: errProfile
        }), {
            status: HTTP_STATUS.BAD_REQUEST
        })
    }

    const supabase = await createDevServerSupabaseClient();
    const { data: draftGame } = await supabase.from(DEV_TABLE_NAMES.games).select<'*', GamiGame>('*').eq("slug", slug).single();

    if (draftGame && (draftGame.developer_id != profile.local_id || gameInput.id && gameInput.id != draftGame.id)) {
        return new NextResponse(JSON.stringify({
            error: {
                message: `Access denied: You can update ${gameInput.name}`
            }
        }), {
            status: HTTP_STATUS.BAD_REQUEST
        })
    }

    //--------------------- Upload Game ---------------------
    gameInput.developer_id = profile.local_id;
    gameInput.developer = profile.studio_name;
    gameInput.slug = slug;
    gameInput.id = draftGame?.id ?? gameInput.id;

    const {
        id, ...values
    } = gameInput;

    const { data, error } = gameInput.id ?
        await supabase.from(DEV_TABLE_NAMES.games).update(values).eq("slug", gameInput.slug).select().single() :
        await supabase.from(DEV_TABLE_NAMES.games).insert(values).select().single();

    return new NextResponse(JSON.stringify({
        data,
        error
    }), {
        status: error ? HTTP_STATUS.BAD_REQUEST : HTTP_STATUS.OK
    })
}