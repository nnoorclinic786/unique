
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
import { useOrderContext } from '@/context/orders-context';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const user = {
  name: 'City Pharmacy',
  email: 'contact@citypharm.com',
  mobile: '9876543210',
  gst: '29ABCDE1234F1Z5',
  address: '123, Main Market, Bangalore, Karnataka, 560001',
};

const statusColors: { [key: string]: 'default' | 'secondary' | 'destructive' | 'outline' } = {
    'Pending': 'secondary',
    'Processing': 'outline',
    'Shipped': 'default',
    'Delivered': 'default',
    'Cancelled': 'destructive',
};

export default function AccountPage() {
  const { orders, updateOrderStatus } = useOrderContext();
  const { toast } = useToast();
  const [userName, setUserName] = useState<string | null>(null);

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

  const userOrders = userName ? orders.filter(order => order.buyerName === userName) : [];

  return (
    <>
      <Header />
      <main className="flex-1 container mx-auto px-4 md:px-6 py-8">
        <h1 className="text-3xl font-headline font-bold mb-8">My Account</h1>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="font-headline">{userName || 'User'}</CardTitle>
                <CardDescription>{user.email}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div>
                  <h3 className="font-semibold">Mobile</h3>
                  <p className="text-muted-foreground">{user.mobile}</p>
                </div>
                <div>
                  <h3 className="font-semibold">GST Number</h3>
                  <p className="text-muted-foreground">{user.gst}</p>
                </div>
                <div>
                  <h3 className="font-semibold">Delivery Address</h3>
                  <p className="text-muted-foreground">{user.address}</p>
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
