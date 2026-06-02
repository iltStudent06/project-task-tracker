// ============================================================
//  src/main.ts
//  Application entry point.
//  NOTE: main.css is linked directly in index.html — no CSS
//        import here so tsc stays happy in strict mode.
// ============================================================

import type { AppState } from "./types/task";
import { seedTasks }         from "./data/tasks";
import { renderAll }         from "./dom/renderTable";
import { initEventHandlers } from "./dom/eventHandlers";

// ── Bootstrap application state ───────────────────────────────
const state: AppState = {
  tasks:         [...seedTasks],
  sort:          { column: null, direction: "none" },
  filter:        { status: "all", priority: "all", search: "" },
  editingTaskId: null,
};

// ── Initial render ────────────────────────────────────────────
renderAll(state);

// ── Wire all interactive controls ────────────────────────────
initEventHandlers(state);
