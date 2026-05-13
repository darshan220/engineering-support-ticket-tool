import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Inbox as InboxIcon, Search, Filter, MoreHorizontal, CheckCircle2, AlertCircle, Clock, Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { useAppStore } from "@/store";
import { cn, formatRelativeTime } from "@/lib/utils";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
};
const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

const Inbox = () => {
  const { notifications, markNotificationRead, markAllNotificationsRead } = useAppStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<string>("all");

  const filteredNotifications = useMemo(() => {
    return notifications.filter((n) => {
      const matchesSearch = 
        n.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        n.message.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = activeFilter === "all" || n.type === activeFilter;
      return matchesSearch && matchesFilter;
    });
  }, [notifications, searchQuery, activeFilter]);

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="p-4 lg:p-6 h-[calc(100vh-64px)] flex flex-col space-y-6">
      <motion.div variants={itemVariants} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Inbox</h1>
          <p className="text-muted-foreground">Stay updated with your latest activities and notifications.</p>
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="hidden sm:flex gap-2 rounded-xl">
                <Filter className="h-4 w-4" />
                Filter: {activeFilter.charAt(0).toUpperCase() + activeFilter.slice(1)}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40 rounded-xl">
              {["all", "critical", "warning", "info", "success"].map((f) => (
                <DropdownMenuItem 
                  key={f} 
                  onClick={() => setActiveFilter(f)}
                  className="flex justify-between items-center"
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                  {activeFilter === f && <Check className="h-4 w-4" />}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button 
            variant="outline" 
            size="sm" 
            className="hidden sm:flex gap-2 rounded-xl"
            onClick={markAllNotificationsRead}
          >
            <CheckCircle2 className="h-4 w-4" />
            Mark all read
          </Button>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="flex-1 flex gap-6 overflow-hidden">
        {/* Inbox Sidebar/List */}
        <Card className="w-full lg:w-96 flex flex-col overflow-hidden">
          <CardHeader className="p-4 border-b border-border">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search notifications..." 
                className="pl-9 h-10 rounded-xl" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent className="p-0 flex-1 overflow-hidden">
            <ScrollArea className="h-full">
              <div className="divide-y divide-border">
                {filteredNotifications.length > 0 ? (
                  filteredNotifications.map((n) => (
                    <div
                      key={n.id}
                      className={cn(
                        "p-4 cursor-pointer hover:bg-accent/30 transition-colors",
                        !n.read && "bg-primary/5"
                      )}
                      onClick={() => markNotificationRead(n.id)}
                    >
                      <div className="flex justify-between mb-1">
                        <Badge variant={n.type === "critical" ? "destructive" : n.type === "warning" ? "warning" : "secondary"} className="text-[10px]">
                          {n.type}
                        </Badge>
                        <span className="text-[10px] text-muted-foreground">{formatRelativeTime(n.timestamp)}</span>
                      </div>
                      <h4 className={cn("text-sm mb-1", !n.read ? "font-bold" : "font-medium")}>{n.title}</h4>
                      <p className="text-xs text-muted-foreground line-clamp-2">{n.message}</p>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center">
                    <InboxIcon className="h-12 w-12 mx-auto text-muted-foreground/20 mb-3" />
                    <p className="text-sm text-muted-foreground">Your inbox is empty</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Message Content (Desktop) */}
        <Card className="hidden lg:flex flex-1 flex-col overflow-hidden">
          <div className="flex-1 flex items-center justify-center p-12 text-center">
            <div>
              <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <InboxIcon className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Select a notification</h3>
              <p className="text-muted-foreground max-w-xs mx-auto">
                Choose a notification from the list to view its full details and take action.
              </p>
            </div>
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default Inbox;
