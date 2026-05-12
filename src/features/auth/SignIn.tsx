import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Eye,
  EyeOff,
  Zap,
  Workflow,
  Shield,
  BarChart3,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useAppStore } from "@/store";
import { cn } from "@/lib/utils";

const features = [
  { icon: Workflow, text: "Real-time ticket workflows" },
  { icon: BarChart3, text: "Sprint management & analytics" },
  { icon: Users, text: "Team collaboration" },
  { icon: Shield, text: "Incident tracking & resolution" },
];

const SignIn = () => {
  const navigate = useNavigate();
  const { setAuthenticated } = useAppStore();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setAuthenticated(true);
    navigate("/dashboard");
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Branding Panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-primary/20 via-background to-primary/5">
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        {/* Floating elements */}
        <div className="absolute inset-0">
          <motion.div
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[15%] left-[10%] w-64 h-40 rounded-2xl border border-border/30 bg-card/40 backdrop-blur-sm p-4 shadow-2xl"
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="h-3 w-3 rounded-full bg-emerald-400" />
              <div className="h-2 w-20 rounded bg-foreground/10" />
            </div>
            <div className="space-y-2">
              <div className="h-2 w-full rounded bg-foreground/5" />
              <div className="h-2 w-3/4 rounded bg-foreground/5" />
              <div className="h-2 w-1/2 rounded bg-foreground/5" />
            </div>
            <div className="mt-3 flex gap-2">
              <div className="h-6 w-16 rounded-lg bg-primary/20" />
              <div className="h-6 w-16 rounded-lg bg-emerald-500/20" />
            </div>
          </motion.div>

          <motion.div
            animate={{ y: [0, 15, 0] }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
            className="absolute top-[35%] right-[8%] w-56 h-32 rounded-2xl border border-border/30 bg-card/40 backdrop-blur-sm p-4 shadow-2xl"
          >
            <div className="text-xs text-muted-foreground mb-2">
              Sprint Velocity
            </div>
            <div className="flex items-end gap-1 h-16">
              {[40, 65, 45, 80, 55, 70, 90].map((h, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-t bg-primary/30"
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>
          </motion.div>

          <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{
              duration: 7,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2,
            }}
            className="absolute bottom-[20%] left-[15%] w-72 h-20 rounded-2xl border border-border/30 bg-card/40 backdrop-blur-sm p-3 shadow-2xl"
          >
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                {["bg-blue-500", "bg-purple-500", "bg-emerald-500"].map(
                  (color, i) => (
                    <div
                      key={i}
                      className={cn(
                        "h-7 w-7 rounded-full border-2 border-card",
                        color,
                      )}
                    />
                  ),
                )}
              </div>
              <div className="flex-1">
                <div className="flex gap-1 mb-1">
                  {["Backlog", "In Progress", "Done"].map((col) => (
                    <div
                      key={col}
                      className="flex-1 h-2 rounded-full bg-foreground/10"
                    >
                      <div
                        className="h-full rounded-full bg-primary/40"
                        style={{ width: `${Math.random() * 60 + 30}%` }}
                      />
                    </div>
                  ))}
                </div>
                <p className="text-[10px] text-muted-foreground">
                  Kanban Board Preview
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center px-12 xl:px-20">
          <div className="flex items-center gap-3 mb-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/70 shadow-lg shadow-primary/25">
              <Zap className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">NexusOps</h1>
              <p className="text-xs text-muted-foreground">
                Engineering Platform
              </p>
            </div>
          </div>

          <h2 className="text-4xl xl:text-5xl font-bold leading-tight mb-4">
            Modern Engineering
            <br />
            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Operations
            </span>
          </h2>

          <p className="text-lg text-muted-foreground mb-8 max-w-md leading-relaxed">
            Manage engineering workflows, incidents, and support operations from
            a single platform.
          </p>

          <div className="space-y-4">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="flex items-center gap-3"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
                  <feature.icon className="h-4 w-4 text-primary" />
                </div>
                <span className="text-sm text-foreground/80">
                  {feature.text}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Auth Panel */}
      <div className="flex flex-1 items-center justify-center p-6 lg:p-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md"
        >
          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/70 shadow-lg shadow-primary/25">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-xl font-bold">NexusOps</h1>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-2">Welcome back</h2>
            <p className="text-muted-foreground">
              Sign in to your engineering workspace
            </p>
          </div>

          <form onSubmit={handleSignIn} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="signin-email" className="text-sm font-medium">
                Email
              </label>
              <Input
                id="signin-email"
                type="email"
                placeholder="alex@nexusops.io"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                aria-label="Email address"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="signin-password" className="text-sm font-medium">
                Password
              </label>
              <div className="relative">
                <Input
                  id="signin-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pr-10"
                  aria-label="Password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  tabIndex={0}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  className="rounded border-input accent-primary cursor-pointer"
                  aria-label="Remember me"
                />
                Remember me
              </label>
              <Link
                to="/forgot-password"
                className="text-sm text-primary hover:underline"
                tabIndex={0}
              >
                Forgot password?
              </Link>
            </div>

            <Button type="submit" className="w-full h-11" disabled={isLoading}>
              {isLoading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full"
                />
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          <div className="relative my-6">
            <Separator />
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-3 text-xs text-muted-foreground">
              or continue with
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              className="h-11"
              type="button"
              aria-label="Sign in with Google"
              tabIndex={0}
            >
              <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Google
            </Button>
          </div>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-primary hover:underline font-medium"
              tabIndex={0}
            >
              Sign up
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default SignIn;
