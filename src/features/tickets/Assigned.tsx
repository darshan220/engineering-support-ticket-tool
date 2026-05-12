import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAppStore } from "@/store";
import { users, teams } from "@/data/mock-data";
import { cn, getInitials, getPriorityColor } from "@/lib/utils";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
};
const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

const heatmapColors = [
  "bg-emerald-500/10",
  "bg-emerald-500/20",
  "bg-emerald-500/30",
  "bg-amber-500/20",
  "bg-amber-500/30",
  "bg-red-500/20",
  "bg-red-500/30",
];

const Assigned = () => {
  const { tickets } = useAppStore();

  const userWorkload = users.map((user) => {
    const userTickets = tickets.filter((t) => t.assignee.id === user.id);
    const active = userTickets.filter((t) => t.status !== "done" && t.status !== "backlog");
    const critical = userTickets.filter((t) => t.priority === "critical" && t.status !== "done");
    const completed = userTickets.filter((t) => t.status === "done");
    const totalPoints = userTickets.reduce((s, t) => s + t.storyPoints, 0);

    return { user, total: userTickets.length, active: active.length, critical: critical.length, completed: completed.length, totalPoints, tickets: userTickets };
  }).filter((u) => u.total > 0);

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="p-4 lg:p-6 space-y-6">
      <motion.div variants={itemVariants}>
        <h1 className="text-2xl font-bold">Assigned</h1>
        <p className="text-muted-foreground">Team workload overview and ticket allocation.</p>
      </motion.div>

      {/* Workload Grid */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Team Workload Grid</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {userWorkload.map(({ user, total, active, critical, completed, totalPoints }) => {
                const loadPercent = Math.min((active / 5) * 100, 100);
                return (
                  <div key={user.id} className="rounded-xl border border-border p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3 mb-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="text-xs">{getInitials(user.name)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-semibold">{user.name}</p>
                        <p className="text-xs text-muted-foreground">{user.role}</p>
                      </div>
                    </div>
                    <div className="space-y-2 mb-3">
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Workload</span>
                        <span className={cn(
                          "font-medium",
                          loadPercent > 80 ? "text-red-400" : loadPercent > 50 ? "text-amber-400" : "text-emerald-400"
                        )}>
                          {active} active
                        </span>
                      </div>
                      <Progress value={loadPercent} className="h-1.5" />
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div>
                        <p className="text-lg font-bold">{total}</p>
                        <p className="text-[10px] text-muted-foreground">Total</p>
                      </div>
                      <div>
                        <p className="text-lg font-bold text-emerald-500">{completed}</p>
                        <p className="text-[10px] text-muted-foreground">Done</p>
                      </div>
                      <div>
                        <p className="text-lg font-bold text-red-400">{critical}</p>
                        <p className="text-[10px] text-muted-foreground">Critical</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Allocation Heatmap */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Allocation Heatmap</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr>
                    <th className="text-left py-2 px-3 text-xs font-medium text-muted-foreground">Team Member</th>
                    <th className="text-center py-2 px-3 text-xs font-medium text-muted-foreground">Backlog</th>
                    <th className="text-center py-2 px-3 text-xs font-medium text-muted-foreground">Todo</th>
                    <th className="text-center py-2 px-3 text-xs font-medium text-muted-foreground">In Progress</th>
                    <th className="text-center py-2 px-3 text-xs font-medium text-muted-foreground">Review</th>
                    <th className="text-center py-2 px-3 text-xs font-medium text-muted-foreground">Testing</th>
                    <th className="text-center py-2 px-3 text-xs font-medium text-muted-foreground">Done</th>
                    <th className="text-center py-2 px-3 text-xs font-medium text-muted-foreground">Blocked</th>
                  </tr>
                </thead>
                <tbody>
                  {userWorkload.map(({ user, tickets: userTickets }) => {
                    const statuses = ["backlog", "todo", "in-progress", "in-review", "testing", "done", "blocked"];
                    return (
                      <tr key={user.id} className="border-t border-border">
                        <td className="py-2 px-3">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarFallback className="text-[8px]">{getInitials(user.name)}</AvatarFallback>
                            </Avatar>
                            <span className="text-sm">{user.name}</span>
                          </div>
                        </td>
                        {statuses.map((status) => {
                          const count = userTickets.filter((t) => t.status === status).length;
                          const colorIndex = Math.min(count, heatmapColors.length - 1);
                          return (
                            <td key={status} className="py-2 px-3 text-center">
                              <div className={cn(
                                "inline-flex h-8 w-8 items-center justify-center rounded-lg text-xs font-medium",
                                count > 0 ? heatmapColors[colorIndex] : "bg-muted/30 text-muted-foreground"
                              )}>
                                {count}
                              </div>
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default Assigned;
