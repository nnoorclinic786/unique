
"use client";

import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Logo } from "@/components/icons";
import { useBuyerContext } from "@/context/buyers-context";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from 'date-fns';
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { FileUp } from "lucide-react";

const formSchema = z.object({
  personName: z.string().min(2, "Person name is required."),
  businessName: z.string().min(2, "Business name is required."),
  mobileNumber1: z.string().min(10, "A valid mobile number is required."),
  mobileNumber2: z.string().optional(),
  email: z.string().email({ message: "Please enter a valid email address." }),
  address: z.string().min(10, "A valid business address is required."),
  businessLocation: z.string().min(2, "Business location is required."),
  type: z.enum(['Medical Store', 'Doctor', 'Hospital'], { required_error: "Please select a buyer type."}),
  doctorRegNumber: z.string().optional(),
  gstNumber: z.string().optional(),
  // For now, we won't validate file uploads, just show the fields.
});

export default function SignupPage() {
  const { toast } = useToast();
  const { addPendingBuyer } = useBuyerContext();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      personName: "",
      businessName: "",
      mobileNumber1: "",
      mobileNumber2: "",
      email: "",
      address: "",
      businessLocation: "",
      doctorRegNumber: "",
      gstNumber: "",
    },
  });

  const businessType = useWatch({
    control: form.control,
    name: 'type'
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const newBuyer = {
      id: `BUYER-${Date.now()}`,
      name: values.businessName, // Main name for display
      ...values,
      registeredOn: format(new Date(), 'yyyy-MM-dd'),
      status: 'Pending' as const,
    };
    
    addPendingBuyer(newBuyer);
    
    toast({
      title: "Registration Submitted!",
      description: "Your registration is under review. We will notify you upon approval.",
    });
    form.reset();
  }

  const renderConditionalFields = () => {
    switch (businessType) {
      case 'Doctor':
        return (
          <FormField
            control={form.control}
            name="doctorRegNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Doctor Registration Number</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your registration number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        );
      case 'Hospital':
        return (
          <FormItem>
            <FormLabel>Clinic/Hospital Registration</FormLabel>
            <FormControl>
              <Button variant="outline" className="w-full justify-start font-normal" type="button">
                <FileUp className="mr-2 h-4 w-4" />
                Upload Registration Document
              </Button>
            </FormControl>
            <FormDescription>Upload a PDF or image of your registration.</FormDescription>
            <FormMessage />
          </FormItem>
        );
      case 'Medical Store':
         return (
          <FormItem>
            <FormLabel>Drug License</FormLabel>
            <FormControl>
              <Button variant="outline" className="w-full justify-start font-normal" type="button">
                <FileUp className="mr-2 h-4 w-4" />
                Upload Drug License
              </Button>
            </FormControl>
            <FormDescription>Upload a PDF or image of your drug license.</FormDescription>
            <FormMessage />
          </FormItem>
        );
      default:
        return null;
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-3xl mx-auto my-8">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Link href="/" className="flex items-center gap-2">
              <Logo className="h-12 w-12 text-primary" />
            </Link>
          </div>
          <CardTitle className="font-headline text-2xl">Create a Buyer Account</CardTitle>
          <CardDescription>Fill in the details below to register as a wholesale buyer.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

              {/* Personal Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium font-headline">Personal Details</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <FormField control={form.control} name="personName" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Person Name</FormLabel>
                        <FormControl><Input placeholder="e.g., John Doe" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField control={form.control} name="businessName" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Business Name</FormLabel>
                        <FormControl><Input placeholder="e.g., City Pharmacy" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Contact Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium font-headline">Contact Details</h3>
                <div className="grid md:grid-cols-2 gap-4">
                    <FormField control={form.control} name="mobileNumber1" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Mobile Number 1</FormLabel>
                          <FormControl><Input type="tel" placeholder="Primary mobile number" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField control={form.control} name="mobileNumber2" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Mobile Number 2 (Optional)</FormLabel>
                          <FormControl><Input type="tel" placeholder="Secondary mobile number" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                </div>
                 <FormField control={form.control} name="email" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl><Input placeholder="contact@example.com" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Address Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium font-headline">Address Details</h3>
                <FormField control={form.control} name="address" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Buyer Business Address</FormLabel>
                      <FormControl><Textarea placeholder="Enter your full business address" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField control={form.control} name="businessLocation" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Business Location (City / Area)</FormLabel>
                      <FormControl><Input placeholder="e.g., Bangalore" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Business Details */}
              <div className="space-y-4">
                 <h3 className="text-lg font-medium font-headline">Business Details</h3>
                <div className="grid md:grid-cols-2 gap-4">
                   <FormField control={form.control} name="type" render={({ field }) => (
                      <FormItem>
                        <FormLabel>I am a...</FormLabel>
                         <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger><SelectValue placeholder="Select buyer type" /></SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Medical Store">Medical Store / Chemist</SelectItem>
                            <SelectItem value="Doctor">Doctor / Practitioner</SelectItem>
                            <SelectItem value="Hospital">Hospital / Clinic</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {renderConditionalFields()}
                  <FormField control={form.control} name="gstNumber" render={({ field }) => (
                      <FormItem>
                        <FormLabel>GST Number (Optional)</FormLabel>
                        <FormControl><Input placeholder="Enter GSTIN" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>


              <Button type="submit" className="w-full">Create Account</Button>
            </form>
          </Form>
          <div className="mt-6 text-center text-sm">
            Already have an account?{" "}
            <Link href="/login" className="underline">
              Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
