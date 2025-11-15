
"use client";

import { MoreHorizontal, CheckCircle2, EyeOff, Eye, Search } from "lucide-react";
import Link from "next/link";
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useBuyerContext } from "@/context/buyers-context";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export default function AdminBuyersPage() {
  const { buyers, pendingBuyers, disabledBuyers, approveBuyer, toggleBuyerStatus } = useBuyerContext();
  const [searchQuery, setSearchQuery] = useState("");

  const filterBuyers = (buyers: any[]) => {
    if (!searchQuery) return buyers;
    return buyers.filter(buyer =>
        buyer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        buyer.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  const filteredPendingBuyers = filterBuyers(pendingBuyers);
  const filteredBuyers = filterBuyers(buyers);
  const filteredDisabledBuyers = filterBuyers(disabledBuyers);

  return (
    <div className="space-y-8">
       <div className="relative w-full md:w-1/3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search buyers by name or email..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

      {filteredPendingBuyers.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Pending Approvals</CardTitle>
            <CardDescription>
              These buyers are waiting for your approval to access the platform.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Buyer</TableHead>
                  <TableHead className="hidden sm:table-cell">Registered On</TableHead>
                  <TableHead className="hidden md:table-cell">GST Number</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPendingBuyers.map((buyer) => (
                  <TableRow key={buyer.id}>
                    <TableCell>
                      <div className="flex items-center gap-4">
                        <Avatar className="hidden h-9 w-9 sm:flex">
                          <AvatarFallback>{buyer.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="grid gap-1">
                          <p className="text-sm font-medium leading-none">{buyer.name}</p>
                          <p className="text-sm text-muted-foreground">{buyer.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">{buyer.registeredOn}</TableCell>
                    <TableCell className="hidden md:table-cell font-mono text-xs">{buyer.gstNumber}</TableCell>
                    <TableCell className="text-right">
                       <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button aria-haspopup="true" size="icon" variant="ghost">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Toggle menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem asChild>
                            <Link href={`/admin/buyers/${buyer.id}`}>View Details</Link>
                          </DropdownMenuItem>
                           <DropdownMenuItem onClick={() => approveBuyer(buyer.id)}>
                            <CheckCircle2 className="mr-2 h-4 w-4" />
                            Approve
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Approved Buyers</CardTitle>
          <CardDescription>
            List of all approved buyers on the platform.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Buyer</TableHead>
                <TableHead className="hidden sm:table-cell">Type</TableHead>
                <TableHead className="hidden md:table-cell">GST Number</TableHead>
                <TableHead className="hidden sm:table-cell">Registered On</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBuyers.map((buyer) => (
                <TableRow key={buyer.id}>
                  <TableCell>
                    <div className="flex items-center gap-4">
                      <Avatar className="hidden h-9 w-9 sm:flex">
                          <AvatarFallback>{buyer.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="grid gap-1">
                        <p className="text-sm font-medium leading-none">{buyer.name}</p>
                        <p className="text-sm text-muted-foreground">{buyer.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                      <Badge variant="outline">{buyer.type}</Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell font-mono text-xs">{buyer.gstNumber}</TableCell>
                  <TableCell className="hidden sm:table-cell">{buyer.registeredOn}</TableCell>
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
                        <DropdownMenuItem asChild>
                          <Link href={`/admin/buyers/${buyer.id}`}>View Details</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => toggleBuyerStatus(buyer.id, 'Approved')}>
                          <EyeOff className="mr-2 h-4 w-4" />
                          Disable Account
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {filteredDisabledBuyers.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Disabled Buyers</CardTitle>
            <CardDescription>
              These buyers are currently disabled and cannot access the platform.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Buyer</TableHead>
                  <TableHead className="hidden sm:table-cell">Type</TableHead>
                  <TableHead className="hidden md:table-cell">GST Number</TableHead>
                  <TableHead className="hidden sm:table-cell">Registered On</TableHead>
                  <TableHead>
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDisabledBuyers.map((buyer) => (
                  <TableRow key={buyer.id}>
                    <TableCell>
                      <div className="flex items-center gap-4">
                        <Avatar className="hidden h-9 w-9 sm:flex">
                            <AvatarFallback>{buyer.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="grid gap-1">
                          <p className="text-sm font-medium leading-none">{buyer.name}</p>
                          <p className="text-sm text-muted-foreground">{buyer.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                        <Badge variant="outline">{buyer.type}</Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell font-mono text-xs">{buyer.gstNumber}</TableCell>
                    <TableCell className="hidden sm:table-cell">{buyer.registeredOn}</TableCell>
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
                          <DropdownMenuItem asChild>
                            <Link href={`/admin/buyers/${buyer.id}`}>View Details</Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => toggleBuyerStatus(buyer.id, 'Disabled')}>
                             <Eye className="mr-2 h-4 w-4" />
                             Enable Account
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
