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
      return matchesSearch && matchesPriority;
    });
  }, [tickets, searchQuery, priorityFilter]);

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
