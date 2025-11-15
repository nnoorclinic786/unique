
"use client";

import { MoreHorizontal, File } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { orders } from "@/lib/data";
import type { Order } from "@/lib/types";

const statusColors: { [key: string]: 'default' | 'secondary' | 'destructive' } = {
    'Pending': 'secondary',
    'Processing': 'secondary',
    'Shipped': 'secondary',
    'Delivered': 'default',
    'Cancelled': 'destructive',
};

const OrderTable = ({ ordersToShow }: { ordersToShow: typeof orders }) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Customer</TableHead>
          <TableHead className="hidden sm:table-cell">Status</TableHead>
          <TableHead className="hidden sm:table-cell">Date</TableHead>
          <TableHead className="text-right">Amount</TableHead>
          <TableHead>
            <span className="sr-only">Actions</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {ordersToShow.map((order) => (
          <TableRow key={order.id}>
            <TableCell>
              <div className="font-medium">{order.buyerName}</div>
              <div className="hidden text-sm text-muted-foreground md:inline">
                {order.id}
              </div>
            </TableCell>
            <TableCell className="hidden sm:table-cell">
              <Badge className="text-xs" variant={statusColors[order.status] || 'secondary'}>
                {order.status}
              </Badge>
            </TableCell>
            <TableCell className="hidden sm:table-cell">{order.date}</TableCell>
            <TableCell className="text-right">₹{order.total.toFixed(2)}</TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button aria-haspopup="true" size="icon" variant="ghost">
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">Toggle menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuItem>View Details</DropdownMenuItem>
                  <DropdownMenuItem>Update Status</DropdownMenuItem>
                  <DropdownMenuItem>Contact Buyer</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
);


export default function AdminOrdersPage() {
  const pendingOrders = orders.filter(o => o.status === 'Pending' || o.status === 'Processing');
  const shippedOrders = orders.filter(o => o.status === 'Shipped');
  const deliveredOrders = orders.filter(o => o.status === 'Delivered');

  const exportToCsv = (data: Order[], filename: string) => {
    const csvRows = [
        // Headers
        ['Order ID', 'Customer', 'Date', 'Amount', 'Status'].join(','),
        // Data
        ...data.map(order => [
            order.id,
            `"${order.buyerName.replace(/"/g, '""')}"`, // Handle quotes in names
            order.date,
            order.total.toFixed(2),
            order.status
        ].join(','))
    ];

    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExport = () => {
    exportToCsv(orders, 'orders.csv');
  };

  return (
    <Tabs defaultValue="all">
      <div className="flex items-center">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="shipped">Shipped</TabsTrigger>
          <TabsTrigger value="delivered">Delivered</TabsTrigger>
        </TabsList>
        <div className="ml-auto flex items-center gap-2">
            <Button size="sm" variant="outline" className="h-7 gap-1" onClick={handleExport}>
                <File className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Export
                </span>
            </Button>
        </div>
      </div>
      <TabsContent value="all">
        <Card>
          <CardHeader>
            <CardTitle>All Orders</CardTitle>
            <CardDescription>
              A list of all recent orders from your buyers.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <OrderTable ordersToShow={orders} />
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="pending">
        <Card>
          <CardHeader>
            <CardTitle>Pending Orders</CardTitle>
            <CardDescription>
              These orders are awaiting processing or shipment.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <OrderTable ordersToShow={pendingOrders} />
          </CardContent>
        </Card>
      </TabsContent>
       <TabsContent value="shipped">
        <Card>
          <CardHeader>
            <CardTitle>Shipped Orders</CardTitle>
            <CardDescription>
              These orders have been shipped and are in transit.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <OrderTable ordersToShow={shippedOrders} />
          </CardContent>
        </Card>
      </TabsContent>
       <TabsContent value="delivered">
        <Card>
          <CardHeader>
            <CardTitle>Delivered Orders</CardTitle>
            <CardDescription>
              These orders have been successfully delivered.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <OrderTable ordersToShow={deliveredOrders} />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
