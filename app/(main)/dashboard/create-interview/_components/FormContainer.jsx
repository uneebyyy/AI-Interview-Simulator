"use client";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import React, { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { InterviewType } from "@/services/Constants";
import { ArrowRight } from "lucide-react";

function FormContainer({ onHandleInputChange, GoToNext }) {
  // ✅ tracks which interview types are selected (can select multiple)
  const [interviewType, setInterviewType] = useState([]);

  // ✅ whenever interviewType changes, update parent formData
  useEffect(() => {
    if (interviewType.length > 0) {
      onHandleInputChange("type", interviewType);
    }
  }, [interviewType]);

  // ✅ toggle interview type — add if not selected, remove if already selected
  const AddInterviewType = (type) => {
    const exists = interviewType.includes(type);
    if (!exists) {
      setInterviewType(prev => [...prev, type]);
    } else {
      setInterviewType(interviewType.filter(item => item !== type));
    }
  };

  return (
    <div style={{
      background: "rgba(255,255,255,0.05)",
      border: "1px solid rgba(167,139,250,0.2)",
      borderRadius: "20px",
      padding: "28px",
      display: "flex",
      flexDirection: "column",
      gap: "24px"
    }}>
      <style>{`
        .form-input {
          background: rgba(255,255,255,0.05) !important;
          border: 1px solid rgba(167,139,250,0.2) !important;
          border-radius: 10px !important;
          color: white !important;
          margin-top: 8px;
          transition: border-color 0.2s;
        }
        .form-input:focus {
          border-color: rgba(167,139,250,0.6) !important;
          outline: none !important;
        }
        .form-input::placeholder {
          color: rgba(255,255,255,0.25) !important;
        }
        .type-chip {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 14px;
          border-radius: 50px;
          border: 1px solid rgba(167,139,250,0.25);
          cursor: pointer;
          transition: all 0.2s ease;
          background: rgba(255,255,255,0.04);
          color: rgba(255,255,255,0.5);
          font-size: 13px;
        }
        .type-chip:hover {
          border-color: rgba(167,139,250,0.5);
          background: rgba(167,139,250,0.1);
          color: #a78bfa;
        }
        .type-chip.selected {
          background: rgba(167,139,250,0.2);
          border-color: rgba(167,139,250,0.6);
          color: #a78bfa;
          box-shadow: 0 0 10px rgba(167,139,250,0.2);
        }
        .next-btn {
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
        .next-btn:hover {
          opacity: 0.9;
          transform: translateY(-2px);
        }
        .select-trigger {
          background: rgba(255,255,255,0.05) !important;
          border: 1px solid rgba(167,139,250,0.2) !important;
          color: white !important;
          border-radius: 10px !important;
          margin-top: 8px;
        }
      `}</style>

      {/* ── Job Position ── */}
      <div>
        <h2 style={{ color: "#a78bfa", fontSize: "15px", fontWeight: "600", margin: "0 0 4px" }}>
          Job Position
        </h2>
        <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "12px", margin: "0 0 8px" }}>
          Enter the role you are interviewing for
        </p>
        <Input
          placeholder="e.g. Frontend Developer"
          className="form-input"
          onChange={(e) => onHandleInputChange("jobPosition", e.target.value)}
        />
      </div>

      {/* ── Job Description ── */}
      <div>
        <h2 style={{ color: "#a78bfa", fontSize: "15px", fontWeight: "600", margin: "0 0 4px" }}>
          Job Description
        </h2>
        <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "12px", margin: "0 0 8px" }}>
          Describe the responsibilities and required skills
        </p>
        <Textarea
          placeholder="Enter job details, skills required, responsibilities..."
          className="form-input"
          style={{ height: "160px", resize: "none" }}
          onChange={(e) => onHandleInputChange("jobDescription", e.target.value)}
        />
      </div>

      {/* ── Interview Duration ── */}
      <div>
        <h2 style={{ color: "#a78bfa", fontSize: "15px", fontWeight: "600", margin: "0 0 4px" }}>
          Interview Duration
        </h2>
        <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "12px", margin: "0 0 8px" }}>
          How long should the interview last?
        </p>
        <Select onValueChange={(value) => onHandleInputChange("duration", value)}>
          <SelectTrigger className="select-trigger w-full">
            <SelectValue placeholder="Select duration" />
          </SelectTrigger>
          <SelectContent style={{
            background: "#1e1b4b",
            border: "1px solid rgba(167,139,250,0.3)",
            borderRadius: "12px"
          }}>
            <SelectGroup>
              {/* 5 min = 5 questions */}
              <SelectItem value="5">5 Minutes — Quick (5 questions)</SelectItem>
              {/* 15 min = 10 questions */}
              <SelectItem value="15">15 Minutes — Standard (10 questions)</SelectItem>
              {/* 30 min = 15 questions */}
              <SelectItem value="30">30 Minutes — In-depth (15 questions)</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {/* ── Interview Type ── */}
      <div>
        <h2 style={{ color: "#a78bfa", fontSize: "15px", fontWeight: "600", margin: "0 0 4px" }}>
          Interview Type
        </h2>
        <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "12px", margin: "0 0 12px" }}>
          Select one or more interview types
        </p>

        {/* ✅ renders all interview type chips from Constants */}
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          {InterviewType.map((type, index) => (
            <div
              key={index}
              className={`type-chip ${interviewType.includes(type.title) ? "selected" : ""}`}
              onClick={() => AddInterviewType(type.title)}
            >
              <type.icon size={14} />
              <span>{type.title}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Submit Button ── */}
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button className="next-btn" onClick={() => GoToNext()}>
          Generate Questions
          <ArrowRight size={16} />
        </button>
      </div>

    </div>
  );
}

export default FormContainer;