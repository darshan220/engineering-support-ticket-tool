import { create } from "zustand";
import type { Ticket, Notification, TicketStatus } from "@/types";
import { tickets as initialTickets, notifications as initialNotifications } from "@/data/mock-data";

interface AppState {
  // Theme
  theme: "light" | "dark";
  toggleTheme: () => void;
  setTheme: (theme: "light" | "dark") => void;

  // Sidebar
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;

  // Tickets
  tickets: Ticket[];
  moveTicket: (ticketId: string, newStatus: TicketStatus) => void;
  addTicket: (ticket: Ticket) => void;
  updateTicket: (ticketId: string, updates: Partial<Ticket>) => void;

  // Selected ticket
  selectedTicketId: string | null;
  setSelectedTicketId: (id: string | null) => void;

  // Notifications
  notifications: Notification[];
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;

  // Modals
  isCreateTicketOpen: boolean;
  setCreateTicketOpen: (open: boolean) => void;
  editingTicketId: string | null;
  setEditingTicketId: (id: string | null) => void;

  // Search
  globalSearchQuery: string;
  setGlobalSearchQuery: (query: string) => void;

  // Auth
  isAuthenticated: boolean;
  user: {
    email: string;
    name: string;
    role: string;
    avatar?: string;
  } | null;
  setAuthenticated: (auth: boolean, user?: { email: string; name: string; role?: string }) => void;
  updateUser: (updates: Partial<{ name: string; avatar: string; role: string }>) => void;
}

export const useAppStore = create<AppState>((set) => ({
  // Theme - default dark
  theme: "dark",
  toggleTheme: () =>
    set((state) => {
      const newTheme = state.theme === "dark" ? "light" : "dark";
      document.documentElement.classList.toggle("dark", newTheme === "dark");
      return { theme: newTheme };
    }),
  setTheme: (theme) => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    set({ theme });
  },

  // Sidebar
  sidebarCollapsed: false,
  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),

  // Tickets
  tickets: initialTickets,
  moveTicket: (ticketId, newStatus) =>
    set((state) => ({
      tickets: state.tickets.map((t) =>
        t.id === ticketId ? { ...t, status: newStatus, updatedAt: new Date().toISOString() } : t
      ),
    })),
  addTicket: (ticket) => set((state) => ({ tickets: [ticket, ...state.tickets] })),
  updateTicket: (ticketId, updates) =>
    set((state) => ({
      tickets: state.tickets.map((t) =>
        t.id === ticketId ? { ...t, ...updates, updatedAt: new Date().toISOString() } : t
      ),
    })),

  // Selected ticket
  selectedTicketId: null,
  setSelectedTicketId: (id) => set({ selectedTicketId: id }),

  // Notifications
  notifications: initialNotifications,
  markNotificationRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
    })),
  markAllNotificationsRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
    })),

  // Modals
  isCreateTicketOpen: false,
  setCreateTicketOpen: (open) => set({ isCreateTicketOpen: open }),
  editingTicketId: null,
  setEditingTicketId: (id) => set({ editingTicketId: id }),

  // Search
  globalSearchQuery: "",
  setGlobalSearchQuery: (query) => set({ globalSearchQuery: query }),

  // Auth
  isAuthenticated: false,
  user: null,
  setAuthenticated: (auth, user) => set({ 
    isAuthenticated: auth,
    user: user ? { 
      ...user, 
      role: user.role || "Staff Engineer",
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}` 
    } : null 
  }),
  updateUser: (updates) => set((state) => ({
    user: state.user 
      ? { ...state.user, ...updates } 
      : { 
          email: "guest@devticketflow.io", 
          name: updates.name || "Guest", 
          role: updates.role || "Staff Engineer",
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${updates.name || "Guest"}`
        }
  })),
}));
