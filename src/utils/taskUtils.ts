// ============================================================
//  src/utils/taskUtils.ts
//  Pure utility functions — no DOM access.
//  Covers: ID generation, date helpers, sorting, filtering,
//          summary calculation, and form validation.
// ============================================================

import type {
  Task,
  TaskSummary,
  SortState,
  FilterState,
  Priority,
  Status,
  ValidationResult,
  TaskFormValues,
} from "../types/task";

// ── Unique ID generator (closure over a counter) ─────────────
const makeIdGenerator = () => {
  let counter = Date.now();
  return (): string => `task-${(++counter).toString(36)}`;
};
export const generateId = makeIdGenerator();

// ── Today's date as "YYYY-MM-DD" ────────────────────────────
// FIX: Array index access returns `string | undefined` in strict mode.
//      We know index 0 always exists after splitting an ISO string,
//      so the non-null assertion `!` is safe here.
export const todayISO = (): string =>
  new Date().toISOString().split("T")[0]!;

// ── Format "YYYY-MM-DD" → "MM/DD/YYYY" for display ──────────
export const formatDisplayDate = (iso: string): string => {
  const [year, month, day] = iso.split("-");
  return `${month}/${day}/${year}`;
};

// ── Compare two ISO date strings ─────────────────────────────
export const isOverdue = (dueDate: string, status: Status): boolean =>
  status !== "Completed" && dueDate < todayISO();

export const isDueToday = (dueDate: string): boolean =>
  dueDate === todayISO();

// ── Priority sort weight (High > Medium > Low) ───────────────
const priorityWeight: Record<Priority, number> = {
  High: 3,
  Medium: 2,
  Low: 1,
};

// ── Status sort weight ────────────────────────────────────────
const statusWeight: Record<Status, number> = {
  "In progress": 3,
  "Not started": 2,
  Completed: 1,
};

// ── Sort tasks ────────────────────────────────────────────────
export const sortTasks = (tasks: Task[], sort: SortState): Task[] => {
  if (sort.direction === "none" || sort.column === null) return [...tasks];

  const multiplier = sort.direction === "asc" ? 1 : -1;

  return [...tasks].sort((a, b) => {
    let comparison = 0;

    switch (sort.column) {
      case "task":
        comparison = a.task.localeCompare(b.task);
        break;
      case "dueDate":
        comparison = a.dueDate.localeCompare(b.dueDate);
        break;
      case "priority":
        comparison = priorityWeight[a.priority] - priorityWeight[b.priority];
        break;
      case "status":
        comparison = statusWeight[a.status] - statusWeight[b.status];
        break;
    }

    return comparison * multiplier;
  });
};

// ── Filter tasks ──────────────────────────────────────────────
export const filterTasks = (tasks: Task[], filter: FilterState): Task[] =>
  tasks.filter((t) => {
    const matchesStatus =
      filter.status === "all" || t.status === filter.status;

    const matchesPriority =
      filter.priority === "all" || t.priority === filter.priority;

    const needle = filter.search.trim().toLowerCase();
    const matchesSearch =
      needle === "" ||
      t.task.toLowerCase().includes(needle) ||
      t.notes.toLowerCase().includes(needle);

    return matchesStatus && matchesPriority && matchesSearch;
  });

// ── Compute summary counters ──────────────────────────────────
export const computeSummary = (tasks: Task[]): TaskSummary => {
  const today = todayISO();

  return {
    total: tasks.length,
    dueToday: tasks.filter((t) => isDueToday(t.dueDate)).length,
    pending: tasks.filter((t) => t.status !== "Completed").length,
    overdue: tasks.filter((t) => isOverdue(t.dueDate, t.status)).length,
    todaysDate: formatDisplayDate(today),
  };
};

// ── CSS class helpers ─────────────────────────────────────────
export const priorityBadgeClass = (priority: Priority): string =>
  `badge badge-priority-${priority.toLowerCase()}`;

export const statusBadgeClass = (status: Status): string => {
  const key = status.toLowerCase().replace(/\s+/g, "");
  return `badge badge-status-${key}`;
};

export const rowStateClass = (task: Task): string => {
  if (task.status === "Completed") return "row-completed";
  if (isOverdue(task.dueDate, task.status)) return "row-overdue";
  return "";
};

// ── Type guards ───────────────────────────────────────────────
export const isValidPriority = (value: string): value is Priority =>
  ["High", "Medium", "Low"].includes(value);

export const isValidStatus = (value: string): value is Status =>
  ["Not started", "In progress", "Completed"].includes(value);

// ── Form validation ───────────────────────────────────────────
export const validateTaskForm = (values: TaskFormValues): ValidationResult => {
  const errors: ValidationResult["errors"] = {};

  if (!values.task.trim()) {
    errors.task = "Task name is required.";
  } else if (values.task.trim().length > 120) {
    errors.task = "Task name must be 120 characters or fewer.";
  }

  if (!values.dueDate) {
    errors.dueDate = "Due date is required.";
  }

  if (!isValidPriority(values.priority)) {
    errors.priority = "Please select a priority.";
  }

  if (!isValidStatus(values.status)) {
    errors.status = "Please select a status.";
  }

  return { valid: Object.keys(errors).length === 0, errors };
};

// ── Build a Task from validated form values ───────────────────
export const buildTask = (
  values: TaskFormValues,
  id: string = generateId()
): Task => ({
  id,
  task: values.task.trim(),
  dueDate: values.dueDate,
  priority: values.priority as Priority,
  notes: values.notes.trim(),
  status: values.status as Status,
});

// ── Spread-merge an existing task with partial updates ────────
export const mergeTask = (
  existing: Task,
  updates: Partial<Omit<Task, "id">>
): Task => ({ ...existing, ...updates });

// ── Extract form values from the DOM form element ────────────
export const extractFormValues = (form: HTMLFormElement): TaskFormValues => {
  const data = new FormData(form);
  return {
    task:     (data.get("task")     as string) ?? "",
    dueDate:  (data.get("dueDate")  as string) ?? "",
    priority: (data.get("priority") as string) ?? "",
    notes:    (data.get("notes")    as string) ?? "",
    status:   (data.get("status")   as string) ?? "",
  };
};
