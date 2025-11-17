
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/icons";
import { useToast } from "@/hooks/use-toast";
import { useAppContext } from "@/context/app-context";
import { Eye, EyeOff } from "lucide-react";
import Cookies from 'js-cookie';
import ClientLayout from "../client-layout";

function LoginPageContent() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const { buyers, pendingBuyers, disabledBuyers } = useAppContext();
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  useEffect(() => {
    const adminCookie = Cookies.get('admin_session');
    if (adminCookie) {
      try {
        const session = JSON.parse(adminCookie);
        if (session.isLoggedIn) {
          setIsAdminLoggedIn(true);
        }
      } catch (e) {
        setIsAdminLoggedIn(false);
      }
    }
  }, []);

  const allBuyers = [...buyers, ...pendingBuyers, ...disabledBuyers];

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    const buyer = allBuyers.find(
      (b) => b.email === email && b.password === password
    );

    if (buyer) {
        if (buyer.status === 'Pending') {
            toast({
                variant: "destructive",
                title: "Login Failed",
                description: "Your account is still pending approval.",
            });
        } else if (buyer.status === 'Disabled') {
            toast({
                variant: "destructive",
                title: "Login Failed",
                description: "Your account has been disabled. Please contact support.",
            });
        }
        else if (buyer.status === 'Approved') {
            // In a real app, you'd set a session cookie or token
            toast({
                title: "Login Successful",
                description: "Welcome back!",
            });
            // For now, we simulate login by storing a value in localStorage
            localStorage.setItem('userLoggedIn', 'true');
            localStorage.setItem('userName', buyer.name);
            router.push("/medicines");
        }
    } else {
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: "Invalid email or password.",
      });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Link href="/" className="flex items-center gap-2">
              <Logo className="h-12 w-12 text-primary" />
            </Link>
          </div>
          <CardTitle className="font-headline text-2xl">Welcome Back</CardTitle>
          <CardDescription>Enter your email below to login to your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4" onSubmit={handleLogin}>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <Link href="/forgot-password" className="ml-auto inline-block text-sm underline">
                  Forgot your password?
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-muted-foreground"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                  <span className="sr-only">{showPassword ? 'Hide password' : 'Show password'}</span>
                </Button>
              </div>
            </div>
            <Button type="submit" className="w-full">
              Login
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="underline">
              Sign up
            </Link>
          </div>
           {!isAdminLoggedIn && (
            <div className="mt-4 text-center text-sm">
                Are you an admin?{" "}
                <Link href="/admin/login" className="underline">
                Login here
                </Link>
            </div>
           )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function LoginPage() {
    return (
        <ClientLayout>
            <LoginPageContent />
        </ClientLayout>
    )
}
