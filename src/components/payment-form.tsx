
"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSettings } from "@/context/settings-context";
import { Copy } from "lucide-react";
import { Button } from "./ui/button";
import { useToast } from "@/hooks/use-toast";

type PaymentFormProps = {
  method: 'card' | 'upi' | 'netbanking' | string;
};

const banks = [
    "State Bank of India",
    "HDFC Bank",
    "ICICI Bank",
    "Axis Bank",
    "Kotak Mahindra Bank",
    "Punjab National Bank",
]

export function PaymentForm({ method }: PaymentFormProps) {
  const { settings } = useSettings();
  const { toast } = useToast();

   const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
        title: "Copied to clipboard!",
        description: "UPI ID has been copied."
    });
  }

  switch (method) {
    case 'card':
      return (
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="cardNumber">Card Number</Label>
            <Input id="cardNumber" placeholder="0000 0000 0000 0000" />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="grid gap-2 col-span-2">
              <Label htmlFor="expiry">Expiry Date</Label>
              <Input id="expiry" placeholder="MM / YY" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="cvc">CVC</Label>
              <Input id="cvc" placeholder="123" />
            </div>
          </div>
           <div className="grid gap-2">
            <Label htmlFor="nameOnCard">Name on Card</Label>
            <Input id="nameOnCard" placeholder="John Doe" />
          </div>
        </div>
      );
    case 'upi':
      return (
         <div className="space-y-3">
            <p className="text-sm text-muted-foreground">You can pay using the business UPI ID or by entering your own.</p>
             {settings.upiId && (
                <div className="flex items-center gap-4 rounded-md border bg-muted/20 p-4">
                    <img src="https://www.vectorlogo.zone/logos/upi/upi-icon.svg" alt="UPI" className="h-6 w-6"/>
                    <span className="font-mono text-lg">{settings.upiId}</span>
                    <Button size="icon" variant="ghost" className="ml-auto" onClick={() => copyToClipboard(settings.upiId)}>
                        <Copy className="h-4 w-4" />
                    </Button>
                </div>
            )}
            <div className="grid gap-2">
                <Label htmlFor="upiId">Your UPI ID</Label>
                <Input id="upiId" placeholder="yourname@bank" />
            </div>
        </div>
      );
    case 'netbanking':
        return (
             <div className="grid gap-2">
                <Label htmlFor="bank">Select Bank</Label>
                <Select>
                    <SelectTrigger id="bank">
                        <SelectValue placeholder="Choose your bank" />
                    </SelectTrigger>
                    <SelectContent>
                        {banks.map(bank => (
                             <SelectItem key={bank} value={bank.toLowerCase().replace(/ /g, '-')}>{bank}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        )
    default:
      return <p>This payment method is not configured.</p>;
  }
}
