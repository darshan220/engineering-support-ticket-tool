import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Bell,
  Sun,
  Moon,
  Plus,
  Menu,
  ChevronRight,
  AlertTriangle,
  Info,
  XCircle,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAppStore } from "@/store";
import { cn, getInitials, formatRelativeTime } from "@/lib/utils";
import logo from "@/assets/logo.png";

const routeLabels: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/board": "Board",
  "/my-tickets": "My Tickets",
  "/assigned": "Assigned",
  "/analytics": "Analytics",
  "/teams": "Teams",
  "/inbox": "Inbox",
  "/settings": "Settings",
};

const Topbar = () => {
  const location = useLocation();
  const {
    theme,
    toggleTheme,
    toggleSidebar,
    setCreateTicketOpen,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    user,
    setAuthenticated,
  } = useAppStore();
  const navigate = useNavigate();
  const [searchOpen, setSearchOpen] = useState(false);

  const handleLogout = () => {
    setAuthenticated(false);
    navigate("/signin");
  };

  const unreadCount = notifications.filter((n) => !n.read).length;
  const pageTitle = routeLabels[location.pathname] || "Dashboard";

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "critical":
        return <XCircle className="h-4 w-4 text-red-400" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-amber-400" />;
      case "success":
        return <CheckCircle2 className="h-4 w-4 text-emerald-400" />;
      default:
        return <Info className="h-4 w-4 text-blue-400" />;
    }
  };

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-border bg-background/80 backdrop-blur-xl px-4 lg:px-6">
      {/* Left */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={toggleSidebar}
          aria-label="Toggle sidebar"
        >
          <Menu className="h-5 w-5" />
        </Button>

        <div className="hidden sm:flex items-center gap-2 text-sm">
          <img src={logo} alt="Dev Ticket Flow" className="h-6 w-6 object-contain" />
          <span className="text-muted-foreground font-semibold">Dev Ticket Flow</span>
          <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="font-medium text-foreground">{pageTitle}</span>
        </div>
        <h2 className="text-lg font-semibold sm:hidden">{pageTitle}</h2>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">
        {/* Search */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 280, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <Input
                placeholder="Search tickets, teams..."
                className="h-9"
                autoFocus
                onBlur={() => setSearchOpen(false)}
                aria-label="Global search"
              />
            </motion.div>
          )}
        </AnimatePresence>

        {!searchOpen && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSearchOpen(true)}
            aria-label="Open search"
            className="h-9 w-9"
          >
            <Search className="h-4 w-4" />
          </Button>
        )}

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="relative h-9 w-9"
              aria-label="Notifications"
            >
              <Bell className="h-4 w-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-white">
                  {unreadCount}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-96">
            <div className="flex items-center justify-between px-3 py-2">
              <DropdownMenuLabel className="p-0">
                Notifications
              </DropdownMenuLabel>
              {unreadCount > 0 && (
                <button
                  onClick={markAllNotificationsRead}
                  className="text-xs text-primary hover:underline cursor-pointer"
                  aria-label="Mark all notifications as read"
                  tabIndex={0}
                >
                  Mark all read
                </button>
              )}
            </div>
            <DropdownMenuSeparator />
            <ScrollArea className="h-80">
              {notifications.map((notification) => (
                <DropdownMenuItem
                  key={notification.id}
                  className={cn(
                    "flex items-start gap-3 p-3 cursor-pointer",
                    !notification.read && "bg-primary/5",
                  )}
                  onClick={() => markNotificationRead(notification.id)}
                >
                  <div className="mt-0.5 shrink-0">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 space-y-1">
                    <p
                      className={cn(
                        "text-sm",
                        !notification.read && "font-medium",
                      )}
                    >
                      {notification.title}
                    </p>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {notification.message}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatRelativeTime(notification.timestamp)}
                    </p>
                  </div>
                  {!notification.read && (
                    <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" />
                  )}
                </DropdownMenuItem>
              ))}
            </ScrollArea>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Theme toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          className="h-9 w-9"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={theme}
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 10, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </motion.div>
          </AnimatePresence>
        </Button>

        {/* Create Ticket */}
        <Button
          onClick={() => setCreateTicketOpen(true)}
          className="hidden sm:flex gap-1.5 h-9 px-4 shadow-[0_8px_20px_rgba(22,193,93,0.25)]"
          aria-label="Create new ticket"
        >
          <Plus className="h-4 w-4" />
          <span className="text-sm">Create</span>
        </Button>

        <Button
          onClick={() => setCreateTicketOpen(true)}
          size="icon"
          className="sm:hidden h-9 w-9"
          aria-label="Create new ticket"
        >
          <Plus className="h-4 w-4" />
        </Button>

        {/* User menu */}
        <Separator orientation="vertical" className="h-6 hidden sm:block" />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="flex items-center gap-2 cursor-pointer outline-none"
              aria-label="User menu"
              tabIndex={0}
            >
              <Avatar className="h-8 w-8">
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
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="font-medium">{user?.name || "Guest"}</p>
                <p className="text-xs text-muted-foreground font-normal">
                  {user?.role || "Staff Engineer"}
                </p>
                <p className="text-[10px] text-muted-foreground font-normal opacity-70">
                  {user?.email || "guest@nexusops.io"}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate("/settings")} className="cursor-pointer">
              Profile Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className="text-destructive cursor-pointer"
              onClick={handleLogout}
            >
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Topbar;
