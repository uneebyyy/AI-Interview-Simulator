import React from "react";
import DashboardProvider from "./provider";

function DashboardLayout({ children }) {
  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0f0c29, #302b63, #24243e)",
    }}>
      <DashboardProvider>
        <div>
          {children}
        </div>
      </DashboardProvider>
    </div>
  );
}

export default DashboardLayout;