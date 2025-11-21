
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
import { ChevronLeft, UploadCloud, Link as LinkIcon, Eye, Trash2, Loader2, File as FileIcon } from "lucide-react";
import type { Medicine } from "@/lib/types";
import { useAppContext } from "@/context/app-context";
import { useState } from "react";
import Image from "next/image";

const formSchema = z.object({
  name: z.string().min(2, { message: "Medicine name must be at least 2 characters." }),
  hsnCode: z.string().optional(),
  batchNumber: z.string().optional(),
  manufacturingDate: z.string().optional(),
  expiryDate: z.string().optional(),
  price: z.coerce.number().min(0, { message: "Price must be a positive number." }),
  priceUnit: z.enum(['strip', 'piece', 'bottle', 'box'], { required_error: "Please select a price unit."}),
  imageUrl: z.string().optional().or(z.literal('')),
  imageSource: z.string().optional(),
  category: z.string().min(2, { message: "Category is required." }),
  description: z.string().min(10, { message: "Description must be at least 10 characters." }),
  stock: z.coerce.number().int().min(0, { message: "Stock must be a positive integer." }),
  stockUnit: z.enum(['strip', 'piece', 'bottle', 'box'], { required_error: "Please select a stock unit."}),
  manufacturingCompany: z.string().min(2, { message: "Manufacturing company is required." }),
  marketingCompany: z.string().optional(),
});

export default function AddMedicinePage() {
  const router = useRouter();
  const { toast } = useToast();
  const { addMedicine } = useAppContext();
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [fileType, setFileType] = useState<'image' | 'pdf' | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      hsnCode: "",
      batchNumber: "",
      manufacturingDate: "",
      expiryDate: "",
      price: 0,
      imageUrl: "",
      imageSource: "",
      category: "",
      description: "",
      stock: 0,
      manufacturingCompany: "",
      marketingCompany: "",
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast({ variant: "destructive", title: "File too large", description: "Please upload a file smaller than 10MB." });
        return;
    }

    if (!['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf'].includes(file.type)) {
        toast({ variant: "destructive", title: "Invalid file type", description: "Please upload an image (JPG, PNG, GIF, WEBP) or a PDF." });
        return;
    }

    setIsUploading(true);
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
        const dataUrl = reader.result as string;
        form.setValue('imageUrl', dataUrl);
        setPreview(dataUrl);
        setFileType(file.type.startsWith('image/') ? 'image' : 'pdf');
        setIsUploading(false);
        toast({ title: "File Ready", description: "The file has been processed and is ready." });
    };
    reader.onerror = () => {
        setIsUploading(false);
        toast({ variant: "destructive", title: "Error", description: "Failed to read the file." });
    };
  };

  const removeImage = () => {
      form.setValue('imageUrl', '');
      setPreview(null);
      setFileType(null);
  };
  
  const fetchFromUrl = async () => {
    const url = form.getValues('imageUrl');
    if (!url) {
        toast({ variant: "destructive", title: "No URL", description: "Please paste a URL first." });
        return;
    }
    
    try {
        const response = await fetch(url);
        const contentType = response.headers.get('content-type');
        if (!contentType || !['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf'].some(type => contentType.includes(type))) {
             toast({ variant: "destructive", title: "Invalid URL content", description: "The URL does not point to a valid image or PDF." });
             return;
        }

        const blob = await response.blob();
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = () => {
            const dataUrl = reader.result as string;
            setPreview(dataUrl);
            setFileType(contentType.startsWith('image/') ? 'image' : 'pdf');
            toast({ title: "URL Fetched", description: "The file from the URL is ready." });
        };

    } catch (error) {
        toast({ variant: "destructive", title: "Fetch Failed", description: "Could not fetch the file from the provided URL." });
    }
  }


  async function onSubmit(values: z.infer<typeof formSchema>) {
    const newMedicine: Omit<Medicine, 'id'> = {
      ...values,
      imageUrl: values.imageUrl || 'https://placehold.co/600x400/EEE/31343C?text=No+Image', 
    };
    
    try {
      await addMedicine(newMedicine);
      toast({
        title: "Medicine Added!",
        description: `${values.name} has been added to the catalog.`,
      });
      router.push("/admin/drugs");
    } catch (error) {
       toast({
        variant: "destructive",
        title: "Failed to add medicine",
        description: "An error occurred while saving the medicine. Please try again.",
      });
    }
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
                <FormField
                  control={form.control}
                  name="batchNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Batch Number</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., B-12345" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="manufacturingDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Manufacturing Date</FormLabel>
                      <FormControl>
                        <Input type="month" placeholder="MM/YYYY" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="expiryDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Expiry Date</FormLabel>
                      <FormControl>
                        <Input type="month" placeholder="MM/YYYY" {...field} />
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
                                {isUploading ? (
                                    <Loader2 className="w-8 h-8 mb-4 text-muted-foreground animate-spin" />
                                ) : (
                                    <UploadCloud className="w-8 h-8 mb-4 text-muted-foreground" />
                                )}
                                <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                <p className="text-xs text-muted-foreground">JPG, PNG, GIF, WEBP, or PDF (Max 10MB)</p>
                            </div>
                            <input id="dropzone-file" type="file" className="hidden" onChange={handleFileChange} disabled={isUploading} />
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
                            <FormLabel>Image / PDF URL</FormLabel>
                            <FormControl>
                                <div className="flex gap-2">
                                    <Input placeholder="https://example.com/image.jpg" {...field} />
                                    <Button variant="outline" type="button" onClick={fetchFromUrl}>
                                        <LinkIcon className="mr-2 h-4 w-4"/>
                                        Fetch
                                    </Button>
                                </div>
                            </FormControl>
                            <FormDescription>
                                If you paste a URL, click Fetch to preview. The URL itself will be saved.
                            </FormDescription>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                    {preview && (
                        <div className="space-y-4">
                            <h4 className="text-sm font-medium">Preview</h4>
                            <div className="relative w-fit">
                                {fileType === 'image' ? (
                                    <Image src={preview} alt="Preview" width={200} height={200} className="rounded-md object-cover" />
                                ) : (
                                    <div className="flex items-center gap-4 p-4 border rounded-md">
                                        <FileIcon className="h-10 w-10 text-muted-foreground" />
                                        <span className="text-sm text-muted-foreground">PDF Document</span>
                                    </div>
                                )}
                            </div>
                             <Button variant="destructive" size="sm" type="button" onClick={removeImage}>
                                <Trash2 className="mr-2 h-4 w-4" /> Remove
                            </Button>
                        </div>
                    )}
                </div>
            </div>
            
            {/* Other Fields */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium font-headline border-b pb-2">Other Details</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <FormField
                    control={form.control}
                    name="manufacturingCompany"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Manufacturing Company</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Cipla" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                 <FormField
                    control={form.control}
                    name="marketingCompany"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Marketing Company (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., GSK" {...field} />
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
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving...</> : 'Save'}
                </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
