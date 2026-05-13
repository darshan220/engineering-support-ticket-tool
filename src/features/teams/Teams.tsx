import { useState } from "react";
import { motion } from "framer-motion";
import { Users as UsersIcon, Zap, Ticket, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { teams, users } from "@/data/mock-data";
import { useAppStore } from "@/store";
import { cn, getInitials } from "@/lib/utils";
import type { Team } from "@/types";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const Teams = () => {
  const { tickets } = useAppStore();
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);

  const handleTeamClick = (team: Team) => {
    setSelectedTeam(team);
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="p-4 lg:p-6 space-y-6"
    >
      <motion.div variants={itemVariants}>
        <h1 className="text-2xl font-bold">Teams</h1>
        <p className="text-muted-foreground">Team overview and member performance.</p>
      </motion.div>

      {/* Team Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {teams.map((team) => (
          <motion.div 
            key={team.id} 
            variants={itemVariants}
            onClick={() => handleTeamClick(team)} 
            className="cursor-pointer"
          >
            <Card className="group hover:shadow-xl transition-all duration-500 overflow-hidden border-none bg-gradient-to-b from-card to-card/50 relative">
              <div className="absolute top-0 left-0 w-full h-[3px] opacity-70" style={{ backgroundColor: team.color }} />
              <CardHeader className="pb-3 px-4 pt-5">
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <div className="h-12 w-12 rounded-2xl flex items-center justify-center shadow-inner transition-transform group-hover:scale-110 duration-300" style={{ backgroundColor: `${team.color}15` }}>
                      <UsersIcon className="h-6 w-6" style={{ color: team.color }} />
                    </div>
                    <Badge variant="outline" className="bg-background/50 backdrop-blur-sm border-border/50 text-[10px] font-medium px-2 py-0">
                      {team.activeSprint}
                    </Badge>
                  </div>
                  <div>
                    <CardTitle className="text-lg font-bold tracking-tight">{team.name}</CardTitle>
                    <p className="text-[11px] text-muted-foreground flex items-center gap-1.5 mt-1">
                      <span className="h-1 w-1 rounded-full bg-muted-foreground/40" />
                      Led by {team.lead.name}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="px-4 pb-5">
                {/* Stats */}
                <div className="grid grid-cols-3 gap-2 mb-6 p-2 rounded-xl bg-accent/20 border border-border/10">
                  <div className="flex flex-col items-center">
                    <span className="text-sm font-bold">{team.ticketCount}</span>
                    <p className="text-[9px] text-muted-foreground uppercase tracking-wider font-medium">Tickets</p>
                  </div>
                  <div className="flex flex-col items-center border-x border-border/20">
                    <span className="text-sm font-bold">{team.members.length}</span>
                    <p className="text-[9px] text-muted-foreground uppercase tracking-wider font-medium">Members</p>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="flex items-center gap-0.5">
                      <Zap className="h-2.5 w-2.5 text-amber-500 fill-amber-500" />
                      <span className="text-sm font-bold">{team.velocityScore}</span>
                    </div>
                    <p className="text-[9px] text-muted-foreground uppercase tracking-wider font-medium">Velocity</p>
                  </div>
                </div>

                {/* Members */}
                <div className="flex items-center justify-between">
                  <div className="flex -space-x-2.5">
                    {team.members.slice(0, 4).map((member) => (
                      <Avatar key={member.id} className="h-7 w-7 border-2 border-background ring-1 ring-border/20">
                        <AvatarFallback className="text-[8px] font-bold bg-muted">{getInitials(member.name)}</AvatarFallback>
                      </Avatar>
                    ))}
                    {team.members.length > 4 && (
                      <div className="h-7 w-7 rounded-full bg-accent border-2 border-background flex items-center justify-center text-[8px] font-bold ring-1 ring-border/20">
                        +{team.members.length - 4}
                      </div>
                    )}
                  </div>
                  <div className="h-6 w-6 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary transition-colors duration-300">
                    <TrendingUp className="h-3 w-3 text-primary group-hover:text-primary-foreground" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Member Table */}
      <motion.div variants={itemVariants}>
        <Card className="border-none shadow-sm overflow-hidden bg-card/30 backdrop-blur-sm">
          <CardHeader className="border-b border-border/50 bg-muted/20">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-bold">All Team Members</CardTitle>
              <Badge variant="secondary" className="font-normal text-[10px] uppercase tracking-wider">
                Active Members: {users.length}
              </Badge>
            </div>
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

      {/* Team Details Dialog */}
      <Dialog open={!!selectedTeam} onOpenChange={() => setSelectedTeam(null)}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-hidden flex flex-col p-0 border-none bg-card/95 backdrop-blur-xl duration-0 animate-none">
          <DialogHeader className="p-6 pb-2">
            <DialogTitle className="text-xl flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${selectedTeam?.color}20` }}>
                <UsersIcon className="h-5 w-5" style={{ color: selectedTeam?.color }} />
              </div>
              <div>
                <span className="font-bold tracking-tight">{selectedTeam?.name}</span>
                <p className="text-xs text-muted-foreground font-normal mt-0.5">Team overview and active assignments</p>
              </div>
            </DialogTitle>
          </DialogHeader>

          <ScrollArea className="flex-1 px-6">
            <div className="space-y-8 py-6">
              {selectedTeam?.members.map((member) => {
                const memberTickets = tickets.filter((t) => t.assignee.id === member.id);
                return (
                  <div key={member.id} className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <Avatar className="h-10 w-10 ring-2 ring-background">
                            <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">{getInitials(member.name)}</AvatarFallback>
                          </Avatar>
                          <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-500 border-2 border-background" />
                        </div>
                        <div>
                          <p className="text-sm font-bold tracking-tight">{member.name}</p>
                          <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">{member.role}</p>
                        </div>
                      </div>
                      <Badge variant="secondary" className="h-6 rounded-full px-2.5 text-[10px] font-bold bg-primary/5 text-primary border-primary/10">
                        {memberTickets.length} ACTIVE {memberTickets.length === 1 ? 'TICKET' : 'TICKETS'}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 gap-2.5">
                      {memberTickets.length > 0 ? (
                        memberTickets.map((ticket) => (
                            <div 
                              key={ticket.id} 
                              className="group/item flex items-center justify-between p-3 rounded-xl border border-border/50 bg-accent/5 hover:bg-accent/10 hover:border-primary/20"
                            >
                              <div className="flex items-center gap-3 overflow-hidden">
                                <div className={cn(
                                  "h-2 w-2 rounded-full shrink-0",
                                  ticket.priority === 'critical' ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]' :
                                  ticket.priority === 'high' ? 'bg-orange-500' :
                                  ticket.priority === 'medium' ? 'bg-blue-500' : 'bg-slate-400'
                                )} />
                                <Badge variant="outline" className="text-[9px] font-medium font-mono h-5 px-1.5 bg-background/50 border-border/50 shrink-0">
                                  {ticket.ticketId}
                                </Badge>
                                <span className="text-xs font-medium truncate">
                                  {ticket.title}
                                </span>
                              </div>
                              <div className="flex items-center gap-3 shrink-0">
                                <Badge variant="outline" className="text-[9px] font-medium h-5 px-2 capitalize bg-background/30 backdrop-blur-sm">
                                  {ticket.status.replace('-', ' ')}
                                </Badge>
                              </div>
                            </div>
                        ))
                      ) : (
                        <div className="p-4 rounded-xl border border-dashed border-border/50 flex flex-col items-center justify-center gap-2 opacity-60">
                          <Ticket className="h-4 w-4 text-muted-foreground" />
                          <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">No tickets assigned</p>
                        </div>
                      )}
                    </div>
                    {selectedTeam?.members.indexOf(member) !== selectedTeam.members.length - 1 && (
                      <Separator className="opacity-50" />
                    )}
                  </div>
                );
              })}
            </div>
          </ScrollArea>
          
          <div className="p-6 pt-2 border-t border-border/50 bg-muted/20">
            <p className="text-[10px] text-muted-foreground text-center font-medium uppercase tracking-widest">
              End of member list • Team Velocity: {selectedTeam?.velocityScore}%
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default Teams;

