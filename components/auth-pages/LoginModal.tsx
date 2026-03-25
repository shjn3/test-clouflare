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
    const { setLoading } = useLoading();
    const { showToast } = useToast();


    async function handleSubmit() {
        if (!emailRef.current || !passRef.current) return

        setLoading(true);
        const supabase = createSupabaseBrowser();
        const { data, error } = await supabase.auth.signInWithPassword(
            {
                email: emailRef.current.value,
                password: passRef.current.value
            }
        );

        setLoading(false);

        if (error) {
            showToast(error.message, 'error');
        } else {
            redirect('/developer')
        }
    }

    return <div className="auth-card">
        <div className="auth-logo">
            <div className="auth-logo-badge">G</div>
            <div>
                <div className="auth-logo-text">GAMI <span>Dev</span></div>
                <div className="auth-logo-sub">developer.bravemobiles.com</div>
            </div>
        </div>
        <div className="auth-title">Welcome Back</div>
        <div className="auth-sub">Sign in to your developer account.</div>
        <div className="auth-err" id="loginErr">Invalid email or password.</div>
        <div className="field">
            <label>Email Address</label>
            <input ref={emailRef} type="email" id="loginEmail" placeholder="you@yourstudio.com" />
        </div>
        <div className="field">
            <label>Password</label>
            <input ref={passRef} type="password" id="loginPass" placeholder="••••••••" onKeyDown={(e) => { if (e.key === 'Enter') handleSubmit(); }} />
        </div>
        <button className="btn btn-primary" onClick={handleSubmit}>Sign In →</button>
        <div className="auth-switch">New developer? <Link href="/auth/register">Create account</Link></div>
    </div >
}


// export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {


//     // Already logged in → redirect to home
//     if (session) {
//         return { redirect: { destination: "/", permanent: false } }
//     }

//     return {
//         props: {
//             initialUser: null,
//             initialProfile: null,
//         },
//     }
// }
