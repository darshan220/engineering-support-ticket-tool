import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Search, Plus, Download, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AnimatePresence } from "framer-motion";
import { useAppStore } from "@/store";
import { cn, getInitials } from "@/lib/utils";
import { users } from "@/data/mock-data";

import type { Ticket, TicketStatus } from "@/types";
import KanbanColumn from "./KanbanColumn";
import TicketCard from "./TicketCard";
import TicketDetailDrawer from "../ticket/TicketDetailDrawer";

const COLUMNS: { id: TicketStatus; title: string; color: string }[] = [
  { id: "backlog", title: "Backlog", color: "#64748b" },
  { id: "todo", title: "Todo", color: "#3b82f6" },
  { id: "in-progress", title: "In Progress", color: "#f59e0b" },
  { id: "in-review", title: "In Review", color: "#a855f7" },
  { id: "testing", title: "Testing", color: "#06b6d4" },
  { id: "done", title: "Done", color: "#10b981" },
  { id: "blocked", title: "Blocked", color: "#ef4444" },
];

const KanbanBoard = () => {
  const {
    tickets,
    moveTicket,
    setCreateTicketOpen,
    selectedTicketId,
    setSelectedTicketId,
    theme,
    toggleTheme,
    user,
  } = useAppStore();
  const [activeTicket, setActiveTicket] = useState<Ticket | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [userFilter, setUserFilter] = useState<string>("all");

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor),
  );

  const filteredTickets = useMemo(() => {
    return tickets.filter((t) => {
      const matchesSearch =
        !searchQuery ||
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.ticketId.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesPriority =
        priorityFilter === "all" || t.priority === priorityFilter;
      const matchesUser = userFilter === "all" || t.assignee.id === userFilter;
      return matchesSearch && matchesPriority && matchesUser;
    });
  }, [tickets, searchQuery, priorityFilter, userFilter]);

  const columnTickets = useMemo(() => {
    const grouped: Record<TicketStatus, Ticket[]> = {
      backlog: [],
      todo: [],
      "in-progress": [],
      "in-review": [],
      testing: [],
      done: [],
      blocked: [],
    };
    filteredTickets.forEach((t) => {
      if (grouped[t.status]) grouped[t.status].push(t);
    });
    return grouped;
  }, [filteredTickets]);

  const handleDragStart = (event: DragStartEvent) => {
    const ticket = tickets.find((t) => t.id === event.active.id);
    if (ticket) setActiveTicket(ticket);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTicket(null);

    if (!over) return;

    const ticketId = active.id as string;
    const overId = over.id as string;

    // Check if dropped on a column
    const targetColumn = COLUMNS.find((c) => c.id === overId);
    if (targetColumn) {
      moveTicket(ticketId, targetColumn.id);
      return;
    }

    // Check if dropped on another ticket - move to that ticket's column
    const targetTicket = tickets.find((t) => t.id === overId);
    if (targetTicket) {
      moveTicket(ticketId, targetTicket.status);
    }
  };

  const selectedTicket = selectedTicketId
    ? tickets.find((t) => t.id === selectedTicketId)
    : null;

  return (
    <div className="flex flex-col h-full overflow-hidden min-w-0">
      {/* Board Header */}
      <div className="border-b border-border p-4 lg:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-xl lg:text-2xl font-bold">Board</h1>
            <p className="text-sm text-muted-foreground">
              Sprint 24 · Platform Engineering
            </p>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative flex-1 min-w-[200px] max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search tickets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9"
              aria-label="Search tickets"
            />
          </div>

          <div className="flex items-center gap-1.5">
            {["all", "critical", "high", "medium", "low"].map((p) => (
              <button
                key={p}
                onClick={() => setPriorityFilter(p)}
                className={cn(
                  "px-4 py-1.5 text-xs font-medium rounded-full transition-all border cursor-pointer",
                  priorityFilter === p
                    ? "bg-primary border-primary text-primary-foreground shadow-sm shadow-primary/20"
                    : "bg-secondary/50 border-border/50 text-muted-foreground hover:bg-secondary hover:text-foreground",
                )}
                aria-label={`Filter by ${p} priority`}
                tabIndex={0}
              >
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </button>
            ))}
          </div>

          <Separator
            orientation="vertical"
            className="h-8 mx-2 hidden md:block"
          />

          {/* User Filter - Different Design */}
          <div className="flex items-center -space-x-2 overflow-hidden hover:overflow-visible p-1">
            <button
              onClick={() => setUserFilter("all")}
              className={cn(
                "cursor-pointer relative z-30 flex items-center justify-center h-8 w-8 rounded-full border-2 transition-all hover:z-40 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 bg-background",
                userFilter === "all"
                  ? "border-primary scale-110 shadow-md"
                  : "border-border hover:border-primary/50",
              )}
              aria-label="All Users"
              tabIndex={0}
            >
              <span className="text-[10px] font-bold text-foreground">All</span>
            </button>
            {users.slice(0, 6).map((u, idx) => (
              <button
                key={u.id}
                onClick={() => setUserFilter(u.id)}
                className={cn(
                  "cursor-pointer relative h-8 w-8 rounded-full border transition-all hover:z-40 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                  userFilter === u.id
                    ? "z-40 border-primary scale-110 shadow-md"
                    : "border-background hover:border-primary/50 hover:scale-105",
                  idx === 0 && "z-20",
                  idx === 1 && "z-15",
                  idx === 2 && "z-10",
                  idx === 3 && "z-5",
                )}
                style={{ zIndex: userFilter === u.id ? 40 : 20 - idx }}
                aria-label={`Filter by ${u.name}`}
                tabIndex={0}
              >
                <Avatar className="h-full w-full">
                  <AvatarFallback className="text-[10px] bg-muted font-medium text-foreground">
                    {getInitials(u.name)}
                  </AvatarFallback>
                </Avatar>
                {userFilter === u.id && (
                  <motion.div
                    layoutId="user-active"
                    className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full"
                  />
                )}
              </button>
            ))}
            {users.length > 6 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    className="relative z-0 flex items-center justify-center h-8 w-8 rounded-full border-2 border-background bg-secondary text-secondary-foreground transition-all hover:bg-secondary/80 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                    aria-label="More users"
                  >
                    <Plus className="h-3 w-3" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>Team Members</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <ScrollArea className="h-[200px]">
                    {users.map((u) => (
                      <DropdownMenuItem
                        key={u.id}
                        onClick={() => setUserFilter(u.id)}
                        className={cn(
                          "flex items-center gap-2 cursor-pointer",
                          userFilter === u.id && "bg-accent",
                        )}
                      >
                        <Avatar className="h-6 w-6">
                          <AvatarFallback className="text-[8px] font-medium text-foreground">
                            {getInitials(u.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium">{u.name}</span>
                          <span className="text-[10px] text-muted-foreground">
                            {u.role}
                          </span>
                        </div>
                      </DropdownMenuItem>
                    ))}
                  </ScrollArea>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1 w-full overflow-hidden">
        <div className="h-full px-4 lg:px-8 py-6">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <div className="flex gap-6 pb-4 w-max min-w-full h-full">
              {COLUMNS.map((column) => (
                <KanbanColumn
                  key={column.id}
                  id={column.id}
                  title={column.title}
                  color={column.color}
                  tickets={columnTickets[column.id]}
                  onTicketClick={(id) => setSelectedTicketId(id)}
                />
              ))}
              {/* Spacer for scroll padding */}
              <div className="w-4 shrink-0" />
            </div>

            <DragOverlay>
              {activeTicket && (
                <div className="rotate-3 opacity-90">
                  <TicketCard ticket={activeTicket} isDragging />
                </div>
              )}
            </DragOverlay>
          </DndContext>
        </div>
        <ScrollBar orientation="horizontal" className="z-20" />
      </ScrollArea>

      {/* Ticket Detail Drawer */}
      {selectedTicket && (
        <TicketDetailDrawer
          ticket={selectedTicket}
          open={!!selectedTicketId}
          onClose={() => setSelectedTicketId(null)}
        />
      )}
    </div>
  );
};

export default KanbanBoard;
