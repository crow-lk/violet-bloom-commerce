import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, MailCheck, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Layout from "@/components/layout/Layout";
import { forgotPassword, sendPasswordResetSms, verifyPasswordResetSms } from "@/lib/api";
import { getApiErrorMessage } from "@/lib/api/client";
import { useToast } from "@/hooks/use-toast";

const CODE_LENGTH = 6;

function EmailResetForm() {
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
      toast({
        title: "Could not send reset link",
        description: getApiErrorMessage(error, "Something went wrong. Please try again."),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (sentTo) {
    return (
      <div className="text-center space-y-4">
        <MailCheck className="h-12 w-12 text-primary mx-auto" />
        <h2 className="font-display text-xl font-bold">Check your email</h2>
        <p className="text-sm text-muted-foreground">
          If an account exists for <span className="font-medium text-foreground">{sentTo}</span>, we've sent a link to
          reset your password. The link expires in 60 minutes.
        </p>
        <p className="text-sm text-muted-foreground">Don't see it? Check your spam folder.</p>
        <Button variant="outline" className="w-full" onClick={() => setSentTo(null)}>
          Use a different email
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <p className="text-sm text-muted-foreground text-center">
        Enter the email you signed up with and we'll send you a link to reset your password.
      </p>
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
  );
}

function PhoneResetForm() {
  const navigate = useNavigate();
  const [mobile, setMobile] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState<"mobile" | "code">("mobile");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expiresInMinutes, setExpiresInMinutes] = useState(10);
  const [resendIn, setResendIn] = useState(0);

  useEffect(() => {
    if (resendIn <= 0) return;
    const timer = window.setTimeout(() => setResendIn((s) => s - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [resendIn]);

  const requestCode = async () => {
    setError(null);
    setIsSubmitting(true);
    try {
      const res = await sendPasswordResetSms({ mobile });
      setExpiresInMinutes(res.expires_in_minutes);
      setResendIn(res.resend_after_seconds);
      setCode("");
      setStep("code");
    } catch (err) {
      setError(getApiErrorMessage(err, "Could not send the code. Please try again."));
    } finally {
      setIsSubmitting(false);
    }
  };

  const verifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length !== CODE_LENGTH) {
      setError(`Enter the ${CODE_LENGTH}-digit code from the SMS.`);
      return;
    }
    setError(null);
    setIsSubmitting(true);
    try {
      const res = await verifyPasswordResetSms({ mobile, code });
      const params = new URLSearchParams({ token: res.token, mobile });
      navigate(`/reset-password?${params.toString()}`);
    } catch (err) {
      setCode("");
      setError(getApiErrorMessage(err, "Could not verify the code. Please try again."));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (step === "mobile") {
    return (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          requestCode();
        }}
        className="space-y-4"
      >
        <p className="text-sm text-muted-foreground text-center">
          Enter the mobile number on your account and we'll text you a {CODE_LENGTH}-digit reset code.
        </p>
        <div>
          <Label htmlFor="forgot-mobile">Mobile Number</Label>
          <Input
            id="forgot-mobile"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            required
            autoFocus
            className="mt-1"
            placeholder="07X XXX XXXX"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
          />
        </div>
        {error && (
          <p role="alert" className="text-sm text-destructive">
            {error}
          </p>
        )}
        <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
          {isSubmitting ? "Sending..." : "Send Code"}
        </Button>
      </form>
    );
  }

  return (
    <form onSubmit={verifyCode} className="space-y-4">
      <p className="text-sm text-muted-foreground text-center">
        If an account uses <span className="font-medium text-foreground">{mobile}</span>, we've sent it a{" "}
        {CODE_LENGTH}-digit code. It expires in {expiresInMinutes} minutes.
      </p>
      <div className="flex justify-center">
        <InputOTP maxLength={CODE_LENGTH} value={code} onChange={setCode} autoFocus inputMode="numeric" pattern="^[0-9]*$">
          <InputOTPGroup>
            {Array.from({ length: CODE_LENGTH }, (_, i) => (
              <InputOTPSlot key={i} index={i} />
            ))}
          </InputOTPGroup>
        </InputOTP>
      </div>
      {error && (
        <p role="alert" className="text-sm text-destructive text-center">
          {error}
        </p>
      )}
      <Button type="submit" className="w-full" size="lg" disabled={isSubmitting || code.length !== CODE_LENGTH}>
        {isSubmitting ? "Verifying..." : "Verify Code"}
      </Button>
      <div className="flex items-center justify-between text-sm">
        <button
          type="button"
          className="text-muted-foreground hover:underline"
          onClick={() => {
            setStep("mobile");
            setError(null);
          }}
        >
          Change number
        </button>
        <button
          type="button"
          className="text-primary font-medium hover:underline disabled:text-muted-foreground disabled:no-underline"
          disabled={resendIn > 0 || isSubmitting}
          onClick={requestCode}
        >
          {resendIn > 0 ? `Resend code in ${resendIn}s` : "Resend code"}
        </button>
      </div>
    </form>
  );
}

export default function ForgotPasswordPage() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-16 max-w-md">
        <div className="glass rounded-2xl p-8 shadow-purple">
          <h1 className="font-display text-2xl font-bold text-center mb-6">Forgot Password?</h1>
          <Tabs defaultValue="email">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="email">
                <Mail className="h-4 w-4 mr-1" /> Email
              </TabsTrigger>
              <TabsTrigger value="phone">
                <Smartphone className="h-4 w-4 mr-1" /> Phone
              </TabsTrigger>
            </TabsList>
            <TabsContent value="email">
              <EmailResetForm />
            </TabsContent>
            <TabsContent value="phone">
              <PhoneResetForm />
            </TabsContent>
          </Tabs>
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
