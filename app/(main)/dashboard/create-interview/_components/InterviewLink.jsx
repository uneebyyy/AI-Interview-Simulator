"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Clock, Copy, List, Plus, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

function InterviewLink({ interviewId, formData }) {
  const router = useRouter();

  // ✅ full interview URL using env variable
const interviewUrl = `${process.env.NEXT_PUBLIC_HOST_URL}/interview/${interviewId.replace(/^interview\//, "")}`;
  // ✅ copy link to clipboard
  const onCopyLink = async () => {
    await navigator.clipboard.writeText(interviewUrl);
    toast("Link Copied!");
  };

  return (
    <div style={{
      display: "flex", flexDirection: "column",
      alignItems: "center", textAlign: "center",
      gap: "20px", padding: "12px",
      animation: "fadeIn 0.5s ease"
    }}>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .copy-btn {
          background: linear-gradient(135deg, #7c3aed, #a78bfa);
          border: none; border-radius: 10px;
          padding: 10px 18px; color: white;
          font-weight: 600; font-size: 13px;
          cursor: pointer; display: flex;
          align-items: center; gap: 6px;
          transition: all 0.2s ease;
          box-shadow: 0 4px 15px rgba(124,58,237,0.4);
          white-space: nowrap;
        }
        .copy-btn:hover { opacity: 0.9; transform: translateY(-1px); }
        .nav-btn {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(167,139,250,0.2);
          border-radius: 12px; padding: 11px 20px;
          color: rgba(255,255,255,0.7); font-weight: 600;
          font-size: 13px; cursor: pointer;
          display: flex; align-items: center; gap: 8px;
          transition: all 0.2s ease; text-decoration: none;
        }
        .nav-btn:hover {
          background: rgba(167,139,250,0.1);
          border-color: rgba(167,139,250,0.4);
          color: #a78bfa;
        }
        .nav-btn-primary {
          background: linear-gradient(135deg, #7c3aed, #a78bfa);
          border: none; border-radius: 12px;
          padding: 11px 20px; color: white;
          font-weight: 600; font-size: 13px;
          cursor: pointer; display: flex;
          align-items: center; gap: 8px;
          transition: all 0.2s ease;
          text-decoration: none;
          box-shadow: 0 4px 15px rgba(124,58,237,0.4);
        }
        .nav-btn-primary:hover { opacity: 0.9; transform: translateY(-1px); }
      `}</style>

      {/* ── Success Icon ── */}
      <div style={{
        width: "80px", height: "80px", borderRadius: "50%",
        background: "rgba(16,185,129,0.15)",
        border: "2px solid rgba(16,185,129,0.4)",
        display: "flex", alignItems: "center", justifyContent: "center"
      }}>
        <CheckCircle size={40} color="#10b981" />
      </div>

      {/* ── Title ── */}
      <div>
        <h2 style={{ color: "#fff", fontSize: "22px", fontWeight: "700", margin: "0 0 8px" }}>
          AI Interview is Ready! 🎉
        </h2>
        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "14px", margin: 0 }}>
          Share this link with the candidate to start the interview
        </p>
      </div>

      {/* ── Link Box ── */}
      <div style={{
        width: "100%", maxWidth: "520px",
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(167,139,250,0.25)",
        borderRadius: "20px", padding: "24px"
      }}>

        {/* Link Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
          <h3 style={{ color: "#fff", fontWeight: "600", fontSize: "15px", margin: 0 }}>
            Interview Link
          </h3>
          <span style={{
            background: "rgba(167,139,250,0.15)",
            border: "1px solid rgba(167,139,250,0.3)",
            color: "#a78bfa", padding: "4px 12px",
            borderRadius: "50px", fontSize: "11px", fontWeight: "600"
          }}>
            Valid for 30 days
          </span>
        </div>

        {/* URL Input + Copy Button */}
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <input
            value={interviewUrl}
            readOnly
            style={{
              flex: 1, padding: "10px 14px",
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(167,139,250,0.2)",
              borderRadius: "10px", color: "rgba(255,255,255,0.6)",
              fontSize: "13px", outline: "none",
              overflow: "hidden", textOverflow: "ellipsis"
            }}
          />
          <button className="copy-btn" onClick={onCopyLink}>
            <Copy size={14} />
            Copy
          </button>
        </div>

        {/* Divider */}
        <div style={{
          borderTop: "1px solid rgba(255,255,255,0.06)",
          margin: "20px 0"
        }} />

        {/* Interview Details */}
        <div style={{ display: "flex", gap: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <Clock size={14} color="#a78bfa" />
            <span style={{ color: "rgba(255,255,255,0.5)", fontSize: "13px" }}>
              {formData?.duration} Minutes
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <List size={14} color="#a78bfa" />
            <span style={{ color: "rgba(255,255,255,0.5)", fontSize: "13px" }}>
              {Array.isArray(formData?.type) ? formData.type.join(", ") : formData?.type}
            </span>
          </div>
        </div>

      </div>

      {/* ── Bottom Buttons ── */}
      <div style={{
        display: "flex", gap: "12px",
        width: "100%", maxWidth: "520px",
        justifyContent: "space-between", marginTop: "8px"
      }}>
        <Link href="/dashboard" className="nav-btn">
          <ArrowLeft size={16} />
          Back to Dashboard
        </Link>

        <Link href="/dashboard/create-interview" className="nav-btn-primary">
          <Plus size={16} />
          Create New Interview
        </Link>
      </div>

    </div>
  );
}

export default InterviewLink;