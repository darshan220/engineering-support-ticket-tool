import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { cn } from "@/lib/utils";
import type { Ticket, TicketStatus } from "@/types";
import TicketCard from "./TicketCard";
import { Badge } from "../ui/badge";

interface KanbanColumnProps {
  id: TicketStatus;
  title: string;
  color: string;
  tickets: Ticket[];
  onTicketClick: (id: string) => void;
}

const KanbanColumn = ({
  id,
  title,
  color,
  tickets,
  onTicketClick,
}: KanbanColumnProps) => {
  const { isOver, setNodeRef } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "flex w-[350px] shrink-0 flex-col rounded-2xl border border-border/60 bg-secondary/20 backdrop-blur-sm transition-all duration-200",
        isOver &&
          "border-primary/50 bg-primary/5 shadow-[0_0_20px_rgba(22,193,93,0.05)]",
      )}
    >
      {/* Column Header */}
      <div className="flex items-center justify-between p-4 pb-3">
        <div className="flex items-center gap-2.5">
          <div
            className="h-2 w-2 rounded-full shadow-[0_0_8px_rgba(0,0,0,0.1)]"
            style={{ backgroundColor: color }}
          />
          <h3 className="text-sm font-bold tracking-tight">{title}</h3>
          <Badge
            variant="secondary"
            className="h-5 px-1.5 text-[10px] font-bold bg-muted/50 border-none"
          >
            {tickets.length}
          </Badge>
        </div>
      </div>

      {/* Cards */}
      <div className="flex-1 space-y-3 p-3 pt-0 min-h-[150px] max-h-[calc(100vh-320px)] overflow-y-auto scrollbar-hide">
        <SortableContext
          items={tickets.map((t) => t.id)}
          strategy={verticalListSortingStrategy}
        >
          {tickets.map((ticket) => (
            <TicketCard
              key={ticket.id}
              ticket={ticket}
              onClick={() => onTicketClick(ticket.id)}
            />
          ))}
        </SortableContext>

        {tickets.length === 0 && (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="h-10 w-10 rounded-xl bg-muted/50 flex items-center justify-center mb-2">
              <span className="text-lg opacity-50">📋</span>
            </div>
            <p className="text-xs text-muted-foreground">No tickets</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default KanbanColumn;
