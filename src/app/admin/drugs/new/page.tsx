
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
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { ChevronLeft } from "lucide-react";
import type { Medicine } from "@/lib/types";
import { useMedicineContext } from "@/context/medicines-context";

const formSchema = z.object({
  name: z.string().min(2, { message: "Medicine name must be at least 2 characters." }),
  companyName: z.string().min(2, { message: "Company name must be at least 2 characters." }),
  description: z.string().min(10, { message: "Description must be at least 10 characters." }),
  price: z.coerce.number().min(0, { message: "Price must be a positive number." }),
  priceUnit: z.enum(['strip', 'piece', 'bottle'], { required_error: "Please select a price unit."}),
  stock: z.coerce.number().int().min(0, { message: "Stock must be a positive integer." }),
  category: z.string().min(2, { message: "Category is required." }),
  hsnCode: z.string().optional(),
  imageId: z.string({ required_error: "Please select an image." }),
});

export default function AddMedicinePage() {
  const router = useRouter();
  const { toast } = useToast();
  const { medicines, addMedicine } = useMedicineContext();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      companyName: "",
      description: "",
      price: 0,
      stock: 0,
      category: "",
      hsnCode: "",
      imageId: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const newId = `PROD${(medicines.length + 1).toString().padStart(3, '0')}`;
    const newMedicine: Medicine = {
      id: newId,
      ...values,
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
                <CardDescription>Fill out the form to add a new medicine to the catalog.</CardDescription>
            </div>
        </div>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
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
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Describe the medicine" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                    <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Price (₹)</FormLabel>
                        <FormControl>
                            <Input type="number" step="0.01" placeholder="e.g., 15.50" {...field} />
                        </FormControl>
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
                                    <SelectValue placeholder="Unit" />
                                </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="strip">Strip</SelectItem>
                                    <SelectItem value="piece">Piece</SelectItem>
                                    <SelectItem value="bottle">Bottle</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                </div>
              </div>
              <div className="space-y-6">
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
                <div className="grid grid-cols-2 gap-4">
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
                    name="hsnCode"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>HSN Code</FormLabel>
                        <FormControl>
                            <Input placeholder="e.g., 30049099" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                </div>
                <FormField
                    control={form.control}
                    name="imageId"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Image</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Select an image for the medicine" />
                            </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                            {PlaceHolderImages.map((image) => (
                                <SelectItem key={image.id} value={image.id}>
                                {image.description}
                                </SelectItem>
                            ))}
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
                <Button type="submit">Add Medicine</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
