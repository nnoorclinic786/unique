
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Logo } from "@/components/icons";
import { ChevronLeft, Mail } from "lucide-react";
import { useAppContext } from "@/context/app-context";

export default function AdminForgotPasswordPage() {
  const { admins } = useAppContext();
  const superAdmin = admins.find(a => a.role === 'Super Admin');

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Link href="/" className="flex items-center gap-2">
              <Logo className="h-12 w-12 text-primary" />
            </Link>
          </div>
          <CardTitle className="font-headline text-2xl">Forgot Admin Password?</CardTitle>
          <CardDescription>
            To reset your password, please contact the Super Admin.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
            <p className="text-muted-foreground">
                For security reasons, password resets must be handled manually by the Super Admin.
            </p>
            {superAdmin && (
                <div className="flex items-center justify-center gap-2 rounded-md border bg-muted/50 p-3">
                    <Mail className="h-5 w-5 text-muted-foreground" />
                    <a href={`mailto:${superAdmin.email}`} className="font-medium text-primary hover:underline">
                        {superAdmin.email}
                    </a>
                </div>
            )}
            <div className="mt-4 text-center">
                <Button variant="link" asChild>
                    <Link href="/admin/login">
                        <ChevronLeft className="mr-2 h-4 w-4" />
                        Back to Admin Login
                    </Link>
                </Button>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
