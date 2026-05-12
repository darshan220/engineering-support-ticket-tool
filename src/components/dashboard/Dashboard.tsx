import { motion } from "framer-motion";
import {
  Ticket,
  AlertCircle,
  Bug,
  CheckCircle2,
  Clock,
  Zap,
  TrendingUp,
  TrendingDown,
  Calendar,
  ArrowRight,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { currentUser, tickets, sprints, chartData } from "@/data/mock-data";
import { cn, getInitials, formatRelativeTime, getPriorityColor, getTypeIcon } from "@/lib/utils";

const metrics = [
  { title: "Total Tickets", value: "156", change: 12, changeLabel: "vs last sprint", icon: Ticket, color: "from-blue-500 to-blue-600" },
  { title: "Open Issues", value: "43", change: -8, changeLabel: "vs last week", icon: AlertCircle, color: "from-amber-500 to-orange-500" },
  { title: "Critical Bugs", value: "3", change: 2, changeLabel: "this sprint", icon: Bug, color: "from-red-500 to-rose-600" },
  { title: "Resolved This Week", value: "28", change: 15, changeLabel: "vs last week", icon: CheckCircle2, color: "from-emerald-500 to-green-600" },
  { title: "Avg Resolution", value: "4.2h", change: -18, changeLabel: "improvement", icon: Clock, color: "from-purple-500 to-violet-600" },
  { title: "Sprint Velocity", value: "42", change: 8, changeLabel: "vs last sprint", icon: Zap, color: "from-indigo-500 to-blue-600" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const Dashboard = () => {
  const activeSprint = sprints.find((s) => s.status === "active");
  const recentTickets = [...tickets]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 6);
  const upcomingDeadlines = [...tickets]
    .filter((t) => t.status !== "done" && new Date(t.dueDate) > new Date())
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 5);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="p-4 lg:p-6 space-y-6"
    >
      {/* Welcome Header */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold">
            Good {new Date().getHours() < 12 ? "morning" : new Date().getHours() < 18 ? "afternoon" : "evening"}, {currentUser.name.split(" ")[0]} 👋
          </h1>
          <p className="text-muted-foreground mt-1">
            Here's what's happening with your team today.
          </p>
        </div>
        {activeSprint && (
          <div className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3 px-4">
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">Active Sprint</span>
              <span className="text-sm font-semibold">{activeSprint.name}</span>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-xs text-muted-foreground">Progress</span>
              <span className="text-sm font-semibold text-primary">
                {Math.round((activeSprint.completedCount / activeSprint.ticketCount) * 100)}%
              </span>
            </div>
          </div>
        )}
      </motion.div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {metrics.map((metric, index) => (
          <motion.div key={metric.title} variants={itemVariants}>
            <Card className="relative overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br shadow-lg", metric.color)}>
                    <metric.icon className="h-5 w-5 text-white" />
                  </div>
                  <div className={cn(
                    "flex items-center gap-1 text-xs font-medium rounded-lg px-1.5 py-0.5",
                    metric.change > 0 ? "text-emerald-500 bg-emerald-500/10" : "text-red-400 bg-red-500/10"
                  )}>
                    {metric.change > 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                    {Math.abs(metric.change)}%
                  </div>
                </div>
                <div className="mt-3">
                  <p className="text-2xl font-bold">{metric.value}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{metric.title}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Ticket Activity */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Ticket Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={240}>
                <AreaChart data={chartData.ticketActivity}>
                  <defs>
                    <linearGradient id="colorCreated" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorResolved" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis dataKey="day" stroke="var(--color-muted-foreground)" fontSize={12} />
                  <YAxis stroke="var(--color-muted-foreground)" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--color-card)",
                      border: "1px solid var(--color-border)",
                      borderRadius: "12px",
                      fontSize: "12px",
                    }}
                  />
                  <Area type="monotone" dataKey="created" stroke="#6366f1" fillOpacity={1} fill="url(#colorCreated)" strokeWidth={2} />
                  <Area type="monotone" dataKey="resolved" stroke="#10b981" fillOpacity={1} fill="url(#colorResolved)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Priority Distribution */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Priority Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-6">
                <ResponsiveContainer width="50%" height={200}>
                  <PieChart>
                    <Pie
                      data={chartData.priorityDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {chartData.priorityDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "var(--color-card)",
                        border: "1px solid var(--color-border)",
                        borderRadius: "12px",
                        fontSize: "12px",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-3 flex-1">
                  {chartData.priorityDistribution.map((item) => (
                    <div key={item.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.fill }} />
                        <span className="text-sm">{item.name}</span>
                      </div>
                      <span className="text-sm font-semibold">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Team Workload */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Team Workload</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={chartData.teamWorkload}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis dataKey="team" stroke="var(--color-muted-foreground)" fontSize={12} />
                  <YAxis stroke="var(--color-muted-foreground)" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--color-card)",
                      border: "1px solid var(--color-border)",
                      borderRadius: "12px",
                      fontSize: "12px",
                    }}
                  />
                  <Bar dataKey="assigned" fill="#6366f1" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="completed" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Sprint Burndown */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Sprint Burndown</CardTitle>
                <Badge variant="default">{activeSprint?.name}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={240}>
                <LineChart data={chartData.sprintBurndown}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis dataKey="day" stroke="var(--color-muted-foreground)" fontSize={12} />
                  <YAxis stroke="var(--color-muted-foreground)" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--color-card)",
                      border: "1px solid var(--color-border)",
                      borderRadius: "12px",
                      fontSize: "12px",
                    }}
                  />
                  <Line type="monotone" dataKey="ideal" stroke="var(--color-muted-foreground)" strokeDasharray="5 5" strokeWidth={1.5} dot={false} />
                  <Line type="monotone" dataKey="remaining" stroke="#6366f1" strokeWidth={2.5} dot={{ r: 3, fill: "#6366f1" }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recent Activity */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Recent Activity</CardTitle>
                <button className="text-xs text-primary hover:underline cursor-pointer" tabIndex={0} aria-label="View all activity">
                  View all <ArrowRight className="inline h-3 w-3" />
                </button>
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-72">
                <div className="space-y-4">
                  {recentTickets.map((ticket) => (
                    <div key={ticket.id} className="flex items-start gap-3 group">
                      <Avatar className="h-8 w-8 shrink-0 mt-0.5">
                        <AvatarFallback className="text-[9px]">{getInitials(ticket.assignee.name)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono text-muted-foreground">{ticket.ticketId}</span>
                          <span className="text-xs">{getTypeIcon(ticket.type)}</span>
                        </div>
                        <p className="text-sm font-medium truncate">{ticket.title}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-[10px] px-1.5 py-0">{ticket.status}</Badge>
                          <span className="text-xs text-muted-foreground">{formatRelativeTime(ticket.updatedAt)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </motion.div>

        {/* Upcoming Deadlines */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Upcoming Deadlines</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-72">
                <div className="space-y-3">
                  {upcomingDeadlines.map((ticket) => {
                    const daysLeft = Math.ceil(
                      (new Date(ticket.dueDate).getTime() - Date.now()) / 86400000
                    );
                    const isUrgent = daysLeft <= 2;

                    return (
                      <div
                        key={ticket.id}
                        className={cn(
                          "flex items-center justify-between rounded-xl border p-3 transition-colors hover:bg-accent/50",
                          isUrgent && "border-destructive/30 bg-destructive/5"
                        )}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <span className="text-xs font-mono text-muted-foreground shrink-0">{ticket.ticketId}</span>
                          <p className="text-sm truncate">{ticket.title}</p>
                        </div>
                        <Badge variant={isUrgent ? "destructive" : "outline"} className="shrink-0 ml-2">
                          {daysLeft <= 0 ? "Overdue" : `${daysLeft}d left`}
                        </Badge>
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
