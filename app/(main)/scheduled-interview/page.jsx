"use client";
import React, { useState, useEffect } from "react";
import { useUser } from "@/app/provider";
import { supabase } from "@/services/supabaseClient";
import { Video, Clock, Calendar, Copy, CheckCheck } from "lucide-react";
import moment from "moment";

function ScheduledInterviews() {
  const { user } = useUser();
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    user && GetInterviews();
  }, [user]);

  const GetInterviews = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("interviews")
      .select("*")
      .eq("userEmail", user?.email)
      .order("created_at", { ascending: false });

    if (error) { console.error(error); setLoading(false); return; }
    setInterviews(data);
    setLoading(false);
  };

  const copyLink = (interviewId) => {
    const link = `${window.location.origin}/interview/${interviewId}`;
    navigator.clipboard.writeText(link);
    setCopiedId(interviewId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (loading) {
    return (
      <div style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0f0c29, #302b63, #24243e)",
        display: "flex", alignItems: "center", justifyContent: "center"
      }}>
        <div style={{
          width: "50px", height: "50px", borderRadius: "50%",
          border: "3px solid rgba(255,255,255,0.1)",
          borderTop: "3px solid #a78bfa",
          animation: "spin 1s linear infinite"
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0f0c29, #302b63, #24243e)",
      padding: "32px",
      fontFamily: "sans-serif"
    }}>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      {/* Header */}
      <h2 style={{
        color: "#fff", fontWeight: "700",
        fontSize: "24px", marginBottom: "8px"
      }}>
        Scheduled Interviews
      </h2>
      <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "14px", marginBottom: "24px" }}>
        All interviews you have created
      </p>

      {/* Empty State */}
      {interviews.length === 0 && (
        <div style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: "20px", padding: "60px",
          display: "flex", flexDirection: "column",
          alignItems: "center", gap: "12px"
        }}>
          <Video size={48} color="rgba(167,139,250,0.4)" />
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "15px", margin: 0 }}>
            No interviews created yet
          </p>
        </div>
      )}

      {/* Interview Cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: "16px", animation: "fadeIn 0.5s ease" }}>
        {interviews.map((interview, index) => (
          <div key={index} style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(167,139,250,0.2)",
            borderRadius: "20px", padding: "24px",
          }}>

            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: "16px" }}>

              {/* Left */}
              <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                <div style={{
                  width: "52px", height: "52px", borderRadius: "14px",
                  background: "linear-gradient(135deg, #7c3aed, #a78bfa)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0
                }}>
                  <Video size={24} color="white" />
                </div>

                <div>
                  <h3 style={{ color: "#fff", fontWeight: "600", fontSize: "16px", margin: "0 0 6px" }}>
                    {interview?.jobPosition}
                  </h3>

                  <div style={{ display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
                    <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "12px", display: "flex", alignItems: "center", gap: "4px" }}>
                      <Calendar size={12} />
                      {moment(interview?.created_at).format('MMM DD, YYYY')}
                    </span>
                    <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "12px", display: "flex", alignItems: "center", gap: "4px" }}>
                      <Clock size={12} />
                      {interview?.duration} Minutes
                    </span>
                    <span style={{
                      background: "rgba(167,139,250,0.15)",
                      color: "#a78bfa",
                      border: "1px solid rgba(167,139,250,0.3)",
                      padding: "3px 10px", borderRadius: "50px", fontSize: "11px"
                    }}>
                      {Array.isArray(interview?.type) ? interview.type.join(", ") : interview?.type}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right — Copy Link Button */}
              <button
                onClick={() => copyLink(interview?.interviewId)}
                style={{
                  display: "flex", alignItems: "center", gap: "8px",
                  background: copiedId === interview?.interviewId
                    ? "rgba(16,185,129,0.15)" : "rgba(167,139,250,0.1)",
                  border: `1px solid ${copiedId === interview?.interviewId
                    ? "rgba(16,185,129,0.3)" : "rgba(167,139,250,0.3)"}`,
                  borderRadius: "12px", padding: "10px 18px",
                  color: copiedId === interview?.interviewId ? "#10b981" : "#a78bfa",
                  fontSize: "13px", fontWeight: "600", cursor: "pointer",
                  transition: "all 0.2s ease"
                }}
              >
                {copiedId === interview?.interviewId
                  ? <><CheckCheck size={16} /> Copied!</>
                  : <><Copy size={16} /> Copy Link</>
                }
              </button>

            </div>

            {/* Job Description */}
            {interview?.jobDescription && (
              <p style={{
                color: "rgba(255,255,255,0.35)", fontSize: "13px",
                margin: "16px 0 0", lineHeight: "1.6",
                borderTop: "1px solid rgba(255,255,255,0.06)",
                paddingTop: "14px",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden"
              }}>
                {interview?.jobDescription}
              </p>
            )}

          </div>
        ))}
      </div>
    </div>
  );
}

export default ScheduledInterviews;