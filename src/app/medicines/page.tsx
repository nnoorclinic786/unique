
"use client";
import { useState } from 'react';
import { Header } from '@/components/header';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { MedicineCard } from '@/components/medicine-card';
import { useAppContext } from '@/context/app-context';

export default function MedicinesPage() {
  const { medicines } = useAppContext();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredMedicines = medicines.filter(medicine =>
    medicine.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (medicine.description && medicine.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (medicine.category && medicine.category.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <>
      <Header />
      <main className="flex-1 container mx-auto px-4 md:px-6 py-8">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
            <h1 className="text-3xl font-headline font-bold">Our Medicines</h1>
            <div className="relative w-full md:w-1/3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search for medicines..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredMedicines.map((medicine) => (
              <MedicineCard key={medicine.id} medicine={medicine} />
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
