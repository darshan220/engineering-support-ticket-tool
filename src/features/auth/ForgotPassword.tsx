import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import logo from "@/assets/logo.png";

const ForgotPassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [email, setEmail] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setSent(true);
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="flex items-center gap-3 mb-8">
          <div className="flex h-10 w-10 items-center justify-center">
            <img src={logo} alt="Dev Ticket Flow" className="h-9 w-9 object-contain" />
          </div>
          <h1 className="text-xl font-bold tracking-tight">Dev Ticket Flow</h1>
        </div>

        {sent ? (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.1 }}
              className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10"
            >
              <Mail className="h-8 w-8 text-emerald-500" />
            </motion.div>
            <h2 className="text-2xl font-bold mb-2 text-center">Check your email</h2>
            <p className="text-muted-foreground text-center mb-6">
              We've sent a password reset link to <span className="font-medium text-foreground">{email}</span>
            </p>
            <Link to="/signin">
              <Button variant="outline" className="w-full h-11">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Sign In
              </Button>
            </Link>
          </motion.div>
        ) : (
          <>
            <h2 className="text-2xl font-bold mb-2">Forgot password?</h2>
            <p className="text-muted-foreground mb-6">
              No worries, we'll send you a reset link.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="reset-email" className="text-sm font-medium">Email</label>
                <Input
                  id="reset-email"
                  type="email"
                  placeholder="alex@nexusops.io"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  aria-label="Email address"
                />
              </div>

              <Button type="submit" className="w-full h-11" disabled={isLoading}>
                {isLoading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full"
                  />
                ) : (
                  "Send Reset Link"
                )}
              </Button>
            </form>

            <Link
              to="/signin"
              className="flex items-center justify-center gap-2 mt-6 text-sm text-muted-foreground hover:text-foreground transition-colors"
              tabIndex={0}
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Sign In
            </Link>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
