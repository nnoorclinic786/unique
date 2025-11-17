
'use client';

import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { DialogFooter } from './ui/dialog';
import type { Buyer } from '@/lib/types';
import { useEffect } from "react";
import { Textarea } from "./ui/textarea";
import { ScrollArea } from "./ui/scroll-area";

interface BuyerProfileFormProps {
    buyer: Buyer | null;
    onSave: (data: z.infer<typeof formSchema>) => void;
    onCancel: () => void;
}

const formSchema = z.object({
  name: z.string().min(2, "Business name is required."),
  personName: z.string().min(2, "Contact person name is required."),
  email: z.string().email("Invalid email address."),
  mobileNumber1: z.string().min(10, "A valid mobile number is required."),
  gstNumber: z.string().optional(),
  permanentAddress: z.string().min(10, "Permanent address is required.")
});

export function BuyerProfileForm({ buyer, onSave, onCancel }: BuyerProfileFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: buyer?.name || "",
      personName: buyer?.personName || "",
      email: buyer?.email || "",
      mobileNumber1: buyer?.mobileNumber1 || "",
      gstNumber: buyer?.gstNumber || "",
      permanentAddress: buyer?.permanentAddress || "",
    },
  });
  
  useEffect(() => {
    if (buyer) {
        form.reset({
            name: buyer.name,
            personName: buyer.personName,
            email: buyer.email,
            mobileNumber1: buyer.mobileNumber1,
            gstNumber: buyer.gstNumber,
            permanentAddress: buyer.permanentAddress,
        });
    }
  }, [buyer, form]);

  return (
    <>
      <Form {...form}>
          <form onSubmit={form.handleSubmit(onSave)} className="space-y-4">
            <ScrollArea className="h-[60vh] pr-6">
              <div className="space-y-4">
                <FormField control={form.control} name="name" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Business Name</FormLabel>
                        <FormControl><Input placeholder="e.g., City Pharmacy" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
                <FormField control={form.control} name="personName" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Contact Person</FormLabel>
                        <FormControl><Input placeholder="e.g., John Doe" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
                <FormField control={form.control} name="email" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl><Input type="email" placeholder="contact@example.com" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
                <FormField control={form.control} name="mobileNumber1" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Mobile Number</FormLabel>
                        <FormControl><Input type="tel" placeholder="Primary mobile number" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
                <FormField control={form.control} name="permanentAddress" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Permanent Address</FormLabel>
                        <FormControl><Textarea placeholder="Enter your full business address" {...field} /></FormControl>
                        <FormDescription>Your official registered address.</FormDescription>
                        <FormMessage />
                    </FormItem>
                )} />
                <FormField control={form.control} name="gstNumber" render={({ field }) => (
                    <FormItem>
                        <FormLabel>GST Number</FormLabel>
                        <FormControl><Input placeholder="Enter GSTIN" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
              </div>
            </ScrollArea>
            <DialogFooter className="pt-4 border-t">
                <Button variant="outline" type="button" onClick={onCancel}>Cancel</Button>
                <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </form>
      </Form>
    </>
  );
}
