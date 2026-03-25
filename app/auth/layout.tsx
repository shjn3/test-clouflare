import { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
    title: "Gami Developer",
};

export default async ({ children }: { children: ReactNode }) => {

    return <div className="auth-screen" id="screenLogin">
        <div className="auth-bg"></div>
        <div className="auth-grid"></div>
        {children}

    </div>
}