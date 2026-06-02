// ============================================================
//  src/dom/eventHandlers.ts
//  Wires every interactive element to app-state mutations.
//  Exports a single `initEventHandlers` function consumed by
//  main.ts — keeping all addEventListener calls in one place.
// ============================================================

import type {
  AppState,
  SortableColumn,
  SortDirection,
  Task,
} from "../types/task";

import {
  validateTaskForm,
  buildTask,
  mergeTask,
  extractFormValues,
  isValidPriority,
  isValidStatus,
} from "../utils/taskUtils";

import { renderAll } from "./renderTable";

// ── DOM references ────────────────────────────────────────────

// Controls
const filterStatus   = document.querySelector<HTMLSelectElement>("#filter-status")!;
const filterPriority = document.querySelector<HTMLSelectElement>("#filter-priority")!;
const searchInput    = document.querySelector<HTMLInputElement>("#search-input")!;
const btnAddTask     = document.querySelector<HTMLButtonElement>("#btn-add-task")!;

// Table header (sort)
const taskTable      = document.querySelector<HTMLTableElement>("#task-table")!;
const tbody          = document.querySelector<HTMLTableSectionElement>("#task-tbody")!;

// Add/Edit Modal
const taskModal      = document.querySelector<HTMLDivElement>("#task-modal")!;
const modalTitle     = document.querySelector<HTMLHeadingElement>("#modal-title")!;
const taskForm       = document.querySelector<HTMLFormElement>("#task-form")!;
const btnModalClose  = document.querySelector<HTMLButtonElement>("#modal-close")!;
const btnCancel      = document.querySelector<HTMLButtonElement>("#btn-cancel")!;

// Delete Confirm Modal
const confirmModal      = document.querySelector<HTMLDivElement>("#confirm-modal")!;
const confirmTaskName   = document.querySelector<HTMLElement>("#confirm-task-name")!;
const confirmCancelBtn  = document.querySelector<HTMLButtonElement>("#confirm-cancel")!;
const confirmDeleteBtn  = document.querySelector<HTMLButtonElement>("#confirm-delete")!;

// ── Pending delete target ─────────────────────────────────────
let pendingDeleteId: string | null = null;

// ── Validation field IDs ──────────────────────────────────────
const VALIDATED_FIELDS = ["task", "dueDate", "priority", "status"] as const;
type ValidatedField = (typeof VALIDATED_FIELDS)[number];

// ── Show / hide modals ────────────────────────────────────────
const openModal  = (el: HTMLElement): void => { el.hidden = false; };
const closeModal = (el: HTMLElement): void => { el.hidden = true;  };

// ── Clear all form validation state ──────────────────────────
const clearFormErrors = (): void => {
  VALIDATED_FIELDS.forEach((field) => {
    const input = taskForm.elements.namedItem(field) as HTMLElement | null;
    const errEl = document.querySelector<HTMLElement>(`#err-${field}`);
    input?.classList.remove("is-invalid");
    if (errEl) errEl.textContent = "";
  });
};

// ── Show field-level errors ───────────────────────────────────
const showFormErrors = (
  errors: Partial<Record<ValidatedField, string>>
): void => {
  (Object.entries(errors) as [ValidatedField, string][]).forEach(
    ([field, message]) => {
      const input = taskForm.elements.namedItem(field) as HTMLElement | null;
      const errEl = document.querySelector<HTMLElement>(`#err-${field}`);
      input?.classList.add("is-invalid");
      if (errEl) errEl.textContent = message ?? "";
    }
  );
};

// ── Populate form for edit ────────────────────────────────────
const populateForm = (task: Task): void => {
  (taskForm.elements.namedItem("task")     as HTMLInputElement).value  = task.task;
  (taskForm.elements.namedItem("dueDate")  as HTMLInputElement).value  = task.dueDate;
  (taskForm.elements.namedItem("priority") as HTMLSelectElement).value = task.priority;
  (taskForm.elements.namedItem("status")   as HTMLSelectElement).value = task.status;
  (taskForm.elements.namedItem("notes")    as HTMLInputElement).value  = task.notes;
};

// ── Toggle sort direction (none → asc → desc → asc …) ────────
const nextSortDirection = (
  currentCol: SortableColumn | null,
  clickedCol: SortableColumn,
  currentDir: SortDirection
): SortDirection => {
  if (currentCol !== clickedCol) return "asc";
  if (currentDir === "asc")  return "desc";
  if (currentDir === "desc") return "asc";
  return "asc";
};

