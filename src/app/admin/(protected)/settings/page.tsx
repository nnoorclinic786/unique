
"use client";

import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useAppContext } from "@/context/app-context";

const formSchema = z.object({
  upiId: z.string().min(3, "Please enter a valid UPI ID").regex(/^[\w.-]+@[\w.-]+$/, "Invalid UPI ID format."),
});

export default function AdminSettingsPage() {
  const { settings, setSettings } = useAppContext();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      upiId: settings.upiId || "",
    },
    values: { // Ensures the form is controlled by the context state
      upiId: settings.upiId
    }
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setSettings(values);
    toast({
      title: "Settings Saved!",
      description: "Your payment settings have been updated.",
    });
  }

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle className="font-headline">Platform Settings</CardTitle>
        <CardDescription>
          Configure general settings for the application.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <h3 className="text-lg font-medium font-headline border-b pb-2">Payment Settings</h3>
            <FormField
              control={form.control}
              name="upiId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Business UPI ID</FormLabel>
                  <FormControl>
                    <Input placeholder="your-business@okhdfcbank" {...field} />
                  </FormControl>
                  <FormDescription>
                    Buyers will use this UPI ID to make payments for their orders.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Save Settings</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
