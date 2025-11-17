
'use client';

import { Header } from '@/components/header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Badge } from '@/components/ui/badge';
import { useAppContext } from '@/context/app-context';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AddressForm } from '@/components/address-form';

const statusColors: { [key: string]: 'default' | 'secondary' | 'destructive' | 'outline' } = {
    'Pending': 'secondary',
    'Processing': 'outline',
    'Shipped': 'default',
    'Delivered': 'default',
    'Cancelled': 'destructive',
};

export default function AccountPage() {
  const { orders, updateOrderStatus, buyers, updateBuyerAddress } = useAppContext();
  const { toast } = useToast();
  const [userName, setUserName] = useState<string | null>(null);
  const [isAddressDialogOpen, setAddressDialogOpen] = useState(false);

  useEffect(() => {
    // In a real app, you'd get the user from a session.
    // For this prototype, we'll use localStorage to get the logged-in user's name.
    const storedUserName = localStorage.getItem('userName');
    setUserName(storedUserName);
  }, []);

  const handleCancelOrder = (orderId: string) => {
    updateOrderStatus(orderId, 'Cancelled');
    toast({
        title: "Order Cancelled",
        description: `Order ${orderId} has been cancelled.`,
    });
  };
  
  const buyer = buyers.find(b => b.name === userName);
  const userOrders = userName ? orders.filter(order => order.buyerName === userName) : [];

  const handleAddressSave = (newAddress: string) => {
    if (buyer) {
        updateBuyerAddress(buyer.id, newAddress);
        toast({
            title: "Address Updated",
            description: "Your shipping address has been successfully updated.",
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


  return (
    <>
      <Header />
      <main className="flex-1 container mx-auto px-4 md:px-6 py-8">
        <h1 className="text-3xl font-headline font-bold mb-8">My Account</h1>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="font-headline">{buyer?.name || 'User'}</CardTitle>
                <CardDescription>{buyer?.email}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div>
                  <h3 className="font-semibold">Mobile</h3>
                  <p className="text-muted-foreground">{buyer?.mobileNumber1}</p>
                </div>
                <div>
                  <h3 className="font-semibold">GST Number</h3>
                  <p className="text-muted-foreground">{buyer?.gstNumber}</p>
                </div>
                <div>
                  <h3 className="font-semibold">Delivery Address</h3>
                   {buyer?.address ? (
                        <p className="text-muted-foreground">{buyer.address}</p>
                   ) : (
                        <p className="text-muted-foreground italic">No address set.</p>
                   )}
                   <Dialog open={isAddressDialogOpen} onOpenChange={setAddressDialogOpen}>
                        <DialogTrigger asChild>
                            <Button variant="link" className="p-0 h-auto mt-2 text-sm">{buyer?.address ? 'Change Address' : 'Add Shipping Address'}</Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Edit Shipping Address</DialogTitle>
                            </DialogHeader>
                            <AddressForm currentAddress={buyer?.address} onSave={handleAddressSave} />
                        </DialogContent>
                    </Dialog>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="md:col-span-2">
            <h2 className="text-2xl font-headline font-bold mb-4">Order History</h2>
            <Card>
              <CardContent className="p-0">
                {userOrders.length > 0 ? (
                    <Accordion type="single" collapsible className="w-full">
                    {userOrders.map(order => (
                        <AccordionItem value={order.id} key={order.id}>
                        <AccordionTrigger className="px-6">
                            <div className="flex justify-between w-full pr-4">
                            <div className="text-left">
                                <p className="font-medium">{order.id}</p>
                                <p className="text-sm text-muted-foreground">{order.date}</p>
                            </div>
                            <div className="flex flex-col items-end">
                                <p className="font-semibold">₹{order.total.toFixed(2)}</p>
                                <Badge variant={statusColors[order.status] || 'secondary'} className="mt-1">{order.status}</Badge>
                            </div>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-6 pb-4 space-y-4">
                            <p>This order contained {order.itemCount} items. The payment method was Cash on Delivery. Order status is currently <span className="font-semibold">{order.status}</span>.</p>
                            {(order.status === 'Pending' || order.status === 'Processing') && (
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => handleCancelOrder(order.id)}
                                >
                                    Cancel Order
                                </Button>
                            )}
                        </AccordionContent>
                        </AccordionItem>
                    ))}
                    </Accordion>
                ) : (
                    <div className="text-center p-8 text-muted-foreground">
                        You have not placed any orders yet.
                    </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </>
  );
}
