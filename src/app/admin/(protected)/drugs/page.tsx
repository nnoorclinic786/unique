
"use client";
import Image from "next/image";
import Link from "next/link";
import { MoreHorizontal, PlusCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import { useAppContext } from "@/context/app-context";
import { useAdminSearch } from "@/context/admin-search-context";
import React from 'react';

export default function AdminDrugsPage() {
  const { medicines, deleteMedicine } = useAppContext();
  const { query } = useAdminSearch();

  const filteredMedicines = medicines.filter(medicine => {
    if (!query) return true;
    const lowerCaseQuery = query.toLowerCase();
    return medicine.name.toLowerCase().includes(lowerCaseQuery) ||
           (medicine.manufacturingCompany && medicine.manufacturingCompany.toLowerCase().includes(lowerCaseQuery)) ||
           (medicine.marketingCompany && medicine.marketingCompany.toLowerCase().includes(lowerCaseQuery)) ||
           (medicine.description && medicine.description.toLowerCase().includes(lowerCaseQuery)) ||
           (medicine.category && medicine.category.toLowerCase().includes(lowerCaseQuery));
  });
  
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
            <div>
                <CardTitle>Medicines</CardTitle>
                <CardDescription>
                    Manage your medicines and view their sales performance.
                </CardDescription>
            </div>
            <Button size="sm" className="gap-1" asChild>
                <Link href="/admin/drugs/new">
                    <PlusCircle className="h-3.5 w-3.5" />
                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                        Add Medicine
                    </span>
                </Link>
            </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="hidden w-[100px] sm:table-cell">
                <span className="sr-only">Image</span>
              </TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Manufacturing Co.</TableHead>
              <TableHead>Marketing Co.</TableHead>
              <TableHead className="hidden md:table-cell">Stock</TableHead>
              <TableHead className="hidden md:table-cell">Price</TableHead>
              <TableHead className="hidden md:table-cell">Batch No.</TableHead>
              <TableHead className="hidden md:table-cell">Mfg. Date</TableHead>
              <TableHead className="hidden md:table-cell">Expiry</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMedicines.map((medicine) => {
              return (
                <TableRow key={medicine.id}>
                  <TableCell className="hidden sm:table-cell">
                    {medicine.imageUrl && (
                      <Image
                        alt={medicine.name}
                        className="aspect-square rounded-md object-cover"
                        height="64"
                        src={medicine.imageUrl}
                        width="64"
                      />
                    )}
                  </TableCell>
                  <TableCell className="font-medium">{medicine.name}</TableCell>
                  <TableCell className="hidden md:table-cell">{medicine.manufacturingCompany || 'N/A'}</TableCell>
                  <TableCell className="hidden md:table-cell">{medicine.marketingCompany || 'N/A'}</TableCell>
                  <TableCell className="hidden md:table-cell">{medicine.stock}</TableCell>
                  <TableCell className="hidden md:table-cell">₹{medicine.price.toFixed(2)}</TableCell>
                   <TableCell className="hidden md:table-cell">{medicine.batchNumber || 'N/A'}</TableCell>
                  <TableCell className="hidden md:table-cell">{medicine.manufacturingDate || 'N/A'}</TableCell>
                  <TableCell className="hidden md:table-cell">{medicine.expiryDate || 'N/A'}</TableCell>
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
                          <Link href={`/admin/drugs/${medicine.id}`}>Edit</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => deleteMedicine(medicine.id)}>Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter>
        <div className="text-xs text-muted-foreground">
          Showing <strong>1-{filteredMedicines.length}</strong> of <strong>{medicines.length}</strong> medicines
        </div>
      </CardFooter>
    </Card>
  );
}
