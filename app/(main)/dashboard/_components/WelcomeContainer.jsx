"use client";
import Image from "next/image";
import { useUser } from "@/app/provider";

function WelcomeContainer() {
  const { user, loading } = useUser();

  if (loading) return null;

  const displayName = user?.name || "Guest";
  const profilePic = user?.picture;

  return (
    <div style={{
      background: "rgba(255,255,255,0.05)",
      border: "1px solid rgba(167,139,250,0.3)",
      borderRadius: "20px", padding: "24px",
      display: "flex", alignItems: "center",
      justifyContent: "space-between",
      marginBottom: "24px",
      position: "relative", overflow: "hidden"
    }}>
      {/* Purple glow */}
      <div style={{
        position: "absolute", top: "-40px", left: "-40px",
        width: "200px", height: "200px", borderRadius: "50%",
        background: "rgba(124,58,237,0.15)", filter: "blur(40px)"
      }} />

      <div style={{ position: "relative" }}>
        <h2 style={{ color: "#fff", fontSize: "24px", fontWeight: "700", margin: "0 0 6px" }}>
          Welcome back, {displayName} 👋
        </h2>
        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "14px", margin: 0 }}>
          AI-Driven Mock Interview Platform
        </p>
      </div>

      {profilePic ? (
        <div style={{
          width: "64px", height: "64px", borderRadius: "50%",
          overflow: "hidden", border: "3px solid rgba(167,139,250,0.5)",
          flexShrink: 0, position: "relative"
        }}>
          <Image src={profilePic} alt={displayName} fill
            style={{ objectFit: "cover" }} sizes="64px" priority />
        </div>
      ) : (
        <div style={{
          width: "64px", height: "64px", borderRadius: "50%",
          background: "linear-gradient(135deg, #7c3aed, #a78bfa)",
          display: "flex", alignItems: "center", justifyContent: "center",
          border: "3px solid rgba(167,139,250,0.5)", flexShrink: 0
        }}>
          <span style={{ color: "#fff", fontSize: "24px", fontWeight: "700" }}>
            {displayName.charAt(0).toUpperCase()}
          </span>
        </div>
      )}
    </div>
  );
}

export default WelcomeContainer;