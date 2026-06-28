import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { Video, Calendar, Clock } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/services/supabaseClient'

function InterviewCard({ interview }) {
  const router = useRouter()
  const feedback = interview?.feedback?.feedback
  const [jobPosition, setJobPosition] = useState("")

  // ✅ fetch job position from interviews table
  useEffect(() => {
    if (interview?.interview_id) {
      GetJobPosition();
    }
  }, [interview]);

  const GetJobPosition = async () => {
    const { data, error } = await supabase
      .from("interviews")
      .select("jobPosition")
      .eq("interviewId", interview?.interview_id);

    if (data && data.length > 0) {
      setJobPosition(data[0]?.jobPosition);
    }
  };

  return (
    <div
      onClick={() => router.push(`/interview/${interview?.interview_id}/completed`)}
      style={{
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(167,139,250,0.2)",
        borderRadius: "16px",
        padding: "20px",
        cursor: "pointer",
        transition: "all 0.2s ease",
        marginBottom: "12px"
      }}
      onMouseEnter={e => {
        e.currentTarget.style.background = "rgba(167,139,250,0.08)"
        e.currentTarget.style.borderColor = "rgba(167,139,250,0.4)"
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = "rgba(255,255,255,0.04)"
        e.currentTarget.style.borderColor = "rgba(167,139,250,0.2)"
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>

        {/* Left side */}
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>

          {/* Avatar */}
          <div style={{
            width: "48px", height: "48px", borderRadius: "12px",
            background: "linear-gradient(135deg, #7c3aed, #a78bfa)",
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0
          }}>
            <Video size={22} color="white" />
          </div>

          {/* Info */}
          <div>
            <h3 style={{ color: "#fff", fontWeight: "600", fontSize: "15px", margin: "0 0 2px" }}>
              {interview?.userName || "Candidate"}
            </h3>

            {/* ✅ Job Position */}
            <p style={{ color: "#a78bfa", fontSize: "12px", margin: "0 0 4px", fontWeight: "500" }}>
              {jobPosition || "Loading..."}
            </p>

            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "12px", display: "flex", alignItems: "center", gap: "4px" }}>
                <Calendar size={12} />
                {moment(interview?.created_at).format('MMM DD, YYYY')}
              </span>
              <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "12px", display: "flex", alignItems: "center", gap: "4px" }}>
                <Clock size={12} />
                {moment(interview?.created_at).format('hh:mm A')}
              </span>
            </div>
          </div>
        </div>

        {/* Right side — ratings */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div style={{ display: "flex", gap: "8px" }}>
            {[
              { label: "Tech", value: feedback?.rating?.technicalSkills, color: "#a78bfa" },
              { label: "Comm", value: feedback?.rating?.communication, color: "#10b981" },
              { label: "PS", value: feedback?.rating?.problemSolving, color: "#f59e0b" },
              { label: "Exp", value: feedback?.rating?.experience, color: "#ef4444" },
            ].map((item, i) => (
              <div key={i} style={{ textAlign: "center" }}>
                <div style={{
                  background: "rgba(255,255,255,0.05)",
                  border: `1px solid ${item.color}33`,
                  borderRadius: "8px", padding: "6px 10px"
                }}>
                  <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "10px", margin: "0 0 2px" }}>
                    {item.label}
                  </p>
                  <span style={{ color: item.color, fontSize: "14px", fontWeight: "700" }}>
                    {item.value ?? "-"}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Recommendation badge */}
          <span style={{
            background: feedback?.Recommendation === "Yes"
              ? "rgba(16,185,129,0.15)" : "rgba(239,68,68,0.15)",
            color: feedback?.Recommendation === "Yes" ? "#10b981" : "#ef4444",
            border: `1px solid ${feedback?.Recommendation === "Yes"
              ? "rgba(16,185,129,0.3)" : "rgba(239,68,68,0.3)"}`,
            padding: "6px 12px", borderRadius: "50px",
            fontSize: "12px", fontWeight: "600", whiteSpace: "nowrap"
          }}>
            {feedback?.Recommendation === "Yes" ? "✅ Hired" : "❌ Not yet"}
          </span>
        </div>
      </div>

      {/* Summary */}
      {feedback?.summery && (
        <p style={{
          color: "rgba(255,255,255,0.4)", fontSize: "13px",
          margin: "12px 0 0", lineHeight: "1.5",
          borderTop: "1px solid rgba(255,255,255,0.06)",
          paddingTop: "12px"
        }}>
          {feedback?.summery}
        </p>
      )}
    </div>
  )
}

export default InterviewCard