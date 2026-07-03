// src/views/WorkoutSelector.jsx
import React from "react";
import { useWorkout } from "../context/WorkoutContext";

// Hardcoded library defining your workout routines and external reference links
export const EXERCISE_LIBRARY = {
  push: [
    {
      name: "Flat Dumbbell Bench Press",
      sets: 3,
      url: "https://www.youtube.com/watch?v=v=rT7DgCr-3pg",
    },
    {
      name: "Incline Dumbbell Bench Press @ 30 Degrees",
      sets: 3,
      url: "https://www.youtube.com/watch?v=v=QAQ64hK4Xdg",
    },
    {
      name: "Standing Dumbbell Shoulder Press",
      sets: 3,
      url: "https://www.youtube.com/watch?v=v=bDaXnv59f3U",
    },
    {
      name: "Standing Upright Row",
      sets: 3,
      url: "https://www.youtube.com/watch?v=v=2-LAMcpzODU",
    },
    {
      name: "Tricep Cable Push Downs With Rope",
      sets: 3,
      url: "https://www.youtube.com/watch?v=v=2-LAMcpzODU",
    },
  ],
  pull: [
    {
      name: "Single Arm Bent-over Rows",
      sets: 3,
      url: "https://www.youtube.com/watch?v=v=RQU8wZ6079c",
    },
    {
      name: "Cable Lat Pulldowns",
      sets: 3,
      url: "https://www.youtube.com/watch?v=v=CAwf7n6Luuc",
    },
    {
      name: "Low Row (Machine or Cable)",
      sets: 3,
      url: "https://www.youtube.com/watch?v=v=V8dZ3WwI140",
    },
    {
      name: "Dumbbell Bicep Curls",
      sets: 3,
      url: "https://www.youtube.com/watch?v=v=kwG2ipFRgfo",
    },
    {
      name: "Rear Delt Cable Extension (Lightweight & Slow)",
      sets: 3,
      url: "https://www.youtube.com/watch?v=v=kwG2ipFRgfo",
    },
    {
      name: "Rope Face Pulls",
      sets: 3,
      url: "https://www.youtube.com/watch?v=v=kwG2ipFRgfo",
    },
  ],
  legs: [
    {
      name: "Goblet Squats",
      sets: 3,
      url: "https://www.youtube.com/watch?v=v=Gc9mknb_L9A",
    },
    {
      name: "Walking Lunges",
      sets: 3,
      url: "https://www.youtube.com/watch?v=v=JCX81dxcCFc",
    },
    {
      name: "Leg Press",
      sets: 3,
      url: "https://www.youtube.com/watch?v=v=IZxyjW7MPJQ",
    },
    {
      name: "Standing Calf Raises",
      sets: 3,
      url: "https://www.youtube.com/watch?v=v=ym34eM2D6V4",
    },
    {
      name: "Hamstring Curls",
      sets: 3,
      url: "https://www.youtube.com/watch?v=v=ym34eM2D6V4",
    },
    {
      name: "Body Weight Squats",
      sets: 3,
      url: "https://www.youtube.com/watch?v=v=ym34eM2D6V4",
    },
  ],
  cardio: [
    { name: "Treadmill Run", sets: 1, url: "https://www.youtube.com" },
    { name: "Stationary Bike", sets: 1, url: "https://www.youtube.com" },
  ],
};

const ROTATION = ["push", "pull", "legs"];

export default function WorkoutSelector() {
  const { history, startWorkout } = useWorkout();

  // Find the most recent resistance training workout type to recommend the next one
  const getRecommendedWorkout = () => {
    const lastResistanceWorkout = history.find((w) =>
      ROTATION.includes(w.type),
    );
    if (!lastResistanceWorkout) return "push"; // Default starting routine

    const currentIndex = ROTATION.indexOf(lastResistanceWorkout.type);
    const nextIndex = (currentIndex + 1) % ROTATION.length;
    return ROTATION[nextIndex];
  };

  const recommended = getRecommendedWorkout();

  return (
    <div
      style={{
        padding: "20px",
        maxWidth: "500px",
        margin: "0 auto",
        fontFamily: "sans-serif",
      }}
    >
      <h2>Start a Workout</h2>

      {/* Recommendation Banner */}
      <div
        style={{
          backgroundColor: "#e8f0fe",
          border: "1px solid #1a73e8",
          borderRadius: "8px",
          padding: "16px",
          marginBottom: "24px",
        }}
      >
        <span
          style={{ fontSize: "14px", color: "#1a73e8", fontWeight: "bold" }}
        >
          NEXT UP IN ROTATION
        </span>
        <h3 style={{ margin: "4px 0 0 0", textTransform: "uppercase" }}>
          🏋️‍♂️ {recommended} Day
        </h3>
      </div>

      {/* Quick Launch Buttons */}
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {["push", "pull", "legs", "cardio"].map((type) => {
          const isRec = type === recommended;
          return (
            <button
              key={type}
              onClick={() => startWorkout(type)}
              style={{
                padding: "16px",
                fontSize: "16px",
                fontWeight: "bold",
                textTransform: "uppercase",
                backgroundColor: isRec ? "#1a73e8" : "#f1f3f4",
                color: isRec ? "#fff" : "#3c4043",
                border: isRec ? "none" : "1px solid #dadce0",
                borderRadius: "8px",
                cursor: "pointer",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span>{type} Session</span>
              {isRec && (
                <span
                  style={{
                    fontSize: "12px",
                    backgroundColor: "#fff",
                    color: "#1a73e8",
                    padding: "2px 8px",
                    borderRadius: "12px",
                  }}
                >
                  Suggested
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
