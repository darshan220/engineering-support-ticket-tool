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
  Inbox,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import logo from "@/assets/logo.png";
import { getInitials } from "@/lib/utils";

const navItems = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/board", icon: Kanban, label: "Board" },
  { to: "/my-tickets", icon: Ticket, label: "My Tickets" },
  { to: "/inbox", icon: Inbox, label: "Inbox", badge: 3 },
  { to: "/teams", icon: Users, label: "Teams" },
  { to: "/analytics", icon: BarChart3, label: "Analytics" },
  { to: "/settings", icon: Settings, label: "Settings" },
];

const Sidebar = () => {
  const { sidebarCollapsed, toggleSidebar, setCreateTicketOpen, user } =
    useAppStore();
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
          sidebarCollapsed && "max-lg:-translate-x-full",
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center gap-3 px-4 shrink-0">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center">
            <img
              src={logo}
              alt="Dev Ticket Flow"
              className="h-9 w-9 object-contain"
            />
          </div>
          <AnimatePresence>
            {!sidebarCollapsed && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                className="overflow-hidden flex-1 flex items-center justify-between ml-1"
              >
                <h1 className="text-xl font-bold tracking-tight whitespace-nowrap">
                  Dev Ticket Flow
                </h1>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <nav
          className="flex-1 space-y-1 p-2 overflow-y-auto"
          aria-label="Main navigation"
        >
          {navItems.map((item) => {
            const isActive =
              location.pathname === item.to ||
              location.pathname.startsWith(item.to + "/");
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={cn(
                  "group relative flex items-center gap-3 rounded-2xl mx-1 px-4 py-3 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-primary/20 text-primary shadow-sm"
                    : "text-sidebar-foreground/60 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground",
                )}
                aria-label={item.label}
                tabIndex={0}
              >
                <item.icon
                  className={cn(
                    "h-5 w-5 shrink-0 transition-colors",
                    isActive
                      ? "text-primary"
                      : "group-hover:text-sidebar-foreground",
                  )}
                />

                <AnimatePresence>
                  {!sidebarCollapsed && (
                    <motion.div
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "auto" }}
                      exit={{ opacity: 0, width: 0 }}
                      className="flex-1 flex items-center justify-between overflow-hidden"
                    >
                      <span className="whitespace-nowrap">{item.label}</span>
                      {item.badge && (
                        <span className="h-5 w-5 rounded-full bg-primary text-white text-[10px] flex items-center justify-center font-bold">
                          {item.badge}
                        </span>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </NavLink>
            );
          })}
        </nav>

        <Separator />

        {/* User section */}
        <div className="p-3">
          <div
            className={cn(
              "flex items-center gap-3 rounded-xl p-2",
              !sidebarCollapsed && "pr-3",
            )}
          >
            <Avatar className="h-8 w-8 shrink-0">
              {user?.avatar && (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="h-full w-full object-cover"
                />
              )}
              <AvatarFallback className="text-[10px]">
                {getInitials(user?.name || "Guest")}
              </AvatarFallback>
            </Avatar>
            <AnimatePresence>
              {!sidebarCollapsed && (
                <motion.div
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  className="flex-1 overflow-hidden"
                >
                  <p className="text-sm font-medium truncate">
                    {user?.name || "Guest"}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    Staff Engineer
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;
