"use client";

import { useUser } from "@/app/provider";
import axios from "axios";
import { Loader2Icon, CheckCircle, EyeOff } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import { supabase } from "@/services/supabaseClient";

function QuestionList({ formData, onCreateLink }) {
  const [loading, setLoading] = useState(false);
  const [questionList, setQuestionList] = useState([]);
  const { user } = useUser();
  const [saveLoading, setSaveLoading] = useState(false);

  // ✅ auto generate questions when formData arrives
  useEffect(() => {
    if (formData && Object.keys(formData).length > 0) {
      GenerateQuestionList();
    }
  }, [formData]);

  const GenerateQuestionList = async () => {
    try {
      setLoading(true);

      // ✅ decide question count based on duration
      let questionCount = 5;
      if (formData?.duration == 15) questionCount = 10;
      if (formData?.duration == 30) questionCount = 15;

      const result = await axios.post("/api/ai-model", {
        ...formData,
        questionCount,
      });

      let data = result?.data?.content || result?.data;
      let parsed;

      if (typeof data === "string") {
        const cleaned = data.replace(/```json/g, "").replace(/```/g, "").trim();
        try {
          parsed = JSON.parse(cleaned);
        } catch {
          toast.error("AI returned invalid format");
          setQuestionList([]);
          return;
        }
      } else {
        parsed = data;
      }

      const questions = parsed?.interviewQuestions || parsed?.questions || [];
      setQuestionList(Array.isArray(questions) ? questions : []);

    } catch (error) {
      console.error("API ERROR:", error);
      toast.error("Server error. Please try again.");
      setQuestionList([]);
    } finally {
      setLoading(false);
    }
  };

  // ✅ save interview to supabase and go to next step
  const onFinish = async () => {
    setSaveLoading(true);
    const interviewId = uuidv4();

    const { data, error } = await supabase
      .from("interviews")
      .insert([{
        ...formData,
        questionList,
        userEmail: user?.email,
        interviewId: interviewId,
      }])
      .select();

    setSaveLoading(false);

    if (error) {
      console.error(error);
      toast.error("Failed to save interview");
      return;
    }

    onCreateLink(interviewId);
  };

  return (
    <div style={{
      background: "rgba(255,255,255,0.05)",
      border: "1px solid rgba(167,139,250,0.2)",
      borderRadius: "20px",
      padding: "28px",
    }}>
      <style>{`
        .finish-btn {
          background: linear-gradient(135deg, #7c3aed, #a78bfa);
          border: none;
          border-radius: 12px;
          padding: 12px 24px;
          color: white;
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: all 0.2s ease;
          box-shadow: 0 4px 15px rgba(124,58,237,0.4);
        }
        .finish-btn:hover {
          opacity: 0.9;
          transform: translateY(-2px);
        }
        .finish-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      {/* ── LOADING STATE ── */}
      {loading && (
        <div style={{
          display: "flex", flexDirection: "column",
          alignItems: "center", gap: "16px",
          padding: "40px 0", animation: "fadeIn 0.4s ease"
        }}>
          <div style={{
            width: "60px", height: "60px", borderRadius: "50%",
            border: "3px solid rgba(167,139,250,0.2)",
            borderTop: "3px solid #a78bfa",
            animation: "spin 1s linear infinite"
          }} />
          <h2 style={{ color: "#a78bfa", fontWeight: "600", fontSize: "16px", margin: 0 }}>
            Generating Interview Questions...
          </h2>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "13px", margin: 0 }}>
            AI is preparing personalized questions for you
          </p>
        </div>
      )}

      {/* ── QUESTIONS READY — hidden from user ── */}
      {!loading && questionList.length > 0 && (
        <div style={{ animation: "fadeIn 0.5s ease" }}>

          {/* Success Header */}
          <div style={{
            display: "flex", flexDirection: "column",
            alignItems: "center", gap: "12px",
            padding: "32px 0", textAlign: "center"
          }}>
            <div style={{
              width: "70px", height: "70px", borderRadius: "50%",
              background: "rgba(16,185,129,0.15)",
              border: "2px solid rgba(16,185,129,0.4)",
              display: "flex", alignItems: "center", justifyContent: "center"
            }}>
              <CheckCircle size={36} color="#10b981" />
            </div>

            <h2 style={{ color: "#fff", fontSize: "22px", fontWeight: "700", margin: 0 }}>
              Questions Ready!
            </h2>

            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "14px", margin: 0 }}>
              {questionList.length} questions generated for a {formData?.duration} min interview
            </p>

            {/* Hidden notice */}
            <div style={{
              display: "flex", alignItems: "center", gap: "8px",
              background: "rgba(167,139,250,0.1)",
              border: "1px solid rgba(167,139,250,0.2)",
              borderRadius: "50px", padding: "8px 16px",
              marginTop: "4px"
            }}>
              <EyeOff size={14} color="#a78bfa" />
              <span style={{ color: "#a78bfa", fontSize: "12px", fontWeight: "500" }}>
                Questions are hidden to keep your interview fair
              </span>
            </div>
          </div>

          {/* Question count breakdown */}
          <div style={{
            display: "grid", gridTemplateColumns: "repeat(3, 1fr)",
            gap: "12px", marginBottom: "24px"
          }}>
            {[
              { label: "Total Questions", value: questionList.length, color: "#a78bfa" },
              { label: "Duration", value: `${formData?.duration} Min`, color: "#10b981" },
              { label: "Type", value: Array.isArray(formData?.type) ? formData.type.length + " types" : formData?.type, color: "#f59e0b" },
            ].map((item, i) => (
              <div key={i} style={{
                background: "rgba(255,255,255,0.04)",
                border: `1px solid ${item.color}33`,
                borderRadius: "14px", padding: "16px", textAlign: "center"
              }}>
                <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "11px", margin: "0 0 6px" }}>
                  {item.label}
                </p>
                <span style={{ color: item.color, fontSize: "18px", fontWeight: "700" }}>
                  {item.value}
                </span>
              </div>
            ))}
          </div>

          {/* Finish Button */}
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button
              className="finish-btn"
              onClick={() => onFinish()}
              disabled={saveLoading}
            >
              {saveLoading && (
                <div style={{
                  width: "16px", height: "16px", borderRadius: "50%",
                  border: "2px solid rgba(255,255,255,0.3)",
                  borderTop: "2px solid white",
                  animation: "spin 1s linear infinite"
                }} />
              )}
              Create Interview Link & Finish
            </button>
          </div>
        </div>
      )}

      {/* ── EMPTY STATE ── */}
      {!loading && questionList.length === 0 && (
        <div style={{
          display: "flex", flexDirection: "column",
          alignItems: "center", gap: "12px",
          padding: "40px 0", textAlign: "center"
        }}>
          <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "14px", margin: 0 }}>
            No questions generated yet.
          </p>
        </div>
      )}

    </div>
  );
}

export default QuestionList;