import { motion } from "framer-motion";
import {
  LineChart, Line, BarChart, Bar, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { chartData, teams, users } from "@/data/mock-data";
import { useAppStore } from "@/store";
import { getInitials } from "@/lib/utils";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
};
const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

const bugCategories = [
  { name: "API", value: 8, fill: "#6366f1" },
  { name: "Frontend", value: 5, fill: "#8b5cf6" },
  { name: "Database", value: 4, fill: "#f59e0b" },
  { name: "Auth", value: 3, fill: "#ef4444" },
  { name: "Infra", value: 6, fill: "#10b981" },
];

const deploymentFailures = [
  { week: "W1", failures: 2 },
  { week: "W2", failures: 0 },
  { week: "W3", failures: 3 },
  { week: "W4", failures: 1 },
  { week: "W5", failures: 4 },
  { week: "W6", failures: 1 },
  { week: "W7", failures: 0 },
  { week: "W8", failures: 2 },
];

const Analytics = () => {
  const { tickets } = useAppStore();

  const leaderboard = users
    .map((user) => {
      const resolved = tickets.filter((t) => t.assignee.id === user.id && t.status === "done").length;
      const points = tickets.filter((t) => t.assignee.id === user.id && t.status === "done").reduce((s, t) => s + t.storyPoints, 0);
      return { user, resolved, points };
    })
    .filter((u) => u.resolved > 0)
    .sort((a, b) => b.points - a.points);

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="p-4 lg:p-6 space-y-6">
      <motion.div variants={itemVariants}>
        <h1 className="text-2xl font-bold">Analytics</h1>
        <p className="text-muted-foreground">Engineering performance metrics and insights.</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Ticket Trends */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Ticket Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={chartData.ticketActivity}>
                  <defs>
                    <linearGradient id="trendCreated" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="trendResolved" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis dataKey="day" stroke="var(--color-muted-foreground)" fontSize={12} />
                  <YAxis stroke="var(--color-muted-foreground)" fontSize={12} />
                  <Tooltip contentStyle={{ backgroundColor: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: "12px", fontSize: "12px" }} />
                  <Area type="monotone" dataKey="created" stroke="#6366f1" fillOpacity={1} fill="url(#trendCreated)" strokeWidth={2} />
                  <Area type="monotone" dataKey="resolved" stroke="#10b981" fillOpacity={1} fill="url(#trendResolved)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* SLA Performance */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">SLA Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={chartData.slaPerformance}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis dataKey="month" stroke="var(--color-muted-foreground)" fontSize={12} />
                  <YAxis stroke="var(--color-muted-foreground)" fontSize={12} />
                  <Tooltip contentStyle={{ backgroundColor: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: "12px", fontSize: "12px" }} />
                  <Bar dataKey="met" fill="#10b981" radius={[4, 4, 0, 0]} name="SLA Met %" />
                  <Bar dataKey="missed" fill="#ef4444" radius={[4, 4, 0, 0]} name="SLA Missed %" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Resolution Time */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Avg Resolution Time by Type</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={chartData.resolutionTime} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis type="number" stroke="var(--color-muted-foreground)" fontSize={12} unit="h" />
                  <YAxis type="category" dataKey="type" stroke="var(--color-muted-foreground)" fontSize={12} width={80} />
                  <Tooltip contentStyle={{ backgroundColor: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: "12px", fontSize: "12px" }} />
                  <Bar dataKey="hours" fill="#6366f1" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Team Efficiency Leaderboard */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Team Efficiency Leaderboard</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {leaderboard.map((entry, index) => (
                  <div key={entry.user.id} className="flex items-center gap-3 rounded-xl p-3 border border-border hover:bg-accent/30 transition-colors">
                    <span className="text-lg font-bold text-muted-foreground w-6 text-center">
                      {index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : `${index + 1}`}
                    </span>
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-[9px]">{getInitials(entry.user.name)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{entry.user.name}</p>
                      <p className="text-xs text-muted-foreground">{entry.user.role}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold">{entry.points} pts</p>
                      <p className="text-xs text-muted-foreground">{entry.resolved} resolved</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Bugs by Category */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Bugs by Category</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-6">
                <ResponsiveContainer width="50%" height={200}>
                  <PieChart>
                    <Pie data={bugCategories} cx="50%" cy="50%" innerRadius={45} outerRadius={75} paddingAngle={3} dataKey="value">
                      {bugCategories.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: "12px", fontSize: "12px" }} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-2 flex-1">
                  {bugCategories.map((cat) => (
                    <div key={cat.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full" style={{ backgroundColor: cat.fill }} />
                        <span className="text-sm">{cat.name}</span>
                      </div>
                      <span className="text-sm font-semibold">{cat.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Deployment Failures */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Deployment Failures Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={deploymentFailures}>
                  <defs>
                    <linearGradient id="deployFail" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis dataKey="week" stroke="var(--color-muted-foreground)" fontSize={12} />
                  <YAxis stroke="var(--color-muted-foreground)" fontSize={12} />
                  <Tooltip contentStyle={{ backgroundColor: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: "12px", fontSize: "12px" }} />
                  <Area type="monotone" dataKey="failures" stroke="#ef4444" fillOpacity={1} fill="url(#deployFail)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Analytics;
