"use client";

import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { AdminProfileForm } from "@/components/admin-profile-form";
import { useAppContext } from "@/context/app-context";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import type { AdminUser } from "@/lib/types";

export default function AdminProfilePage() {
  const { admins, updateAdminDetails } = useAppContext();
  const { toast } = useToast();
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);

  useEffect(() => {
    const adminCookie = Cookies.get('admin_session');
    if (adminCookie) {
      try {
        const session = JSON.parse(adminCookie);
        const user = admins.find(a => a.email === session.email);
        if(user) {
          setCurrentUser(user);
        }
      } catch (e) {
        console.error("Failed to parse admin session", e);
      }
    }
  }, [admins]);


  const handleProfileSave = (data: any) => {
    if (currentUser) {
        const result = updateAdminDetails(currentUser.email, data);
        if(result.success) {
            toast({
                title: "Profile Updated",
                description: "Your account details have been successfully updated.",
            });
        } else {
             toast({
                variant: "destructive",
                title: "Update Failed",
                description: result.error,
            });
        }
    }
  };

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle className="font-headline">My Profile</CardTitle>
        <CardDescription>
          Manage your account settings and update your password here.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <AdminProfileForm
            admin={currentUser}
            onSave={handleProfileSave}
        />
      </CardContent>
    </Card>
  );
}
