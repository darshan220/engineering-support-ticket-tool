export type Priority = "critical" | "high" | "medium" | "low";
export type TicketStatus = "backlog" | "todo" | "in-progress" | "in-review" | "testing" | "done" | "blocked";
export type TicketType = "bug" | "feature" | "task" | "incident" | "infrastructure" | "security" | "performance";

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: string;
  department: string;
  status: "online" | "offline" | "away";
}

export interface Team {
  id: string;
  name: string;
  lead: User;
  members: User[];
  activeSprint: string;
  ticketCount: number;
  velocityScore: number;
  color: string;
}

export interface Label {
  id: string;
  name: string;
  color: string;
}

export interface Comment {
  id: string;
  author: User;
  content: string;
  createdAt: string;
  updatedAt?: string;
  replies?: Comment[];
}

export interface ActivityItem {
  id: string;
  user: User;
  action: string;
  target: string;
  timestamp: string;
  type: "status" | "assignment" | "comment" | "priority" | "creation" | "label";
  details?: string;
}

export interface Ticket {
  id: string;
  ticketId: string;
  title: string;
  description: string;
  status: TicketStatus;
  priority: Priority;
  type: TicketType;
  assignee: User;
  reporter: User;
  sprint: string;
  storyPoints: number;
  labels: Label[];
  dueDate: string;
  createdAt: string;
  updatedAt: string;
  comments: Comment[];
  attachments: number;
  linkedIssues: string[];
  activity: ActivityItem[];
}

export interface Sprint {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  status: "active" | "planned" | "completed";
  ticketCount: number;
  completedCount: number;
}

export interface Notification {
  id: string;
  type: "info" | "success" | "warning" | "critical";
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
  category: "mention" | "assignment" | "sla" | "comment" | "deployment";
}

export interface MetricCard {
  title: string;
  value: string | number;
  change: number;
  changeLabel: string;
  icon: string;
}

export interface KanbanColumn {
  id: TicketStatus;
  title: string;
  tickets: Ticket[];
  color: string;
}
