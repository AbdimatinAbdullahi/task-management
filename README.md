# 🧠 Productivity Collaboration Tool (ClickUp-Inspired)

A modern, scalable productivity and collaboration platform inspired by tools like **ClickUp**, **Notion**, and **Slack** — built with full-stack technologies, role-based access control, real-time collaboration, and multi-workspace support.

---

## 📌 Features Implemented So Far

### 1. 🔐 Authentication & Security

- **Email/Password login system** using JWT
- **Email verification system** to activate accounts
- **Password reset flow** for forgotten passwords
- Role-based access control per **workspace**
- Future support planned for **OAuth (Google, GitHub)**

#### 🧠 Why PostgreSQL for Auth?
Postgres was chosen for authentication and user/role management because of its:
- Strong relational integrity
- Advanced querying for roles and permissions
- Scalability with JOIN-heavy logic (e.g., users ↔ workspaces ↔ roles)

---

### 2. 🗂️ Workspace & Project System

- Users can belong to **multiple workspaces** (companies/teams)
- Each workspace can have multiple **projects**
- Projects contain tasks managed in a **Kanban board**
- Workspace members have specific **roles**: `owner`, `admin`, `member`, `viewer`

---

### 3. ✅ Kanban Board + Task Management

- **Drag-and-drop** interface (Trello-style)
- Tasks have statuses, due dates, assignees
- **Create / update / delete** tasks with real-time updates
- Used **MongoDB** for task data because:
  - Schema flexibility for task metadata
  - Easier to store nested subtasks/comments in the future
- Projects & workspace structure are stored in **PostgreSQL** for relational integrity

---

### 4. 📩 Inviting & Managing Users (In Progress)

- Users can be **invited by email** to workspaces
- Role assignment upon invite (e.g. `admin`, `member`)
- Working on architectural refinement for:
  - Invite logic
  - Role validation on actions
  - Access-based rendering

---

### 5. 🔁 Real-Time Task Updates (Slack-Like UI)

- **Live UI refresh** when:
  - Task is updated
  - Task is deleted
  - Task changes column/status
- Simulates **Slack-style** collaborative feedback experience
- Will extend to include real-time notifications/messages

---

## 🛠️ Tech Stack

| Area                    | Tech Used                          |
|-------------------------|------------------------------------|
| Backend API             | Node.js + Express                  |
| Authentication          | JWT, Bcrypt, Nodemailer            |
| Database (Users, Auth)  | PostgreSQL                         |
| Database (Tasks)        | MongoDB                            |
| Frontend                | React (Kanban board)               |
| Real-time UI            | WebSockets / Socket.IO (planned)   |

---

## 🧱 Planned Architecture Improvements

- Invite code or email-based workspace invites
- Project-level permissions (in addition to workspace roles)
- Real-time collaborative editing
- OAuth integration (Google/GitHub)
- Notifications system

---

## 🧑‍💻 Current Status

- [x] Email/password auth with verification + reset
- [x] Workspace & project data models
- [x] Role-based access per workspace
- [x] Kanban board working (CRUD + drag/drop)
- [ ] Invite system (WIP — refining architecture)
- [x] Live UI updates on task changes
- [ ] OAuth, project-specific permissions, messaging, and more...

---


## 🙌 Author

Built by [**YOU**] — a software engineering student growing fast 🚀 and building serious tools from scratch.
#Planned finished Day: 26th April, 2025
