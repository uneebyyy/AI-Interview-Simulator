"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Plus, LogOut } from "lucide-react";
import { SideBarOptions } from "@/services/Constants";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/services/supabaseClient";

export function AppSidebar() {
  const path = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <Sidebar
      style={{
        background: "linear-gradient(160deg, #0f0c29, #302b63, #24243e)",
        borderRight: "1px solid rgba(255,255,255,0.08)",
        minHeight: "100vh",
      }}
    >
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateX(-10px); }
          to { opacity: 1; transform: translateX(0); }
        }

        .menu-link {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          border-radius: 12px;
          text-decoration: none;
          border: 1px solid transparent;
          transition: all 0.25s ease;
          cursor: pointer;
        }

        .menu-link:hover {
          background: rgba(167, 139, 250, 0.12) !important;
          border-color: rgba(167, 139, 250, 0.25) !important;
          transform: translateX(4px);
        }

        .menu-link.active {
          background: rgba(167, 139, 250, 0.22) !important;
          border-color: rgba(167, 139, 250, 0.4) !important;
          box-shadow: 0 0 15px rgba(167, 139, 250, 0.15);
        }

        .logout-btn {
          width: 100%;
          background: rgba(167, 139, 250, 0.1); /* ✅ purple */
          border: 1px solid rgba(167, 139, 250, 0.3);
          border-radius: 12px;
          padding: 12px;
          color: #a78bfa; /* ✅ purple */
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: all 0.2s ease;
        }

        .logout-btn:hover {
          background: rgba(167, 139, 250, 0.2); /* ✅ purple hover */
          border-color: rgba(167, 139, 250, 0.5);
          transform: translateY(-1px);
        }

        .create-btn {
          width: 100%;
          background: linear-gradient(135deg, #7c3aed, #a78bfa);
          border: none;
          border-radius: 12px;
          padding: 12px;
          color: white;
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          box-shadow: 0 4px 15px rgba(124, 58, 237, 0.4);
          transition: all 0.2s ease;
        }

        .create-btn:hover {
          opacity: 0.9;
          transform: translateY(-2px);
        }
      `}</style>

      {/* HEADER */}
      <SidebarHeader
        style={{
          padding: "24px 16px 16px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "16px",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          animation: "fadeIn 0.4s ease",
        }}
      >
        <Image
          src="/logo.png"
          alt="logo"
          width={200}
          height={100}
          style={{ width: "100px", filter: "brightness(0) invert(0)" }}
        />

        <button
          className="create-btn"
          onClick={() => router.push("/dashboard/create-interview")}
        >
          <Plus size={16} />
          Create New Interview
        </button>
      </SidebarHeader>

      {/* MENU */}
      <SidebarContent
        style={{ padding: "12px", animation: "fadeIn 0.5s ease" }}
      >
        <SidebarGroup>
          <SidebarMenu
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "6px",
              listStyle: "none",
              padding: 0,
              margin: 0,
            }}
          >
            {SideBarOptions.map((option, index) => {
              const Icon = option.icon;
              const isActive = path === option.path;

              return (
                <SidebarMenuItem key={index} style={{ listStyle: "none" }}>
                  <Link
                    href={option.path}
                    className={`menu-link ${isActive ? "active" : ""}`}
                  >
                    <Icon
                      size={18}
                      color={isActive ? "#a78bfa" : "#c4b5fd"}
                    />
                    <span
                      style={{
                        fontSize: "15px",
                        fontWeight: isActive ? "600" : "500",
                        color: isActive ? "#a78bfa" : "#c4b5fd",
                      }}
                    >
                      {option.name}
                    </span>

                    {isActive && (
                      <div
                        style={{
                          marginLeft: "auto",
                          width: "8px", height: "8px",
                          borderRadius: "50%",
                          background: "#a78bfa",
                          boxShadow: "0 0 10px #a78bfa",
                        }}
                      />
                    )}
                  </Link>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      {/* FOOTER */}
      <SidebarFooter
        style={{
          padding: "16px",
          borderTop: "1px solid rgba(255,255,255,0.06)",
          animation: "fadeIn 0.6s ease",
        }}
      >
        <button className="logout-btn" onClick={handleLogout}>
          <LogOut size={16} />
          Logout
        </button>
      </SidebarFooter>
    </Sidebar>
  );
}

export default AppSidebar;