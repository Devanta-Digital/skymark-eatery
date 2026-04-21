import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useSeo } from "@/lib/seo";
import { Loader2, Eye, EyeOff, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

export default function AdminLogin() {
  useSeo({
    title: "Staff Login | Skymark Eatery by Caffe E Pranzo",
    description: "Staff and admin login for Skymark Eatery.",
    path: "/admin-login",
    robots: "noindex, nofollow",
  });

  const [, navigate] = useLocation();
  const { login, user } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const staffRedirect = (role: string) =>
    role === "staff" ? "/kitchen" : "/admin";

  if (user && ["admin", "developer", "staff"].includes(user.role)) {
    navigate(staffRedirect(user.role));
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const loggedInUser = await login(email, password);
      toast.success("Welcome back!");
      navigate(staffRedirect(loggedInUser?.role ?? ""));
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-primary flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-block bg-white rounded-xl px-6 py-3 shadow-lg mb-4">
            <img src="/logo.webp" alt="Skymark Eatery" className="h-12 w-auto object-contain" />
          </div>
          <div className="flex items-center justify-center gap-2 text-primary-foreground/80">
            <ShieldCheck className="w-4 h-4" />
            <span className="text-sm uppercase tracking-widest font-medium">Staff & Admin Portal</span>
          </div>
        </div>

        <Card className="shadow-2xl border-0">
          <CardHeader className="pb-4">
            <CardTitle className="font-serif text-2xl text-center">Staff Login</CardTitle>
            <CardDescription className="text-center text-sm">
              Authorized personnel only
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="info@skymarkeatery.ca"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPass ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="pr-10"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    onClick={() => setShowPass(!showPass)}
                  >
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={loading} size="lg">
                {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Signing in...</> : "Access Admin Portal"}
              </Button>
            </form>
            <div className="mt-4 text-center">
              <Link href="/" className="text-xs text-muted-foreground hover:text-primary">
                ← Back to Restaurant
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
