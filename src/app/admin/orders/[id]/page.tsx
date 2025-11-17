
'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useOrderContext } from '@/context/orders-context';
import { useBuyerContext } from '@/context/buyers-context';
import { useMedicineContext } from '@/context/medicines-context';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  ChevronLeft,
  Mail,
  Phone,
  User,
  Truck,
  Package,
  Calendar,
  IndianRupee,
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const statusColors: { [key: string]: 'default' | 'secondary' | 'destructive' | 'outline' } = {
    'Pending': 'secondary',
    'Processing': 'outline',
    'Shipped': 'default',
    'Delivered': 'default',
    'Cancelled': 'destructive',
};

export default function OrderDetailsPage() {
  const params = useParams();
  const { id } = params;
  const { orders } = useOrderContext();
  const { buyers } = useBuyerContext();
  const { medicines } = useMedicineContext();

  const order = orders.find((o) => o.id === id);
  const buyer = order ? buyers.find((b) => b.name === order.buyerName) : null;
  
  // Mock order items - in a real app this would come from the order object
  const orderItems = [
    { ...medicines[0], quantity: 2 },
    { ...medicines[2], quantity: 1 },
    { ...medicines[4], quantity: 3 },
  ];
  const subtotal = orderItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const tax = subtotal * 0.05;
  const total = subtotal + tax;


  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center">
        <p className="text-xl mb-4">Order not found.</p>
         <Button asChild>
            <Link href="/admin/orders">
                <ChevronLeft className="mr-2 h-4 w-4" />
                Back to Orders
            </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center gap-4 mb-4">
        <Button variant="outline" size="icon" className="h-7 w-7" asChild>
          <Link href="/admin/orders">
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
          Order Details
        </h1>
        <Badge variant={statusColors[order.status]} className="ml-auto sm:ml-0">
          {order.status}
        </Badge>
      </div>
      <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
        <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle>Order {order.id}</CardTitle>
              <CardDescription>Date: {order.date}</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead className="text-right">Unit Price</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orderItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell className="text-right">₹{item.price.toFixed(2)}</TableCell>
                      <TableCell className="text-right">₹{(item.price * item.quantity).toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="flex flex-row items-center border-t bg-muted/50 px-6 py-3">
                 <div className="text-xs text-muted-foreground">
                    Updated <time dateTime={order.date}>{order.date}</time>
                </div>
            </CardFooter>
          </Card>
        </div>

        <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
            <Card>
                <CardHeader>
                    <CardTitle>Order Summary</CardTitle>
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
                     <div className="flex justify-between">
                        <span>Shipping</span>
                        <span>FREE</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-semibold">
                        <span>Total</span>
                        <span>₹{total.toFixed(2)}</span>
                    </div>
                </CardContent>
            </Card>

            {buyer && (
              <Card>
                <CardHeader className="flex flex-row items-center space-y-0">
                    <CardTitle>Customer</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-4 text-sm">
                    <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-muted-foreground" />
                        <span>{buyer.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        <span>{buyer.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-muted-foreground" />
                        <span>{buyer.mobileNumber1}</span>
                    </div>
                     <Separator />
                     <div className="flex items-start gap-2">
                        <Truck className="w-4 h-4 text-muted-foreground mt-1" />
                        <div className="grid gap-0.5">
                            <span className="font-medium">Shipping Address</span>
                            <address className="not-italic text-muted-foreground">
                                {buyer.address}
                            </address>
                        </div>
                    </div>
                </CardContent>
              </Card>
            )}
        </div>
      </div>
    </div>
  );
}
