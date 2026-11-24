import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Layout from "@/components/layout/Layout";
import { resetPassword } from "@/lib/api";
import { ApiError } from "@/lib/api/client";
import { useToast } from "@/hooks/use-toast";

const MIN_PASSWORD_LENGTH = 8;

function firstValidationError(error: unknown): string | null {
  if (!(error instanceof ApiError)) return null;
  if (error.status === 429) return "Too many attempts. Please wait a minute and try again.";
  const errors = (error.payload as { errors?: Record<string, string[]> } | undefined)?.errors;
  const first = errors ? Object.values(errors).flat()[0] : undefined;
  return first || error.message || null;
}

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const token = searchParams.get("token") || "";
  const email = searchParams.get("email") || "";
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < MIN_PASSWORD_LENGTH) {
      setError(`Password must be at least ${MIN_PASSWORD_LENGTH} characters.`);
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);
    try {
      await resetPassword({ token, email, password, password_confirmation: confirmPassword });
      toast({ title: "Password reset", description: "You can now log in with your new password." });
      navigate("/account", { replace: true });
    } catch (err) {
      setError(firstValidationError(err) || "Could not reset your password. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!token || !email) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 max-w-md">
          <div className="glass rounded-2xl p-8 shadow-purple text-center space-y-4">
            <h1 className="font-display text-2xl font-bold">Invalid reset link</h1>
            <p className="text-sm text-muted-foreground">
              This password reset link is incomplete or broken. Please request a new one.
            </p>
            <Button asChild className="w-full">
              <Link to="/forgot-password">Request a new link</Link>
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-16 max-w-md">
        <div className="glass rounded-2xl p-8 shadow-purple">
          <h1 className="font-display text-2xl font-bold text-center mb-2">Set a New Password</h1>
          <p className="text-sm text-muted-foreground text-center mb-6">
            Choose a new password for <span className="font-medium text-foreground">{email}</span>.
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="new-password">New Password</Label>
              <Input
                id="new-password"
                type="password"
                required
                autoFocus
                autoComplete="new-password"
                minLength={MIN_PASSWORD_LENGTH}
                className="mt-1"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <p className="text-xs text-muted-foreground mt-1">At least {MIN_PASSWORD_LENGTH} characters.</p>
            </div>
            <div>
              <Label htmlFor="confirm-password">Confirm New Password</Label>
              <Input
                id="confirm-password"
                type="password"
                required
                autoComplete="new-password"
                className="mt-1"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            {error && (
              <p role="alert" className="text-sm text-destructive">
                {error}{" "}
                {/expired|invalid/i.test(error) && (
                  <Link to="/forgot-password" className="underline font-medium">
                    Request a new link
                  </Link>
                )}
              </p>
            )}
            <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
              {isSubmitting ? "Resetting..." : "Reset Password"}
            </Button>
          </form>
          <p className="text-center text-sm text-muted-foreground mt-6">
            <Link to="/account" className="text-primary font-medium hover:underline">
              Back to Log In
            </Link>
          </p>
        </div>
      </div>
    </Layout>
  );
}
