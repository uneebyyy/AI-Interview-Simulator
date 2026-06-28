// "use client";
// import { InterviewDataContext } from "@/context/InterviewDataContext";
// import React, { useContext, useEffect, useState, useRef } from "react";
// import { Mic, Phone, Timer } from "lucide-react";
// import { Mic, MicOff, Phone, Timer } from "lucide-react";
// import Image from "next/image";
// import { useUser } from "@/app/provider";
// import Vapi from "@vapi-ai/web";
// import AlertConfirmation from "./_components/AlertConfirmation";
// import { useParams, useRouter } from "next/navigation";
// import { supabase } from "@/services/supabaseClient";
// import { Loader2Icon } from "lucide-react";
// import axios from "axios";

"use client";
import { InterviewDataContext } from "@/context/InterviewDataContext";
import React, { useContext, useEffect, useState, useRef } from "react";
import { Mic, MicOff, Phone, Timer } from "lucide-react"; // ✅ added MicOff
import Image from "next/image";
import { useUser } from "@/app/provider";
import Vapi from "@vapi-ai/web";
import AlertConfirmation from "./_components/AlertConfirmation";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/services/supabaseClient";
import { Loader2Icon } from "lucide-react";
import axios from "axios";

function StartInterview() {
  const { interviewInfo, setInterviewInfo } = useContext(InterviewDataContext);
  const { user } = useUser();
  const { interview_id } = useParams();
  const [loading, setLoading] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [vapiStatus, setVapiStatus] = useState("idle");
  const [conversation, setConversation] = useState();
  const [timer, setTimer] = useState(0);
  const [isMuted, setIsMuted] = useState(false); // ✅ mute state
  const timerRef = useRef(null); // ✅ defined ONCE here at top
  const callStartedRef = useRef(false);
  const router = useRouter();
  const [vapi] = useState(
    () => new Vapi(process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY)
  );

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600).toString().padStart(2, "0");
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

  useEffect(() => {
    vapi.on("call-start", () => {
      setVapiStatus("active");
      // ✅ start timer when call starts
      timerRef.current = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    });

    vapi.on("call-end", () => {
      setVapiStatus("ended");
      callStartedRef.current = false;
      clearInterval(timerRef.current); // ✅ FIXED — no useRef inside here
      GenerateFeedback(); // ✅ auto generate feedback when AI ends call
    });

    vapi.on("speech-start", () => setIsSpeaking(true));
    vapi.on("speech-end", () => setIsSpeaking(false));

    vapi.on("error", (error) => {
      console.error("Vapi error:", error);
      setVapiStatus("error");
    });

    vapi.on("message", (message) => {
      if (message?.conversation) {
        console.log("CONVERSATION LENGTH:", message.conversation?.length);
        console.log("CONVERSATION:", JSON.stringify(message.conversation));
        setConversation(message.conversation);
      }
    });

    return () => {
      vapi.stop();
      vapi.removeAllListeners();
      clearInterval(timerRef.current);
    };
  }, [vapi]);

  useEffect(() => {
    if (interview_id) GetInterviewDetail();
  }, [interview_id]);

