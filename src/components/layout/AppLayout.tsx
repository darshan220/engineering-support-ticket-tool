import { Outlet } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { useAppStore } from "@/store";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import CreateTicketModal from "../ticket/CreateTicketModal";

const AppLayout = () => {
  const { sidebarCollapsed, toggleSidebar } = useAppStore();

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />

      {/* Sidebar Toggle Button - Desktop */}
      <button
        onClick={toggleSidebar}
        className={cn(
          "fixed top-6 z-[60] hidden h-6 w-6 items-center justify-center rounded-full border border-border bg-card shadow-lg transition-all duration-300 hover:bg-accent lg:flex",
          sidebarCollapsed ? "left-[60px]" : "left-[248px]",
        )}
        aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {sidebarCollapsed ? (
          <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
        ) : (
          <ChevronLeft className="h-3.5 w-3.5 text-muted-foreground" />
        )}
      </button>

      <div
        className={cn(
          "flex flex-1 flex-col transition-all duration-200 min-w-0",
          sidebarCollapsed ? "lg:ml-[72px]" : "lg:ml-[260px]",
        )}
      >
        <Topbar />
        <main className="flex-1 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="h-full"
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
      <CreateTicketModal />
    </div>
  );
};

export default AppLayout;
