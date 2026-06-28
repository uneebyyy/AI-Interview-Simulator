"use client";

import React, { useState, useEffect } from "react";
import { Video } from "lucide-react";
import { useUser } from "@/app/provider"
import { supabase } from "@/services/supabaseClient";
import InterviewCard from "./InterviewCard";

function LatestInterviews() {
  const [interviewList, setInterviewList] = useState([]);
  const { user } = useUser();

  useEffect(() => {
    user && GetInterviewList();
  }, [user]);

  const GetInterviewList = async () => {
    const { data, error } = await supabase
      .from("interview-feedback")
      .select("*")
      .eq("userEmail", user?.email)
      .order("created_at", { ascending: false }); // ✅ latest first

    if (error) { console.error(error); return; }
    console.log(data);
    setInterviewList(data);
  };

  return (
    <div style={{ marginTop: "24px" }}>
      <h2 style={{ fontWeight: "700", fontSize: "20px", marginBottom: "16px", color: "#fff" }}>
        Previously Created Interviews
      </h2>

      {interviewList?.length === 0 && (
        <div style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: "16px", padding: "40px",
          display: "flex", flexDirection: "column",
          alignItems: "center", gap: "12px"
        }}>
          <Video size={40} color="rgba(167,139,250,0.5)" />
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "15px", margin: 0 }}>
            You don't have any interviews yet
          </p>
        </div>
      )}

      {interviewList && interviewList.map((interview, index) => (
        <InterviewCard interview={interview} key={index} />
      ))}
    </div>
  );
}

export default LatestInterviews;