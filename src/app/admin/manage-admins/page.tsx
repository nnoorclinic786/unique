
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
import { getAdmins, updateAdminPermissions, approveAdmin, toggleAdminStatus } from "@/app/admin/login/actions";
import { MoreHorizontal, CheckCircle2, Eye, EyeOff } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

type AdminUser = {
  email: string;
  name: string;
  role: string;
  permissions: string[];
  status: 'Approved' | 'Pending' | 'Disabled';
};

const allPermissions = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'orders', label: 'Orders' },
  { id: 'drugs', label: 'Medicines' },
  { id: 'buyers', label: 'Buyers' },
];

export default function ManageAdminsPage() {
  const [allAdmins, setAllAdmins] = useState<AdminUser[]>([]);
  const [initialAdmins, setInitialAdmins] = useState<AdminUser[]>([]);
  const { toast } = useToast();

  const fetchAdmins = async () => {
    const adminData = await getAdmins();
    // Filter out Super Admin from being managed
    const manageableAdmins = adminData.filter(a => a.role !== 'Super Admin'); 
    setAllAdmins(manageableAdmins);
    setInitialAdmins(JSON.parse(JSON.stringify(manageableAdmins)));
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const handlePermissionChange = (email: string, permissionId: string, checked: boolean) => {
    setAllAdmins(prevAdmins =>
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
      fetchAdmins(); // Refetch to update initial state
    } else {
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: "Could not save permission changes.",
      });
    }
  };
  
  const handleApprove = async (email: string) => {
    const result = await approveAdmin(email);
    if (result.success) {
      toast({ title: "Admin Approved", description: result.message });
      fetchAdmins();
    } else {
      toast({ variant: "destructive", title: "Approval Failed", description: result.error });
    }
  }

  const handleToggleStatus = async (email: string, status: 'Approved' | 'Disabled') => {
      const result = await toggleAdminStatus(email, status);
      if (result.success) {
          toast({ title: "Status Updated", description: result.message });
          fetchAdmins();
      } else {
          toast({ variant: "destructive", title: "Update Failed", description: result.error });
      }
  }


  const handleReset = (email: string) => {
    const originalAdmin = initialAdmins.find(a => a.email === email);
    if (originalAdmin) {
        setAllAdmins(prev => prev.map(a => a.email === email ? originalAdmin : a));
    }
  }

  const hasChanged = (email: string): boolean => {
    const currentAdmin = allAdmins.find(a => a.email === email);
    const originalAdmin = initialAdmins.find(a => a.email === email);
    if (!currentAdmin || !originalAdmin) return false;
    return JSON.stringify(currentAdmin.permissions.sort()) !== JSON.stringify(originalAdmin.permissions.sort());
  }

  const pendingAdmins = allAdmins.filter(a => a.status === 'Pending');
  const approvedAdmins = allAdmins.filter(a => a.status === 'Approved');
  const disabledAdmins = allAdmins.filter(a => a.status === 'Disabled');

  return (
    <div className="space-y-8">
       {pendingAdmins.length > 0 && (
         <Card>
           <CardHeader>
             <CardTitle>Pending Admin Approvals</CardTitle>
             <CardDescription>These users have signed up and are waiting for your approval.</CardDescription>
           </CardHeader>
           <CardContent>
             <Table>
               <TableHeader>
                 <TableRow>
                   <TableHead>User</TableHead>
                   <TableHead>Role</TableHead>
                   <TableHead className="text-right">Actions</TableHead>
                 </TableRow>
               </TableHeader>
               <TableBody>
                 {pendingAdmins.map(admin => (
                   <TableRow key={admin.email}>
                     <TableCell>
                       <div className="font-medium">{admin.name}</div>
                       <div className="text-sm text-muted-foreground">{admin.email}</div>
                     </TableCell>
                     <TableCell>{admin.role}</TableCell>
                     <TableCell className="text-right">
                       <Button size="sm" onClick={() => handleApprove(admin.email)}>
                         <CheckCircle2 className="mr-2 h-4 w-4" /> Approve
                       </Button>
                     </TableCell>
                   </TableRow>
                 ))}
               </TableBody>
             </Table>
           </CardContent>
         </Card>
       )}


      <Card>
        <CardHeader>
          <CardTitle>Manage Admin Access</CardTitle>
          <CardDescription>
            Assign permissions to approved administrators. Changes will take effect upon their next login.
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
                {approvedAdmins.map((admin) => (
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
                        <div className="flex gap-2 justify-end">
                            {hasChanged(admin.email) ? (<>
                                <Button size="sm" onClick={() => handleSaveChanges(admin)}>Save</Button>
                                <Button size="sm" variant="outline" onClick={() => handleReset(admin.email)}>Cancel</Button>
                            </>) : (
                                <Button size="sm" variant="outline" onClick={() => handleToggleStatus(admin.email, 'Approved')}>
                                    <EyeOff className="mr-2 h-4 w-4" /> Disable
                                </Button>
                            )}
                        </div>
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
      
      {disabledAdmins.length > 0 && (
         <Card>
           <CardHeader>
             <CardTitle>Disabled Admins</CardTitle>
             <CardDescription>These admin accounts are currently disabled.</CardDescription>
           </CardHeader>
           <CardContent>
             <Table>
               <TableHeader>
                 <TableRow>
                   <TableHead>User</TableHead>
                   <TableHead>Role</TableHead>
                   <TableHead className="text-right">Actions</TableHead>
                 </TableRow>
               </TableHeader>
               <TableBody>
                 {disabledAdmins.map(admin => (
                   <TableRow key={admin.email}>
                     <TableCell>
                       <div className="font-medium">{admin.name}</div>
                       <div className="text-sm text-muted-foreground">{admin.email}</div>
                     </TableCell>
                     <TableCell><Badge variant="destructive">{admin.role}</Badge></TableCell>
                     <TableCell className="text-right">
                       <Button size="sm" variant="outline" onClick={() => handleToggleStatus(admin.email, 'Disabled')}>
                         <Eye className="mr-2 h-4 w-4" /> Enable
                       </Button>
                     </TableCell>
                   </TableRow>
                 ))}
               </TableBody>
             </Table>
           </CardContent>
         </Card>
       )}
    </div>
  );
}
