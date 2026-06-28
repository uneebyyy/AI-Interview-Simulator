"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/services/supabaseClient";
import { CheckCircle, Star, ArrowRight } from "lucide-react";

function InterviewCompleted() {
  const { interview_id } = useParams();
  const router = useRouter();
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (interview_id) GetFeedback();
  }, [interview_id]);

  const GetFeedback = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("interview-feedback")
      .select("*")
      .eq("interview_id", interview_id);

    if (error) { console.error(error); setLoading(false); return; }
    if (data && data.length > 0) {
      console.log("Feedback data:", data[0]); // 👈 so you can see structure
      setFeedback(data[0]);
      if (data && data.length > 0) {
  console.log("FULL FEEDBACK:", JSON.stringify(data[0])); // 👈 add this
  setFeedback(data[0]);
}
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0f0c29, #302b63, #24243e)",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", gap: "16px"
      }}>
        <div style={{
          width: "60px", height: "60px", borderRadius: "50%",
          border: "3px solid rgba(255,255,255,0.1)",
          borderTop: "3px solid #a78bfa",
          animation: "spin 1s linear infinite"
        }} />
        <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "16px" }}>
          Loading your feedback...
        </p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  // ✅ correct field names from your FEEDBACK_PROMPT
const rating = feedback?.feedback?.feedback?.rating; // ✅ one extra .feedback
const summery = feedback?.feedback?.feedback?.summery;
const recommendation = feedback?.feedback?.feedback?.Recommendation;
const recommendationMsg = feedback?.feedback?.feedback?.RecommendationMsg;

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0f0c29, #302b63, #24243e)",
      padding: "40px 20px",
      fontFamily: "sans-serif"
    }}>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      <div style={{ maxWidth: "700px", margin: "0 auto", animation: "fadeIn 0.6s ease" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div style={{
            width: "80px", height: "80px", borderRadius: "50%",
            background: "rgba(16,185,129,0.15)",
            border: "2px solid rgba(16,185,129,0.4)",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 16px"
          }}>
            <CheckCircle size={40} color="#10b981" />
          </div>
          <h1 style={{ color: "#fff", fontSize: "28px", fontWeight: "700", margin: "0 0 8px" }}>
            Interview Completed!
          </h1>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "15px", margin: 0 }}>
            Here's your performance feedback
          </p>
        </div>

        {feedback ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

            {/* Ratings Grid */}
            <div style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(167,139,250,0.3)",
              borderRadius: "20px", padding: "24px"
            }}>
              <h3 style={{ color: "#a78bfa", fontSize: "16px", fontWeight: "600", margin: "0 0 20px" }}>
                ⭐ Ratings
              </h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>

                {/* Technical Skills */}
                <div style={{
                  background: "rgba(255,255,255,0.04)",
                  borderRadius: "14px", padding: "16px", textAlign: "center",
                  border: "1px solid rgba(255,255,255,0.08)"
                }}>
                  <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "12px", margin: "0 0 8px" }}>
                    Technical Skills
                  </p>
                  <span style={{ color: "#a78bfa", fontSize: "32px", fontWeight: "700" }}>
                 {rating?.technicalSkills ?? "N/A"}
                  </span>
                  <span style={{ color: "rgba(255,255,255,0.3)", fontSize: "16px" }}>/10</span>
                </div>

                {/* Communication */}
                <div style={{
                  background: "rgba(255,255,255,0.04)",
                  borderRadius: "14px", padding: "16px", textAlign: "center",
                  border: "1px solid rgba(255,255,255,0.08)"
                }}>
                  <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "12px", margin: "0 0 8px" }}>
                    Communication
                  </p>
                  <span style={{ color: "#10b981", fontSize: "32px", fontWeight: "700" }}>
                    {rating?.communication ?? "N/A"}
                  </span>
                  <span style={{ color: "rgba(255,255,255,0.3)", fontSize: "16px" }}>/10</span>
                </div>

                {/* Problem Solving */}
                <div style={{
                  background: "rgba(255,255,255,0.04)",
                  borderRadius: "14px", padding: "16px", textAlign: "center",
                  border: "1px solid rgba(255,255,255,0.08)"
                }}>
                  <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "12px", margin: "0 0 8px" }}>
                    Problem Solving
                  </p>
                  <span style={{ color: "#f59e0b", fontSize: "32px", fontWeight: "700" }}>
                    {rating?.problemSolving ?? "N/A"}
                  </span>
                  <span style={{ color: "rgba(255,255,255,0.3)", fontSize: "16px" }}>/10</span>
                </div>

                {/* Experience */}
                <div style={{
                  background: "rgba(255,255,255,0.04)",
                  borderRadius: "14px", padding: "16px", textAlign: "center",
                  border: "1px solid rgba(255,255,255,0.08)"
                }}>
                  <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "12px", margin: "0 0 8px" }}>
                    Experience
                  </p>
                  <span style={{ color: "#ef4444", fontSize: "32px", fontWeight: "700" }}>
                  {rating?.experience ?? "N/A"}
                  </span>
                  <span style={{ color: "rgba(255,255,255,0.3)", fontSize: "16px" }}>/10</span>
                </div>

              </div>
            </div>

            {/* Summary */}
            {summery && (
              <div style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "20px", padding: "24px"
              }}>
                <h3 style={{ color: "#a78bfa", fontSize: "16px", fontWeight: "600", margin: "0 0 12px" }}>
                  📋 Summary
                </h3>
                <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "14px", lineHeight: "1.7", margin: 0 }}>
                  {summery}
                </p>
              </div>
            )}

            {/* Recommendation */}
            <div style={{
              background: "rgba(167,139,250,0.08)",
              border: "1px solid rgba(167,139,250,0.2)",
              borderRadius: "20px", padding: "24px"
            }}>
              <h3 style={{ color: "#a78bfa", fontSize: "16px", fontWeight: "600", margin: "0 0 12px" }}>
                🎯 Recommendation
              </h3>
              <div style={{
                display: "flex", alignItems: "center",
                justifyContent: "space-between", marginBottom: "12px"
              }}>
                <span style={{ color: "rgba(255,255,255,0.6)", fontSize: "14px" }}>
                  Recommended for hire?
                </span>
                <span style={{
                  background: recommendation === "Yes" ? "rgba(16,185,129,0.15)" : "rgba(239,68,68,0.15)",
                  color: recommendation === "Yes" ? "#10b981" : "#ef4444",
                  border: `1px solid ${recommendation === "Yes" ? "rgba(16,185,129,0.3)" : "rgba(239,68,68,0.3)"}`,
                  padding: "6px 16px", borderRadius: "50px",
                  fontSize: "13px", fontWeight: "600"
                }}>
                  {recommendation === "Yes" ? "✅ Yes" : "❌ Not yet"}
                </span>
              </div>
              {recommendationMsg && (
                <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "14px", lineHeight: "1.6", margin: 0 }}>
                  {recommendationMsg}
                </p>
              )}
            </div>

          </div>
        ) : (
          <div style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "20px", padding: "40px", textAlign: "center"
          }}>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "15px" }}>
              No feedback found for this interview.
            </p>
          </div>
        )}

        {/* Dashboard Button */}
        <button
          onClick={() => router.push("/dashboard")}
          style={{
            marginTop: "24px", width: "100%",
            background: "linear-gradient(135deg, #7c3aed, #a78bfa)",
            border: "none", borderRadius: "14px",
            padding: "16px", color: "#fff",
            fontWeight: "600", fontSize: "15px",
            cursor: "pointer", display: "flex",
            alignItems: "center", justifyContent: "center", gap: "8px",
            boxShadow: "0 4px 15px rgba(124,58,237,0.4)"
          }}
        >
          Go to Dashboard
          <ArrowRight size={18} />
        </button>

      </div>
    </div>
  );
}

export default InterviewCompleted;