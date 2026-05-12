import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { X, Upload } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useAppStore } from "@/store";
import { users, labels, sprints } from "@/data/mock-data";
import { cn, generateTicketId } from "@/lib/utils";
import type { TicketType, Priority } from "@/types";

const ticketSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
});

type TicketFormData = z.infer<typeof ticketSchema>;

const ticketTypes: { value: TicketType; label: string; icon: string }[] = [
  { value: "bug", label: "Bug", icon: "🐛" },
  { value: "feature", label: "Feature", icon: "✨" },
  { value: "task", label: "Task", icon: "📋" },
  { value: "incident", label: "Incident", icon: "🚨" },
  { value: "infrastructure", label: "Infrastructure", icon: "🏗️" },
  { value: "security", label: "Security", icon: "🔒" },
  { value: "performance", label: "Performance", icon: "⚡" },
];

const priorities: { value: Priority; label: string; color: string }[] = [
  { value: "critical", label: "Critical", color: "bg-red-500" },
  { value: "high", label: "High", color: "bg-orange-500" },
  { value: "medium", label: "Medium", color: "bg-yellow-500" },
  { value: "low", label: "Low", color: "bg-blue-500" },
];

const CreateTicketModal = () => {
  const { isCreateTicketOpen, setCreateTicketOpen, addTicket } = useAppStore();
  const [selectedType, setSelectedType] = useState<TicketType>("task");
  const [selectedPriority, setSelectedPriority] = useState<Priority>("medium");
  const [selectedAssignee, setSelectedAssignee] = useState(users[0].id);
  const [selectedLabels, setSelectedLabels] = useState<string[]>([]);
  const [selectedSprint, setSelectedSprint] = useState(sprints[0].id);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<TicketFormData>({
    resolver: zodResolver(ticketSchema),
  });

  const handleToggleLabel = (labelId: string) => {
    setSelectedLabels((prev) =>
      prev.includes(labelId) ? prev.filter((id) => id !== labelId) : [...prev, labelId]
    );
  };

  const handleCreateTicket = async (data: TicketFormData) => {
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 800));

    const assignee = users.find((u) => u.id === selectedAssignee) || users[0];
    const sprint = sprints.find((s) => s.id === selectedSprint);
    const ticketLabels = labels.filter((l) => selectedLabels.includes(l.id));

    addTicket({
      id: `t-${Date.now()}`,
      ticketId: generateTicketId(),
      title: data.title,
      description: data.description,
      status: "backlog",
      priority: selectedPriority,
      type: selectedType,
      assignee,
      reporter: users[0],
      sprint: sprint?.name || "Sprint 24",
      storyPoints: 3,
      labels: ticketLabels,
      dueDate: new Date(Date.now() + 7 * 86400000).toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      comments: [],
      attachments: 0,
      linkedIssues: [],
      activity: [
        {
          id: `a-${Date.now()}`,
          user: users[0],
          action: "created",
          target: data.title,
          timestamp: new Date().toISOString(),
          type: "creation",
        },
      ],
    });

    setIsSubmitting(false);
    reset();
    setSelectedLabels([]);
    setCreateTicketOpen(false);
  };

  return (
    <Dialog open={isCreateTicketOpen} onOpenChange={setCreateTicketOpen}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Ticket</DialogTitle>
          <DialogDescription>Create a new engineering ticket for your team.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleCreateTicket)} className="space-y-5">
          {/* Title */}
          <div className="space-y-2">
            <label htmlFor="ticket-title" className="text-sm font-medium">Title *</label>
            <Input
              id="ticket-title"
              placeholder="Brief description of the issue"
              {...register("title")}
              aria-label="Ticket title"
            />
            {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label htmlFor="ticket-description" className="text-sm font-medium">Description *</label>
            <Textarea
              id="ticket-description"
              placeholder="Detailed description of the issue, expected behavior, steps to reproduce..."
              className="min-h-[100px]"
              {...register("description")}
              aria-label="Ticket description"
            />
            {errors.description && <p className="text-xs text-destructive">{errors.description.message}</p>}
          </div>

          {/* Type & Priority Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Type */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Type</label>
              <div className="flex flex-wrap gap-1.5">
                {ticketTypes.map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => setSelectedType(type.value)}
                    className={cn(
                      "flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer border",
                      selectedType === type.value
                        ? "border-soft-green-border bg-soft-green text-success-text"
                        : "border-border bg-background hover:bg-accent"
                    )}
                    aria-label={`Select type: ${type.label}`}
                    tabIndex={0}
                  >
                    <span>{type.icon}</span> {type.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Priority */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Priority</label>
              <div className="flex flex-wrap gap-1.5">
                {priorities.map((priority) => (
                  <button
                    key={priority.value}
                    type="button"
                    onClick={() => setSelectedPriority(priority.value)}
                    className={cn(
                      "flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer border",
                      selectedPriority === priority.value
                        ? "border-soft-green-border bg-soft-green text-success-text"
                        : "border-border bg-background hover:bg-accent"
                    )}
                    aria-label={`Select priority: ${priority.label}`}
                    tabIndex={0}
                  >
                    <div className={cn("h-2 w-2 rounded-full", priority.color)} />
                    {priority.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Assignee & Sprint Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="ticket-assignee" className="text-sm font-medium">Assignee</label>
              <select
                id="ticket-assignee"
                value={selectedAssignee}
                onChange={(e) => setSelectedAssignee(e.target.value)}
                className="flex h-10 w-full rounded-xl border border-input bg-background px-4 py-2 text-sm cursor-pointer"
                aria-label="Select assignee"
              >
                {users.map((user) => (
                  <option key={user.id} value={user.id}>{user.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="ticket-sprint" className="text-sm font-medium">Sprint</label>
              <select
                id="ticket-sprint"
                value={selectedSprint}
                onChange={(e) => setSelectedSprint(e.target.value)}
                className="flex h-10 w-full rounded-xl border border-input bg-background px-4 py-2 text-sm cursor-pointer"
                aria-label="Select sprint"
              >
                {sprints.map((sprint) => (
                  <option key={sprint.id} value={sprint.id}>{sprint.name} ({sprint.status})</option>
                ))}
              </select>
            </div>
          </div>

          {/* Labels */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Labels</label>
            <div className="flex flex-wrap gap-1.5">
              {labels.map((label) => (
                <button
                  key={label.id}
                  type="button"
                  onClick={() => handleToggleLabel(label.id)}
                  className={cn(
                    "px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer border",
                    selectedLabels.includes(label.id)
                      ? "border-primary shadow-[0_0_10px_rgba(22,193,93,0.15)]"
                      : "border-border hover:border-border/80"
                  )}
                  style={{
                    backgroundColor: selectedLabels.includes(label.id) ? `${label.color}20` : undefined,
                    color: selectedLabels.includes(label.id) ? label.color : undefined,
                  }}
                  aria-label={`Toggle label: ${label.name}`}
                  tabIndex={0}
                >
                  {label.name}
                </button>
              ))}
            </div>
          </div>

          {/* Drop zone */}
          <div className="border-2 border-dashed border-border rounded-xl p-6 text-center hover:border-primary/40 transition-colors cursor-pointer" role="button" tabIndex={0} aria-label="Upload attachments">
            <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">Drag & drop files or click to upload</p>
            <p className="text-xs text-muted-foreground mt-1">PNG, JPG, PDF up to 10MB</p>
          </div>

          <Separator />

          {/* Actions */}
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setCreateTicketOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full"
                />
              ) : (
                "Create Ticket"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTicketModal;
