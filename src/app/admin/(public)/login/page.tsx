
"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/icons";
import { useToast } from "@/hooks/use-toast";
import { login } from "./actions";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

export default function AdminLoginPage() {
  const { toast } = useToast();
  const auth = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      // Step 1: Sign in with Firebase Auth on the client
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Step 2: If sign-in is successful, create a new FormData and call the server action
      // to set the secure cookie.
      const serverFormData = new FormData();
      serverFormData.append('email', user.email || "");
      serverFormData.append('uid', user.uid);
      
      const result = await login(serverFormData);

      if (result?.error) {
        setError(result.error);
        toast({
          variant: "destructive",
          title: "Login Failed",
          description: result.error,
        });
      }
      // On success, the server action will handle the redirect.

    } catch (e: any) {
      // This catches errors from both Firebase Auth signIn and the server action
      let errorMessage = "An unexpected error occurred.";
      if (e.code) { // Firebase error
        switch(e.code) {
          case 'auth/user-not-found':
          case 'auth/wrong-password':
          case 'auth/invalid-credential':
            errorMessage = "Invalid email or password.";
            break;
          default:
            errorMessage = e.message;
            break;
        }
      } else if (e.message !== 'NEXT_REDIRECT') {
        errorMessage = e.message;
      }
      
      if (e.message !== 'NEXT_REDIRECT') {
        setError(errorMessage);
        toast({
          variant: "destructive",
          title: "Login Failed",
          description: errorMessage,
        });
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Link href="/" className="flex items-center gap-2">
              <Logo className="h-12 w-12 text-primary" />
            </Link>
          </div>
          <CardTitle className="font-headline text-2xl">Admin Login</CardTitle>
          <CardDescription>Enter your credentials to access the admin dashboard.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4" onSubmit={handleSubmit}>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="admin@medicare.com"
                required
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <Link href="/admin/forgot-password" className="ml-auto inline-block text-sm underline">
                  Forgot your password?
                </Link>
              </div>
              <div className="relative">
                <Input 
                  id="password" 
                  name="password" 
                  type={showPassword ? "text" : "password"} 
                  required 
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
            {error && <p className="text-sm font-medium text-destructive">{error}</p>}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Logging in...' : 'Login'}
            </Button>
          </form>
           <div className="mt-4 text-center text-sm">
            Want to become an admin?{" "}
            <Link href="/admin/signup" className="underline">
              Sign up here
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
