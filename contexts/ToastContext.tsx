'use client'
import { Toast, ToastContextType, ToastType } from "@/types";
import { createContext, useCallback, useContext, useState, type ReactNode } from "react";


const ToastContext = createContext<ToastContextType | undefined>(undefined);


export const ToastProvider = ({ children }: { children: ReactNode }) => {
    const [currentToast, setCurrentToast] = useState<Toast | undefined>(undefined)
    const showToast = useCallback((msg: string, type: ToastType) => {
        if (currentToast) {
            clearTimeout(currentToast.timer);
        }
        var timer = setTimeout(() => setCurrentToast(undefined), 3000);
        setCurrentToast({
            message: msg,
            type: type,
            id: msg,
            timer
        });
    }, [])

    return <ToastContext.Provider value={{
        showToast
    }}>
        {children}

        <div className={"toast" + (currentToast ? ' show' : '')} id="toast">{
            currentToast ? (currentToast.type == 'success' ? '✔ ' : '✕ ') + currentToast.message : ''
        }</div>
    </ToastContext.Provider>
}

export function useToast() {
    const ctx = useContext(ToastContext);
    if (!ctx) throw new Error("useLoading must be used within ToastProvider");
    return ctx;
}