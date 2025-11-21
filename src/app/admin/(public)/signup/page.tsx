
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useState } from "react";
import { useAuth, useFirestore } from "@/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Logo } from "@/components/icons";
import { Eye, EyeOff } from "lucide-react";
import type { AdminUser } from "@/lib/types";

const formSchema = z.object({
  name: z.string().min(2, "Name is required."),
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(6, "Password must be at least 6 characters."),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

export default function AdminSignupPage() {
  const { toast } = useToast();
  const router = useRouter();
  const auth = useAuth();
  const firestore = useFirestore();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
        // We create the user in Firebase Auth first.
        // NOTE: This will fail if the email is already in use by ANY user (buyer or admin).
        // This is a good thing for security.
        const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password);
        
        // Then, we create a corresponding document in the `admins` collection in Firestore.
        const adminData: Omit<AdminUser, 'id' | 'password'> = {
            name: values.name,
            email: values.email,
            role: "Admin",
            permissions: [], // Permissions will be granted by a Super Admin
            status: 'Pending',
        };

        await setDoc(doc(firestore, "admins", userCredential.user.uid), adminData);

        toast({
            title: "Registration Submitted!",
            description: "Your registration is under review. The Super Admin will approve your account shortly.",
        });
        router.push("/admin/login");

    } catch (error: any) {
        let errorMessage = "Registration failed. Please try again.";
        if (error.code === 'auth/email-already-in-use') {
            errorMessage = "This email address is already in use.";
        }
        toast({
            variant: "destructive",
            title: "Registration Failed",
            description: errorMessage,
        });
        console.error("Admin signup error:", error);
    } finally {
        setIsSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-gray-50">
      <Card className="w-full max-w-md mx-auto my-8">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Link href="/" className="flex items-center gap-2">
              <Logo className="h-12 w-12 text-primary" />
            </Link>
          </div>
          <CardTitle className="font-headline text-2xl">Admin Registration</CardTitle>
          <CardDescription>Fill in the details below to request an admin account.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField control={form.control} name="name" render={({ field }) => (
                    <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl><Input placeholder="e.g., John Doe" {...field} /></FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField control={form.control} name="email" render={({ field }) => (
                    <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl><Input placeholder="admin@example.com" {...field} /></FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField control={form.control} name="password" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Password</FormLabel>
                        <div className="relative">
                            <FormControl>
                                <Input type={showPassword ? "text" : "password"} placeholder="••••••••" {...field} />
                            </FormControl>
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
                        <FormMessage />
                    </FormItem>
                )}
                />
                <FormField control={form.control} name="confirmPassword" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
                         <div className="relative">
                            <FormControl>
                                <Input type={showConfirmPassword ? "text" : "password"} placeholder="••••••••" {...field} />
                            </FormControl>
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-muted-foreground"
                                onClick={() => setShowConfirmPassword((prev) => !prev)}
                            >
                                {showConfirmPassword ? <EyeOff /> : <Eye />}
                                <span className="sr-only">{showConfirmPassword ? 'Hide password' : 'Show password'}</span>
                            </Button>
                        </div>
                        <FormMessage />
                    </FormItem>
                )}
                />
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Request Account'}
              </Button>
            </form>
          </Form>
          <div className="mt-6 text-center text-sm">
            Already have an account?{" "}
            <Link href="/admin/login" className="underline">
              Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
