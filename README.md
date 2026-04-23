# Lumina — Task Manager

A beautifully crafted, fully client-side task management web application built with vanilla HTML, CSS, and JavaScript. **Lumina** features a collapsible sidebar, modal-based task creation, priority levels, date/time scheduling, live completion tracking via an SVG ring, and toast notifications — all wrapped in an elegant ambient UI. Built as **Task 04** of the SkillCraft Technology Web Development Internship.

---

## Features

### Task Management
- **Create tasks** via a clean modal form — with title, optional note, date, time, and priority
- **Complete tasks** — mark any task as done with a single click; completed tasks are visually distinguished
- **Delete tasks** — remove individual tasks with a confirmation-safe delete action
- **Edit tasks** — reopen any task in the modal to update its details
- **Persistent state** — tasks survive page refreshes via `localStorage`

### Filtering & Navigation
- **All Tasks** — view the full task list
- **Pending** — filter to see only incomplete tasks
- **Completed** — filter to see only finished tasks
- Live **badge counts** on each filter button update dynamically as tasks change

### Progress Tracking
- **SVG ring indicator** in the sidebar shows the percentage of tasks completed
- **Percentage label** (`% done`) updates live as you complete or add tasks
- **Stat subtitle** displays a contextual summary (e.g. "3 of 7 done")

### Task Details
- **Title** — required field for the task name
- **Note** — optional free-text description
- **Date & Time** — schedule tasks with a date and time picker
- **Priority** — choose from Low, Medium, or High; each renders with a distinct colour chip on the task card

### UX & Visual Design
- **Collapsible sidebar** — toggle open/closed with an animated arrow button or the hamburger menu
- **Modal overlay** — accessible dialog for creating and editing tasks (`aria-modal`, `aria-label`)
- **Toast notifications** — brief confirmation messages appear on save, delete, and other actions
- **Empty state** — a friendly prompt shown when the task list is empty
- **Ambient background** — three drifting gradient orbs with a film-grain noise overlay
- **Google Fonts** — Cormorant Garamond (headings) + DM Sans (body)

---

## Tech Stack

| Technology | Purpose |
|---|---|
| HTML5 | Semantic page structure, modal, sidebar, form elements |
| CSS3 | Layout, ambient orbs, grain overlay, sidebar animation, priority chips |
| JavaScript (ES6+) | Task CRUD, filtering, localStorage, SVG ring update, toast system |
| SVG | Circular completion progress ring in the sidebar |
| localStorage | Client-side persistence across browser sessions |
| Google Fonts | Cormorant Garamond & DM Sans typefaces |

---

## Project Structure

```
SCT_WD_4/
├── index.html    # Full app layout — sidebar, main content, modal, toast
├── style.css     # All styles — ambient theme, sidebar, task cards, modal, responsive layout
└── app.js        # App logic — task CRUD, filtering, localStorage, ring animation, toasts
```

---

## UI Sections

| Element | Description |
|---|---|
| **Sidebar** | Logo, filter nav with badge counts, SVG completion ring, collapse toggle |
| **Header** | Dynamic filter title, current date, and "New Task" button |
| **Task List** | Scrollable list of task cards with title, note, date/time, priority badge, and action buttons |
| **Empty State** | Decorative prompt shown when no tasks match the current filter |
| **Modal** | Accessible dialog for creating and editing tasks with all fields |
| **Toast** | Transient notification bar for user feedback |

---

## Getting Started

No build tools or dependencies required. Just open in a browser:

```bash
# Clone the repository
git clone https://github.com/krutikakolkur/SCT_WD_4.git

# Navigate into the project folder
cd SCT_WD_4

# Open in browser
open index.html
```

Or simply double-click `index.html` to run it locally.

---

## How to Use

1. Click **New Task** to open the task creation modal
2. Fill in a title, optional note, date/time, and choose a priority level
3. Click **Save Task** — the task appears in the list and the sidebar stats update
4. Click the **check** on a task card to mark it as complete
5. Use the sidebar nav to switch between **All**, **Pending**, and **Completed** views
6. Click the **edit** icon on any card to reopen the modal and update the task
7. Click the **delete** icon to remove a task; a toast confirms the action
8. Toggle the sidebar open or closed using the **‹** arrow or the **☰** hamburger button

---

## Internship Context

This project was built as **Task 04** of the **SkillCraft Technology Web Development Internship (SCT_WD)**. The task objective was to develop a personal portfolio website — demonstrating skills in layout, interactivity, and data persistence through a polished, real-world-quality web application.

