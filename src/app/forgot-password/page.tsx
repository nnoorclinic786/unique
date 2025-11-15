
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/icons";
import { ChevronLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import React from "react";

export default function ForgotPasswordPage() {
  const { toast } = useToast();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = formData.get("email");

    if (email) {
      toast({
        title: "Reset Link Sent",
        description: `If an account with the email ${email} exists, a password reset link has been sent.`,
      });
    } else {
        toast({
            variant: "destructive",
            title: "Error",
            description: "Please enter your email address.",
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
          <CardTitle className="font-headline text-2xl">Forgot Your Password?</CardTitle>
          <CardDescription>
            No problem. Enter your email and we'll send you a reset link.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4" onSubmit={handleSubmit}>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="m@example.com"
                required
              />
            </div>
            <Button type="submit" className="w-full">
              Send Reset Link
            </Button>
          </form>
          <div className="mt-4 text-center">
            <Button variant="link" asChild>
                <Link href="/login">
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    Back to Login
                </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
