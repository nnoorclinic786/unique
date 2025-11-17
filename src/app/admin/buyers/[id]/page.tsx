
"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAppContext } from "@/context/app-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ChevronLeft, Mail, Phone, Building, MapPin, FileText, User } from "lucide-react";

export default function BuyerDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;
  const { buyers, pendingBuyers, disabledBuyers } = useAppContext();

  const allBuyers = [...buyers, ...pendingBuyers, ...disabledBuyers];
  const buyer = allBuyers.find((b) => b.id === id);

  if (!buyer) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>Buyer not found.</p>
      </div>
    );
  }

  const DetailItem = ({ icon, label, value }: { icon: React.ReactNode, label: string, value?: string }) => {
    if (!value) return null;
    return (
        <div className="flex items-start gap-3">
            <span className="text-muted-foreground mt-1">{icon}</span>
            <div>
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className="font-medium">{value}</p>
            </div>
        </div>
    )
  }

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center gap-4">
           <Button variant="outline" size="icon" className="h-7 w-7" asChild>
                <Link href="/admin/buyers">
                    <ChevronLeft className="h-4 w-4" />
                    <span className="sr-only">Back</span>
                </Link>
            </Button>
          <div>
            <div className="flex items-center gap-4">
              <CardTitle className="font-headline text-2xl">{buyer.name}</CardTitle>
              <Badge variant={buyer.status === 'Approved' ? "default" : buyer.status === 'Pending' ? 'secondary' : 'destructive'}>{buyer.status}</Badge>
            </div>
            <CardDescription>Registered on {buyer.registeredOn}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        
        {/* Personal & Business */}
        <div>
            <h3 className="text-lg font-medium font-headline mb-4 border-b pb-2">Personal & Business Details</h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <DetailItem icon={<User size={16}/>} label="Business Name" value={buyer.name} />
                <DetailItem icon={<User size={16}/>} label="Contact Person" value={buyer.personName} />
                <DetailItem icon={<Building size={16}/>} label="Business Type" value={buyer.type} />
            </div>
        </div>
        
        <Separator />

        {/* Contact Details */}
        <div>
            <h3 className="text-lg font-medium font-headline mb-4 border-b pb-2">Contact Information</h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <DetailItem icon={<Mail size={16}/>} label="Email" value={buyer.email} />
                <DetailItem icon={<Phone size={16}/>} label="Mobile 1" value={buyer.mobileNumber1} />
                <DetailItem icon={<Phone size={16}/>} label="Mobile 2" value={buyer.mobileNumber2} />
            </div>
        </div>
        
        <Separator />

        {/* Address Details */}
        <div>
            <h3 className="text-lg font-medium font-headline mb-4 border-b pb-2">Address</h3>
             <div className="grid sm:grid-cols-2 gap-6">
                <DetailItem icon={<MapPin size={16}/>} label="Full Address" value={buyer.address} />
                <DetailItem icon={<MapPin size={16}/>} label="City / Area" value={buyer.businessLocation} />
            </div>
        </div>

        <Separator />
        
        {/* Verification Details */}
        <div>
            <h3 className="text-lg font-medium font-headline mb-4 border-b pb-2">Verification Details</h3>
            <div className="grid sm:grid-cols-2 gap-6">
                <DetailItem icon={<FileText size={16}/>} label="GST Number" value={buyer.gstNumber} />
                {buyer.type === 'Doctor' && <DetailItem icon={<FileText size={16}/>} label="Doctor Reg. Number" value={buyer.doctorRegNumber} />}
                {buyer.type === 'Medical Store' && <p className="text-sm text-muted-foreground">Drug license document would be shown here.</p>}
                {buyer.type === 'Hospital' && <p className="text-sm text-muted-foreground">Hospital registration document would be shown here.</p>}
            </div>
        </div>

      </CardContent>
       <CardFooter className="border-t pt-6">
            <Button onClick={() => router.back()}>Close</Button>
      </CardFooter>
    </Card>
  );
}
