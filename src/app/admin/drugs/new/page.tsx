
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { ChevronLeft, UploadCloud, Link as LinkIcon, Eye, Trash2 } from "lucide-react";
import type { Medicine } from "@/lib/types";
import { useMedicineContext } from "@/context/medicines-context";

const formSchema = z.object({
  name: z.string().min(2, { message: "Medicine name must be at least 2 characters." }),
  hsnCode: z.string().optional(),
  price: z.coerce.number().min(0, { message: "Price must be a positive number." }),
  priceUnit: z.enum(['strip', 'piece', 'bottle', 'box'], { required_error: "Please select a price unit."}),
  imageUrl: z.string().url({ message: "Please enter a valid image URL." }).optional().or(z.literal('')),
  imageSource: z.string().optional(),
  category: z.string().min(2, { message: "Category is required." }),
  description: z.string().min(10, { message: "Description must be at least 10 characters." }),
  stock: z.coerce.number().int().min(0, { message: "Stock must be a positive integer." }),
  stockUnit: z.enum(['strip', 'piece', 'bottle', 'box'], { required_error: "Please select a stock unit."}),
  companyName: z.string().min(2, { message: "Company name must be at least 2 characters." }),
});

export default function AddMedicinePage() {
  const router = useRouter();
  const { toast } = useToast();
  const { medicines, addMedicine } = useMedicineContext();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      hsnCode: "",
      price: 0,
      imageUrl: "",
      imageSource: "",
      category: "",
      description: "",
      stock: 0,
      companyName: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const newId = `PROD${(medicines.length + 1).toString().padStart(3, '0')}`;
    const newMedicine: Medicine = {
      id: newId,
      ...values,
      // Ensure imageUrl is a string, even if it was optional in the form
      imageUrl: values.imageUrl || 'https://placehold.co/600x400/EEE/31343C?text=No+Image', 
    };
    
    addMedicine(newMedicine);
    
    toast({
      title: "Medicine Added!",
      description: `${values.name} has been added to the catalog.`,
    });
    router.push("/admin/drugs");
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" className="h-7 w-7" asChild>
                <Link href="/admin/drugs">
                    <ChevronLeft className="h-4 w-4" />
                    <span className="sr-only">Back</span>
                </Link>
            </Button>
            <div>
                <CardTitle className="font-headline text-2xl">Add New Medicine</CardTitle>
                <CardDescription>Please enter the medicine details below.</CardDescription>
            </div>
        </div>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            
            {/* Basic Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium font-headline border-b pb-2">Basic Details</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Medicine Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Paracetamol 500mg" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="hsnCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>HSN Number</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 30049099" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid md:grid-cols-2 gap-4 items-end">
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price</FormLabel>
                      <div className="relative">
                          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">₹</span>
                          <FormControl>
                              <Input type="number" step="0.01" placeholder="15.50" className="pl-7" {...field} />
                          </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="priceUnit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price Per</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Unit (e.g., Strip)" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="strip">Strip</SelectItem>
                          <SelectItem value="piece">Piece</SelectItem>
                          <SelectItem value="bottle">Bottle</SelectItem>
                          <SelectItem value="box">Box</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Image Section */}
            <div className="space-y-4">
                <h3 className="text-lg font-medium font-headline border-b pb-2">Image Section</h3>
                <div className="grid gap-6">
                    <div className="flex items-center justify-center w-full">
                        <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer bg-muted hover:bg-muted/80">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <UploadCloud className="w-8 h-8 mb-4 text-muted-foreground" />
                                <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                <p className="text-xs text-muted-foreground">JPG, PNG, GIF, WEBP, or PDF (Max 10MB)</p>
                            </div>
                            <input id="dropzone-file" type="file" className="hidden" />
                        </label>
                    </div> 
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-background px-2 text-muted-foreground">Or paste URL</span>
                        </div>
                    </div>
                     <FormField
                        control={form.control}
                        name="imageUrl"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Upload image / PDF or paste image / PDF URL</FormLabel>
                            <FormControl>
                                <div className="flex gap-2">
                                    <Input placeholder="https://example.com/image.jpg" {...field} />
                                    <Button variant="outline" type="button">
                                        <LinkIcon className="mr-2 h-4 w-4"/>
                                        Fetch
                                    </Button>
                                </div>
                            </FormControl>
                            <FormDescription>
                                If you paste a URL, we will fetch and validate the file. First page of a PDF will be used as a thumbnail. Animated GIF/WEBP supported.
                            </FormDescription>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                      control={form.control}
                      name="imageSource"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Image / PDF Source (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Unsplash, Company Website" {...field} />
                          </FormControl>
                           <FormDescription>Credit the source of the image or document.</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" type="button" className="w-full">
                            <Eye className="mr-2 h-4 w-4" /> Preview
                        </Button>
                        <Button variant="destructive" size="sm" type="button" className="w-full">
                            <Trash2 className="mr-2 h-4 w-4" /> Remove
                        </Button>
                    </div>
                </div>
            </div>
            
            {/* Other Fields */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium font-headline border-b pb-2">Other Details</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <FormField
                    control={form.control}
                    name="companyName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company Name</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Cipla" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                 <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Analgesics" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Describe the medicine, its composition, and uses." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid md:grid-cols-2 gap-4 items-end">
                <FormField
                  control={form.control}
                  name="stock"
                  render={({ field }) => (
                      <FormItem>
                      <FormLabel>Stock Quantity</FormLabel>
                      <FormControl>
                          <Input type="number" placeholder="e.g., 1200" {...field} />
                      </FormControl>
                      <FormMessage />
                      </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="stockUnit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Stock Unit Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Unit (e.g., Box)" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="strip">Strip</SelectItem>
                          <SelectItem value="piece">Piece</SelectItem>
                          <SelectItem value="bottle">Bottle</SelectItem>
                          <SelectItem value="box">Box</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
                <Button type="submit">Save</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

    