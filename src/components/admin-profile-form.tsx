"use client";

import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { AdminUser } from '@/lib/types';
import { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface AdminProfileFormProps {
    admin: AdminUser | null;
    onSave: (data: z.infer<typeof formSchema>) => void;
}

const formSchema = z.object({
  name: z.string().min(2, "Name is required."),
  email: z.string().email("Invalid email address."),
  currentPassword: z.string().optional(),
  newPassword: z.string().optional(),
  confirmPassword: z.string().optional(),
}).refine(data => {
    // If newPassword is provided, currentPassword must also be provided
    if (data.newPassword && !data.currentPassword) {
        return false;
    }
    return true;
}, {
    message: "Current password is required to set a new one.",
    path: ["currentPassword"],
}).refine(data => {
    // If newPassword is provided, it must match confirmPassword
    if (data.newPassword && data.newPassword !== data.confirmPassword) {
        return false;
    }
    return true;
}, {
    message: "New passwords do not match.",
    path: ["confirmPassword"],
}).refine(data => {
    // New password should be at least 6 chars if provided
    if (data.newPassword && data.newPassword.length < 6) {
        return false;
    }
    return true;
}, {
    message: "New password must be at least 6 characters.",
    path: ["newPassword"],
});


export function AdminProfileForm({ admin, onSave }: AdminProfileFormProps) {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    },
  });
  
  useEffect(() => {
    if (admin) {
        form.reset({
            name: admin.name,
            email: admin.email,
        });
    }
  }, [admin, form]);

  const isSuperAdmin = admin?.role === 'Super Admin';

  return (
      <Form {...form}>
          <form onSubmit={form.handleSubmit(onSave)} className="space-y-8">
            <FormField control={form.control} name="name" render={({ field }) => (
                <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl><Input placeholder="e.g., John Doe" {...field} /></FormControl>
                    <FormMessage />
                </FormItem>
            )} />
             <FormField control={form.control} name="email" render={({ field }) => (
                <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl><Input type="email" placeholder="admin@example.com" {...field} readOnly={isSuperAdmin} /></FormControl>
                    {isSuperAdmin && <FormMessage>Super Admin email cannot be changed.</FormMessage>}
                    {!isSuperAdmin && <FormMessage />}
                </FormItem>
            )} />

            <div className="space-y-4 pt-4 border-t">
                 <h3 className="text-lg font-medium font-headline">Change Password</h3>
                 <FormField control={form.control} name="currentPassword" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Current Password</FormLabel>
                        <div className="relative">
                            <FormControl>
                                <Input type={showCurrentPassword ? "text" : "password"} placeholder="Enter your current password" {...field} />
                            </FormControl>
                             <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-muted-foreground"
                                onClick={() => setShowCurrentPassword((prev) => !prev)}
                            >
                                {showCurrentPassword ? <EyeOff /> : <Eye />}
                            </Button>
                        </div>
                        <FormMessage />
                    </FormItem>
                )} />
                 <FormField control={form.control} name="newPassword" render={({ field }) => (
                    <FormItem>
                        <FormLabel>New Password</FormLabel>
                        <div className="relative">
                            <FormControl>
                                <Input type={showNewPassword ? "text" : "password"} placeholder="Enter new password" {...field} />
                            </FormControl>
                             <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-muted-foreground"
                                onClick={() => setShowNewPassword((prev) => !prev)}
                            >
                                {showNewPassword ? <EyeOff /> : <Eye />}
                            </Button>
                        </div>
                        <FormMessage />
                    </FormItem>
                )} />
                 <FormField control={form.control} name="confirmPassword" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Confirm New Password</FormLabel>
                        <div className="relative">
                            <FormControl>
                                <Input type={showConfirmPassword ? "text" : "password"} placeholder="Confirm new password" {...field} />
                             </FormControl>
                             <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-muted-foreground"
                                onClick={() => setShowConfirmPassword((prev) => !prev)}
                            >
                                {showConfirmPassword ? <EyeOff /> : <Eye />}
                            </Button>
                        </div>
                        <FormMessage />
                    </FormItem>
                )} />
            </div>

            <div className="flex justify-end">
                <Button type="submit">Save Changes</Button>
            </div>
          </form>
      </Form>
  );
}
