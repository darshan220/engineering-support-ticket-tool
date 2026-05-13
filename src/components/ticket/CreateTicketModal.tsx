import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { X, Upload, Calendar, User, Clock, ChevronDown } from "lucide-react";
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
import type { TicketType, Priority, Ticket } from "@/types";

const ticketSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  startDate: z.string().optional(),
  dueDate: z.string().min(1, "Due date is required"),
});

type TicketFormData = z.infer<typeof ticketSchema>;

const ticketTypes: { value: TicketType; label: string }[] = [
  { value: "bug", label: "Bug" },
  { value: "feature", label: "Feature" },
  { value: "task", label: "Task" },
  { value: "incident", label: "Incident" },
  { value: "infrastructure", label: "Infrastructure" },
  { value: "security", label: "Security" },
  { value: "performance", label: "Performance" },
];

const priorities: { value: Priority; label: string; color: string }[] = [
  { value: "critical", label: "Critical", color: "bg-red-500" },
  { value: "high", label: "High", color: "bg-orange-500" },
  { value: "medium", label: "Medium", color: "bg-yellow-500" },
  { value: "low", label: "Low", color: "bg-blue-500" },
];

const CreateTicketModal = () => {
  const { 
    isCreateTicketOpen, 
    setCreateTicketOpen, 
    addTicket, 
    updateTicket, 
    editingTicketId, 
    setEditingTicketId,
    tickets 
  } = useAppStore();

  const [selectedType, setSelectedType] = useState<TicketType>("task");
  const [selectedPriority, setSelectedPriority] = useState<Priority>("medium");
  const [selectedAssignee, setSelectedAssignee] = useState(users[0].id);
  const [selectedReporter, setSelectedReporter] = useState(users[0].id);
  const [selectedLabels, setSelectedLabels] = useState<string[]>([]);
  const [selectedSprint, setSelectedSprint] = useState(sprints[0].id);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const editingTicket = editingTicketId ? tickets.find(t => t.id === editingTicketId) : null;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<TicketFormData>({
    resolver: zodResolver(ticketSchema),
    defaultValues: {
      startDate: new Date().toISOString().split("T")[0],
      dueDate: new Date(Date.now() + 7 * 86400000).toISOString().split("T")[0],
    }
  });

  useEffect(() => {
    if (editingTicket) {
      setValue("title", editingTicket.title);
      setValue("description", editingTicket.description);
      setValue("startDate", editingTicket.startDate ? editingTicket.startDate.split("T")[0] : "");
      setValue("dueDate", editingTicket.dueDate.split("T")[0]);
      setSelectedType(editingTicket.type);
      setSelectedPriority(editingTicket.priority);
      setSelectedAssignee(editingTicket.assignee.id);
      setSelectedReporter(editingTicket.reporter.id);
      setSelectedLabels(editingTicket.labels.map(l => l.id));
      const sprint = sprints.find(s => s.name === editingTicket.sprint);
      if (sprint) setSelectedSprint(sprint.id);
    } else {
      reset({
        title: "",
        description: "",
        startDate: new Date().toISOString().split("T")[0],
        dueDate: new Date(Date.now() + 7 * 86400000).toISOString().split("T")[0],
      });
      setSelectedType("task");
      setSelectedPriority("medium");
      setSelectedAssignee(users[0].id);
      setSelectedReporter(users[0].id);
      setSelectedLabels([]);
      setSelectedSprint(sprints[0].id);
    }
  }, [editingTicket, setValue, reset, isCreateTicketOpen]);

  const handleToggleLabel = (labelId: string) => {
    setSelectedLabels((prev) =>
      prev.includes(labelId) ? prev.filter((id) => id !== labelId) : [...prev, labelId]
    );
  };

  const handleClose = () => {
    setCreateTicketOpen(false);
    setEditingTicketId(null);
  };

  const onSubmit = async (data: TicketFormData) => {
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 600));

    const assignee = users.find((u) => u.id === selectedAssignee) || users[0];
    const reporter = users.find((u) => u.id === selectedReporter) || users[0];
    const sprint = sprints.find((s) => s.id === selectedSprint);
    const ticketLabels = labels.filter((l) => selectedLabels.includes(l.id));

    if (editingTicket) {
      updateTicket(editingTicket.id, {
        title: data.title,
        description: data.description,
        priority: selectedPriority,
        type: selectedType,
        assignee,
        reporter,
        sprint: sprint?.name || "Sprint 24",
        labels: ticketLabels,
        startDate: data.startDate ? new Date(data.startDate).toISOString() : undefined,
        dueDate: new Date(data.dueDate).toISOString(),
        updatedAt: new Date().toISOString(),
      });
    } else {
      addTicket({
        id: `t-${Date.now()}`,
        ticketId: generateTicketId(),
        title: data.title,
        description: data.description,
        status: "backlog",
        priority: selectedPriority,
        type: selectedType,
        assignee,
        reporter,
        sprint: sprint?.name || "Sprint 24",
        storyPoints: 3,
        labels: ticketLabels,
        startDate: data.startDate ? new Date(data.startDate).toISOString() : undefined,
        dueDate: new Date(data.dueDate).toISOString(),
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
    }

    setIsSubmitting(false);
    handleClose();
  };

  return (
    <Dialog open={isCreateTicketOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0 border-none bg-background shadow-2xl">
        <div className="p-6 space-y-6">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              {editingTicket ? "Edit Ticket" : "Create Ticket"}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              {editingTicket ? "Modify the details of this ticket." : "Create a new engineering ticket for your team."}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <label htmlFor="ticket-title" className="text-sm font-semibold flex items-center gap-2">
                Title <span className="text-destructive">*</span>
              </label>
              <Input
                id="ticket-title"
                placeholder="Brief description of the issue"
                className="h-11 rounded-xl bg-secondary/30 border-border/50 focus:border-primary/50 transition-all"
                {...register("title")}
                aria-label="Ticket title"
              />
              {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label htmlFor="ticket-description" className="text-sm font-semibold flex items-center gap-2">
                Description <span className="text-destructive">*</span>
              </label>
              <Textarea
                id="ticket-description"
                placeholder="Detailed description of the issue, expected behavior, steps to reproduce..."
                className="min-h-[120px] rounded-xl bg-secondary/30 border-border/50 focus:border-primary/50 transition-all resize-none"
                {...register("description")}
                aria-label="Ticket description"
              />
              {errors.description && <p className="text-xs text-destructive">{errors.description.message}</p>}
            </div>

            {/* Type & Priority Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Type */}
              <div className="space-y-3">
                <label className="text-sm font-semibold">Type</label>
                <div className="flex flex-wrap gap-2">
                  {ticketTypes.map((type) => (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => setSelectedType(type.value)}
                      className={cn(
                        "px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer border",
                        selectedType === type.value
                          ? "border-primary bg-primary/10 text-primary shadow-[0_0_15px_rgba(22,193,93,0.1)]"
                          : "border-border/50 bg-secondary/20 text-muted-foreground hover:bg-secondary/40 hover:border-border"
                      )}
                      aria-label={`Select type: ${type.label}`}
                    >
                      {type.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Priority */}
              <div className="space-y-3">
                <label className="text-sm font-semibold">Priority</label>
                <div className="flex flex-wrap gap-2">
                  {priorities.map((priority) => (
                    <button
                      key={priority.value}
                      type="button"
                      onClick={() => setSelectedPriority(priority.value)}
                      className={cn(
                        "flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer border",
                        selectedPriority === priority.value
                          ? "border-primary bg-primary/10 text-primary shadow-[0_0_15px_rgba(22,193,93,0.1)]"
                          : "border-border/50 bg-secondary/20 text-muted-foreground hover:bg-secondary/40 hover:border-border"
                      )}
                      aria-label={`Select priority: ${priority.label}`}
                    >
                      <div className={cn("h-2 w-2 rounded-full shadow-sm", priority.color)} />
                      {priority.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Assignee & Reporter Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="ticket-assignee" className="text-sm font-semibold flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" /> Assignee
                </label>
                <div className="relative group">
                  <select
                    id="ticket-assignee"
                    value={selectedAssignee}
                    onChange={(e) => setSelectedAssignee(e.target.value)}
                    className="appearance-none flex h-11 w-full rounded-xl border border-border/50 bg-secondary/30 px-4 py-2 text-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all pr-10"
                    aria-label="Select assignee"
                  >
                    {users.map((user) => (
                      <option key={user.id} value={user.id} className="bg-background text-foreground">{user.name}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none transition-transform group-hover:text-foreground" />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="ticket-reporter" className="text-sm font-semibold flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" /> Reporter
                </label>
                <div className="relative group">
                  <select
                    id="ticket-reporter"
                    value={selectedReporter}
                    onChange={(e) => setSelectedReporter(e.target.value)}
                    className="appearance-none flex h-11 w-full rounded-xl border border-border/50 bg-secondary/30 px-4 py-2 text-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all pr-10"
                    aria-label="Select reporter"
                  >
                    {users.map((user) => (
                      <option key={user.id} value={user.id} className="bg-background text-foreground">{user.name}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none transition-transform group-hover:text-foreground" />
                </div>
              </div>
            </div>

            {/* Dates & Sprint Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label htmlFor="start-date" className="text-sm font-semibold flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" /> Start Date
                </label>
                <Input
                  id="start-date"
                  type="date"
                  className="h-11 rounded-xl bg-secondary/30 border-border/50 focus:border-primary/50 transition-all cursor-pointer"
                  {...register("startDate")}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="due-date" className="text-sm font-semibold flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" /> Due Date <span className="text-destructive">*</span>
                </label>
                <Input
                  id="due-date"
                  type="date"
                  className="h-11 rounded-xl bg-secondary/30 border-border/50 focus:border-primary/50 transition-all cursor-pointer"
                  {...register("dueDate")}
                />
                {errors.dueDate && <p className="text-xs text-destructive">{errors.dueDate.message}</p>}
              </div>

              <div className="space-y-2">
                <label htmlFor="ticket-sprint" className="text-sm font-semibold flex items-center gap-2">
                  Sprint
                </label>
                <div className="relative group">
                  <select
                    id="ticket-sprint"
                    value={selectedSprint}
                    onChange={(e) => setSelectedSprint(e.target.value)}
                    className="appearance-none flex h-11 w-full rounded-xl border border-border/50 bg-secondary/30 px-4 py-2 text-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all pr-10"
                    aria-label="Select sprint"
                  >
                    {sprints.map((sprint) => (
                      <option key={sprint.id} value={sprint.id} className="bg-background text-foreground">
                        {sprint.name} ({sprint.status})
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none transition-transform group-hover:text-foreground" />
                </div>
              </div>
            </div>

            {/* Labels */}
            <div className="space-y-3">
              <label className="text-sm font-semibold">Labels</label>
              <div className="flex flex-wrap gap-2">
                {labels.map((label) => (
                  <button
                    key={label.id}
                    type="button"
                    onClick={() => handleToggleLabel(label.id)}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer border",
                      selectedLabels.includes(label.id)
                        ? "border-primary shadow-[0_0_15px_rgba(22,193,93,0.1)]"
                        : "border-border/50 bg-secondary/20 text-muted-foreground hover:bg-secondary/40"
                    )}
                    style={{
                      backgroundColor: selectedLabels.includes(label.id) ? `${label.color}15` : undefined,
                      color: selectedLabels.includes(label.id) ? label.color : undefined,
                      borderColor: selectedLabels.includes(label.id) ? `${label.color}40` : undefined,
                    }}
                    aria-label={`Toggle label: ${label.name}`}
                  >
                    {label.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Drop zone */}
            <div className="group border-2 border-dashed border-border/50 rounded-2xl p-8 text-center hover:border-primary/40 hover:bg-primary/5 transition-all cursor-pointer" role="button" tabIndex={0} aria-label="Upload attachments">
              <div className="bg-secondary/50 h-12 w-12 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-primary/20 transition-colors">
                <Upload className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
              <p className="text-sm font-medium text-foreground">Drag & drop files or click to upload</p>
              <p className="text-xs text-muted-foreground mt-1">PNG, JPG, PDF up to 10MB</p>
            </div>

            <Separator className="opacity-50" />

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-2">
              <Button 
                type="button" 
                variant="ghost" 
                onClick={handleClose}
                className="rounded-xl px-6"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="rounded-xl px-8 shadow-lg shadow-primary/20"
              >
                {isSubmitting ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full"
                  />
                ) : (
                  editingTicket ? "Save Changes" : "Create Ticket"
                )}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTicketModal;
