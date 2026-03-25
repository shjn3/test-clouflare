
import { REGEX } from "@/const/regex";
import { GamiGame } from "@/types";

export function CreateGameInput(input: Partial<GamiGame>): GamiGame {
    // b435d367-1194-4e45-b458-30c51058ab1e
    return {
        id: "",
        name: "",
        slug: "",
        upvotes: 0,
        downvotes: 0,
        rating: 0,
        category: "",
        description: "",
        developer_id: "",
        developer: "",
        plays: 0,
        covers: {
            "1x1": "",
            "2x3": "",
            "16x9": ""
        },
        basic_launch_on: undefined,
        url: "",
        external_url: "",
        videos: {
            sizes: []
        },
        game_thumb_labels: [],
        status: 'pending-review',
        mobile_orientation: '',
        tag: "",
        build_id: 0,
        icon_url: "",
        cover_url: "",
        screenshot_urls: [],
        trailer_url: "",
        trailer_thumb: "",
        users: null,
        short_desc: "",
        ...input
    };

}

const emailReg = new RegExp(REGEX.email);
const passReg = new RegExp(REGEX.email);
const usernameReg = new RegExp(REGEX.email);

const validateEmail = (email: string) => {
    return emailReg.test(email);
}

const validatePassword = (pass: string) => {
    return passReg.test(pass);

}

const validateUsername = (username: string) => {
    return usernameReg.test(username);
}

export {
    validateEmail,
    validatePassword, validateUsername
};


export const getSlug = (name: string) => {
    return name.toLowerCase().trim().replaceAll(/[^a-z0-9\s-]/g, '').replaceAll(/[\s-]+/g, '-').replaceAll(/^-+|-+$/g, '')
}


export const getPathName = (slug: string, mediaType: string) => {
    return `${slug}/${slug}-${mediaType}`
}

export const getFileExtension = (fileName: string) => {

    return fileName.slice(fileName.lastIndexOf('.'));
}