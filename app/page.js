"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/services/supabaseClient";
import { useRouter } from "next/navigation";
import { Sparkles, Mic, Star, Zap, ChevronRight } from "lucide-react";

export default function Home() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };
    getUser();
  }, []);

  const handleCreateInterview = () => {
    if (user) router.push("/dashboard");
    else router.push("/auth");
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0f0c29, #302b63, #24243e)",
      fontFamily: "sans-serif",
      overflowX: "hidden"
    }}>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes glow {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
        .nav-link:hover { color: #a78bfa !important; }
        .create-btn:hover { opacity: 0.85; transform: translateY(-1px); }
        .login-btn:hover { background: rgba(255,255,255,0.1) !important; }
        .feature-card:hover { 
          transform: translateY(-4px); 
          border-color: rgba(167,139,250,0.5) !important;
          background: rgba(167,139,250,0.08) !important;
        }
        .hero-btn:hover { opacity: 0.9; transform: translateY(-2px); box-shadow: 0 8px 25px rgba(124,58,237,0.5) !important; }
      `}</style>

      {/* NAVBAR */}
      <nav style={{
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        background: "rgba(255,255,255,0.03)",
        backdropFilter: "blur(10px)",
        position: "sticky", top: 0, zIndex: 100
      }}>
        <div style={{
          maxWidth: "1100px", margin: "0 auto",
          padding: "16px 24px",
          display: "flex", alignItems: "center", justifyContent: "space-between"
        }}>
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <Image src="/logo.png" alt="logo" width={36} height={36}
              style={{ filter: "brightness(0) invert(1)" }} />
            <span style={{ color: "#fff", fontWeight: "700", fontSize: "16px" }}>
              EazyWith.AI
            </span>
          </div>

          {/* Links */}
          <div style={{ display: "flex", alignItems: "center", gap: "28px" }}>
            <a href="#features" className="nav-link" style={{
              color: "rgba(255,255,255,0.5)", fontSize: "14px",
              textDecoration: "none", transition: "color 0.2s"
            }}>Features</a>
            <a href="#how-it-works" className="nav-link" style={{
              color: "rgba(255,255,255,0.5)", fontSize: "14px",
              textDecoration: "none", transition: "color 0.2s"
            }}>How It Works</a>
          </div>

          {/* Buttons */}
          <div style={{ display: "flex", gap: "12px" }}>
            <button className="login-btn" onClick={() => router.push("/auth")} style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.15)",
              borderRadius: "10px", padding: "9px 20px",
              color: "#fff", fontSize: "14px", fontWeight: "500",
              cursor: "pointer", transition: "all 0.2s"
            }}>
              Login
            </button>
            <button className="create-btn" onClick={handleCreateInterview} style={{
              background: "linear-gradient(135deg, #7c3aed, #a78bfa)",
              border: "none", borderRadius: "10px",
              padding: "9px 20px", color: "#fff",
              fontSize: "14px", fontWeight: "600",
              cursor: "pointer", transition: "all 0.2s",
              boxShadow: "0 4px 15px rgba(124,58,237,0.4)"
            }}>
              Create Interview
            </button>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section style={{
        display: "flex", flexDirection: "column",
        alignItems: "center", textAlign: "center",
        padding: "100px 24px 80px",
        position: "relative", animation: "fadeIn 0.6s ease"
      }}>
        {/* Background glow */}
        <div style={{
          position: "absolute", top: "0", left: "50%",
          transform: "translateX(-50%)",
          width: "600px", height: "400px", borderRadius: "50%",
          background: "rgba(124,58,237,0.15)", filter: "blur(80px)",
          animation: "glow 3s ease-in-out infinite"
        }} />

        {/* Badge */}
        <div style={{
          display: "inline-flex", alignItems: "center", gap: "8px",
          background: "rgba(167,139,250,0.15)",
          border: "1px solid rgba(167,139,250,0.3)",
          borderRadius: "50px", padding: "6px 16px",
          marginBottom: "24px", position: "relative"
        }}>
          <Sparkles size={14} color="#a78bfa" />
          <span style={{ color: "#a78bfa", fontSize: "13px", fontWeight: "600" }}>
            AI-Powered Interview Platform
          </span>
        </div>

        {/* Heading */}
        <h1 style={{
          color: "#fff", fontSize: "56px", fontWeight: "800",
          margin: "0 0 20px", lineHeight: "1.15",
          maxWidth: "700px", position: "relative"
        }}>
          Ace Your Next
          <span style={{
            background: "linear-gradient(135deg, #a78bfa, #7c3aed)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent"
          }}> Interview </span>
          with AI
        </h1>

        {/* Subtitle */}
        <p style={{
          color: "rgba(255,255,255,0.5)", fontSize: "18px",
          maxWidth: "520px", lineHeight: "1.7",
          margin: "0 0 40px", position: "relative"
        }}>
          Practice interviews with AI, receive smart feedback, and improve your
          confidence before real interviews.
        </p>

        {/* CTA Button */}
        <button className="hero-btn" onClick={handleCreateInterview} style={{
          background: "linear-gradient(135deg, #7c3aed, #a78bfa)",
          border: "none", borderRadius: "14px",
          padding: "16px 36px", color: "#fff",
          fontSize: "16px", fontWeight: "700",
          cursor: "pointer", transition: "all 0.2s",
          boxShadow: "0 4px 20px rgba(124,58,237,0.4)",
          display: "flex", alignItems: "center", gap: "8px",
          position: "relative"
        }}>
          Get Started Free
          <ChevronRight size={20} />
        </button>

        {/* Hero Image */}
        <div style={{
          marginTop: "60px", position: "relative",
          animation: "float 4s ease-in-out infinite"
        }}>
          <div style={{
            position: "absolute", inset: "-2px",
            borderRadius: "24px",
            background: "linear-gradient(135deg, #7c3aed, #a78bfa)",
            filter: "blur(8px)", opacity: 0.4
          }} />
          <Image
            src="/interview.png"
            alt="app preview"
            width={500}
            height={300}
            style={{
              borderRadius: "20px",
              border: "1px solid rgba(167,139,250,0.3)",
              position: "relative"
            }}
          />
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" style={{
        maxWidth: "1100px", margin: "0 auto",
        padding: "80px 24px", animation: "fadeIn 0.7s ease"
      }}>
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <h2 style={{ color: "#fff", fontSize: "36px", fontWeight: "700", margin: "0 0 12px" }}>
            Why Choose EazyWith.AI?
          </h2>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "16px", margin: 0 }}>
            Everything you need to prepare for your dream job
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" }}>
          {[
            {
              icon: <Mic size={28} color="#a78bfa" />,
              bg: "rgba(167,139,250,0.15)",
              border: "rgba(167,139,250,0.3)",
              title: "Realistic AI Interviewer",
              desc: "Practice with an AI that asks industry-specific questions just like a real interviewer."
            },
            {
              icon: <Star size={28} color="#f59e0b" />,
              bg: "rgba(245,158,11,0.15)",
              border: "rgba(245,158,11,0.3)",
              title: "Instant Feedback",
              desc: "Get detailed performance ratings on technical skills, communication, and problem solving."
            },
            {
              icon: <Zap size={28} color="#10b981" />,
              bg: "rgba(16,185,129,0.15)",
              border: "rgba(16,185,129,0.3)",
              title: "Confidence Boost",
              desc: "Practice as many times as you want and track your improvement over time."
            },
          ].map((item, i) => (
            <div key={i} className="feature-card" style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "20px", padding: "28px",
              transition: "all 0.25s ease"
            }}>
              <div style={{
                width: "56px", height: "56px", borderRadius: "14px",
                background: item.bg, border: `1px solid ${item.border}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                marginBottom: "16px"
              }}>
                {item.icon}
              </div>
              <h3 style={{ color: "#fff", fontWeight: "600", fontSize: "16px", margin: "0 0 8px" }}>
                {item.title}
              </h3>
              <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "14px", lineHeight: "1.6", margin: 0 }}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" style={{
        maxWidth: "1100px", margin: "0 auto",
        padding: "0 24px 80px"
      }}>
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <h2 style={{ color: "#fff", fontSize: "36px", fontWeight: "700", margin: "0 0 12px" }}>
            How It Works
          </h2>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "16px", margin: 0 }}>
            Get started in 3 simple steps
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" }}>
          {[
            { step: "01", title: "Create Interview", desc: "Enter your job role, description, and preferred interview duration." },
            { step: "02", title: "Join & Practice", desc: "Share the link and start your AI-powered voice interview session." },
            { step: "03", title: "Get Feedback", desc: "Receive detailed scores and improvement tips instantly after the interview." },
          ].map((item, i) => (
            <div key={i} style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(167,139,250,0.15)",
              borderRadius: "20px", padding: "28px",
              position: "relative", overflow: "hidden"
            }}>
              <span style={{
                position: "absolute", top: "16px", right: "20px",
                color: "rgba(167,139,250,0.15)", fontSize: "48px",
                fontWeight: "800", lineHeight: 1
              }}>
                {item.step}
              </span>
              <div style={{
                width: "40px", height: "40px", borderRadius: "10px",
                background: "linear-gradient(135deg, #7c3aed, #a78bfa)",
                display: "flex", alignItems: "center", justifyContent: "center",
                marginBottom: "16px"
              }}>
                <span style={{ color: "#fff", fontWeight: "700", fontSize: "14px" }}>
                  {item.step}
                </span>
              </div>
              <h3 style={{ color: "#fff", fontWeight: "600", fontSize: "16px", margin: "0 0 8px" }}>
                {item.title}
              </h3>
              <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "14px", lineHeight: "1.6", margin: 0 }}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA BANNER */}
      <section style={{
        maxWidth: "1100px", margin: "0 auto",
        padding: "0 24px 80px"
      }}>
        <div style={{
          background: "linear-gradient(135deg, rgba(124,58,237,0.3), rgba(167,139,250,0.1))",
          border: "1px solid rgba(167,139,250,0.3)",
          borderRadius: "24px", padding: "48px",
          textAlign: "center", position: "relative", overflow: "hidden"
        }}>
          <div style={{
            position: "absolute", top: "-40px", left: "50%",
            transform: "translateX(-50%)",
            width: "300px", height: "200px",
            background: "rgba(124,58,237,0.2)", filter: "blur(60px)"
          }} />
          <h2 style={{ color: "#fff", fontSize: "32px", fontWeight: "700", margin: "0 0 12px", position: "relative" }}>
            Ready to Ace Your Interview?
          </h2>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "16px", margin: "0 0 28px", position: "relative" }}>
            Join thousands of candidates who improved with EazyWith.AI
          </p>
          <button className="hero-btn" onClick={handleCreateInterview} style={{
            background: "linear-gradient(135deg, #7c3aed, #a78bfa)",
            border: "none", borderRadius: "12px",
            padding: "14px 32px", color: "#fff",
            fontSize: "15px", fontWeight: "700",
            cursor: "pointer", transition: "all 0.2s",
            boxShadow: "0 4px 20px rgba(124,58,237,0.4)",
            position: "relative"
          }}>
            Start Free Now →
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{
        borderTop: "1px solid rgba(255,255,255,0.06)",
        padding: "24px",
        textAlign: "center"
      }}>
        <p style={{ color: "rgba(255,255,255,0.2)", fontSize: "13px", margin: 0 }}>
          © 2026 EazyWith.AI — All rights reserved
        </p>
      </footer>

    </div>
  );
}