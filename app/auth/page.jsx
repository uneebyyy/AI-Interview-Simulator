"use client"
import { supabase } from "@/services/supabaseClient"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Chrome } from "lucide-react"

export default function Login() {
  const router = useRouter()

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: "http://localhost:3000/dashboard",
        queryParams: {
          prompt: 'select_account',
        }
      }
    })
    if (error) console.log(error.message)
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0f0c29, #302b63, #24243e)",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "sans-serif", padding: "24px"
    }}>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        @keyframes glow {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.8; }
        }
        .google-btn:hover {
          opacity: 0.9 !important;
          transform: translateY(-2px) !important;
          box-shadow: 0 8px 25px rgba(124,58,237,0.5) !important;
        }
        .back-btn:hover {
          color: #a78bfa !important;
        }
      `}</style>

      {/* Background glow */}
      <div style={{
        position: "fixed", top: "20%", left: "50%",
        transform: "translateX(-50%)",
        width: "500px", height: "400px", borderRadius: "50%",
        background: "rgba(124,58,237,0.12)", filter: "blur(80px)",
        animation: "glow 3s ease-in-out infinite",
        pointerEvents: "none"
      }} />

      <div style={{
        width: "100%", maxWidth: "420px",
        animation: "fadeIn 0.6s ease",
        position: "relative"
      }}>

        {/* Card */}
        <div style={{
          background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(167,139,250,0.25)",
          borderRadius: "28px", padding: "40px",
          display: "flex", flexDirection: "column",
          alignItems: "center", gap: "20px",
          backdropFilter: "blur(10px)"
        }}>

          {/* Logo */}
          <div style={{ animation: "float 4s ease-in-out infinite" }}>
            <Image
              src="/logo.png"
              width={80} height={80}
              alt="logo"
              style={{ filter: "brightness(0) invert(1)" }}
            />
          </div>

          {/* Title */}
          <div style={{ textAlign: "center" }}>
            <h2 style={{
              color: "#fff", fontSize: "26px",
              fontWeight: "700", margin: "0 0 8px"
            }}>
              Welcome to EazyWith.AI
            </h2>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "14px", margin: 0 }}>
              Sign in to start your AI interview journey
            </p>
          </div>

          {/* Interview Image */}
          <div style={{
            width: "100%", borderRadius: "16px",
            overflow: "hidden",
            border: "1px solid rgba(167,139,250,0.2)"
          }}>
            <Image
              src="/interview.png"
              width={400} height={200}
              alt="interview"
              style={{ width: "100%", height: "auto", display: "block" }}
            />
          </div>

          {/* Divider */}
          <div style={{
            width: "100%", display: "flex",
            alignItems: "center", gap: "12px"
          }}>
            <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.08)" }} />
            <span style={{ color: "rgba(255,255,255,0.25)", fontSize: "12px" }}>
              continue with
            </span>
            <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.08)" }} />
          </div>

          {/* Google Login Button */}
          <button
            className="google-btn"
            onClick={signInWithGoogle}
            style={{
              width: "100%",
              background: "linear-gradient(135deg, #7c3aed, #a78bfa)",
              border: "none", borderRadius: "14px",
              padding: "14px", color: "#fff",
              fontSize: "15px", fontWeight: "700",
              cursor: "pointer", transition: "all 0.2s",
              display: "flex", alignItems: "center",
              justifyContent: "center", gap: "10px",
              boxShadow: "0 4px 20px rgba(124,58,237,0.4)"
            }}
          >
            <Chrome size={20} />
            Login with Google
          </button>

          {/* Privacy Note */}
          <p style={{
            color: "rgba(255,255,255,0.2)",
            fontSize: "12px", textAlign: "center", margin: 0
          }}>
            By signing in, you agree to our terms of service and privacy policy
          </p>

        </div>

        {/* Back to Home */}
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <button
            className="back-btn"
            onClick={() => router.push("/")}
            style={{
              background: "none", border: "none",
              color: "rgba(255,255,255,0.3)",
              fontSize: "13px", cursor: "pointer",
              transition: "color 0.2s"
            }}
          >
            ← Back to Home
          </button>
        </div>

      </div>
    </div>
  )
}