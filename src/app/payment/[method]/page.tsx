
"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PaymentForm } from "@/components/payment-form";
import { ChevronLeft, CreditCard, Landmark } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

const paymentMethodDetails = {
    card: { icon: <CreditCard className="w-8 h-8" />, title: "Credit/Debit Card" },
    upi: { icon: <img src="https://www.vectorlogo.zone/logos/upi/upi-icon.svg" alt="UPI" className="w-8 h-8"/>, title: "UPI Payment" },
    netbanking: { icon: <Landmark className="w-8 h-8" />, title: "Net Banking" }
}

export default function PaymentPage() {
    const params = useParams();
    const router = useRouter();
    const { toast } = useToast();
    const method = params.method as keyof typeof paymentMethodDetails;
    const details = paymentMethodDetails[method];
    const [isFormValid, setIsFormValid] = useState(false);

    const handlePayment = () => {
        // In a real app, this would handle the payment submission to a gateway
        toast({
            title: "Payment Successful!",
            description: "Your payment was processed successfully.",
        });
        
        // Redirect back to cart page to complete the order
        router.push(`/cart?payment_success=true&method=${method}`);
    }

    if (!details) {
        return (
             <>
                <main className="flex-1 container mx-auto px-4 md:px-6 py-8">
                    <div className="flex flex-col items-center justify-center h-[50vh] text-center">
                        <h1 className="text-2xl font-bold mb-4">Invalid Payment Method</h1>
                        <p className="text-muted-foreground mb-6">The selected payment method is not supported.</p>
                        <Button asChild>
                            <Link href="/cart">Return to Cart</Link>
                        </Button>
                    </div>
                </main>
            </>
        )
    }

    return (
        <>
            <main className="flex-1 container mx-auto px-4 md:px-6 py-8">
                <div className="max-w-md mx-auto">
                     <div className="mb-6">
                        <Button variant="outline" size="sm" asChild>
                            <Link href="/cart">
                                <ChevronLeft className="mr-2 h-4 w-4" />
                                Back to Cart
                            </Link>
                        </Button>
                    </div>
                    <Card>
                        <CardHeader className="text-center">
                            <div className="flex justify-center mb-4">
                                {details.icon}
                            </div>
                            <CardTitle className="font-headline text-2xl">{details.title}</CardTitle>
                            <CardDescription>Please enter your payment details below.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <PaymentForm method={method} onValidationChange={setIsFormValid} />
                            <Button className="w-full" size="lg" onClick={handlePayment} disabled={!isFormValid}>
                                Pay Now
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </>
    )
}
