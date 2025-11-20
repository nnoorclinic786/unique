

"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import * as z from "zod";
import { doc, setDoc } from "firebase/firestore";
import { createUserWithEmailAndPassword }from "firebase/auth";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Logo } from "@/components/icons";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from 'date-fns';
import { Textarea } from "@/components/ui/textarea";
import { FileUp } from "lucide-react";
import type { Buyer } from "@/lib/types";
import ClientLayout from "../client-layout";
import { useAuth, useFirestore } from "@/firebase";

const formSchema = z.object({
  personName: z.string().min(2, "Person name is required."),
  businessName: z.string().min(2, "Business name is required."),
  mobileNumber1: z.string().min(10, "A valid mobile number is required."),
  mobileNumber2: z.string().optional(),
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(6, "Password must be at least 6 characters."),
  confirmPassword: z.string(),
  permanentAddress: z.string().min(10, "A valid permanent address is required."),
  businessLocation: z.string().min(2, "Business location is required."),
  type: z.enum(['Medical Store', 'Doctor', 'Hospital'], { required_error: "Please select a buyer type."}),
  doctorRegNumber: z.string().optional(),
  gstNumber: z.string().optional(),
}).refine(data => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

function SignupPageContent() {
  const { toast } = useToast();
  const router = useRouter();
  const firestore = useFirestore();
  const auth = useAuth();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      personName: "",
      businessName: "",
      mobileNumber1: "",
      mobileNumber2: "",
      email: "",
      password: "",
      confirmPassword: "",
      permanentAddress: "",
      businessLocation: "",
      doctorRegNumber: "",
      gstNumber: "",
    },
  });

  const buyerType = useWatch({
    control: form.control,
    name: 'type'
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
        // Step 1: Create the user account in Firebase Auth
        const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password);
        const user = userCredential.user;

        if (!user) {
            throw new Error("User creation failed.");
        }

        // Step 2: Create the buyer request document in Firestore with the new user's UID
        const addressId = `addr-${Date.now()}`;
        const newBuyerRequest: Omit<Buyer, 'id'> = {
          name: values.businessName,
          personName: values.personName,
          businessName: values.businessName,
          mobileNumber1: values.mobileNumber1,
          mobileNumber2: values.mobileNumber2,
          email: values.email,
          password: values.password, // Storing password is not recommended in production
          permanentAddress: values.permanentAddress,
          addresses: [{ id: addressId, name: 'Primary', fullAddress: values.permanentAddress }],
          defaultAddressId: addressId,
          businessLocation: values.businessLocation,
          type: values.type,
          doctorRegNumber: values.doctorRegNumber,
          gstNumber: values.gstNumber,
          registeredOn: format(new Date(), 'yyyy-MM-dd'),
          status: 'Pending' as const,
        };

        const requestDocRef = doc(firestore, 'buyer_requests', user.uid);
        await setDoc(requestDocRef, { ...newBuyerRequest, id: user.uid });
        
        toast({
          title: "Registration Submitted!",
          description: "Your registration is under review. We will notify you upon approval.",
        });
        form.reset();
        router.push('/login');

    } catch (error: any) {
        console.error("Error during signup:", error);
        let errorMessage = "Could not submit your registration. Please try again.";
        if (error.code === 'auth/email-already-in-use') {
            errorMessage = "This email address is already in use. Please use a different email or log in.";
        }
        toast({
            variant: "destructive",
            title: "Submission Failed",
            description: errorMessage,
        });
    }
  }

  const renderBusinessVerificationFields = () => {
    switch (buyerType) {
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
            <FormLabel>Clinic/Hospital Registration Certificate</FormLabel>
            <FormControl>
              <Button variant="outline" className="w-full justify-start font-normal" type="button">
                <FileUp className="mr-2 h-4 w-4" />
                Upload Registration Document
              </Button>
            </FormControl>
            <FormMessage />
          </FormItem>
        );
      case 'Medical Store':
         return (
          <FormItem>
            <FormLabel>Medical Store Drug License</FormLabel>
            <FormControl>
              <Button variant="outline" className="w-full justify-start font-normal" type="button">
                <FileUp className="mr-2 h-4 w-4" />
                Upload Drug License
              </Button>
            </FormControl>
            <FormMessage />
          </FormItem>
        );
      default:
        return null;
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-gray-50">
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
                <h3 className="text-lg font-medium font-headline border-b pb-2">Account Details</h3>
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
                  <FormField control={form.control} name="email" render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Email Address</FormLabel>
                      <FormControl><Input placeholder="contact@example.com" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                  />
                  <FormField control={form.control} name="password" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl><Input type="password" placeholder="••••••••" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                  />
                  <FormField control={form.control} name="confirmPassword" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl><Input type="password" placeholder="••••••••" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                  />
                </div>
              </div>

              {/* Contact Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium font-headline border-b pb-2">Contact Details</h3>
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
              </div>

              {/* Address Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium font-headline border-b pb-2">Address Details</h3>
                <FormField control={form.control} name="permanentAddress" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Permanent Business Address</FormLabel>
                      <FormControl><Textarea placeholder="Enter your full business address" {...field} /></FormControl>
                      <FormDescription>This is your official registered address. Shipping addresses can be added later.</FormDescription>
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
                 <h3 className="text-lg font-medium font-headline border-b pb-2">Business Verification</h3>
                 <FormDescription>Please provide any one of the following, if applicable.</FormDescription>
                <div className="grid md:grid-cols-2 gap-4 items-start">
                   <FormField control={form.control} name="type" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Business Type</FormLabel>
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
                  
                  {renderBusinessVerificationFields()}

                  <FormField control={form.control} name="gstNumber" render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>GST Number (Optional)</FormLabel>
                        <FormControl><Input placeholder="Enter GSTIN" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>


              <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? 'Submitting...' : 'Create Account'}
              </Button>
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

export default function SignupPage() {
    return (
        <ClientLayout>
            <SignupPageContent />
        </ClientLayout>
    )
}
    
