import { motion } from "framer-motion";
import { Users as UsersIcon, Zap, Ticket, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { teams, users } from "@/data/mock-data";
import { useAppStore } from "@/store";
import { cn, getInitials } from "@/lib/utils";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
};
const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

const Teams = () => {
  const { tickets } = useAppStore();

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="p-4 lg:p-6 space-y-6">
      <motion.div variants={itemVariants}>
        <h1 className="text-2xl font-bold">Teams</h1>
        <p className="text-muted-foreground">Team overview and member performance.</p>
      </motion.div>

      {/* Team Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {teams.map((team) => (
          <motion.div key={team.id} variants={itemVariants}>
            <Card className="hover:shadow-lg transition-shadow duration-300 overflow-hidden">
              <div className="h-1" style={{ backgroundColor: team.color }} />
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${team.color}15` }}>
                      <UsersIcon className="h-5 w-5" style={{ color: team.color }} />
                    </div>
                    <div>
                      <CardTitle className="text-base">{team.name}</CardTitle>
                      <p className="text-xs text-muted-foreground">Led by {team.lead.name}</p>
                    </div>
                  </div>
                  <Badge variant="outline">{team.activeSprint}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Ticket className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="text-lg font-bold">{team.ticketCount}</span>
                    </div>
                    <p className="text-[10px] text-muted-foreground">Tickets</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      <UsersIcon className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="text-lg font-bold">{team.members.length}</span>
                    </div>
                    <p className="text-[10px] text-muted-foreground">Members</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Zap className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="text-lg font-bold">{team.velocityScore}</span>
                    </div>
                    <p className="text-[10px] text-muted-foreground">Velocity</p>
                  </div>
                </div>

                {/* Members */}
                <div className="flex -space-x-2">
                  {team.members.map((member) => (
                    <Avatar key={member.id} className="h-8 w-8 border-2 border-card">
                      <AvatarFallback className="text-[9px]">{getInitials(member.name)}</AvatarFallback>
                    </Avatar>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Member Table */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">All Team Members</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Member</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Role</th>
                    <th className="text-center py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Assigned</th>
                    <th className="text-center py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                    <th className="text-center py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Performance</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => {
                    const userTickets = tickets.filter((t) => t.assignee.id === user.id);
                    const completed = userTickets.filter((t) => t.status === "done").length;
                    const performance = userTickets.length > 0 ? Math.round((completed / userTickets.length) * 100) : 0;

                    return (
                      <tr key={user.id} className="border-b border-border hover:bg-accent/30 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="relative">
                              <Avatar className="h-8 w-8">
                                <AvatarFallback className="text-[9px]">{getInitials(user.name)}</AvatarFallback>
                              </Avatar>
                              {user.status === "online" && (
                                <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-primary border-2 border-background shadow-[0_0_10px_rgba(22,193,93,0.45)]" />
                              )}
                            </div>
                            <div>
                              <p className="text-sm font-medium">{user.name}</p>
                              <p className="text-xs text-muted-foreground">{user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <p className="text-sm">{user.role}</p>
                          <p className="text-xs text-muted-foreground">{user.department}</p>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className="text-sm font-semibold">{userTickets.length}</span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <Badge variant={user.status === "online" ? "success" : user.status === "away" ? "warning" : "secondary"} className="text-xs">
                            {user.status}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <Progress value={performance} className="h-1.5 flex-1" />
                            <span className="text-xs font-medium w-8 text-right">{performance}%</span>
                          </div>
                        </td>
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

export default Teams;
