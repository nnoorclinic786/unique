
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Header } from '@/components/header';
import { Trash2, ShoppingCart } from 'lucide-react';
import { useCart } from '@/context/cart-context';
import { useOrderContext } from '@/context/orders-context';
import { useRouter } from 'next/navigation';

export default function CartPage() {
  const { cartItems, updateQuantity, removeFromCart, cartCount, clearCart } = useCart();
  const { addOrder } = useOrderContext();
  const router = useRouter();


  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const tax = subtotal * 0.05;
  const total = subtotal + tax;

  const handleCheckout = () => {
    // This is a simplified checkout process
    // A real app would integrate with a payment gateway
    const newOrder = {
        id: `ORD-${Date.now()}`,
        buyerName: localStorage.getItem('userName') || 'Unknown Buyer', // In a real app, get from user session
        date: new Date().toISOString().split('T')[0],
        total: total,
        status: 'Pending' as const,
        itemCount: cartCount,
    };
    addOrder(newOrder);
    clearCart();
    router.push('/account'); // Redirect to account page to see new order
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
                          <Button variant="ghost" size="icon" onClick={() => removeFromCart(item.id)}>
                            <Trash2 className="h-4 w-4 text-muted-foreground" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </Card>
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
                  <span>Taxes (5%)</span>
                  <span>₹{tax.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
              </CardContent>
              <CardFooter className="flex-col gap-2">
                <p className="text-sm text-muted-foreground">Payment Method: Cash on Delivery</p>
                <Button className="w-full" size="lg" onClick={handleCheckout}>Proceed to Checkout</Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </main>
    </>
  );
}