const GetInterviewDetail = async () => {
  setLoading(true);
  const { data, error } = await supabase
    .from("interviews")
    .select("*")
    .eq("interviewId", interview_id);

  if (error) { console.error(error); setLoading(false); return; }
  if (!data || data.length === 0) { setLoading(false); return; }

  // ✅ mark interview as incomplete when candidate joins
  await supabase
    .from("interviews")
    .update({ status: "incomplete" })
    .eq("interviewId", interview_id);

  setInterviewInfo({ ...interviewInfo, interviewData: data[0] });
  setLoading(false);
};

  // ✅ Start call only once when data is ready
  useEffect(() => {
    if (interviewInfo?.interviewData && !callStartedRef.current) {
      callStartedRef.current = true;
      startCall();
    }
  }, [interviewInfo?.interviewData]);

  const startCall = () => {
    let questionList = "";
    interviewInfo?.interviewData?.questionList?.forEach((item) => {
      questionList += item?.question + ", ";
    });

    const assistantOptions = {
      name: "AI Recruiter",
      firstMessage:
        "Hi " + (interviewInfo?.userName || "there") +
        ", how are you? Ready for your interview on " +
        interviewInfo?.interviewData?.jobPosition?.trim() + "?",
      backgroundDenoisingEnabled: false,
      transcriber: { provider: "deepgram", model: "nova-2", language: "en-US" },
      voice: { provider: "11labs", voiceId: "paula" },
      model: {
        provider: "openai",
        model: "gpt-4",
        messages: [{
          role: "system",
          content: `You are an AI voice assistant conducting interviews.
Your job is to ask candidates provided interview questions, assess their responses.
Begin the conversation with a friendly introduction, setting a relaxed yet professional tone.
"Hey there! Welcome to your ${interviewInfo?.interviewData?.jobPosition?.trim()} interview. Let's get started with a few questions!"
Ask one question at a time and wait for the candidate's response before proceeding. Keep the questions clear and concise. Below Are the questions ask one by one:
Questions: ${questionList}
If the candidate struggles, offer hints or rephrase the question without giving away the answer.
Provide brief, encouraging feedback after each answer.
Keep the conversation natural and engaging.
After all questions, wrap up the interview smoothly by summarizing their performance.
End on a positive note.
Key Guidelines:
Be friendly, engaging, and witty. Keep responses short and natural, like a real conversation. Adapt based on the candidate's confidence level.`.trim(),
        }],
      },
    };

    vapi.start(assistantOptions);
  };

  const stopInterview = () => {
    vapi.stop();
    GenerateFeedback();
  };

  const GenerateFeedback = async () => {
    try {
      setLoading(true);
      console.log("CONVERSATION LENGTH:", conversation?.length);
      console.log("CONVERSATION DATA:", conversation);
      
      if (!conversation) { setLoading(false); return; }

      const result = await axios.post("/api/ai-feedback", { conversation });
      const Content = result?.data?.content;
      if (!Content) { setLoading(false); return; }

      const FINAL_CONTENT = Content.replace("```json", "").replace("```", "").trim();
      let parsedFeedback;
      try { parsedFeedback = JSON.parse(FINAL_CONTENT); }
      catch (e) { console.error("JSON parse failed:", FINAL_CONTENT); setLoading(false); return; }

      const { data, error } = await supabase
        .from("interview-feedback")
        .insert([{
          userName: interviewInfo?.userName,
          userEmail: interviewInfo?.userEmail,
          interview_id: interview_id,
          feedback: parsedFeedback,
          recommended: false,
        }])
        .select();

      if (error) { console.error("Supabase error:", error); setLoading(false); return; }

      // ✅ mark interview as completed after feedback saves
      await supabase
        .from("interviews")
        .update({ status: "completed" })
        .eq("interviewId", interview_id);

      console.log("Feedback saved:", data);
      router.replace("/interview/" + interview_id + "/completed");

    } catch (err) {
      console.error("GenerateFeedback error:", err);
      setLoading(false);
    }
  };
  if (loading) {
    return (
      <div style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0f0c29, #302b63, #24243e)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "16px"
      }}>
        <div style={{
          width: "60px", height: "60px", borderRadius: "50%",
          border: "3px solid rgba(255,255,255,0.1)",
          borderTop: "3px solid #a78bfa",
          animation: "spin 1s linear infinite"
        }} />
        <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "16px" }}>
          Setting up your interview...
        </p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0f0c29, #302b63, #24243e)",
      fontFamily: "sans-serif"
    }}>
      <style>{`
        @keyframes pulse-ring {
          0% { transform: scale(1); opacity: 0.6; }
          100% { transform: scale(1.5); opacity: 0; }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        .card-hover:hover { transform: translateY(-2px); transition: transform 0.2s; }
        .mic-btn:hover { background: rgba(255,255,255,0.15) !important; }
        .end-btn:hover { background: #dc2626 !important; }
      `}</style>

      {/* Header */}
      <div style={{
        background: "rgba(255,255,255,0.05)",
        backdropFilter: "blur(10px)",
        borderBottom: "1px solid rgba(255,255,255,0.1)",
        padding: "16px 32px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between"
      }}>
        <div style={{ animation: "fadeIn 0.5s ease" }}>
          <h2 style={{ color: "#fff", fontWeight: "700", fontSize: "20px", margin: 0 }}>
            AI Interview Session
          </h2>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "13px", margin: "2px 0 0" }}>
            {interviewInfo?.interviewData?.jobPosition || "Interview in Progress"}
          </p>
        </div>

        {/* Timer */}
        <div style={{
          display: "flex", alignItems: "center", gap: "8px",
          background: "rgba(167,139,250,0.15)",
          border: "1px solid rgba(167,139,250,0.3)",
          padding: "10px 20px", borderRadius: "50px"
        }}>
          <Timer size={18} color="#a78bfa" />
          <span style={{
            fontFamily: "monospace", fontWeight: "700",
            color: "#a78bfa", fontSize: "18px", letterSpacing: "2px"
          }}>
            {formatTime(timer)}
          </span>
        </div>
      </div>

      {/* Status Bar */}
      <div style={{ textAlign: "center", padding: "12px", animation: "fadeIn 0.5s ease" }}>
        {vapiStatus === "active" && !isSpeaking && (
          <span style={{
            background: "rgba(16,185,129,0.15)", color: "#10b981",
            padding: "6px 16px", borderRadius: "50px", fontSize: "13px",
            border: "1px solid rgba(16,185,129,0.3)"
          }}>
            🎙️ Listening to you...
          </span>
        )}
        {vapiStatus === "active" && isSpeaking && (
          <span style={{
            background: "rgba(167,139,250,0.15)", color: "#a78bfa",
            padding: "6px 16px", borderRadius: "50px", fontSize: "13px",
            border: "1px solid rgba(167,139,250,0.3)"
          }}>
            🔊 AI is speaking...
          </span>
        )}
        {vapiStatus === "idle" && (
          <span style={{
            background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.4)",
            padding: "6px 16px", borderRadius: "50px", fontSize: "13px"
          }}>
            Connecting...
          </span>
        )}
        {vapiStatus === "error" && (
          <span style={{
            background: "rgba(239,68,68,0.15)", color: "#ef4444",
            padding: "6px 16px", borderRadius: "50px", fontSize: "13px",
            border: "1px solid rgba(239,68,68,0.3)"
          }}>
            ❌ Connection error
          </span>
        )}
      </div>

      {/* Cards */}
      <div style={{
        display: "grid", gridTemplateColumns: "1fr 1fr",
        gap: "24px", padding: "16px 32px", animation: "fadeIn 0.6s ease"
      }}>

        {/* AI Card */}
        <div className="card-hover" style={{
          background: "rgba(255,255,255,0.05)",
          backdropFilter: "blur(10px)",
          border: isSpeaking
            ? "1px solid rgba(167,139,250,0.6)"
            : "1px solid rgba(255,255,255,0.1)",
          borderRadius: "24px",
          height: "380px",
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center", gap: "16px",
          transition: "border 0.3s ease",
          position: "relative", overflow: "hidden"
        }}>
          {/* Pulse ring when speaking */}
          {isSpeaking && (
            <>
              <div style={{
                position: "absolute", width: "120px", height: "120px",
                borderRadius: "50%", border: "2px solid rgba(167,139,250,0.4)",
                animation: "pulse-ring 1.5s ease-out infinite"
              }} />
              <div style={{
                position: "absolute", width: "120px", height: "120px",
                borderRadius: "50%", border: "2px solid rgba(167,139,250,0.3)",
                animation: "pulse-ring 1.5s ease-out 0.5s infinite"
              }} />
            </>
          )}

          <div style={{
            width: "90px", height: "90px", borderRadius: "50%",
            border: isSpeaking ? "3px solid #a78bfa" : "3px solid rgba(255,255,255,0.1)",
            overflow: "hidden", transition: "border 0.3s ease", zIndex: 1
          }}>
            <Image src="/ai.png" alt="ai" width={90} height={90}
              style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>

          <p style={{ color: "rgba(255,255,255,0.8)", fontWeight: "600", fontSize: "15px", zIndex: 1 }}>
            AI Interviewer
          </p>
          {isSpeaking && (
            <span style={{
              color: "#a78bfa", fontSize: "12px",
              animation: "pulse-ring 1s ease infinite", zIndex: 1
            }}>
              Speaking...
            </span>
          )}
        </div>

        {/* User Card */}
        <div className="card-hover" style={{
          background: "rgba(255,255,255,0.05)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: "24px",
          height: "380px",
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center", gap: "16px"
        }}>
          <div style={{
            width: "90px", height: "90px", borderRadius: "50%",
            background: "linear-gradient(135deg, #7c3aed, #a78bfa)",
            display: "flex", alignItems: "center", justifyContent: "center",
            border: "3px solid rgba(167,139,250,0.4)"
          }}>
            <span style={{ fontSize: "36px", fontWeight: "700", color: "#fff" }}>
              {interviewInfo?.userName?.[0]?.toUpperCase() || "U"}
            </span>
          </div>

          <p style={{ color: "rgba(255,255,255,0.8)", fontWeight: "600", fontSize: "15px" }}>
            {interviewInfo?.userName || "Candidate"}
          </p>
          <span style={{
            background: "rgba(16,185,129,0.15)", color: "#10b981",
            padding: "4px 12px", borderRadius: "50px", fontSize: "12px",
            border: "1px solid rgba(16,185,129,0.2)"
          }}>
            Live
          </span>
        </div>
      </div>

      {/* Buttons */}
    <div style={{
  display: "flex", alignItems: "center", justifyContent: "center",
  gap: "20px", marginTop: "24px", animation: "fadeIn 0.7s ease"
}}>

  {/* ✅ Mic / Mute Button */}
  <button
    onClick={() => {
      const newMuted = !isMuted;
      setIsMuted(newMuted);
      vapi.setMuted(newMuted);
    }}
    style={{
      background: isMuted ? "rgba(239,68,68,0.15)" : "rgba(255,255,255,0.08)",
      border: isMuted ? "1px solid rgba(239,68,68,0.4)" : "1px solid rgba(255,255,255,0.15)",
      borderRadius: "50%", padding: "20px", cursor: "pointer",
      display: "flex", alignItems: "center", justifyContent: "center",
      transition: "all 0.2s"
    }}
  >
    {isMuted
      ? <MicOff size={28} color="#ef4444" />
      : <Mic size={28} color="white" />
    }
  </button>

  {/* ✅ End Call Button */}
  <AlertConfirmation stopInterview={() => stopInterview()}>
    <button style={{
      background: "#ef4444",
      border: "none", borderRadius: "50%",
      padding: "20px", cursor: "pointer",
      display: "flex", alignItems: "center", justifyContent: "center",
      transition: "background 0.2s",
      boxShadow: "0 0 20px rgba(239,68,68,0.4)"
    }}>
      <Phone size={28} color="white" />
    </button>
  </AlertConfirmation>

</div>

      {/* Bottom text */}
      <p style={{
        textAlign: "center", color: "rgba(255,255,255,0.3)",
        fontSize: "13px", marginTop: "16px"
      }}>
        Interview in progress — click the red button to end
      </p>
    </div>
  );
}

export default StartInterview;