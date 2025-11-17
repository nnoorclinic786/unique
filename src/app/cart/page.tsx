
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Header } from '@/components/header';
import { Trash2, ShoppingCart, CreditCard, Banknote, Landmark, Truck, Copy } from 'lucide-react';
import { useCart } from '@/context/cart-context';
import { useOrderContext } from '@/context/orders-context';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useSettings } from '@/context/settings-context';
import { useToast } from '@/hooks/use-toast';

// Mock user data, in a real app this would come from a user context or API
const user = {
  name: 'City Pharmacy',
  address: '123, Main Market, Bangalore, Karnataka, 560001',
};

export default function CartPage() {
  const { cartItems, updateQuantity, removeFromCart, cartCount, clearCart } = useCart();
  const { addOrder } = useOrderContext();
  const { settings } = useSettings();
  const router = useRouter();
  const { toast } = useToast();
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [checkoutStep, setCheckoutStep] = useState(1);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const params = new URLSearchParams(window.location.search);
    if (params.get('payment_success') === 'true') {
        const method = params.get('method');
        if(method) setPaymentMethod(method);
        setCheckoutStep(2); // Move to address confirmation after successful payment
        
        // Clean up URL
        window.history.replaceState(null, '', window.location.pathname);
    }
  }, []);

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const tax = subtotal * 0.05;
  const total = subtotal + tax;

  const handlePlaceOrder = () => {
    const newOrder = {
        id: `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        buyerName: localStorage.getItem('userName') || user.name, // In a real app, get from user session
        date: new Date().toISOString().split('T')[0],
        total: total,
        status: 'Pending' as const,
        itemCount: cartCount,
    };
    
    addOrder(newOrder);
    toast({
        title: "Order Placed!",
        description: `Your order ${newOrder.id} has been successfully placed.`,
    });
    clearCart();
    router.push('/account'); // Redirect to account page to see new order
  }
  
  const handleCheckoutProceed = () => {
    if (paymentMethod === 'cod') {
        setCheckoutStep(2);
    } else {
        router.push(`/payment/${paymentMethod}`);
    }
  }

  const handleRemoveFromCart = (itemId: string) => {
    removeFromCart(itemId);
    toast({
        title: "Item Removed",
        description: `The item has been removed from your cart.`,
    });
  };

  if (!isClient) {
      return null;
  }
  
  if (cartItems.length === 0) {
    return (
        <>
            <Header />
            <main className="flex-1 container mx-auto px-4 md:px-6 py-8">
                <div className="flex flex-col items-center justify-center h-[50vh] text-center">
                    <ShoppingCart className="w-24 h-24 text-muted-foreground mb-6" />
                    <h1 className="text-3xl font-headline font-bold mb-4">Your Cart is Empty</h1>
                    <p className="text-muted-foreground mb-8">Looks like you haven't added anything to your cart yet.</p>
                    <Button asChild>
                        <Link href="/medicines">Start Shopping</Link>
                    </Button>
                </div>
            </main>
        </>
    );
  }


  return (
    <>
      <Header />
      <main className="flex-1 container mx-auto px-4 md:px-6 py-8">
        <h1 className="text-3xl font-headline font-bold mb-8">Your Cart</h1>
        <div className="grid md:grid-cols-3 gap-12">
          <div className="md:col-span-2">
            {checkoutStep === 1 && (
                <Card>
                    <Table>
                        <TableHeader>
                        <TableRow>
                            <TableHead className="w-[80px] hidden md:table-cell"></TableHead>
                            <TableHead>Medicine</TableHead>
                            <TableHead>Quantity</TableHead>
                            <TableHead className="text-right">Price</TableHead>
                            <TableHead className="w-[40px]"></TableHead>
                        </TableRow>
                        </TableHeader>
                        <TableBody>
                        {cartItems.map((item) => {
                            return (
                            <TableRow key={item.id}>
                                <TableCell className="hidden md:table-cell">
                                {item.imageUrl && (
                                    <Image
                                    src={item.imageUrl}
                                    alt={item.name}
                                    width={64}
                                    height={64}
                                    className="rounded-md object-cover"
                                    />
                                )}
                                </TableCell>
                                <TableCell className="font-medium">{item.name}</TableCell>
                                <TableCell>
                                <Input 
                                    type="number" 
                                    value={item.quantity} 
                                    className="w-20"
                                    onChange={(e) => updateQuantity(item.id, parseInt(e.target.value, 10) || 0)}
                                    min="0"
                                />
                                </TableCell>
                                <TableCell className="text-right">₹{(item.price * item.quantity).toFixed(2)}</TableCell>
                                <TableCell>
                                <Button variant="ghost" size="icon" onClick={() => handleRemoveFromCart(item.id)}>
                                    <Trash2 className="h-4 w-4 text-muted-foreground" />
                                </Button>
                                </TableCell>
                            </TableRow>
                            );
                        })}
                        </TableBody>
                    </Table>
                </Card>
            )}
             {checkoutStep === 2 && (
              <Card>
                <CardHeader>
                  <CardTitle className="font-headline">Confirm Your Order</CardTitle>
                  <CardDescription>
                    Please verify your address and payment method before placing the order.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div>
                        <h3 className="font-semibold mb-2">Shipping Address</h3>
                        <div className="flex items-start gap-4 rounded-md border bg-muted/20 p-4">
                            <Truck className="h-6 w-6 text-primary mt-1" />
                            <div>
                            <p className="font-semibold">{user.name}</p>
                            <p className="text-muted-foreground">{user.address}</p>
                            </div>
                        </div>
                        <Button variant="link" size="sm" className="p-0 h-auto mt-2">Change Address</Button>
                    </div>

                    <Separator />
                    
                    <div>
                        <h3 className="font-semibold mb-2">Payment Details</h3>
                        {paymentMethod === 'upi' && settings.upiId ? (
                             <div className="flex items-center gap-2 text-sm">
                                <img src="https://www.vectorlogo.zone/logos/upi/upi-icon.svg" alt="UPI" className="h-6 w-6"/>
                                <span className="font-semibold">Paid via UPI</span>
                            </div>
                        ) : (
                             <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                {paymentMethod === 'cod' && <Banknote className="h-5 w-5" />}
                                {paymentMethod === 'card' && <CreditCard className="h-5 w-5" />}
                                {paymentMethod === 'netbanking' && <Landmark className="h-5 w-5" />}
                                <span className="font-semibold capitalize">
                                    {paymentMethod === 'cod' ? 'Cash on Delivery' :
                                    paymentMethod === 'card' ? 'Paid via Card' :
                                    paymentMethod === 'netbanking' ? 'Paid via Net Banking' :
                                    'Payment details confirmed'}
                                </span>
                            </div>
                        )}
                    </div>
                </CardContent>
                 <CardFooter className="flex justify-between">
                    <Button variant="outline" onClick={() => setCheckoutStep(1)}>Back to Cart</Button>
                    <Button size="lg" onClick={handlePlaceOrder}>
                        Place Order
                    </Button>
                </CardFooter>
              </Card>
            )}
          </div>
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="font-headline">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>GST Rate 5%</span>
                  <span>₹{tax.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
                
                {checkoutStep === 1 && (
                  <>
                    <Separator />
                    <div>
                        <h3 className="text-md font-medium mb-4">Payment Method</h3>
                         <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="grid gap-4">
                            <Label htmlFor="pay-card" className="flex items-center gap-4 rounded-md border p-4 hover:bg-muted/50 transition-colors cursor-pointer has-[input:checked]:border-primary">
                                <RadioGroupItem value="card" id="pay-card" />
                                <CreditCard />
                                <div className="grid gap-1.5">
                                    <span className="font-medium">Credit / Debit Card</span>
                                    <span className="text-sm text-muted-foreground">Visa, Mastercard, RuPay</span>
                                </div>
                            </Label>
                             <Label htmlFor="pay-upi" className="flex items-center gap-4 rounded-md border p-4 hover:bg-muted/50 transition-colors cursor-pointer has-[input:checked]:border-primary">
                                <RadioGroupItem value="upi" id="pay-upi" />
                                <img src="https://www.vectorlogo.zone/logos/upi/upi-icon.svg" alt="UPI" className="h-6 w-6"/>
                                <div className="grid gap-1.5">
                                    <span className="font-medium">UPI / QR Code</span>
                                    <span className="text-sm text-muted-foreground">Google Pay, PhonePe, Paytm</span>
                                </div>
                            </Label>
                            <Label htmlFor="pay-netbanking" className="flex items-center gap-4 rounded-md border p-4 hover:bg-muted/50 transition-colors cursor-pointer has-[input:checked]:border-primary">
                                <RadioGroupItem value="netbanking" id="pay-netbanking" />
                                <Landmark />
                                <div className="grid gap-1.5">
                                    <span className="font-medium">Net Banking</span>
                                    <span className="text-sm text-muted-foreground">All major banks supported</span>
                                </div>
                            </Label>
                            <Label htmlFor="pay-cod" className="flex items-center gap-4 rounded-md border p-4 hover:bg-muted/50 transition-colors cursor-pointer has-[input:checked]:border-primary">
                                <RadioGroupItem value="cod" id="pay-cod" />
                                <Banknote />
                                <div className="grid gap-1.5">
                                    <span className="font-medium">Cash on Delivery</span>
                                    <span className="text-sm text-muted-foreground">Pay upon receiving your order</span>
                                </div>
                            </Label>
                        </RadioGroup>
                    </div>
                  </>
                )}
              </CardContent>
              <CardFooter>
                 {checkoutStep === 1 && (
                  <Button className="w-full" size="lg" onClick={handleCheckoutProceed}>
                    {paymentMethod === 'cod' ? 'Proceed to Checkout' : 'Proceed to Payment'}
                  </Button>
                )}
              </CardFooter>
            </Card>
          </div>
        </div>
      </main>
    </>
  );
}

    