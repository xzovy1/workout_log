// src/views/History.jsx
import React, { useState, useEffect } from "react";
import { useWorkout } from "../context/WorkoutContext";
import { getAllRecords } from "../db";

export default function History() {
  const { history } = useWorkout();
  const [allLogs, setAllLogs] = useState([]);

  // Fetch individual set entries to calculate stats or group summaries
  useEffect(() => {
    async function fetchRawLogs() {
      const data = await getAllRecords("logs");
      setAllLogs(data);
    }
    fetchRawLogs();
  }, [history]);

  // Small helper to get all logged sets for a specific workout session
  const getWorkoutSummary = (workoutId) => {
    const sessionLogs = allLogs.filter((log) => log.workoutId === workoutId);
    if (sessionLogs.length === 0) return "No exercises logged";

    // Group logs by exercise name
    const grouped = sessionLogs.reduce((acc, log) => {
      acc[log.exerciseName] = (acc[log.exerciseName] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(grouped)
      .map(([name, sets]) => `${name} (${sets} sets)`)
      .join(", ");
  };

  return (
    <div
      style={{
        padding: "20px",
        maxWidth: "500px",
        margin: "0 auto",
        fontFamily: "sans-serif",
      }}
    >
      <h2>Workout Logs</h2>

      {history.length === 0 ? (
        <div
          style={{ textAlign: "center", color: "#5f6368", marginTop: "40px" }}
        >
          <p style={{ fontSize: "18px" }}>No workouts tracked yet.</p>
          <p style={{ fontSize: "14px" }}>
            Completed sessions will show up right here.
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {history.map((session) => (
            <div
              key={session.id}
              style={{
                border: "1px solid #dadce0",
                borderRadius: "8px",
                padding: "16px",
                backgroundColor:
                  session.status === "in-progress" ? "#fff7e6" : "#ffffff",
                borderLeft:
                  session.status === "in-progress"
                    ? "4px solid #f2994a"
                    : "1px solid #dadce0",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                  marginBottom: "8px",
                }}
              >
                <strong
                  style={{ textTransform: "uppercase", fontSize: "16px" }}
                >
                  {session.type} Day
                </strong>
                <span style={{ fontSize: "12px", color: "#5f6368" }}>
                  {session.date}
                </span>
              </div>

              <p
                style={{
                  margin: 0,
                  fontSize: "14px",
                  color: "#3c4043",
                  lineHeight: "1.4",
                }}
              >
                {getWorkoutSummary(session.id)}
              </p>

              {session.status === "in-progress" && (
                <span
                  style={{
                    display: "inline-block",
                    marginTop: "8px",
                    fontSize: "11px",
                    color: "#f2994a",
                    fontWeight: "bold",
                  }}
                >
                  ⚠️ SESSION UNFINISHED
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
