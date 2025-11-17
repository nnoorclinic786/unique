

'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Trash2, ShoppingCart, CreditCard, Banknote, Landmark, Truck, PlusCircle, ChevronsUpDown } from 'lucide-react';
import { useAppContext } from '@/context/app-context';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { AddressForm } from '@/components/address-form';
import type { Buyer, Address } from '@/lib/types';


export default function CartPage() {
  const { cartItems, updateQuantity, removeFromCart, cartCount, clearCart, addOrder, settings, buyers, addBuyerAddress } = useAppContext();
  const router = useRouter();
  const { toast } = useToast();
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [checkoutStep, setCheckoutStep] = useState(1);
  const [isClient, setIsClient] = useState(false);
  const [isAddressDialogOpen, setAddressDialogOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<Buyer | null>(null);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);


  useEffect(() => {
    setIsClient(true);
    const storedUserName = localStorage.getItem('userName');
    if (storedUserName) {
        const foundBuyer = buyers.find(b => b.name === storedUserName);
        if (foundBuyer) {
            setCurrentUser(foundBuyer);
            const defaultAddress = foundBuyer.addresses?.find(a => a.id === foundBuyer.defaultAddressId);
            setSelectedAddress(defaultAddress || foundBuyer.addresses?.[0] || null);
        }
    }
    const params = new URLSearchParams(window.location.search);
    if (params.get('payment_success') === 'true') {
        const method = params.get('method');
        if(method) setPaymentMethod(method);
        setCheckoutStep(2); 
        
        window.history.replaceState(null, '', window.location.pathname);
    }
  }, [buyers]);

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const tax = subtotal * 0.05;
  const total = subtotal + tax;

  const handlePlaceOrder = () => {
    const newOrder = {
        id: `ORD-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        buyerName: localStorage.getItem('userName') || currentUser?.name || 'Guest',
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
    router.push('/account');
  }
  
  const handleCheckoutProceed = () => {
    if (!selectedAddress) {
        toast({
            variant: "destructive",
            title: "Address Required",
            description: "Please select or add a shipping address before proceeding.",
        });
        return;
    }
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

  const handleAddressSave = (addressData: Omit<Address, 'id'>) => {
    if (currentUser) {
        addBuyerAddress(currentUser.id, addressData);
        toast({
            title: "Address Added",
            description: "Your new address has been saved.",
        });
        setAddressDialogOpen(false);
    } else {
         toast({
            variant: "destructive",
            title: "Error",
            description: "Could not find user to update address.",
        });
    }
  };

  if (!isClient) {
      return null;
  }
  
  if (cartItems.length === 0) {
    return (
        <>
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
                                <p className="font-semibold">{selectedAddress?.name}</p>
                                <p className="text-muted-foreground">{selectedAddress?.fullAddress}</p>
                            </div>
                        </div>
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

                {checkoutStep === 1 && (
                <>
                <Separator />
                <div>
                  <h3 className="text-md font-medium mb-2">Shipping To</h3>
                  {currentUser?.addresses && currentUser.addresses.length > 0 ? (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                          <Button variant="outline" className="w-full justify-between">
                              <div className="truncate pr-2">
                                  <p className="text-sm font-medium text-left">{selectedAddress?.name}</p>
                                  <p className="text-xs text-muted-foreground text-left truncate">{selectedAddress?.fullAddress}</p>
                              </div>
                              <ChevronsUpDown className="h-4 w-4 opacity-50 flex-shrink-0" />
                          </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)]">
                          {currentUser?.addresses?.map(addr => (
                              <DropdownMenuItem key={addr.id} onSelect={() => setSelectedAddress(addr)}>
                                  {addr.name}
                              </DropdownMenuItem>
                          ))}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onSelect={() => setAddressDialogOpen(true)}>
                              <PlusCircle className="mr-2 h-4 w-4" />
                              Add new address
                          </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  ) : (
                    <Button variant="outline" className="w-full" onClick={() => setAddressDialogOpen(true)}>
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Add Shipping Address
                    </Button>
                  )}
                </div>
                </>
                )}

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
      <Dialog open={isAddressDialogOpen} onOpenChange={setAddressDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
                <DialogTitle>Add New Address</DialogTitle>
            </DialogHeader>
            <AddressForm
              onSave={handleAddressSave}
              onCancel={() => setAddressDialogOpen(false)}
            />
        </DialogContent>
    </Dialog>
    </>
  );
}
