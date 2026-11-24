import { useState } from "react";
import { Link } from "react-router-dom";
import { MailCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Layout from "@/components/layout/Layout";
import { forgotPassword } from "@/lib/api";
import { ApiError } from "@/lib/api/client";
import { useToast } from "@/hooks/use-toast";

export default function ForgotPasswordPage() {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sentTo, setSentTo] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await forgotPassword({ email });
      setSentTo(email);
    } catch (error) {
      const description =
        error instanceof ApiError && error.status === 429
          ? "Too many attempts. Please wait a minute and try again."
          : "Something went wrong. Please try again.";
      toast({ title: "Could not send reset link", description, variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-16 max-w-md">
        <div className="glass rounded-2xl p-8 shadow-purple">
          {sentTo ? (
            <div className="text-center space-y-4">
              <MailCheck className="h-12 w-12 text-primary mx-auto" />
              <h1 className="font-display text-2xl font-bold">Check your email</h1>
              <p className="text-sm text-muted-foreground">
                If an account exists for <span className="font-medium text-foreground">{sentTo}</span>, we've sent a link to
                reset your password. The link expires in 60 minutes.
              </p>
              <p className="text-sm text-muted-foreground">Don't see it? Check your spam folder.</p>
              <Button variant="outline" className="w-full" onClick={() => setSentTo(null)}>
                Use a different email
              </Button>
            </div>
          ) : (
            <>
              <h1 className="font-display text-2xl font-bold text-center mb-2">Forgot Password?</h1>
              <p className="text-sm text-muted-foreground text-center mb-6">
                Enter the email you signed up with and we'll send you a link to reset your password.
              </p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="forgot-email">Email</Label>
                  <Input
                    id="forgot-email"
                    type="email"
                    required
                    autoFocus
                    className="mt-1"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                  {isSubmitting ? "Sending..." : "Send Reset Link"}
                </Button>
              </form>
            </>
          )}
          <p className="text-center text-sm text-muted-foreground mt-6">
            Remembered it?{" "}
            <Link to="/account" className="text-primary font-medium hover:underline">
              Back to Log In
            </Link>
          </p>
        </div>
      </div>
    </Layout>
  );
}
