"use client";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import FormContainer from "./_components/FormContainer";
import QuestionList from "./_components/QuestionList";
import { toast } from "sonner";
import InterviewLink from "./_components/InterviewLink";

function CreateInterview() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({});
  const [interviewId, setInterviewId] = useState();

  const onHandleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const onGoToNext = () => {
    if (!formData?.jobPosition || !formData?.jobDescription || !formData?.duration || !formData.type) {
      toast("Please enter all details");
      return;
    }
    setStep(step + 1);
  };

  const onCreateLink = (interviewId) => {
    setInterviewId(interviewId);
    setStep(step + 1);
  };

  const steps = ["Job Details", "Questions", "Share Link"];

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
      `}</style>

      {/* Header */}
      <div style={{
        display: "flex", alignItems: "center", gap: "16px",
        marginBottom: "32px", animation: "fadeIn 0.4s ease"
      }}>
        <button
          onClick={() => router.back()}
          style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "10px", padding: "10px",
            cursor: "pointer", display: "flex",
            alignItems: "center", justifyContent: "center",
            transition: "all 0.2s ease"
          }}
          onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}
          onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}
        >
          <ArrowLeft size={20} color="white" />
        </button>

        <div>
          <h2 style={{ color: "#fff", fontWeight: "700", fontSize: "22px", margin: 0 }}>
            Create New Interview
          </h2>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "13px", margin: "4px 0 0" }}>
            Step {step} of 3 — {steps[step - 1]}
          </p>
        </div>
      </div>

      {/* Progress Steps */}
      <div style={{
        display: "flex", alignItems: "center",
        marginBottom: "32px", animation: "fadeIn 0.5s ease"
      }}>
        {steps.map((s, i) => (
          <React.Fragment key={i}>
            {/* Step Circle */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
              <div style={{
                width: "36px", height: "36px", borderRadius: "50%",
                background: step > i
                  ? "linear-gradient(135deg, #7c3aed, #a78bfa)"
                  : step === i + 1
                    ? "rgba(167,139,250,0.2)"
                    : "rgba(255,255,255,0.05)",
                border: step === i + 1
                  ? "2px solid #a78bfa"
                  : step > i
                    ? "none"
                    : "2px solid rgba(255,255,255,0.1)",
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "all 0.3s ease"
              }}>
                {step > i + 1 ? (
                  <span style={{ color: "#fff", fontSize: "14px", fontWeight: "700" }}>✓</span>
                ) : (
                  <span style={{
                    color: step === i + 1 ? "#a78bfa" : "rgba(255,255,255,0.3)",
                    fontSize: "13px", fontWeight: "700"
                  }}>
                    {i + 1}
                  </span>
                )}
              </div>
              <span style={{
                color: step === i + 1 ? "#a78bfa" : "rgba(255,255,255,0.3)",
                fontSize: "11px", fontWeight: step === i + 1 ? "600" : "400",
                whiteSpace: "nowrap"
              }}>
                {s}
              </span>
            </div>

            {/* Line between steps */}
            {i < steps.length - 1 && (
              <div style={{
                flex: 1, height: "2px", margin: "0 8px 18px",
                background: step > i + 1
                  ? "linear-gradient(90deg, #7c3aed, #a78bfa)"
                  : "rgba(255,255,255,0.08)",
                transition: "all 0.3s ease"
              }} />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Content */}
      <div style={{
        maxWidth: "700px", margin: "0 auto",
        animation: "fadeIn 0.5s ease"
      }}>
        {step === 1 ? (
          <FormContainer
            onHandleInputChange={onHandleInputChange}
            GoToNext={() => onGoToNext()}
          />
        ) : step === 2 ? (
          <QuestionList
            formData={formData}
            onCreateLink={(interviewId) => onCreateLink(interviewId)}
          />
        ) : step === 3 ? (
          <InterviewLink
            interviewId={interviewId}
            formData={formData}
          />
        ) : null}
      </div>

    </div>
  );
}

export default CreateInterview;