// ── Main initialiser ──────────────────────────────────────────
export const initEventHandlers = (state: AppState): void => {

  // ── Re-render helper (called after any state mutation) ───────
  const refresh = (): void => renderAll(state);

  // ── Filter: status ────────────────────────────────────────────
  filterStatus.addEventListener("change", () => {
    const val = filterStatus.value;
    state.filter.status =
      val === "all" || isValidStatus(val) ? (val as AppState["filter"]["status"]) : "all";
    refresh();
  });

  // ── Filter: priority ─────────────────────────────────────────
  filterPriority.addEventListener("change", () => {
    const val = filterPriority.value;
    state.filter.priority =
      val === "all" || isValidPriority(val)
        ? (val as AppState["filter"]["priority"])
        : "all";
    refresh();
  });

  // ── Filter: search (debounced 250 ms) ────────────────────────
  let debounceTimer: ReturnType<typeof setTimeout>;
  searchInput.addEventListener("input", () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      state.filter.search = searchInput.value;
      refresh();
    }, 250);
  });

  // ── Sort: click on any sortable <th> ─────────────────────────
  taskTable.querySelector("thead")?.addEventListener("click", (e) => {
    const th = (e.target as HTMLElement).closest<HTMLElement>("th.sortable");
    if (!th) return;

    const col = th.dataset["col"] as SortableColumn;
    state.sort.direction = nextSortDirection(
      state.sort.column,
      col,
      state.sort.direction
    );
    state.sort.column = col;
    refresh();
  });

  // ── Add Task button → open blank modal ───────────────────────
  btnAddTask.addEventListener("click", () => {
    state.editingTaskId = null;
    modalTitle.textContent = "Add Task";
    taskForm.reset();
    clearFormErrors();
    openModal(taskModal);
    (taskForm.elements.namedItem("task") as HTMLInputElement).focus();
  });

  // ── Close / Cancel modal ─────────────────────────────────────
  const closetaskModal = (): void => {
    closeModal(taskModal);
    state.editingTaskId = null;
    taskForm.reset();
    clearFormErrors();
  };

  btnModalClose.addEventListener("click", closetaskModal);
  btnCancel.addEventListener("click",     closetaskModal);

  // Close on backdrop click
  taskModal.addEventListener("click", (e) => {
    if (e.target === taskModal) closetaskModal();
  });

  // ── Form submit: Add or Edit ──────────────────────────────────
  taskForm.addEventListener("submit", (e) => {
    e.preventDefault();
    clearFormErrors();

    const values    = extractFormValues(taskForm);
    const { valid, errors } = validateTaskForm(values);

    if (!valid) {
      showFormErrors(errors as Partial<Record<ValidatedField, string>>);
      return;
    }

    if (state.editingTaskId !== null) {
      // Edit existing task
      const idx = state.tasks.findIndex((t) => t.id === state.editingTaskId);
      if (idx !== -1) {
        state.tasks[idx] = mergeTask(state.tasks[idx]!, {
          task:     values.task.trim(),
          dueDate:  values.dueDate,
          priority: values.priority as Task["priority"],
          notes:    values.notes.trim(),
          status:   values.status as Task["status"],
        });
      }
    } else {
      // Add new task
      const newTask = buildTask(values);
      state.tasks = [...state.tasks, newTask];
    }

    closetaskModal();
    refresh();
  });

  // ── Table body: edit & delete via event delegation ───────────
  tbody.addEventListener("click", (e) => {
    const btn = (e.target as HTMLElement).closest<HTMLButtonElement>("[data-action]");
    if (!btn) return;

    const { action, id } = btn.dataset as { action: string; id: string };

    if (action === "edit") {
      const task = state.tasks.find((t) => t.id === id);
      if (!task) return;

      state.editingTaskId = id;
      modalTitle.textContent = "Edit Task";
      taskForm.reset();
      clearFormErrors();
      populateForm(task);
      openModal(taskModal);
      (taskForm.elements.namedItem("task") as HTMLInputElement).focus();
    }

    if (action === "delete") {
      const task = state.tasks.find((t) => t.id === id);
      if (!task) return;

      pendingDeleteId = id;
      confirmTaskName.textContent = task.task;
      openModal(confirmModal);
    }
  });

  // ── Confirm Delete: cancel ────────────────────────────────────
  confirmCancelBtn.addEventListener("click", () => {
    pendingDeleteId = null;
    closeModal(confirmModal);
  });

  confirmModal.addEventListener("click", (e) => {
    if (e.target === confirmModal) {
      pendingDeleteId = null;
      closeModal(confirmModal);
    }
  });

  // ── Confirm Delete: confirm ───────────────────────────────────
  confirmDeleteBtn.addEventListener("click", () => {
    if (pendingDeleteId !== null) {
      state.tasks = state.tasks.filter((t) => t.id !== pendingDeleteId);
      pendingDeleteId = null;
      closeModal(confirmModal);
      refresh();
    }
  });

  // ── Keyboard: Escape closes any open modal ────────────────────
  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    if (!taskModal.hidden)   closetaskModal();
    if (!confirmModal.hidden) {
      pendingDeleteId = null;
      closeModal(confirmModal);
    }
  });
};
