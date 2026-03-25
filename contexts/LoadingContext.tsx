'use client'
import { LoadingContextType } from "@/types";
import { createContext, useCallback, useContext, useState, type ReactNode } from "react";

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);


export const LoadingProvider = ({ children }: { children: ReactNode }) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const setLoading = useCallback((_isLoading: boolean) => {
        setIsLoading(_isLoading);
    }, []);
    return <LoadingContext.Provider value={{
        isLoading,
        setLoading
    }}>
        {children}
        < div className={"loading" + (isLoading ? ' open' : '')} >
            <div className="spinner"></div>
        </div >
    </LoadingContext.Provider>
}

export function useLoading() {
    const ctx = useContext(LoadingContext);
    if (!ctx) throw new Error("useLoading must be used within LoadingProvider");
    return ctx;
}