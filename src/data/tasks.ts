// ============================================================
//  src/data/tasks.ts
//  Seed data — mirrors the rows shown in the reference image.
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

// ── Seed tasks (8 rows matching the reference image) ────────
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
    task: "Update website content",
    dueDate: offsetDate(0),           // due today
    priority: "Medium",
    notes: "New blog post",
    status: "Not started",
  },
  {
    id: "task-004",
    task: "Client follow-up call",
    dueDate: offsetDate(4),
    priority: "Low",
    notes: "Follow-up on proposal",
    status: "In progress",
  },
  {
    id: "task-005",
    task: "Design marketing flyer",
    dueDate: offsetDate(9),
    priority: "Medium",
    notes: "Use new branding assets",
    status: "Completed",
  },
  {
    id: "task-006",
    task: "Invoice reconciliation",
    dueDate: offsetDate(3),
    priority: "High",
    notes: "Verify all payments",
    status: "In progress",
  },
  {
    id: "task-007",
    task: "Research new software tools",
    dueDate: offsetDate(4),
    priority: "Medium",
    notes: "Research top 3 tools",
    status: "Not started",
  },
  {
    id: "task-008",
    task: "Quarterly budget review",
    dueDate: offsetDate(6),
    priority: "High",
    notes: "Present to CFO",
    status: "In progress",
  },
];
