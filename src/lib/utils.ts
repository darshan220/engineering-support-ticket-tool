import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

export const formatDate = (date: string | Date): string => {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
};

export const formatRelativeTime = (date: string | Date): string => {
  const now = new Date();
  const target = new Date(date);
  const diffMs = now.getTime() - target.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return formatDate(date);
};

export const generateTicketId = (prefix = "ENG"): string => {
  const num = Math.floor(Math.random() * 9000) + 1000;
  return `${prefix}-${num}`;
};

export const getInitials = (name: string): string => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

export const getPriorityColor = (priority: string): string => {
  const colors: Record<string, string> = {
    critical: "text-red-400 bg-red-500/10 border-red-500/20",
    high: "text-orange-400 bg-orange-500/10 border-orange-500/20",
    medium: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20",
    low: "text-blue-400 bg-blue-500/10 border-blue-500/20",
  };
  return colors[priority] || colors.medium;
};

export const getStatusColor = (status: string): string => {
  const colors: Record<string, string> = {
    backlog: "text-slate-400 bg-slate-500/10",
    todo: "text-blue-400 bg-blue-500/10",
    "in-progress": "text-amber-400 bg-amber-500/10",
    "in-review": "text-purple-400 bg-purple-500/10",
    testing: "text-cyan-400 bg-cyan-500/10",
    done: "text-emerald-400 bg-emerald-500/10",
    blocked: "text-red-400 bg-red-500/10",
  };
  return colors[status] || colors.backlog;
};

export const getTypeIcon = (type: string): string => {
  const icons: Record<string, string> = {
    bug: "🐛",
    feature: "✨",
    task: "📋",
    incident: "🚨",
    infrastructure: "🏗️",
    security: "🔒",
    performance: "⚡",
  };
  return icons[type] || "📋";
};
