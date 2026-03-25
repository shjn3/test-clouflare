
import { AdminPageType, DevPageType, PageConfigType, RoleType } from "./game.type"
import { AccountTabType, ModalType } from "./ui.type"
import { SafeDev } from "./user.type"

export interface AuthReponse {
    error: string | null
}
export interface AuthContextType {
    isAuthLoading: boolean,
    profile: SafeDev | null
    login: ({ email, password }: {
        email: string
        password: string
    }) => Promise<AuthReponse>
    register: ({ email, password, username }: {
        email: string
        password: string
        username: string
    }) => Promise<AuthReponse>
    logout: () => Promise<AuthReponse>
}

//Loading
export interface LoadingContextType {
    isLoading: boolean;
    setLoading: (isLoading: boolean) => void;
}

//Toast
export interface ToastContextType {
    showToast: (message: string, type: ToastType) => void;
}

export type ToastType = "success" | "error"

export interface Toast {
    id: string,
    message: string,
    type: ToastType,
    timer: NodeJS.Timeout,
}


//Search
export interface SearchContextType {
    search: (q: string) => void
    query: string
}

//UI
export interface UIContextType {
    modalName: ModalType
    tabAccDrawerName: AccountTabType
    openModal: (type: ModalType) => void
    openAccountDrawer: (tabName: AccountTabType) => void
    toggleDrawer: () => void;
    isOpeningMobileDrawer: boolean
    closeDrawer: () => void
    closeModal: () => void
    closeAccountDrawer: () => void
}

export interface AppContextType {
    mode: RoleType
    currentPage: DevPageType | AdminPageType | 'none'
    currentPageConfig: PageConfigType | undefined
    navigateTo: (type: DevPageType | AdminPageType) => void
    updateMode: () => void
}


//Filter
// export interface FilterContextType {
//     activeCategory: string,
//     filterCategory: (cat: string) => void
// }

// // view
// export interface ViewContextType {
//     currenView: ViewName,
//     navigateTo: (name: ViewName) => void,
//     game: GameData | undefined,
//     selectGame: (id: string) => void
//     userGames: UserGame[]
//     likeGame: () => Promise<boolean>
//     addToRecent: () => Promise<boolean>
//     favoriteGame: () => Promise<boolean>

// }