import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { MessageSquare, Paperclip, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  cn,
  getInitials,
  getPriorityColor,
  getTypeIcon,
  formatDate,
} from "@/lib/utils";
import type { Ticket } from "@/types";

interface TicketCardProps {
  ticket: Ticket;
  isDragging?: boolean;
  onClick?: () => void;
}

const priorityLabels: Record<string, string> = {
  critical: "P0",
  high: "P1",
  medium: "P2",
  low: "P3",
};

const TicketCard = ({
  ticket,
  isDragging = false,
  onClick,
}: TicketCardProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortDragging,
  } = useSortable({ id: ticket.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={onClick}
      className={cn(
        "group cursor-pointer rounded-xl border border-border/50 bg-card p-4 shadow-sm transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:border-primary/30 hover:-translate-y-0.5 active:scale-[0.98]",
        isSortDragging && "opacity-50 grayscale-[0.5]",
        isDragging &&
          "shadow-[0_20px_50px_rgba(22,193,93,0.15)] border-primary/60 scale-[1.02] rotate-2 z-50",
      )}
      role="button"
      tabIndex={0}
      aria-label={`Ticket ${ticket.ticketId}: ${ticket.title}`}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick?.();
        }
      }}
    >
      {/* Top: ID + Priority */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-mono text-muted-foreground">
          {ticket.ticketId}
        </span>
        <Badge
          className={cn(
            "text-[10px] px-1.5 py-0 border",
            getPriorityColor(ticket.priority),
          )}
        >
          {priorityLabels[ticket.priority]}
        </Badge>
      </div>

      {/* Title */}
      <p className="text-sm font-medium leading-snug mb-2 line-clamp-2">
        {ticket.title}
      </p>

      {/* Labels */}
      {ticket.labels.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2.5">
          {ticket.labels.slice(0, 3).map((label) => (
            <span
              key={label.id}
              className="inline-flex items-center rounded-md px-1.5 py-0.5 text-[10px] font-medium"
              style={{
                backgroundColor: `${label.color}15`,
                color: label.color,
              }}
            >
              {label.name}
            </span>
          ))}
        </div>
      )}

      {/* Bottom: Avatar, Type, Due, Comments, Attachments */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Avatar className="h-6 w-6">
            <AvatarFallback className="text-[8px]">
              {getInitials(ticket.assignee.name)}
            </AvatarFallback>
          </Avatar>
        </div>
        <div className="flex items-center gap-2.5 text-muted-foreground">
          {ticket.comments.length > 0 && (
            <span className="flex items-center gap-0.5 text-[10px]">
              <MessageSquare className="h-3 w-3" />
              {ticket.comments.length}
            </span>
          )}
          {ticket.attachments > 0 && (
            <span className="flex items-center gap-0.5 text-[10px]">
              <Paperclip className="h-3 w-3" />
              {ticket.attachments}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default TicketCard;
