// ============================================================
//  src/types/task.ts
//  All shared TypeScript interfaces, type aliases, and enums
//  used throughout the application.
// ============================================================

// ── Priority & Status unions ─────────────────────────────────
export type Priority = "High" | "Medium" | "Low";

export type Status = "Not started" | "In progress" | "Completed";

export type SortDirection = "asc" | "desc" | "none";

export type SortableColumn = "task" | "dueDate" | "priority" | "status";

export type FilterStatus = Status | "all";

export type FilterPriority = Priority | "all";

// ── Core data model ──────────────────────────────────────────
export interface Task {
  id: string;
  task: string;
  dueDate: string;   // ISO date string "YYYY-MM-DD"
  priority: Priority;
  notes: string;
  status: Status;
}

// ── Form values (all strings before validation/casting) ──────
export interface TaskFormValues {
  task: string;
  dueDate: string;
  priority: string;
  notes: string;
  status: string;
}

// ── Validation result ────────────────────────────────────────
export interface ValidationResult {
  valid: boolean;
  errors: Partial<Record<keyof TaskFormValues, string>>;
}

// ── Summary counters ─────────────────────────────────────────
export interface TaskSummary {
  total: number;
  dueToday: number;
  pending: number;
  overdue: number;
  todaysDate: string;
}

// ── Sort state ───────────────────────────────────────────────
export interface SortState {
  column: SortableColumn | null;
  direction: SortDirection;
}

// ── Active filter state ──────────────────────────────────────
export interface FilterState {
  status: FilterStatus;
  priority: FilterPriority;
  search: string;
}

// ── App state (single source of truth) ──────────────────────
export interface AppState {
  tasks: Task[];
  sort: SortState;
  filter: FilterState;
  editingTaskId: string | null;
}
