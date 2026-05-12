import { NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Kanban,
  Ticket,
  Users,
  BarChart3,
  Settings,
  UserCircle,
  ChevronLeft,
  LogOut,
  Zap,
  ClipboardList,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { currentUser } from "@/data/mock-data";
import { getInitials } from "@/lib/utils";

const navItems = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/board", icon: Kanban, label: "Board" },
  { to: "/my-tickets", icon: Ticket, label: "My Tickets" },
  { to: "/assigned", icon: ClipboardList, label: "Assigned" },
  { to: "/analytics", icon: BarChart3, label: "Analytics" },
  { to: "/teams", icon: Users, label: "Teams" },
  { to: "/settings", icon: Settings, label: "Settings" },
];

const Sidebar = () => {
  const { sidebarCollapsed, toggleSidebar } = useAppStore();
  const location = useLocation();

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {!sidebarCollapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-30 bg-black/50 lg:hidden"
            onClick={toggleSidebar}
            aria-label="Close sidebar"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Escape" && toggleSidebar()}
          />
        )}
      </AnimatePresence>

      <motion.aside
        initial={false}
        animate={{ width: sidebarCollapsed ? 72 : 260 }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
        className={cn(
          "fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-sidebar-border bg-sidebar-background",
          "max-lg:translate-x-0 max-lg:shadow-2xl",
          sidebarCollapsed && "max-lg:-translate-x-full"
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center gap-3 px-4">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/70 shadow-lg shadow-primary/25">
            <Zap className="h-5 w-5 text-white" />
          </div>
          <AnimatePresence>
            {!sidebarCollapsed && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                className="overflow-hidden"
              >
                <h1 className="text-lg font-bold tracking-tight whitespace-nowrap">
                  NexusOps
                </h1>
                <p className="text-[10px] text-muted-foreground -mt-0.5">Engineering Platform</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <Separator />

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-3 overflow-y-auto" aria-label="Main navigation">
          {navItems.map((item) => {
            const isActive = location.pathname === item.to || location.pathname.startsWith(item.to + "/");
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={cn(
                  "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-sidebar-primary/10 text-sidebar-primary"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                )}
                aria-label={item.label}
                tabIndex={0}
              >
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 rounded-r-full bg-sidebar-primary"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
                <item.icon className={cn("h-5 w-5 shrink-0", isActive && "text-sidebar-primary")} />
                <AnimatePresence>
                  {!sidebarCollapsed && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "auto" }}
                      exit={{ opacity: 0, width: 0 }}
                      className="overflow-hidden whitespace-nowrap"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </NavLink>
            );
          })}
        </nav>

        <Separator />

        {/* User section */}
        <div className="p-3">
          <div className={cn("flex items-center gap-3 rounded-xl p-2", !sidebarCollapsed && "pr-3")}>
            <Avatar className="h-8 w-8 shrink-0">
              <AvatarFallback className="text-[10px]">{getInitials(currentUser.name)}</AvatarFallback>
            </Avatar>
            <AnimatePresence>
              {!sidebarCollapsed && (
                <motion.div
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  className="flex-1 overflow-hidden"
                >
                  <p className="text-sm font-medium truncate">{currentUser.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{currentUser.role}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Collapse toggle */}
        <button
          onClick={toggleSidebar}
          className="absolute -right-3 top-20 flex h-6 w-6 items-center justify-center rounded-full border border-border bg-background shadow-md hover:bg-accent transition-colors cursor-pointer max-lg:hidden"
          aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          tabIndex={0}
        >
          <ChevronLeft
            className={cn("h-3 w-3 transition-transform duration-200", sidebarCollapsed && "rotate-180")}
          />
        </button>
      </motion.aside>
    </>
  );
};

export default Sidebar;
