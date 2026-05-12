import { motion } from "framer-motion";
import { Clock, CheckCircle2, AlertCircle, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAppStore } from "@/store";
import { currentUser } from "@/data/mock-data";
import { cn, getInitials, formatRelativeTime, getPriorityColor, getStatusColor, getTypeIcon, formatDate } from "@/lib/utils";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
};
const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

const MyTickets = () => {
  const { tickets } = useAppStore();
  const myTickets = tickets.filter((t) => t.assignee.id === currentUser.id);
  const assignedToMe = myTickets.filter((t) => t.status !== "done");
  const dueSoon = myTickets
    .filter((t) => {
      const daysLeft = Math.ceil((new Date(t.dueDate).getTime() - Date.now()) / 86400000);
      return daysLeft <= 3 && daysLeft >= 0 && t.status !== "done";
    })
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  const recentlyUpdated = [...myTickets].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()).slice(0, 5);

  const completedCount = myTickets.filter((t) => t.status === "done").length;
  const totalPoints = myTickets.reduce((sum, t) => sum + t.storyPoints, 0);

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="p-4 lg:p-6 space-y-6">
      <motion.div variants={itemVariants}>
        <h1 className="text-2xl font-bold">My Tickets</h1>
        <p className="text-muted-foreground">Track your assigned work and personal performance.</p>
      </motion.div>

      {/* Stats */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
              <AlertCircle className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{assignedToMe.length}</p>
              <p className="text-xs text-muted-foreground">Active</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
              <Clock className="h-5 w-5 text-amber-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{dueSoon.length}</p>
              <p className="text-xs text-muted-foreground">Due Soon</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
              <CheckCircle2 className="h-5 w-5 text-emerald-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{completedCount}</p>
              <p className="text-xs text-muted-foreground">Completed</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-purple-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{totalPoints}</p>
              <p className="text-xs text-muted-foreground">Story Points</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Assigned to Me */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Assigned to Me</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-80">
                <div className="space-y-3">
                  {assignedToMe.map((ticket) => (
                    <div key={ticket.id} className="flex items-center justify-between rounded-xl border border-border p-3 hover:bg-accent/30 transition-colors">
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="text-xs font-mono text-muted-foreground shrink-0">{ticket.ticketId}</span>
                        <span>{getTypeIcon(ticket.type)}</span>
                        <p className="text-sm truncate">{ticket.title}</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0 ml-2">
                        <Badge className={cn("text-[10px] border", getPriorityColor(ticket.priority))}>{ticket.priority}</Badge>
                        <Badge className={cn("text-[10px]", getStatusColor(ticket.status))}>{ticket.status}</Badge>
                      </div>
                    </div>
                  ))}
                  {assignedToMe.length === 0 && (
                    <div className="text-center py-8">
                      <CheckCircle2 className="h-10 w-10 mx-auto text-emerald-500/30 mb-3" />
                      <p className="text-sm text-muted-foreground">All caught up! 🎉</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </motion.div>

        {/* Due Soon */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Due Soon</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-80">
                <div className="space-y-3">
                  {dueSoon.map((ticket) => {
                    const daysLeft = Math.ceil((new Date(ticket.dueDate).getTime() - Date.now()) / 86400000);
                    return (
                      <div key={ticket.id} className="flex items-center justify-between rounded-xl border border-border p-3 hover:bg-accent/30 transition-colors">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono text-muted-foreground">{ticket.ticketId}</span>
                          </div>
                          <p className="text-sm truncate mt-0.5">{ticket.title}</p>
                        </div>
                        <Badge variant={daysLeft <= 1 ? "destructive" : "warning"} className="shrink-0 ml-2">
                          {daysLeft <= 0 ? "Overdue" : `${daysLeft}d`}
                        </Badge>
                      </div>
                    );
                  })}
                  {dueSoon.length === 0 && (
                    <div className="text-center py-8">
                      <Clock className="h-10 w-10 mx-auto text-muted-foreground/30 mb-3" />
                      <p className="text-sm text-muted-foreground">No upcoming deadlines</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Recently Updated */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Recently Updated</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentlyUpdated.map((ticket) => (
                <div key={ticket.id} className="flex items-center justify-between rounded-xl border border-border p-3 hover:bg-accent/30 transition-colors">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-xs font-mono text-muted-foreground shrink-0">{ticket.ticketId}</span>
                    <span>{getTypeIcon(ticket.type)}</span>
                    <p className="text-sm truncate">{ticket.title}</p>
                  </div>
                  <span className="text-xs text-muted-foreground shrink-0 ml-2">{formatRelativeTime(ticket.updatedAt)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default MyTickets;
