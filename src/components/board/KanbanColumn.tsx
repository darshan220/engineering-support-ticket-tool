import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { cn } from "@/lib/utils";
import TicketCard from "./TicketCard";
import type { Ticket, TicketStatus } from "@/types";

interface KanbanColumnProps {
  id: TicketStatus;
  title: string;
  color: string;
  tickets: Ticket[];
  onTicketClick: (id: string) => void;
}

const KanbanColumn = ({ id, title, color, tickets, onTicketClick }: KanbanColumnProps) => {
  const { isOver, setNodeRef } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "flex w-72 shrink-0 flex-col rounded-2xl border border-border bg-card/50 transition-colors duration-200",
        isOver && "border-primary/50 bg-primary/5"
      )}
    >
      {/* Column Header */}
      <div className="flex items-center justify-between p-3 pb-2">
        <div className="flex items-center gap-2">
          <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: color }} />
          <h3 className="text-sm font-semibold">{title}</h3>
          <span className="flex h-5 min-w-5 items-center justify-center rounded-md bg-muted px-1 text-xs font-medium text-muted-foreground">
            {tickets.length}
          </span>
        </div>
      </div>

      {/* Cards */}
      <div className="flex-1 space-y-2 p-2 pt-0 min-h-[100px] max-h-[calc(100vh-280px)] overflow-y-auto">
        <SortableContext items={tickets.map((t) => t.id)} strategy={verticalListSortingStrategy}>
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
