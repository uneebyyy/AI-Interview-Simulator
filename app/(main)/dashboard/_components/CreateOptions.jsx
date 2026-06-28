"use client";
import { Video, Sparkles } from "lucide-react";
import Link from "next/link";
import React from "react";

function CreateOptions() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>

      {/* Create AI Interview */}
      <Link href="/dashboard/create-interview" style={{ textDecoration: "none" }}>
        <div style={{
          display: "flex", alignItems: "center", gap: "16px",
          padding: "24px",
          background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(167,139,250,0.2)",
          borderRadius: "16px", cursor: "pointer",
          transition: "all 0.2s ease"
        }}
          onMouseEnter={e => {
            e.currentTarget.style.background = "rgba(167,139,250,0.1)"
            e.currentTarget.style.borderColor = "rgba(167,139,250,0.4)"
            e.currentTarget.style.transform = "translateY(-2px)"
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = "rgba(255,255,255,0.05)"
            e.currentTarget.style.borderColor = "rgba(167,139,250,0.2)"
            e.currentTarget.style.transform = "translateY(0)"
          }}
        >
          <div style={{
            padding: "14px", borderRadius: "14px",
            background: "rgba(167,139,250,0.15)",
            border: "1px solid rgba(167,139,250,0.3)",
            flexShrink: 0
          }}>
            <Video size={28} color="#a78bfa" />
          </div>
          <div>
            <h2 style={{ color: "#fff", fontWeight: "600", fontSize: "16px", margin: "0 0 6px" }}>
              Create AI Interview
            </h2>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "13px", margin: 0 }}>
              Create AI interview and schedule with candidates
            </p>
          </div>
        </div>
      </Link>

      {/* Coming Soon Card */}
      <div style={{
        display: "flex", alignItems: "center", gap: "16px",
        padding: "24px",
        background: "rgba(255,255,255,0.02)",
        border: "1px dashed rgba(255,255,255,0.1)",
        borderRadius: "16px",
        opacity: "0.6"
      }}>
        <div style={{
          padding: "14px", borderRadius: "14px",
          background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,255,255,0.1)",
          flexShrink: 0
        }}>
          <Sparkles size={28} color="rgba(255,255,255,0.3)" />
        </div>
        <div>
          <h2 style={{ color: "rgba(255,255,255,0.5)", fontWeight: "600", fontSize: "16px", margin: "0 0 6px" }}>
            More Coming Soon
          </h2>
          <p style={{ color: "rgba(255,255,255,0.25)", fontSize: "13px", margin: 0 }}>
            New interview types are on the way
          </p>
        </div>
      </div>

    </div>
  );
}

export default CreateOptions;