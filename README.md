# TaskMinder – Task Management App

TaskMinder is a modern, collaborative task management web application built with React, TypeScript, and a rich set of UI libraries. It supports real-time collaboration, customizable themes, notifications, and advanced user management.

---

## Features

- **User Authentication**
  - Email/password login & registration
  - Google OAuth sign-in
  - Password reset and confirmation
- **Boards, Lists, and Tasks**
  - Create multiple boards, each with customizable lists and tasks
  - Drag & drop tasks between lists (DND-Kit & SortableJS)
  - Task priorities, due dates, and user assignment
  - Real-time updates via WebSockets
- **User & Member Management**
  - Invite users to boards, set roles (owner, admin, member)
  - Edit board names, remove users, leave boards
- **Customizable Themes**
  - Multiple built-in dark/light themes
  - Full custom theme editor (colors, backgrounds)
  - Per-board background images (with permissions)
- **Notifications**
  - In-app and push notifications for board events, invitations, reminders
  - Mark as read, delete single/all notifications
- **Calendar View**
  - Yearly calendar with task due date highlights
  - View all tasks due on a selected day
- **Profile & Settings**
  - Update profile info, profile picture (upload or avatar)
  - Change password (with validation)
  - Delete account (with confirmation)
  - Language selection (English/Georgian)
- **Templates**
  - Create new boards from pre-defined templates

---

## Tech Stack

- **Frontend:** React, TypeScript, Vite
- **UI Libraries:** Material-UI, Ant Design, React Icons, React Loading Skeleton, React Spinners
- **State & Routing:** React Hooks, React Router
- **Drag & Drop:** DND-Kit, SortableJS
- **Networking:** Axios, WebSockets
- **Other:** Service Workers for push notifications

---

## Getting Started

### Prerequisites

- Node.js (v16+ recommended)
- npm or yarn

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/taskminder.git
   cd taskminder
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment Variables:**
   - Copy `.env.example` to `.env` and set your API base URL and Google OAuth client ID.

4. **Start the development server:**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open in your browser:**
   ```
   http://localhost:5173
   ```

---

## Project Structure

```
src/
  ├── auth/                # Authentication (login, register, Google, password reset)
  ├── components/
  │     ├── Boards/        # Board, List, Task, DnD, Members, Skeletons, etc.
  │     ├── settings/      # Profile, Theme, Password, DeleteAccount
  │     ├── Calendar.tsx
  │     ├── Templates.tsx
  │     ├── Notification.tsx
  │     ├── MainPage.tsx
  │     ├── SideBar.tsx
  │     ├── Settings.tsx
  │     └── ErrorPage.tsx
  ├── header/              # Header bar with theme/language/profile
  ├── utils/               # Theme, API, avatars, interfaces, etc.
  ├── styles/              # CSS filesmarkdow
  └── App.tsx              # Main app entry
```

---

## Customization

- **Themes:** Change theme from the header or create your own in Settings.
- **Languages:** Switch between English and Georgian from the header.
- **Board Backgrounds:** Owners/admins can set custom images per board.

---



## Credits

- Built with [React](https://react.dev/), [Vite](https://vite.dev/), [Material-UI](https://mui.com/), [Ant Design](https://ant.design/), [DND-Kit](https://dndkit.com/), [SortableJS](https://sortablejs.github.io/Sortable/), and more.
- Icons by [React Icons](https://react-icons.github.io/react-icons/).

---

## Screenshots

![Board View](./src/assets/screen_text.png)

---
