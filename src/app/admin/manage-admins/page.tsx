
"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { getAdmins, updateAdminPermissions } from "@/app/admin/login/actions";
import { Label } from "@/components/ui/label";

type AdminUser = {
  email: string;
  name: string;
  role: string;
  permissions: string[];
};

const allPermissions = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'orders', label: 'Orders' },
  { id: 'drugs', label: 'Medicines' },
  { id: 'buyers', label: 'Buyers' },
];

export default function ManageAdminsPage() {
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [initialAdmins, setInitialAdmins] = useState<AdminUser[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchAdmins() {
      const adminData = await getAdmins();
      setAdmins(adminData);
      // Create a deep copy for reset functionality
      setInitialAdmins(JSON.parse(JSON.stringify(adminData)));
    }
    fetchAdmins();
  }, []);

  const handlePermissionChange = (email: string, permissionId: string, checked: boolean) => {
    setAdmins(prevAdmins =>
      prevAdmins.map(admin => {
        if (admin.email === email) {
          const newPermissions = checked
            ? [...admin.permissions, permissionId]
            : admin.permissions.filter(p => p !== permissionId);
          return { ...admin, permissions: newPermissions };
        }
        return admin;
      })
    );
  };

  const handleSaveChanges = async (admin: AdminUser) => {
    const result = await updateAdminPermissions(admin.email, admin.permissions);
    if (result.success) {
      toast({
        title: "Permissions Updated",
        description: result.message,
      });
      // Update initial state to reflect saved changes
      setInitialAdmins(prev => prev.map(a => a.email === admin.email ? admin : a));
    } else {
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: "Could not save permission changes.",
      });
    }
  };

  const handleReset = (email: string) => {
    const originalAdmin = initialAdmins.find(a => a.email === email);
    if (originalAdmin) {
        setAdmins(prev => prev.map(a => a.email === email ? originalAdmin : a));
    }
  }

  const hasChanged = (email: string): boolean => {
    const currentAdmin = admins.find(a => a.email === email);
    const originalAdmin = initialAdmins.find(a => a.email === email);
    if (!currentAdmin || !originalAdmin) return false;
    return JSON.stringify(currentAdmin.permissions.sort()) !== JSON.stringify(originalAdmin.permissions.sort());
  }


  return (
    <Card>
      <CardHeader>
        <CardTitle>Manage Admin Access</CardTitle>
        <CardDescription>
          Assign permissions to administrators. Changes will take effect upon their next login.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Admin</TableHead>
                {allPermissions.map(p => (
                  <TableHead key={p.id} className="text-center">{p.label}</TableHead>
                ))}
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {admins.map((admin) => (
                <TableRow key={admin.email}>
                  <TableCell>
                    <div className="font-medium">{admin.name}</div>
                    <div className="text-sm text-muted-foreground">{admin.email}</div>
                  </TableCell>
                  {allPermissions.map(permission => (
                    <TableCell key={permission.id} className="text-center">
                      <Checkbox
                        id={`${admin.email}-${permission.id}`}
                        checked={admin.permissions.includes(permission.id)}
                        onCheckedChange={(checked) => handlePermissionChange(admin.email, permission.id, !!checked)}
                      />
                    </TableCell>
                  ))}
                   <TableCell className="text-right">
                    {hasChanged(admin.email) && (
                        <div className="flex gap-2 justify-end">
                            <Button size="sm" onClick={() => handleSaveChanges(admin)}>Save</Button>
                            <Button size="sm" variant="outline" onClick={() => handleReset(admin.email)}>Cancel</Button>
                        </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
      <CardFooter>
        <p className="text-xs text-muted-foreground">Super Admins have all permissions by default and cannot be edited.</p>
      </CardFooter>
    </Card>
  );
}
