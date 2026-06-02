// ============================================================
//  src/dom/renderSummary.ts
//  Reads a TaskSummary object and pushes values into the five
//  summary cards rendered in index.html.
// ============================================================

import type { TaskSummary } from "../types/task";

// ── Element references (queried once, reused on every render) ─
const elTotal      = document.querySelector<HTMLElement>("#total-tasks")!;
const elDueToday   = document.querySelector<HTMLElement>("#due-today")!;
const elPending    = document.querySelector<HTMLElement>("#total-pending")!;
const elOverdue    = document.querySelector<HTMLElement>("#overdue")!;
const elTodaysDate = document.querySelector<HTMLElement>("#todays-date")!;

// ── Animate a numeric value change with a quick pop ──────────
const animatePop = (el: HTMLElement): void => {
  el.classList.remove("pop");
  // Force reflow so the animation restarts if called rapidly
  void el.offsetWidth;
  el.classList.add("pop");
};

// ── Main render function ──────────────────────────────────────
export const renderSummary = (summary: TaskSummary): void => {
  const updates: [HTMLElement, string][] = [
    [elTotal,      String(summary.total)],
    [elDueToday,   String(summary.dueToday)],
    [elPending,    String(summary.pending)],
    [elOverdue,    String(summary.overdue)],
    [elTodaysDate, summary.todaysDate],
  ];

  updates.forEach(([el, value]) => {
    if (el.textContent !== value) {
      el.textContent = value;
      animatePop(el);
    }
  });
};
