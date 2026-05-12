import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, EyeOff, Zap, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const passwordRequirements = [
  { label: "At least 8 characters", test: (p: string) => p.length >= 8 },
  { label: "One uppercase letter", test: (p: string) => /[A-Z]/.test(p) },
  { label: "One number", test: (p: string) => /\d/.test(p) },
  { label: "One special character", test: (p: string) => /[!@#$%^&*]/.test(p) },
];

const SignUp = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [success, setSuccess] = useState(false);

  const passwordStrength = passwordRequirements.filter((r) => r.test(password)).length;
  const strengthColors = ["bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-emerald-500"];
  const strengthLabels = ["Weak", "Fair", "Good", "Strong"];

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setSuccess(true);
    setTimeout(() => navigate("/signin"), 2000);
  };

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/10"
          >
            <Check className="h-10 w-10 text-emerald-500" />
          </motion.div>
          <h2 className="text-2xl font-bold mb-2">Account Created!</h2>
          <p className="text-muted-foreground">Redirecting to sign in...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="flex items-center gap-3 mb-8">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/70 shadow-lg shadow-primary/25">
            <Zap className="h-5 w-5 text-white" />
          </div>
          <h1 className="text-xl font-bold">NexusOps</h1>
        </div>

        <h2 className="text-2xl font-bold mb-2">Create your account</h2>
        <p className="text-muted-foreground mb-6">Get started with your engineering workspace</p>

        <form onSubmit={handleSignUp} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="signup-name" className="text-sm font-medium">Full Name</label>
            <Input id="signup-name" placeholder="Alex Chen" required aria-label="Full name" />
          </div>

          <div className="space-y-2">
            <label htmlFor="signup-email" className="text-sm font-medium">Work Email</label>
            <Input id="signup-email" type="email" placeholder="alex@company.io" required aria-label="Work email" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <label htmlFor="signup-company" className="text-sm font-medium">Company</label>
              <Input id="signup-company" placeholder="Acme Inc" aria-label="Company name" />
            </div>
            <div className="space-y-2">
              <label htmlFor="signup-role" className="text-sm font-medium">Role</label>
              <Input id="signup-role" placeholder="Engineer" aria-label="Role" />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="signup-password" className="text-sm font-medium">Password</label>
            <div className="relative">
              <Input
                id="signup-password"
                type={showPassword ? "text" : "password"}
                placeholder="Create a strong password"
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
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>

            {password && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}>
                <div className="flex gap-1 mt-2">
                  {[0, 1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className={cn(
                        "h-1 flex-1 rounded-full transition-colors duration-300",
                        i < passwordStrength ? strengthColors[passwordStrength - 1] : "bg-muted"
                      )}
                    />
                  ))}
                </div>
                <p className={cn("text-xs mt-1", passwordStrength >= 3 ? "text-emerald-500" : "text-muted-foreground")}>
                  {passwordStrength > 0 ? strengthLabels[passwordStrength - 1] : "Too short"}
                </p>
                <div className="mt-2 space-y-1">
                  {passwordRequirements.map((req, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs">
                      <div className={cn(
                        "h-3.5 w-3.5 rounded-full flex items-center justify-center transition-colors",
                        req.test(password) ? "bg-emerald-500/20 text-emerald-500" : "bg-muted text-muted-foreground"
                      )}>
                        <Check className="h-2.5 w-2.5" />
                      </div>
                      <span className={cn(req.test(password) ? "text-foreground" : "text-muted-foreground")}>{req.label}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="signup-confirm" className="text-sm font-medium">Confirm Password</label>
            <Input id="signup-confirm" type="password" placeholder="Confirm your password" required aria-label="Confirm password" />
          </div>

          <label className="flex items-start gap-2 text-sm cursor-pointer">
            <input type="checkbox" className="mt-1 rounded border-input accent-primary cursor-pointer" required aria-label="Accept terms" />
            <span className="text-muted-foreground">
              I agree to the{" "}
              <span className="text-primary cursor-pointer hover:underline" tabIndex={0} role="link" aria-label="Terms of service">Terms of Service</span>
              {" "}and{" "}
              <span className="text-primary cursor-pointer hover:underline" tabIndex={0} role="link" aria-label="Privacy policy">Privacy Policy</span>
            </span>
          </label>

          <Button type="submit" className="w-full h-11" disabled={isLoading}>
            {isLoading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full"
              />
            ) : (
              "Create Account"
            )}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link to="/signin" className="text-primary hover:underline font-medium" tabIndex={0}>
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default SignUp;
