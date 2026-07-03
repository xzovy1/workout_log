// src/views/ActiveWorkout.jsx
import React, { useState } from "react";
import { useWorkout } from "../context/WorkoutContext";
import { SetCard } from "../components/SetCard";
import { EXERCISE_LIBRARY } from "./WorkoutSelector";

// Presentational container configured to isolate and render one set at a time
function ExerciseCard({ exercise, workoutId }) {
  // Local numerical pointer tracking which set card is currently active (0-indexed)
  const [currentSetIndex, setCurrentSetIndex] = useState(0);

  const totalSets = exercise.sets;
  const currentSetNumber = currentSetIndex + 1;
  const isExerciseComplete = currentSetIndex >= totalSets;

  // Callback passed to SetCard to advance the view state upon successful IndexedDB logging
  const handleSetLogged = () => {
    setCurrentSetIndex((prev) => prev + 1);
  };

  return (
    <div
      style={{
        border: "1px solid #dadce0",
        borderRadius: "8px",
        padding: "16px",
        marginBottom: "20px",
        backgroundColor: isExerciseComplete ? "#e6f4ea" : "#f8f9fa",
        borderLeft: isExerciseComplete
          ? "4px solid #137333"
          : "1px solid #dadce0",
        transition: "all 0.3s ease",
      }}
    >
      {/* Header Info */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "12px",
        }}
      >
        <div>
          <h3
            style={{
              margin: 0,
              textDecoration: isExerciseComplete ? "line-through" : "none",
              color: isExerciseComplete ? "#137333" : "#000",
            }}
          >
            {exercise.name}
          </h3>
          <small style={{ color: "#5f6368" }}>
            {isExerciseComplete
              ? "All sets completed"
              : `Progress: Set ${currentSetNumber} of ${totalSets}`}
          </small>
        </div>

        <a
          href={exercise.url}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontSize: "13px",
            color: "#1a73e8",
            textDecoration: "none",
            fontWeight: "bold",
            backgroundColor: "#e8f0fe",
            padding: "4px 8px",
            borderRadius: "4px",
          }}
        >
          Form Guide ↗
        </a>
      </div>

      {/* Target Set Card View Switcher */}
      {!isExerciseComplete ? (
        <div>
          {/* Keying by currentSetNumber forces React to clean mount a fresh card 
              with blank inputs every time you advance to the next set */}
          <SetCard
            key={currentSetNumber}
            workoutId={workoutId}
            exerciseName={exercise.name}
            setNumber={currentSetNumber}
            onLogComplete={handleSetLogged}
          />
        </div>
      ) : (
        <div
          style={{
            color: "#137333",
            fontWeight: "bold",
            fontSize: "14px",
            marginTop: "8px",
          }}
        >
          ✓ Exercise complete! Move to the next one.
        </div>
      )}
    </div>
  );
}

export default function ActiveWorkout() {
  const { activeWorkout, finishWorkout } = useWorkout();

  if (!activeWorkout) return null;

  const targetExercises = EXERCISE_LIBRARY[activeWorkout.type] || [];

  const handleComplete = () => {
    if (window.confirm("Are you ready to finalize this workout session?")) {
      finishWorkout();
    }
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
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <div>
          <h2 style={{ margin: 0, textTransform: "uppercase" }}>
            🔥 Active {activeWorkout.type}
          </h2>
          <small style={{ color: "#5f6368" }}>Date: {activeWorkout.date}</small>
        </div>

        <button
          onClick={handleComplete}
          style={{
            backgroundColor: "#d93025",
            color: "#fff",
            border: "none",
            padding: "10px 16px",
            borderRadius: "6px",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          Finish
        </button>
      </div>

      {targetExercises.length > 0 ? (
        targetExercises.map((ex) => (
          <ExerciseCard
            key={ex.name}
            exercise={ex}
            workoutId={activeWorkout.id}
          />
        ))
      ) : (
        <p style={{ color: "#5f6368" }}>
          No exercises defined for this category.
        </p>
      )}
    </div>
  );
}
