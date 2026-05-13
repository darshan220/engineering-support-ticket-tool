import { useState } from "react";
import { motion } from "framer-motion";
import { User, Palette, Bell, Shield, Monitor, Smartphone, Moon, Sun, Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAppStore } from "@/store";
import { cn, getInitials } from "@/lib/utils";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
};
const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

const Settings = () => {
  const { theme, toggleTheme, sidebarCollapsed, toggleSidebar, user, updateUser } = useAppStore();
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [slackNotifications, setSlackNotifications] = useState(true);
  const [sprintReminders, setSprintReminders] = useState(true);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [saved, setSaved] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [role, setRole] = useState(user?.role || "Staff Engineer");

  const handleSave = () => {
    updateUser({ name, role });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="p-4 lg:p-6 space-y-6 max-w-4xl">
      <motion.div variants={itemVariants}>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your account and preferences.</p>
      </motion.div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList>
          <TabsTrigger value="profile" className="gap-1.5"><User className="h-3.5 w-3.5" /> Profile</TabsTrigger>
          <TabsTrigger value="appearance" className="gap-1.5"><Palette className="h-3.5 w-3.5" /> Appearance</TabsTrigger>
          <TabsTrigger value="notifications" className="gap-1.5"><Bell className="h-3.5 w-3.5" /> Notifications</TabsTrigger>
          <TabsTrigger value="security" className="gap-1.5"><Shield className="h-3.5 w-3.5" /> Security</TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile">
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <CardTitle>Profile Settings</CardTitle>
                <CardDescription>Manage your personal information.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    {user?.avatar && <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />}
                    <AvatarFallback className="text-lg">{getInitials(user?.name || "Guest")}</AvatarFallback>
                  </Avatar>
                  <div>
                    <Button variant="outline" size="sm">Change Avatar</Button>
                    <p className="text-xs text-muted-foreground mt-1">JPG, PNG. Max 2MB</p>
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="settings-name" className="text-sm font-medium">Full Name</label>
                    <Input 
                      id="settings-name" 
                      value={name} 
                      onChange={(e) => setName(e.target.value)}
                      aria-label="Full name" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="settings-email" className="text-sm font-medium">Email</label>
                    <Input id="settings-email" defaultValue={user?.email || ""} disabled aria-label="Email" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="settings-role" className="text-sm font-medium">Role</label>
                    <Input 
                      id="settings-role" 
                      value={role} 
                      onChange={(e) => setRole(e.target.value)}
                      aria-label="Role" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="settings-timezone" className="text-sm font-medium">Timezone</label>
                    <select id="settings-timezone" className="flex h-10 w-full rounded-xl border border-input bg-background px-4 py-2 text-sm cursor-pointer" aria-label="Timezone">
                      <option>UTC-8 (Pacific Time)</option>
                      <option>UTC-5 (Eastern Time)</option>
                      <option>UTC+0 (GMT)</option>
                      <option>UTC+5:30 (IST)</option>
                      <option>UTC+8 (SGT)</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button onClick={handleSave}>
                    {saved ? <><Check className="h-4 w-4 mr-1" /> Saved</> : "Save Changes"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* Appearance Tab */}
        <TabsContent value="appearance">
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <CardTitle>Appearance</CardTitle>
                <CardDescription>Customize the look and feel.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {theme === "dark" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                    <div>
                      <p className="text-sm font-medium">Theme</p>
                      <p className="text-xs text-muted-foreground">Switch between light and dark mode</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => theme !== "light" && toggleTheme()}
                      className={cn(
                        "flex items-center gap-2 px-4 py-2 rounded-xl border text-sm transition-colors cursor-pointer",
                        theme === "light" ? "border-primary bg-primary/10 text-primary" : "border-border hover:bg-accent"
                      )}
                      aria-label="Light mode"
                      tabIndex={0}
                    >
                      <Sun className="h-4 w-4" /> Light
                    </button>
                    <button
                      onClick={() => theme !== "dark" && toggleTheme()}
                      className={cn(
                        "flex items-center gap-2 px-4 py-2 rounded-xl border text-sm transition-colors cursor-pointer",
                        theme === "dark" ? "border-primary bg-primary/10 text-primary" : "border-border hover:bg-accent"
                      )}
                      aria-label="Dark mode"
                      tabIndex={0}
                    >
                      <Moon className="h-4 w-4" /> Dark
                    </button>
                  </div>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Compact Sidebar</p>
                    <p className="text-xs text-muted-foreground">Collapse sidebar to icon-only mode</p>
                  </div>
                  <Switch checked={sidebarCollapsed} onCheckedChange={toggleSidebar} aria-label="Toggle compact sidebar" />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Interface Density</p>
                    <p className="text-xs text-muted-foreground">Adjust spacing of UI elements</p>
                  </div>
                  <div className="flex gap-1.5">
                    {["Comfortable", "Compact"].map((density) => (
                      <button
                        key={density}
                        className="px-3 py-1.5 text-xs font-medium rounded-lg border border-border hover:bg-accent transition-colors cursor-pointer"
                        aria-label={`${density} density`}
                        tabIndex={0}
                      >
                        {density}
                      </button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications">
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <CardTitle>Notifications</CardTitle>
                <CardDescription>Configure how you receive notifications.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Email Notifications</p>
                    <p className="text-xs text-muted-foreground">Receive email alerts for ticket updates</p>
                  </div>
                  <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} aria-label="Toggle email notifications" />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Slack Notifications</p>
                    <p className="text-xs text-muted-foreground">Get notified via Slack for mentions and assignments</p>
                  </div>
                  <Switch checked={slackNotifications} onCheckedChange={setSlackNotifications} aria-label="Toggle Slack notifications" />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Sprint Reminders</p>
                    <p className="text-xs text-muted-foreground">Daily sprint standup reminders</p>
                  </div>
                  <Switch checked={sprintReminders} onCheckedChange={setSprintReminders} aria-label="Toggle sprint reminders" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security">
          <motion.div variants={itemVariants} className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Password</CardTitle>
                <CardDescription>Update your password.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="current-pw" className="text-sm font-medium">Current Password</label>
                  <Input id="current-pw" type="password" placeholder="Enter current password" aria-label="Current password" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="new-pw" className="text-sm font-medium">New Password</label>
                    <Input id="new-pw" type="password" placeholder="Enter new password" aria-label="New password" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="confirm-pw" className="text-sm font-medium">Confirm Password</label>
                    <Input id="confirm-pw" type="password" placeholder="Confirm new password" aria-label="Confirm password" />
                  </div>
                </div>
                <Button onClick={handleSave}>Update Password</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Two-Factor Authentication</CardTitle>
                <CardDescription>Add an extra layer of security.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "h-10 w-10 rounded-xl flex items-center justify-center",
                      twoFactorEnabled ? "bg-emerald-500/10" : "bg-muted"
                    )}>
                      <Shield className={cn("h-5 w-5", twoFactorEnabled ? "text-emerald-500" : "text-muted-foreground")} />
                    </div>
                    <div>
                      <p className="text-sm font-medium">2FA Status</p>
                      <Badge variant={twoFactorEnabled ? "success" : "secondary"}>
                        {twoFactorEnabled ? "Enabled" : "Disabled"}
                      </Badge>
                    </div>
                  </div>
                  <Switch checked={twoFactorEnabled} onCheckedChange={setTwoFactorEnabled} aria-label="Toggle two-factor authentication" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Active Sessions</CardTitle>
                <CardDescription>Manage your active sessions.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { device: "MacBook Pro", location: "San Francisco, US", icon: Monitor, current: true },
                    { device: "iPhone 15", location: "San Francisco, US", icon: Smartphone, current: false },
                  ].map((session, i) => (
                    <div key={i} className="flex items-center justify-between rounded-xl border border-border p-3">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-xl bg-muted flex items-center justify-center">
                          <session.icon className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{session.device}</p>
                          <p className="text-xs text-muted-foreground">{session.location}</p>
                        </div>
                      </div>
                      {session.current ? (
                        <Badge variant="success">Current</Badge>
                      ) : (
                        <Button variant="outline" size="sm">Revoke</Button>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default Settings;
