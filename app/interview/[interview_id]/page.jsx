"use client";
import React, { useContext, useEffect, useState } from "react";
import Image from "next/image";
import { Clock, Video, Info, Loader2Icon } from "lucide-react";
import { useParams } from "next/navigation";
import { supabase } from "@/services/supabaseClient";
import { useRouter } from "next/navigation";
import { InterviewDataContext } from "@/context/InterviewDataContext";

function Interview() {
  const { interview_id } = useParams();
  const [interviewData, setInterviewData] = useState();
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState();
  const [userEmail, setUserEmail] = useState();
  const { interviewInfo, setInterviewInfo } = useContext(InterviewDataContext);
  const router = useRouter();

  useEffect(() => {
    interview_id && GetInterviewDetail();
  }, [interview_id]);

  const GetInterviewDetail = async () => {
    setLoading(true);

    let { data: Interviews, error } = await supabase
      .from("interviews")
      .select("jobPosition,jobDescription,duration,type")
      .eq("interviewId", interview_id);

    if (error) {
      console.error(error);
      setLoading(false);
      return;
    }

    setInterviewData(Interviews[0]);
    setLoading(false);
  };

  const onJoinInterview = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("interviews")
        .select("*")
        .eq("interviewId", interview_id);

      if (error) {
        console.error("Supabase Error:", error);
        setLoading(false);
        return;
      }

      if (!data || data.length === 0) {
        console.log("No interview found");
        setLoading(false);
        return;
      }

      console.log("Interview Data:", data[0]);
      setInterviewInfo({
        userName: userName,
        userEmail: userEmail,
        interviewData: data[0],
      });

      router.push(`/interview/${interview_id}/start`);
      setLoading(false);
    } catch (err) {
      console.error("Unexpected Error:", err);
      setLoading(false);
    }
  };

  if (loading && !interviewData) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          gap: "14px",
          background: "linear-gradient(135deg, #0f0a1e, #1a1029)",
        }}
      >
        <Loader2Icon
          className="animate-spin"
          color="#a78bfa"
          size={40}
        />
        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "14px" }}>
          Loading interview details...
        </p>
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        padding: "40px 16px",
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0f0a1e, #1a1029)",
      }}
    >
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .interview-card {
          animation: fadeIn 0.5s ease;
        }
        .interview-input {
          width: 100%;
          max-width: 320px;
          padding: 10px 14px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(167,139,250,0.2);
          border-radius: 10px;
          color: #fff;
          font-size: 14px;
          outline: none;
          text-align: center;
          transition: all 0.2s ease;
        }
        .interview-input::placeholder {
          color: rgba(255,255,255,0.3);
        }
        .interview-input:focus {
          border-color: rgba(167,139,250,0.6);
          background: rgba(255,255,255,0.07);
        }
        .join-btn {
          width: 100%;
          max-width: 520px;
          background: linear-gradient(135deg, #7c3aed, #a78bfa);
          border: none;
          border-radius: 12px;
          padding: 14px 20px;
          color: white;
          font-weight: 700;
          font-size: 15px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: all 0.2s ease;
          box-shadow: 0 4px 15px rgba(124,58,237,0.4);
        }
        .join-btn:hover:not(:disabled) {
          opacity: 0.9;
          transform: translateY(-1px);
        }
        .join-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
        }
      `}</style>

      <div
        className="interview-card"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          gap: "20px",
          width: "100%",
          maxWidth: "560px",
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(167,139,250,0.25)",
          borderRadius: "20px",
          padding: "32px 24px",
        }}
      >
        {/* Logo */}
        <Image
          src="/logo.png"
          alt="logo"
          width={70}
          height={45}
          className="object-contain"
        />

        {/* Heading */}
        <div>
          <h2 style={{ color: "#fff", fontSize: "24px", fontWeight: "700", margin: "0 0 8px" }}>
            AI-Powered Interview Platform
          </h2>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "14px", margin: 0 }}>
            Start your smart interview experience
          </p>
        </div>

        {/* Interview Image */}
        <Image
          src="/interview.png"
          alt="interview"
          width={180}
          height={180}
          className="object-contain"
        />

        {/* Role */}
        <h2 style={{ color: "#fff", fontWeight: "700", fontSize: "18px", margin: 0 }}>
          {interviewData?.jobPosition}
        </h2>

        {/* Duration */}
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <Clock size={16} color="#a78bfa" />
          <span style={{ color: "rgba(255,255,255,0.5)", fontSize: "13px" }}>
            {interviewData?.duration} Minutes
          </span>
        </div>

        {/* Name Input */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%", gap: "8px" }}>
          <h2 style={{ color: "#fff", fontWeight: "600", fontSize: "15px", margin: 0 }}>
            Enter Your Full Name
          </h2>
          <input
            className="interview-input"
            placeholder="e.g. BATMAN"
            onChange={(event) => setUserName(event.target.value)}
          />
        </div>

        {/* Email Input */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%", gap: "8px" }}>
          <h2 style={{ color: "#fff", fontWeight: "600", fontSize: "15px", margin: 0 }}>
            Enter Your Email
          </h2>
          <input
            className="interview-input"
            placeholder="e.g. bat@gmail.com"
            onChange={(event) => setUserEmail(event.target.value)}
          />
        </div>

        {/* Info Card */}
        <div
          style={{
            width: "100%",
            background: "rgba(167,139,250,0.08)",
            border: "1px solid rgba(167,139,250,0.25)",
            borderRadius: "16px",
            padding: "18px",
            textAlign: "left",
          }}
        >
          <div style={{ display: "flex", gap: "12px" }}>
            <Info color="#a78bfa" size={20} style={{ marginTop: "2px", flexShrink: 0 }} />
            <div>
              <h2 style={{ color: "#fff", fontWeight: "700", fontSize: "15px", margin: "0 0 8px" }}>
                Before you begin
              </h2>
              <ul style={{ color: "rgba(255,255,255,0.5)", fontSize: "13px", margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: "4px" }}>
                <li>- Test your camera and microphone</li>
                <li>- Ensure you have a stable internet connection</li>
                <li>- Find a quiet place for interview</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Join Button */}
        <button
          className="join-btn"
          disabled={loading || !userName || !userEmail}
          onClick={() => onJoinInterview()}
        >
          {loading && <Loader2Icon className="animate-spin" size={18} />}
          <Video size={18} />
          Join Interview
        </button>
      </div>
    </div>
  );
}

export default Interview;