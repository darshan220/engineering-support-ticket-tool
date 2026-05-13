import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  MessageSquare,
  Paperclip,
  Calendar,
  Clock,
  User,
  Tag,
  Link2,
  Activity,
  Send,
  Pencil,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  cn,
  getInitials,
  formatDate,
  formatRelativeTime,
  getPriorityColor,
  getStatusColor,
  getTypeIcon,
} from "@/lib/utils";
import type { Ticket } from "@/types";
import { useState } from "react";
import { useAppStore } from "@/store";

interface TicketDetailDrawerProps {
  ticket: Ticket;
  open: boolean;
  onClose: () => void;
}

const TicketDetailDrawer = ({
  ticket,
  open,
  onClose,
}: TicketDetailDrawerProps) => {
  const [commentText, setCommentText] = useState("");
  const { setCreateTicketOpen, setEditingTicketId, updateTicket, user } =
    useAppStore();

  const handleSendComment = () => {
    if (!commentText.trim()) return;

    // Use the user from store
    const author = {
      id: user?.email,
      name: user?.name,
      email: user?.email,
      avatar: user?.avatar,
      role: user?.role,
      department: "Engineering",
      status: "online" as const,
    };

    const newComment = {
      id: Math.random().toString(36).substring(2, 9),
      author,
      content: commentText.trim(),
      createdAt: new Date().toISOString(),
    };

    updateTicket(ticket.id, {
      comments: [...ticket.comments, newComment],
      updatedAt: new Date().toISOString(),
    });

    setCommentText("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendComment();
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
            aria-label="Close drawer"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Escape" && onClose()}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 z-50 h-screen w-full max-w-3xl border-l border-border bg-background shadow-2xl"
          >
            <div className="flex h-full flex-col">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-border p-4">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-mono text-muted-foreground">
                    {ticket.ticketId}
                  </span>
                  <Badge
                    className={cn("text-xs", getStatusColor(ticket.status))}
                  >
                    {ticket.status}
                  </Badge>
                  <Badge
                    className={cn(
                      "text-xs border",
                      getPriorityColor(ticket.priority),
                    )}
                  >
                    {ticket.priority}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setEditingTicketId(ticket.id);
                      setCreateTicketOpen(true);
                    }}
                    aria-label="Edit ticket"
                    className="hover:bg-primary/10 hover:text-primary transition-colors"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={onClose}
                    aria-label="Close drawer"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              <ScrollArea className="flex-1">
                <div className="flex flex-col lg:flex-row">
                  {/* Left Content */}
                  <div className="flex-1 p-6 space-y-6">
                    {/* Title & Description */}
                    <div>
                      <h2 className="text-xl font-bold mb-3">{ticket.title}</h2>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {ticket.description}
                      </p>
                    </div>

                    <Separator />

                    {/* Activity Timeline */}
                    <div>
                      <h3 className="text-sm font-semibold mb-4 flex items-center gap-2 text-foreground">
                        <Activity className="h-4 w-4" />
                        Activity
                      </h3>
                      <div className="space-y-4">
                        {ticket.activity.map((item, index) => (
                          <div key={item.id} className="flex gap-3">
                            <div className="flex flex-col items-center">
                              <Avatar className="h-7 w-7 ring-2 ring-background">
                                <AvatarFallback className="text-[8px] bg-muted/50">
                                  {getInitials(item.user.name)}
                                </AvatarFallback>
                              </Avatar>
                              {index < ticket.activity.length - 1 && (
                                <div className="w-px flex-1 bg-border/50 mt-1" />
                              )}
                            </div>
                            <div className="pb-4">
                              <p className="text-sm text-foreground">
                                <span className="font-semibold">
                                  {item.user.name}
                                </span>{" "}
                                <span className="text-muted-foreground">
                                  {item.action}
                                </span>{" "}
                                <span className="font-medium">
                                  {item.target}
                                </span>
                              </p>
                              <span className="text-xs text-muted-foreground/70">
                                {formatRelativeTime(item.timestamp)}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <Separator />

                    {/* Comments */}
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-semibold flex items-center gap-2 text-foreground">
                          <MessageSquare className="h-4 w-4" />
                          Comments
                          <Badge
                            variant="secondary"
                            className="ml-1 px-1.5 py-0 h-5 min-w-5 flex items-center justify-center text-[10px] font-bold"
                          >
                            {ticket.comments.length}
                          </Badge>
                        </h3>
                      </div>

                      <div className="space-y-5">
                        <AnimatePresence initial={false}>
                          {ticket.comments.map((comment) => (
                            <motion.div
                              key={comment.id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="flex gap-3 group"
                            >
                              <Avatar className="h-9 w-9 shrink-0 ring-2 ring-background transition-transform group-hover:scale-105">
                                <AvatarFallback className="text-[10px] bg-primary/10 text-primary font-bold">
                                  {getInitials(comment.author.name)}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1 space-y-1">
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-bold text-foreground">
                                    {comment.author.name}
                                  </span>
                                  <span className="text-[10px] text-muted-foreground bg-muted/50 px-1.5 py-0.5 rounded uppercase tracking-wider font-semibold">
                                    {formatRelativeTime(comment.createdAt)}
                                  </span>
                                </div>
                                <div className="rounded-2xl rounded-tl-none border border-border bg-muted/30 p-3 shadow-sm group-hover:bg-muted/50 transition-colors">
                                  <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap">
                                    {comment.content}
                                  </p>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </AnimatePresence>

                        {ticket.comments.length === 0 && (
                          <div className="text-center py-10 bg-muted/20 rounded-2xl border-2 border-dashed border-border/50">
                            <div className="h-12 w-12 bg-background rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm">
                              <MessageSquare className="h-6 w-6 text-muted-foreground/40" />
                            </div>
                            <p className="text-sm font-medium text-foreground/70">
                              No comments yet
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              Be the first to share your thoughts
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Add Comment */}
                      <div className="relative mt-8 group">
                        <div className="absolute -left-12 top-0 hidden lg:block">
                          <Avatar className="h-9 w-9 ring-2 ring-background">
                            <AvatarFallback className="text-[10px] bg-primary/10 text-primary font-bold">
                              {getInitials(user?.name || "GU")}
                            </AvatarFallback>
                          </Avatar>
                        </div>
                        <div className="relative flex flex-col gap-2 rounded-2xl border border-border bg-card p-2 shadow-sm focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary/30 transition-all">
                          <Textarea
                            placeholder="Add a comment..."
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            onKeyDown={handleKeyDown}
                            className="min-h-[50px] border-none focus-visible:ring-0 resize-none bg-transparent py-2 px-3 text-sm"
                            aria-label="Add a comment"
                          />
                          <div className="flex items-center justify-between px-2 pb-1">
                            <div className="flex items-center gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-muted-foreground hover:text-foreground"
                                title="Attach file"
                              >
                                <Paperclip className="h-4 w-4" />
                              </Button>
                            </div>
                            <Button
                              onClick={handleSendComment}
                              disabled={!commentText.trim()}
                              className={cn(
                                "h-8 px-4 gap-2 transition-all",
                                !commentText.trim()
                                  ? "opacity-50"
                                  : "bg-primary hover:bg-primary/90",
                              )}
                              aria-label="Send comment"
                            >
                              <Send className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                        <p className="mt-2 text-[10px] text-muted-foreground px-2">
                          <span className="font-bold">Pro tip:</span> Press{" "}
                          <kbd className="px-1 py-0.5 rounded bg-muted border border-border text-[9px]">
                            Enter
                          </kbd>{" "}
                          to send,{" "}
                          <kbd className="px-1 py-0.5 rounded bg-muted border border-border text-[9px]">
                            Shift + Enter
                          </kbd>{" "}
                          for new line
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Right Metadata Panel */}
                  <div className="w-full lg:w-72 border-t lg:border-t-0 lg:border-l border-border p-6 space-y-4">
                    <div>
                      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Status
                      </span>
                      <Badge
                        className={cn(
                          "mt-1.5 block w-fit",
                          getStatusColor(ticket.status),
                        )}
                      >
                        {ticket.status}
                      </Badge>
                    </div>

                    <div>
                      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Priority
                      </span>
                      <Badge
                        className={cn(
                          "mt-1.5 block w-fit border",
                          getPriorityColor(ticket.priority),
                        )}
                      >
                        {ticket.priority}
                      </Badge>
                    </div>

                    <div>
                      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Type
                      </span>
                      <p className="text-sm mt-1.5 flex items-center gap-1.5">
                        {getTypeIcon(ticket.type)} {ticket.type}
                      </p>
                    </div>

                    <Separator />

                    <div>
                      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                        <User className="h-3 w-3" /> Assignee
                      </span>
                      <div className="flex items-center gap-2 mt-1.5">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback className="text-[8px]">
                            {getInitials(ticket.assignee.name)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm">{ticket.assignee.name}</span>
                      </div>
                    </div>

                    <div>
                      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Reporter
                      </span>
                      <div className="flex items-center gap-2 mt-1.5">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback className="text-[8px]">
                            {getInitials(ticket.reporter.name)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm">{ticket.reporter.name}</span>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Sprint
                      </span>
                      <p className="text-sm mt-1.5">{ticket.sprint}</p>
                    </div>

                    <div>
                      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Story Points
                      </span>
                      <p className="text-sm mt-1.5 font-semibold">
                        {ticket.storyPoints}
                      </p>
                    </div>

                    <div>
                      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                        <Tag className="h-3 w-3" /> Labels
                      </span>
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {ticket.labels.map((label) => (
                          <span
                            key={label.id}
                            className="inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium"
                            style={{
                              backgroundColor: `${label.color}15`,
                              color: label.color,
                            }}
                          >
                            {label.name}
                          </span>
                        ))}
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                        <Calendar className="h-3 w-3" /> Due Date
                      </span>
                      <p className="text-sm mt-1.5">
                        {formatDate(ticket.dueDate)}
                      </p>
                    </div>

                    <div>
                      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                        <Clock className="h-3 w-3" /> Created
                      </span>
                      <p className="text-sm mt-1.5">
                        {formatDate(ticket.createdAt)}
                      </p>
                    </div>

                    <div>
                      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Updated
                      </span>
                      <p className="text-sm mt-1.5">
                        {formatRelativeTime(ticket.updatedAt)}
                      </p>
                    </div>

                    {ticket.linkedIssues.length > 0 && (
                      <div>
                        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                          <Link2 className="h-3 w-3" /> Linked Issues
                        </span>
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {ticket.linkedIssues.map((id) => (
                            <Badge
                              key={id}
                              variant="outline"
                              className="text-xs cursor-pointer hover:bg-accent"
                            >
                              {id}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-3 text-sm text-muted-foreground pt-2">
                      <span className="flex items-center gap-1">
                        <Paperclip className="h-3.5 w-3.5" />{" "}
                        {ticket.attachments} files
                      </span>
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default TicketDetailDrawer;
