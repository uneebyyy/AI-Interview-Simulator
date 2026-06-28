"use client";
import React, { useState, useEffect } from "react";
import { useUser } from "@/app/provider";
import { supabase } from "@/services/supabaseClient";
import Image from "next/image";
import { Mail, Calendar, Video, Star, Shield } from "lucide-react";
import moment from "moment";

function Settings() {
  const { user } = useUser();
  const [stats, setStats] = useState({
    totalCreated: 0,
    totalCompleted: 0,
    avgRating: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    user && GetStats();
  }, [user]);

  const GetStats = async () => {
    setLoading(true);

    const { data: created } = await supabase
      .from("interviews")
      .select("id")
      .eq("userEmail", user?.email);

    const { data: completed } = await supabase
      .from("interview-feedback")
      .select("*")
      .eq("userEmail", user?.email);

    let avgRating = 0;
    if (completed && completed.length > 0) {
      const total = completed.reduce((sum, item) => {
        const r = item?.feedback?.feedback?.rating;
        const avg = r
          ? ((r.technicalSkills || 0) + (r.communication || 0) +
            (r.problemSolving || 0) + (r.experience || 0)) / 4
          : 0;
        return sum + avg;
      }, 0);
      avgRating = (total / completed.length).toFixed(1);
    }

    setStats({
      totalCreated: created?.length || 0,
      totalCompleted: completed?.length || 0,
      avgRating
    });

    setLoading(false);
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
      <div style={{ marginBottom: "28px", animation: "fadeIn 0.4s ease" }}>
        <h2 style={{ color: "#fff", fontWeight: "700", fontSize: "24px", margin: "0 0 6px" }}>
          Settings
        </h2>
        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "14px", margin: 0 }}>
          Your profile and account information
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "20px", maxWidth: "700px", animation: "fadeIn 0.5s ease" }}>

        {/* Profile Card */}
        <div style={{
          background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(167,139,250,0.3)",
          borderRadius: "24px", padding: "32px",
          display: "flex", alignItems: "center", gap: "24px",
          position: "relative", overflow: "hidden"
        }}>
          {/* Glow */}
          <div style={{
            position: "absolute", top: "-60px", left: "-60px",
            width: "200px", height: "200px", borderRadius: "50%",
            background: "rgba(124,58,237,0.15)", filter: "blur(50px)"
          }} />

          {/* Profile Picture */}
          {user?.picture ? (
            <div style={{
              width: "90px", height: "90px", borderRadius: "50%",
              overflow: "hidden",
              border: "3px solid rgba(167,139,250,0.5)",
              flexShrink: 0, position: "relative", zIndex: 1
            }}>
              <Image
                src={user?.picture}
                alt={user?.name}
                fill
                style={{ objectFit: "cover" }}
                sizes="90px"
              />
            </div>
          ) : (
            <div style={{
              width: "90px", height: "90px", borderRadius: "50%",
              background: "linear-gradient(135deg, #7c3aed, #a78bfa)",
              display: "flex", alignItems: "center", justifyContent: "center",
              border: "3px solid rgba(167,139,250,0.5)",
              flexShrink: 0, zIndex: 1
            }}>
              <span style={{ color: "#fff", fontSize: "36px", fontWeight: "700" }}>
                {user?.name?.[0]?.toUpperCase() || "U"}
              </span>
            </div>
          )}

          {/* Name & Email */}
          <div style={{ zIndex: 1 }}>
            <h3 style={{ color: "#fff", fontWeight: "700", fontSize: "22px", margin: "0 0 6px" }}>
              {user?.name || "User"}
            </h3>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Mail size={14} color="rgba(255,255,255,0.4)" />
              <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "14px", margin: 0 }}>
                {user?.email}
              </p>
            </div>
            <div style={{
              marginTop: "10px",
              display: "inline-flex", alignItems: "center", gap: "6px",
              background: "rgba(167,139,250,0.15)",
              border: "1px solid rgba(167,139,250,0.3)",
              padding: "4px 12px", borderRadius: "50px"
            }}>
              <Shield size={12} color="#a78bfa" />
              <span style={{ color: "#a78bfa", fontSize: "12px", fontWeight: "600" }}>
                Google Account
              </span>
            </div>
          </div>
        </div>

        {/* Account Info */}
        <div style={{
          background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: "20px", padding: "24px"
        }}>
          <h3 style={{ color: "#a78bfa", fontWeight: "600", fontSize: "15px", margin: "0 0 16px" }}>
            Account Information
          </h3>

          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>

            <div style={{
              display: "flex", alignItems: "center",
              justifyContent: "space-between",
              padding: "14px 16px",
              background: "rgba(255,255,255,0.03)",
              borderRadius: "12px",
              border: "1px solid rgba(255,255,255,0.06)"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <Mail size={16} color="rgba(255,255,255,0.4)" />
                <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "14px" }}>Email</span>
              </div>
              <span style={{ color: "#fff", fontSize: "14px", fontWeight: "500" }}>
                {user?.email}
              </span>
            </div>

            <div style={{
              display: "flex", alignItems: "center",
              justifyContent: "space-between",
              padding: "14px 16px",
              background: "rgba(255,255,255,0.03)",
              borderRadius: "12px",
              border: "1px solid rgba(255,255,255,0.06)"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <Calendar size={16} color="rgba(255,255,255,0.4)" />
                <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "14px" }}>Member Since</span>
              </div>
              <span style={{ color: "#fff", fontSize: "14px", fontWeight: "500" }}>
                {moment(user?.created_at).format('MMM DD, YYYY')}
              </span>
            </div>

          </div>
        </div>

        {/* Stats */}
        <div style={{
          background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: "20px", padding: "24px"
        }}>
          <h3 style={{ color: "#a78bfa", fontWeight: "600", fontSize: "15px", margin: "0 0 16px" }}>
            Your Stats
          </h3>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>

            <div style={{
              background: "rgba(167,139,250,0.08)",
              border: "1px solid rgba(167,139,250,0.2)",
              borderRadius: "14px", padding: "16px", textAlign: "center"
            }}>
              <Video size={20} color="#a78bfa" style={{ margin: "0 auto 8px" }} />
              <h4 style={{ color: "#fff", fontSize: "28px", fontWeight: "700", margin: "0 0 4px" }}>
                {stats.totalCreated}
              </h4>
              <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "12px", margin: 0 }}>
                Created
              </p>
            </div>

            <div style={{
              background: "rgba(16,185,129,0.08)",
              border: "1px solid rgba(16,185,129,0.2)",
              borderRadius: "14px", padding: "16px", textAlign: "center"
            }}>
              <Shield size={20} color="#10b981" style={{ margin: "0 auto 8px" }} />
              <h4 style={{ color: "#fff", fontSize: "28px", fontWeight: "700", margin: "0 0 4px" }}>
                {stats.totalCompleted}
              </h4>
              <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "12px", margin: 0 }}>
                Completed
              </p>
            </div>

            <div style={{
              background: "rgba(245,158,11,0.08)",
              border: "1px solid rgba(245,158,11,0.2)",
              borderRadius: "14px", padding: "16px", textAlign: "center"
            }}>
              <Star size={20} color="#f59e0b" style={{ margin: "0 auto 8px" }} />
              <h4 style={{ color: "#fff", fontSize: "28px", fontWeight: "700", margin: "0 0 4px" }}>
                {stats.avgRating}
              </h4>
              <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "12px", margin: 0 }}>
                Avg Rating
              </p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

export default Settings;