
"use client";

import Link from "next/link";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { orders, buyers, salesData, medicines } from "@/lib/data";
import { DollarSign, Users, Package, ShoppingCart } from "lucide-react";
import { useAdminSearch } from "@/context/admin-search-context";
import React from 'react';

export default function DashboardContents() {
  const { query } = useAdminSearch();

  const totalRevenue = orders
    .filter(o => o.status === 'Delivered')
    .reduce((acc, order) => acc + order.total, 0);

  const filteredOrders = orders.filter(order => {
      if (!query) return true;
      const lowerCaseQuery = query.toLowerCase();
      return order.buyerName.toLowerCase().includes(lowerCaseQuery) ||
             order.id.toLowerCase().includes(lowerCaseQuery);
  }).slice(0, 5);
  
  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        <Link href="/admin/orders">
            <Card className="hover:bg-muted/50 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                Total Revenue
                </CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">₹{totalRevenue.toLocaleString('en-IN')}</div>
                <p className="text-xs text-muted-foreground">
                +20.1% from last month
                </p>
            </CardContent>
            </Card>
        </Link>
        <Link href="/admin/buyers">
            <Card className="hover:bg-muted/50 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">New Buyers</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">+{buyers.length}</div>
                <p className="text-xs text-muted-foreground">
                +10 since last month
                </p>
            </CardContent>
            </Card>
        </Link>
        <Link href="/admin/orders">
            <Card className="hover:bg-muted/50 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">
                {orders.filter(o => o.status === 'Pending').length}
                </div>
                <p className="text-xs text-muted-foreground">
                {orders.filter(o => o.status === 'Processing').length} being processed
                </p>
            </CardContent>
            </Card>
        </Link>
        <Link href="/admin/drugs">
            <Card className="hover:bg-muted/50 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                Medicines in Stock
                </CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{medicines.length}</div>
                <p className="text-xs text-muted-foreground">
                Total variants available
                </p>
            </CardContent>
            </Card>
        </Link>
      </div>
      <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>Sales Overview</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={salesData}>
                <XAxis
                  dataKey="month"
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `₹${value / 1000}K`}
                />
                <Bar dataKey="sales" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>
              You have {orders.filter(o => o.status === 'Pending').length} pending orders.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>
                      <div className="font-medium">{order.buyerName}</div>
                      <div className="hidden text-sm text-muted-foreground md:inline">
                        {order.id}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">₹{order.total.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
