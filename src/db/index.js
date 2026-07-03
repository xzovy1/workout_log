// src/db/index.js

const DB_NAME = "LocalFitnessTracker";
const DB_VERSION = 1;

/**
 * Initializes the connection to vanilla IndexedDB.
 * Handles table (object store) creation and indices.
 */
export function initDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (e) => {
      const db = e.target.result;

      // 1. Workouts Store: Records each workout session metadata
      if (!db.objectStoreNames.contains("workouts")) {
        db.createObjectStore("workouts", { keyPath: "id" });
      }

      // 2. Exercise Logs Store: Records individual sets performed
      if (!db.objectStoreNames.contains("logs")) {
        const logStore = db.createObjectStore("logs", { keyPath: "id" });
        // Index allows rapid lookup of history for a specific exercise name
        logStore.createIndex("exerciseName", "exerciseName", { unique: false });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Inserts or updates an individual object record into a target object store.
 */
export async function writeRecord(storeName, data) {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, "readwrite");
    const store = tx.objectStore(storeName);
    const request = store.put(data); // .put handles both insertion and updates seamlessly

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Retrieves all data rows from a target object store.
 */
export async function getAllRecords(storeName) {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, "readonly");
    const store = tx.objectStore(storeName);
    const request = store.getAll();

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Finds and aggregates past logs for a specific exercise name.
 * Automatically sorts data from newest to oldest for progressive overload references.
 */
export async function getLogsForExercise(exerciseName) {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction("logs", "readonly");
    const store = tx.objectStore("logs");
    const index = store.index("exerciseName");
    const request = index.getAll(exerciseName);

    request.onsuccess = () => {
      // Sort array descending: most recent historical metrics first
      const sorted = request.result.sort((a, b) => b.timestamp - a.timestamp);
      resolve(sorted);
    };
    request.onerror = () => reject(request.error);
  });
}

/**
 * EXPORT DATA ENGINE
 * Aggregates all contents from both object stores and builds a downloadable JSON payload.
 */
export async function exportDatabaseToJson() {
  try {
    const workouts = await getAllRecords("workouts");
    const logs = await getAllRecords("logs");

    const dynamicBackupObject = {
      exportDate: new Date().toISOString(),
      workouts,
      logs,
    };

    const jsonString = JSON.stringify(dynamicBackupObject, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const downloadUrl = URL.createObjectURL(blob);

    // Dynamic browser download anchor execution
    const downloadAnchor = document.createElement("a");
    downloadAnchor.href = downloadUrl;
    downloadAnchor.download = `workout_backup_${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();

    // Memory cleanup
    document.body.removeChild(downloadAnchor);
    URL.revokeObjectURL(downloadUrl);
  } catch (error) {
    console.error("Failed executing database data file generation:", error);
    alert("Could not export data. Check developer console.");
  }
}

/**
 * IMPORT DATA ENGINE
 * Takes a parsed JSON backup object, clears existing tables, and hydrates the database.
 */
export async function importDatabaseFromJson(parsedBackupData) {
  if (!parsedBackupData.workouts || !parsedBackupData.logs) {
    throw new Error("Invalid backup file structure: components missing.");
  }

  const db = await initDB();

  return new Promise((resolve, reject) => {
    // Open a readwrite transaction across both tables simultaneously
    const tx = db.transaction(["workouts", "logs"], "readwrite");
    const workoutStore = tx.objectStore("workouts");
    const logStore = tx.objectStore("logs");

    // Wipe tables to prevent primary key constraint collisions
    workoutStore.clear();
    logStore.clear();

    // Hydrate workouts table rows
    parsedBackupData.workouts.forEach((workout) => {
      workoutStore.put(workout);
    });

    // Hydrate individual exercise metric logs rows
    parsedBackupData.logs.forEach((log) => {
      logStore.put(log);
    });

    tx.oncomplete = () => {
      resolve(true);
    };

    tx.onerror = (event) => {
      reject(event.target.error);
    };
  });
}
