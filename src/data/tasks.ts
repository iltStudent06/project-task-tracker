// ============================================================
//  src/data/tasks.ts
//  Dummy records for testing.
//  Dates are kept relative to today so the tracker always
//  renders realistically on any run date.
// ============================================================

import type { Task } from "../types/task";

// ── Helper: offset today's date by N calendar days ──────────
// FIX: Array index access returns `string | undefined` in strict mode.
//      Index 0 is guaranteed to exist after splitting an ISO string,
//      so the non-null assertion `!` is safe here.
const offsetDate = (days: number): string => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split("T")[0]!; // "YYYY-MM-DD"
};

// ── Dummy records ────────
export const seedTasks: Task[] = [
  {
    id: "task-001",
    task: "Submit project report",
    dueDate: offsetDate(-7),          // already overdue
    priority: "High",
    notes: "Final draft",
    status: "In progress",
  },
  {
    id: "task-002",
    task: "Team meeting preparation",
    dueDate: offsetDate(-7),
    priority: "High",
    notes: "Prepare agenda",
    status: "Completed",
  },
  {
    id: "task-003",
    task: "Document detailed business requirements",
    dueDate: offsetDate(0),           // due today
    priority: "Medium",
    notes: "Gather input from stakeholders",
    status: "Not started",
  },
  {
    id: "task-004",
    task: "Set up new Development & Production Environments",
    dueDate: offsetDate(4),
    priority: "Low",
    notes: "Follow-up with Johnson",
    status: "In progress",
  },
  {
    id: "task-005",
    task: "Design application",
    dueDate: offsetDate(9),
    priority: "Medium",
    notes: "Use new branding assets",
    status: "Completed",
  },
  {
    id: "task-006",
    task: "Migrate data from legacy system",
    dueDate: offsetDate(3),
    priority: "High",
    notes: "Verify all records",
    status: "In progress",
  },
  {
    id: "task-007",
    task: "Implement calculations",
    dueDate: offsetDate(4),
    priority: "Medium",
    notes: "57 calculated accounts in total",
    status: "Not started",
  },
  {
    id: "task-008",
    task: "Demo user interface to business team",
    dueDate: offsetDate(6),
    priority: "High",
    notes: "Schedule meeting with stakeholders",
    status: "In progress",
  },
];
