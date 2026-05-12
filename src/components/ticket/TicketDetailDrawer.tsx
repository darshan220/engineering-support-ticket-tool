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

interface TicketDetailDrawerProps {
  ticket: Ticket;
  open: boolean;
  onClose: () => void;
}

const TicketDetailDrawer = ({ ticket, open, onClose }: TicketDetailDrawerProps) => {
  const [commentText, setCommentText] = useState("");

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
                  <span className="text-sm font-mono text-muted-foreground">{ticket.ticketId}</span>
                  <Badge className={cn("text-xs", getStatusColor(ticket.status))}>{ticket.status}</Badge>
                  <Badge className={cn("text-xs border", getPriorityColor(ticket.priority))}>{ticket.priority}</Badge>
                </div>
                <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close drawer">
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <ScrollArea className="flex-1">
                <div className="flex flex-col lg:flex-row">
                  {/* Left Content */}
                  <div className="flex-1 p-6 space-y-6">
                    {/* Title & Description */}
                    <div>
                      <h2 className="text-xl font-bold mb-3">{ticket.title}</h2>
                      <p className="text-sm text-muted-foreground leading-relaxed">{ticket.description}</p>
                    </div>

                    <Separator />

                    {/* Activity Timeline */}
                    <div>
                      <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
                        <Activity className="h-4 w-4" />
                        Activity
                      </h3>
                      <div className="space-y-4">
                        {ticket.activity.map((item, index) => (
                          <div key={item.id} className="flex gap-3">
                            <div className="flex flex-col items-center">
                              <Avatar className="h-7 w-7">
                                <AvatarFallback className="text-[8px]">{getInitials(item.user.name)}</AvatarFallback>
                              </Avatar>
                              {index < ticket.activity.length - 1 && (
                                <div className="w-px flex-1 bg-border mt-1" />
                              )}
                            </div>
                            <div className="pb-4">
                              <p className="text-sm">
                                <span className="font-medium">{item.user.name}</span>{" "}
                                <span className="text-muted-foreground">{item.action}</span>{" "}
                                <span className="font-medium">{item.target}</span>
                              </p>
                              <span className="text-xs text-muted-foreground">{formatRelativeTime(item.timestamp)}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <Separator />

                    {/* Comments */}
                    <div>
                      <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
                        <MessageSquare className="h-4 w-4" />
                        Comments ({ticket.comments.length})
                      </h3>
                      <div className="space-y-4">
                        {ticket.comments.map((comment) => (
                          <div key={comment.id} className="flex gap-3">
                            <Avatar className="h-8 w-8 shrink-0">
                              <AvatarFallback className="text-[9px]">{getInitials(comment.author.name)}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 rounded-xl border border-border bg-card p-3">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-sm font-medium">{comment.author.name}</span>
                                <span className="text-xs text-muted-foreground">{formatRelativeTime(comment.createdAt)}</span>
                              </div>
                              <p className="text-sm text-muted-foreground">{comment.content}</p>
                            </div>
                          </div>
                        ))}

                        {ticket.comments.length === 0 && (
                          <div className="text-center py-6">
                            <MessageSquare className="h-8 w-8 mx-auto text-muted-foreground/30 mb-2" />
                            <p className="text-sm text-muted-foreground">No comments yet</p>
                          </div>
                        )}
                      </div>

                      {/* Add Comment */}
                      <div className="mt-4 flex gap-2">
                        <Textarea
                          placeholder="Write a comment..."
                          value={commentText}
                          onChange={(e) => setCommentText(e.target.value)}
                          className="min-h-[60px]"
                          aria-label="Write a comment"
                        />
                        <Button size="icon" className="shrink-0 self-end" aria-label="Send comment">
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Right Metadata Panel */}
                  <div className="w-full lg:w-72 border-t lg:border-t-0 lg:border-l border-border p-6 space-y-4">
                    <div>
                      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</span>
                      <Badge className={cn("mt-1.5 block w-fit", getStatusColor(ticket.status))}>{ticket.status}</Badge>
                    </div>

                    <div>
                      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Priority</span>
                      <Badge className={cn("mt-1.5 block w-fit border", getPriorityColor(ticket.priority))}>{ticket.priority}</Badge>
                    </div>

                    <div>
                      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Type</span>
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
                          <AvatarFallback className="text-[8px]">{getInitials(ticket.assignee.name)}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm">{ticket.assignee.name}</span>
                      </div>
                    </div>

                    <div>
                      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Reporter</span>
                      <div className="flex items-center gap-2 mt-1.5">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback className="text-[8px]">{getInitials(ticket.reporter.name)}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm">{ticket.reporter.name}</span>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Sprint</span>
                      <p className="text-sm mt-1.5">{ticket.sprint}</p>
                    </div>

                    <div>
                      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Story Points</span>
                      <p className="text-sm mt-1.5 font-semibold">{ticket.storyPoints}</p>
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
                            style={{ backgroundColor: `${label.color}15`, color: label.color }}
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
                      <p className="text-sm mt-1.5">{formatDate(ticket.dueDate)}</p>
                    </div>

                    <div>
                      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                        <Clock className="h-3 w-3" /> Created
                      </span>
                      <p className="text-sm mt-1.5">{formatDate(ticket.createdAt)}</p>
                    </div>

                    <div>
                      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Updated</span>
                      <p className="text-sm mt-1.5">{formatRelativeTime(ticket.updatedAt)}</p>
                    </div>

                    {ticket.linkedIssues.length > 0 && (
                      <div>
                        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                          <Link2 className="h-3 w-3" /> Linked Issues
                        </span>
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {ticket.linkedIssues.map((id) => (
                            <Badge key={id} variant="outline" className="text-xs cursor-pointer hover:bg-accent">
                              {id}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-3 text-sm text-muted-foreground pt-2">
                      <span className="flex items-center gap-1">
                        <Paperclip className="h-3.5 w-3.5" /> {ticket.attachments} files
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
