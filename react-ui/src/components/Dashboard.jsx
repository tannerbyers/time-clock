import React from "react";
import TimeSlotSection from "./TimeSlots/TimeSlotSection";

function Dashboard() {
  return (
    <div
      style={{
        backgroundColor: "#f3f6fc",
        minHeight: "100vh",
        padding: "4em",
      }}
    >
      <TimeSlotSection />
    </div>
  );
}

export default Dashboard;
