// ============================================================
//  src/dom/renderTable.ts
//  Builds and updates the task <tbody> and sort-header classes.
//  Also exports `renderAll` — the single call that refreshes
//  the entire UI from the current AppState.
// ============================================================

import type { Task, SortState, SortableColumn, AppState } from "../types/task";
import {
  formatDisplayDate,
  priorityBadgeClass,
  statusBadgeClass,
  rowStateClass,
  sortTasks,
  filterTasks,
  computeSummary,
} from "../utils/taskUtils";
import { renderSummary } from "./renderSummary";

// ── Element references ────────────────────────────────────────
const tbody = document.querySelector<HTMLTableSectionElement>("#task-tbody")!;
const emptyState = document.querySelector<HTMLParagraphElement>("#empty-state")!;
const headers = document.querySelectorAll<HTMLTableCellElement>("th.sortable");

// ── Minimal HTML-escape to prevent XSS in user-entered text ──
const escapeHTML = (str: string): string =>
  str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

// ── Build a single <tr> HTML string ──────────────────────────
const buildRowHTML = (task: Task): string => {
  const { id, task: name, dueDate, priority, notes, status } = task;

  const rowClass = rowStateClass(task);
  const dateLabel = formatDisplayDate(dueDate);
  const priClass = priorityBadgeClass(priority);
  const statClass = statusBadgeClass(status);
  return `
    <tr class="${rowClass}" data-id="${id}">
      <td class="cell-task">${escapeHTML(name)}</td>
      <td class="cell-date">${dateLabel}</td>
      <td class="cell-priority">
        <span class="${priClass}">${priority}</span>
      </td>
      <td class="cell-notes">${escapeHTML(notes)}</td>
      <td class="cell-status">
        <span class="${statClass}">${status}</span>
      </td>
      <td class="cell-actions">
        <button
          class="btn-edit"
          data-action="edit"
          data-id="${id}"
          title="Edit task"
          aria-label="Edit ${escapeHTML(name)}"
        >Edit </button>
        <button
          class="btn-delete"
          data-action="delete"
          data-id="${id}"
          title="Delete task"
          aria-label="Delete ${escapeHTML(name)}"
        > Delete</button>
                    </td>
    </tr>
  `.trim();
};

// ── Render only the visible (filtered + sorted) rows ─────────
export const renderTable = (tasks: Task[]): void => {
  if (tasks.length === 0) {
    tbody.innerHTML = "";
    emptyState.hidden = false;
    return;
  }
  emptyState.hidden = true;
  tbody.innerHTML = tasks.map(buildRowHTML).join("");
};

// ── Update sort-indicator classes on <th> elements ───────────
export const renderSortHeaders = (sort: SortState): void => {
  headers.forEach((th) => {
    const col = th.dataset["col"] as SortableColumn | undefined;
    th.classList.remove("sort-asc", "sort-desc");

    if (col && col === sort.column) {
      if (sort.direction === "asc") th.classList.add("sort-asc");
      if (sort.direction === "desc") th.classList.add("sort-desc");
    }
  });
};

// ── Master render: summary + sort headers + table rows ───────
//    Called by eventHandlers after every state mutation.
export const renderAll = (state: AppState): void => {
  // 1. Always compute summary from the FULL (unfiltered) task list
  renderSummary(computeSummary(state.tasks));

  // 2. Apply filters then sort for display
  const visible = sortTasks(filterTasks(state.tasks, state.filter), state.sort);

  // 3. Update headers and rows
  renderSortHeaders(state.sort);
  renderTable(visible);
};
