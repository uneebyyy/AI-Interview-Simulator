// app/(main)/dashboard/page.jsx
import WelcomeContainer from "./_components/WelcomeContainer";
import CreateOptions from "./_components/CreateOptions";
import LatestInterviews from "./_components/LatestInterviews";

export default function Dashboard() {
  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0f0c29, #302b63, #24243e)",
      padding: "32px",
      fontFamily: "sans-serif"
    }}>
      <h2 style={{
        color: "#fff",
        fontWeight: "700",
        fontSize: "24px",
        marginBottom: "24px"
      }}>
        Dashboard
      </h2>
      <CreateOptions />
      <LatestInterviews />
    </div>
  );
}