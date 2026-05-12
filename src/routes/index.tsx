import { createBrowserRouter, Navigate } from "react-router-dom";
import AppLayout from "@/components/layout/AppLayout";
import SignIn from "@/features/auth/SignIn";
import SignUp from "@/features/auth/SignUp";
import ForgotPassword from "@/features/auth/ForgotPassword";
import Dashboard from "@/components/dashboard/Dashboard";
import KanbanBoard from "@/components/board/KanbanBoard";
import MyTickets from "@/features/tickets/MyTickets";
import Assigned from "@/features/tickets/Assigned";
import Analytics from "@/components/analytics/Analytics";
import Teams from "@/features/teams/Teams";
import Inbox from "@/features/notifications/Inbox";
import Settings from "@/features/settings/Settings";

export const router = createBrowserRouter([
  {
    path: "/signin",
    element: <SignIn />,
  },
  {
    path: "/signup",
    element: <SignUp />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
  },
  {
    path: "/",
    element: <AppLayout />,
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: "dashboard", element: <Dashboard /> },
      { path: "board", element: <KanbanBoard /> },
      { path: "my-tickets", element: <MyTickets /> },
      { path: "assigned", element: <Assigned /> },
      { path: "inbox", element: <Inbox /> },
      { path: "analytics", element: <Analytics /> },
      { path: "teams", element: <Teams /> },
      { path: "settings", element: <Settings /> },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/signin" replace />,
  },
]);
