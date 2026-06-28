"use client";
import React, { useState, useEffect } from "react";
import { useUser } from "@/app/provider";
import { supabase } from "@/services/supabaseClient";
import {
  Video, Clock, Calendar, Copy, CheckCheck, Star
} from "lucide-react";
import moment from "moment";
import { useRouter } from "next/navigation";

function AllInterviews() {
  const { user } = useUser();
  const [interviews, setInterviews] = useState([]);
  const [feedbacks, setFeedbacks] = useState({});
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState(null);
  const router = useRouter();

  useEffect(() => {
    user && GetAllData();
  }, [user]);

  const GetAllData = async () => {
    setLoading(true);

    // ✅ fetch all interviews created by logged in user
    const { data: interviewData, error: interviewError } = await supabase
      .from("interviews")
      .select("*")
      .eq("userEmail", user?.email)
      .order("created_at", { ascending: false });

    if (interviewError) { console.error(interviewError); setLoading(false); return; }

    // ✅ get all interview IDs to fetch feedback
    const interviewIds = interviewData?.map((i) => i.interviewId) || [];

    // ✅ fetch feedback for ALL interviews regardless of who gave it
    const { data: feedbackData, error: feedbackError } = await supabase
      .from("interview-feedback")
      .select("*")
      .in("interview_id", interviewIds);

    if (feedbackError) { console.error(feedbackError); setLoading(false); return; }

    // ✅ map feedback by interview_id for easy lookup
    const feedbackMap = {};
    feedbackData?.forEach((f) => {
      feedbackMap[f.interview_id] = f;
    });

    setInterviews(interviewData || []);
    setFeedbacks(feedbackMap);
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
      padding: "32px", fontFamily: "sans-serif"
    }}>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        .interview-card:hover {
          transform: translateY(-4px) !important;
          border-color: rgba(167,139,250,0.5) !important;
          background: rgba(167,139,250,0.08) !important;
        }
      `}</style>

      {/* Header */}
      <div style={{ marginBottom: "28px", animation: "fadeIn 0.4s ease" }}>
        <h2 style={{ color: "#fff", fontWeight: "700", fontSize: "24px", margin: "0 0 6px" }}>
          All Interviews
        </h2>
        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "14px", margin: 0 }}>
          {interviews.length} interviews created
        </p>
      </div>

      {/* Empty State */}
      {interviews.length === 0 && (
        <div style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: "20px", padding: "60px",
          display: "flex", flexDirection: "column",
          alignItems: "center", gap: "12px",
          animation: "fadeIn 0.5s ease"
        }}>
          <Video size={48} color="rgba(167,139,250,0.4)" />
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "15px", margin: 0 }}>
            No interviews created yet
          </p>
        </div>
      )}

      {/* Grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
        gap: "20px", animation: "fadeIn 0.5s ease"
      }}>
        {interviews.map((interview, index) => {
          const feedback = feedbacks[interview?.interviewId];

          // ✅ 3 status types
          const isCompleted = !!feedback;
          const isIncomplete = !feedback && interview?.status === "incomplete";
          const isPending = !feedback && interview?.status === "pending";

          const rating = feedback?.feedback?.feedback?.rating;
          const avgRating = rating
            ? (((rating.technicalSkills || 0) + (rating.communication || 0) +
              (rating.problemSolving || 0) + (rating.experience || 0)) / 4).toFixed(1)
            : null;
          const recommendation = feedback?.feedback?.feedback?.Recommendation;

          return (
            <div
              key={index}
              className="interview-card"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(167,139,250,0.2)",
                borderRadius: "20px", padding: "24px",
                cursor: isCompleted ? "pointer" : "default",
                transition: "all 0.25s ease",
                display: "flex", flexDirection: "column", gap: "16px"
              }}
              onClick={() => isCompleted && router.push(`/interview/${interview?.interviewId}/completed`)}
            >

              {/* Top Row */}
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>

                {/* Icon */}
                <div style={{
                  width: "52px", height: "52px", borderRadius: "14px",
                  background: "linear-gradient(135deg, #7c3aed, #a78bfa)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0
                }}>
                  <Video size={24} color="white" />
                </div>

                {/* ✅ Status Badge — 3 types */}
                <span style={{
                  background: isCompleted
                    ? "rgba(16,185,129,0.15)"
                    : isIncomplete
                      ? "rgba(239,68,68,0.15)"
                      : "rgba(245,158,11,0.15)",
                  color: isCompleted
                    ? "#10b981"
                    : isIncomplete
                      ? "#ef4444"
                      : "#f59e0b",
                  border: `1px solid ${isCompleted
                    ? "rgba(16,185,129,0.3)"
                    : isIncomplete
                      ? "rgba(239,68,68,0.3)"
                      : "rgba(245,158,11,0.3)"}`,
                  padding: "4px 12px", borderRadius: "50px",
                  fontSize: "11px", fontWeight: "600"
                }}>
                  {isCompleted ? "✅ Completed" : isIncomplete ? "⚠️ Incomplete" : "⏳ Pending"}
                </span>
              </div>

              {/* Job Info */}
              <div>
                <h3 style={{ color: "#fff", fontWeight: "700", fontSize: "17px", margin: "0 0 8px" }}>
                  {interview?.jobPosition}
                </h3>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                  <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "12px", display: "flex", alignItems: "center", gap: "4px" }}>
                    <Calendar size={12} />
                    {moment(interview?.created_at).format("MMM DD, YYYY")}
                  </span>
                  <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "12px", display: "flex", alignItems: "center", gap: "4px" }}>
                    <Clock size={12} />
                    {interview?.duration} Min
                  </span>
                  <span style={{
                    background: "rgba(167,139,250,0.1)", color: "#a78bfa",
                    border: "1px solid rgba(167,139,250,0.2)",
                    padding: "2px 8px", borderRadius: "50px", fontSize: "11px"
                  }}>
                    {Array.isArray(interview?.type) ? interview.type.join(", ") : interview?.type}
                  </span>
                </div>
              </div>

              {/* Job Description */}
              <p style={{
                color: "rgba(255,255,255,0.3)", fontSize: "12px",
                lineHeight: "1.6", margin: 0,
                display: "-webkit-box", WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical", overflow: "hidden"
              }}>
                {interview?.jobDescription}
              </p>

              {/* Divider */}
              <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }} />

              {/* ✅ Bottom Row — different for each status */}
              {isCompleted ? (
                // ✅ Completed — show rating and recommendation
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <Star size={16} color="#f59e0b" fill="#f59e0b" />
                    <span style={{ color: "#f59e0b", fontWeight: "700", fontSize: "15px" }}>
                      {avgRating}
                    </span>
                    <span style={{ color: "rgba(255,255,255,0.3)", fontSize: "12px" }}>/10</span>
                  </div>
                  <span style={{
                    background: recommendation === "Yes" ? "rgba(16,185,129,0.15)" : "rgba(239,68,68,0.15)",
                    color: recommendation === "Yes" ? "#10b981" : "#ef4444",
                    border: `1px solid ${recommendation === "Yes" ? "rgba(16,185,129,0.3)" : "rgba(239,68,68,0.3)"}`,
                    padding: "4px 12px", borderRadius: "50px",
                    fontSize: "11px", fontWeight: "600"
                  }}>
                    {recommendation === "Yes" ? "✅ Hired" : "❌ Not yet"}
                  </span>
                </div>

              ) : isIncomplete ? (
                // ✅ Incomplete — show warning message
                <div style={{
                  display: "flex", alignItems: "center", gap: "8px",
                  background: "rgba(239,68,68,0.08)",
                  border: "1px solid rgba(239,68,68,0.2)",
                  borderRadius: "10px", padding: "10px 14px"
                }}>
                  <span style={{ color: "#ef4444", fontSize: "13px" }}>
                    ⚠️ Candidate left before completing the interview
                  </span>
                </div>

              ) : (
                // ✅ Pending — show copy link button
                <button
                  onClick={(e) => { e.stopPropagation(); copyLink(interview?.interviewId); }}
                  style={{
                    display: "flex", alignItems: "center",
                    justifyContent: "center", gap: "8px",
                    background: copiedId === interview?.interviewId
                      ? "rgba(16,185,129,0.15)" : "rgba(167,139,250,0.1)",
                    border: `1px solid ${copiedId === interview?.interviewId
                      ? "rgba(16,185,129,0.3)" : "rgba(167,139,250,0.3)"}`,
                    borderRadius: "10px", padding: "10px",
                    color: copiedId === interview?.interviewId ? "#10b981" : "#a78bfa",
                    fontSize: "13px", fontWeight: "600",
                    cursor: "pointer", transition: "all 0.2s ease", width: "100%"
                  }}
                >
                  {copiedId === interview?.interviewId
                    ? <><CheckCheck size={15} /> Copied!</>
                    : <><Copy size={15} /> Copy Interview Link</>
                  }
                </button>
              )}

            </div>
          );
        })}
      </div>
    </div>
  );
}

export default AllInterviews;