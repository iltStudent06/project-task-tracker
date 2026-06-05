# Project Task Tracker

A responsive, fully client-side web application built with Vite and vanilla TypeScript for organizing, monitoring, and managing tasks involved in completing a project. It allows users to create, edit, delete, filter, sort, and search tasks.

---

## Features

- **Add, edit, and delete tasks** via a clean modal form
- **Sort** by Task Name, Due Date, Priority, or Status
- **Filter** by Status and Priority
- **Search** tasks by name or notes
- **Summary cards** — Total Tasks, Due Today, Total Pending, Overdue, Today's Date
- **Overdue row highlighting** — overdue tasks are visually flagged in red
- **Completed row styling** — completed tasks are struck through
- **Priority badges** — color-coded High / Medium / Low
- **Status badges** — color-coded Not Started / In Progress / Completed
- **Delete confirmation modal** — prevents accidental deletion
- **Form validation** — required fields, max length, type guards
- **Keyboard accessible** — Escape key closes any open modal
- **Responsive design** — adapts to mobile, tablet, and desktop
- **XSS protection** — all user input is HTML-escaped before rendering

---

## Tech Stack

| Tool                                          | Version | Purpose                                |
| --------------------------------------------- | ------- | -------------------------------------- |
| [Vite](https://vitejs.dev/)                   | 5.x     | Build tool & dev server                |
| [TypeScript](https://www.typescriptlang.org/) | 5.x     | Type-safe application logic            |
| HTML5                                         | —       | Semantic markup                        |
| CSS3                                          | —       | Styling, animations, responsive layout |

---

## Project Structure

```
project-task-tracker/
├── index.html                  # App shell & modal markup
├── vite.config.ts              # Vite configuration
├── tsconfig.json               # TypeScript configuration (strict mode)
├── package.json                # Project metadata & scripts
└── src/
    ├── main.ts                 # Entry point
    ├── vite-env.d.ts           # Vite client type declarations
    ├── styles/
    │   └── main.css            # All styles (layout, components)
    ├── types/
    │   └── task.ts             # Interfaces, type aliases & union types
    ├── data/
    │   └── tasks.ts            # Test data (8 tasks relative to today's date)
    ├── utils/
    │   └── taskUtils.ts        # Pure functions — sort, filter, validate, compute
    └── dom/
        ├── renderSummary.ts    # Updates the 5 summary cards
        ├── renderTable.ts      # Builds table rows + renderAll() master refresh
        └── eventHandlers.ts    # All event listeners in one place
```

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- [npm](https://www.npmjs.com/) v9 or higher
- [VS Code](https://code.visualstudio.com/)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/iltStudent06/project-task-tracker

# 2. Navigate into the project folder
cd project-task-tracker

# 3. Install dependencies
npm install
```

### Running the Dev Server

```bash
npm run dev
```

Open your browser at **http://localhost:5173**

### Production Build

```bash
npm run build
```

Output is placed in the `dist/` folder.

### Preview the Production Build

```bash
npm run preview
```

---

## Usage Guide

### Adding a Task

1. Click the **+ Add Task** button
2. Fill in Task Name, Due Date, Priority, and Status (all required)
3. Optionally add Notes
4. Click **Save Task**

### Editing a Task

1. Click Edit on any row
2. Update the fields in the modal
3. Click **Save Task**

### Deleting a Task

1. Click Delete on any row
2. Confirm the deletion in the dialog

### Filtering Tasks

- Use the **Status** dropdown to filter by Not Started / In Progress / Completed
- Use the **Priority** dropdown to filter by High / Medium / Low
- Use the **Search** box to search by task name or notes

### Sorting Tasks

- Click any column header (**TASK**, **DATE DUE**, **PRIORITY**, **STATUS**) to sort
- Click again to reverse the sort direction

---

## Scripts

| Script     | Command             | Description                               |
| ---------- | ------------------- | ----------------------------------------- |
| Dev server | `npm run dev`       | Start Vite dev server at localhost:5173   |
| Build      | `npm run build`     | Type-check with tsc then bundle with Vite |
| Preview    | `npm run preview`   | Preview the production build locally      |
| Type check | `npm run typecheck` | Run tsc without emitting files            |

---

## Possible Future Enhancements

- [ ] Persist tasks to `localStorage` so data survives page refresh
- [ ] Drag-and-drop row reordering
- [ ] Due date reminder notifications (Web Notifications API)
- [ ] CSV export of task list
