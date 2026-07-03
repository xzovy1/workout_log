// src/views/Settings.jsx
import React from "react";
import { exportDatabaseToJson, importDatabaseFromJson } from "../db";

export default function Settings() {
  const handleExport = async () => {
    await exportDatabaseToJson();
  };

  const handleImport = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const parsedJson = JSON.parse(e.target.result);

        if (
          window.confirm(
            "Importing backup data will clear your local app storage. Proceed?",
          )
        ) {
          await importDatabaseFromJson(parsedJson);
          alert("Database populated successfully! Reloading application...");
          window.location.reload(); // Force refresh context memory state
        }
      } catch (err) {
        console.error(err);
        alert(
          "Failed to parse backup payload. Make sure it's a valid backup JSON file.",
        );
      }
    };
    reader.readAsText(file);
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
      <h2>Data Management</h2>
      <p style={{ color: "#5f6368", fontSize: "14px", marginBottom: "24px" }}>
        This application stores data entirely locally inside your browser's
        IndexedDB engine. Use these utilities to back up or move your tracking
        records.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        {/* Export Card */}
        <div
          style={{
            border: "1px solid #dadce0",
            borderRadius: "8px",
            padding: "16px",
          }}
        >
          <h3 style={{ margin: "0 0 8px 0", fontSize: "16px" }}>
            Export Backup
          </h3>
          <p
            style={{ margin: "0 0 12px 0", fontSize: "13px", color: "#5f6368" }}
          >
            Download a raw JSON snapshot file containing your entire history and
            logged exercises.
          </p>
          <button
            onClick={handleExport}
            style={{
              backgroundColor: "#1a73e8",
              color: "#fff",
              border: "none",
              padding: "10px 16px",
              borderRadius: "4px",
              fontWeight: "bold",
              cursor: "pointer",
              width: "100%",
            }}
          >
            📥 Download Backup File
          </button>
        </div>

        {/* Import Card */}
        <div
          style={{
            border: "1px solid #dadce0",
            borderRadius: "8px",
            padding: "16px",
          }}
        >
          <h3 style={{ margin: "0 0 8px 0", fontSize: "16px" }}>
            Restore / Import Data
          </h3>
          <p
            style={{ margin: "0 0 12px 0", fontSize: "13px", color: "#5f6368" }}
          >
            Upload a previously exported workout backup file. This clears the
            current browser database.
          </p>

          <label
            htmlFor="file-upload"
            style={{
              display: "block",
              textAlign: "center",
              backgroundColor: "#f1f3f4",
              color: "#3c4043",
              border: "1px dashed #dadce0",
              padding: "12px",
              borderRadius: "4px",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            📤 Choose Backup JSON
          </label>
          <input
            id="file-upload"
            type="file"
            accept=".json"
            onChange={handleImport}
            style={{ display: "none" }}
          />
        </div>
      </div>
    </div>
  );
}
