# NexusOps — Engineering Operations Platform

An enterprise-grade engineering support ticket management platform built with React, TypeScript, and modern web technologies. Designed to feel like a premium internal tool similar to Jira, Linear, and Notion.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 🛠 Tech Stack

| Technology | Purpose |
|---|---|
| React 19 + TypeScript | Core framework |
| Vite 8 | Build tool |
| Tailwind CSS v4 | Styling |
| Radix UI | Accessible primitives |
| React Router v7 | Routing |
| TanStack Query | Server state |
| Zustand | Client state |
| React Hook Form + Zod | Form validation |
| dnd-kit | Kanban drag & drop |
| Recharts | Analytics charts |
| Framer Motion | Animations |
| Lucide React | Icons |

## 📁 Project Structure

```
src/
├── components/
│   ├── layout/          # Sidebar, Topbar, AppLayout
│   ├── ui/              # Button, Card, Badge, Dialog, etc.
│   ├── board/           # KanbanBoard, KanbanColumn, TicketCard
│   ├── ticket/          # TicketDetailDrawer, CreateTicketModal
│   ├── dashboard/       # Dashboard with metrics & charts
│   └── analytics/       # Analytics page with 6 charts
├── features/
│   ├── auth/            # SignIn, SignUp, ForgotPassword
│   ├── tickets/         # MyTickets, Assigned
│   ├── teams/           # Teams page
│   └── settings/        # Settings with tabs
├── hooks/               # Custom hooks
├── lib/                 # Utilities (cn, formatDate, etc.)
├── store/               # Zustand store
├── routes/              # React Router config
├── types/               # TypeScript interfaces
├── data/                # Mock data
└── utils/               # Helper utilities
```

## ✨ Key Features

- **🔐 Premium Authentication** — Two-column sign-in, sign-up with password strength, forgot password
- **📊 Executive Dashboard** — 6 metric cards, 4 charts, activity feed, deadlines
- **📋 Kanban Board** — 7-column board with drag & drop, search, filtering
- **📝 Ticket Detail Drawer** — Activity timeline, comments, metadata panel
- **➕ Create Ticket Modal** — Validated forms, type/priority selectors, labels
- **👤 My Tickets** — Personal stats and due soon alerts
- **📌 Assigned** — Team workload grid, allocation heatmap
- **📈 Analytics** — 6 charts covering trends, SLA, resolution time, leaderboard
- **👥 Teams** — Team cards with velocity, member performance table
- **⚙️ Settings** — Profile, appearance, notifications, security tabs
- **🔔 Notifications** — Real-time dropdown with categories and read states
- **🎨 Theme System** — Dark (default) & Light with smooth transitions
- **📱 Responsive** — Desktop, tablet, mobile with collapsible sidebar
- **♿ Accessible** — Keyboard nav, ARIA labels, focus states

## 📄 License

MIT
