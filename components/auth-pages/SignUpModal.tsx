'use client'
import { useLoading } from "@/contexts/LoadingContext";
import { useToast } from "@/contexts/ToastContext";
import createSupabaseBrowser from "@/libs/dev/DevSupabaseBrowser";

import Link from "next/link";
import { redirect } from "next/navigation";
import { useRef } from "react";

export default () => {
    const emailRef = useRef<HTMLInputElement>(null);
    const passRef = useRef<HTMLInputElement>(null);
    const studioNameRef = useRef<HTMLInputElement>(null);

    const { setLoading } = useLoading();
    const { showToast } = useToast();

    async function handleSubmit() {
        if (!emailRef.current || !passRef.current || !studioNameRef.current) return

        setLoading(true);

        const supabase = createSupabaseBrowser();
        const { data, error } = await supabase.auth.signUp(
            {
                email: emailRef.current.value,
                password: passRef.current.value,
                options: {
                    data: {
                        username: studioNameRef.current.value
                    }
                }
            }
        );

        setLoading(false);

        if (error) {
            showToast(error.message, 'error');
        } else {
            redirect('deloper')
        }
    }

    return <div className="auth-screen" id="screenRegister">
        <div className="auth-bg"></div>
        <div className="auth-grid"></div>
        <div className="auth-card">
            <div className="auth-logo">
                <div className="auth-logo-badge">G</div>
                <div>
                    <div className="auth-logo-text">GAMI <span>Dev</span></div>
                    <div className="auth-logo-sub">developer.bravemobiles.com</div>
                </div>
            </div>
            <div className="auth-title">Create Developer Account</div>
            <div className="auth-sub">Join GAMI and publish your HTML5 games to millions of players.</div>
            <div className="auth-err" id="regErr"></div>
            <div className="field">
                <label>Studio / Developer Name</label>
                <input ref={studioNameRef} type="text" id="regName" placeholder="e.g. Pixel Studio" autoComplete="off" />
            </div>
            <div className="field">
                <label>Email Address</label>
                <input ref={emailRef} type="email" id="regEmail" placeholder="you@yourstudio.com" autoComplete="off" />
            </div>
            <div className="field">
                <label>Password <span style={{ color: 'var(--muted)', fontWeight: 400 }}>(min 6 chars)</span></label>
                <input ref={passRef} type="password" id="regPass" placeholder="••••••••" onKeyDown={(e) => { if (e.key === 'Enter') handleSubmit() }} />
            </div>
            <button className="btn btn-primary" onClick={handleSubmit}>Create Account →</button>
            <div className="auth-switch">Already have an account? <Link href="/auth/login" >Sign in</Link></div>
        </div>
    </div>
}