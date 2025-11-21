
"use client";

import ClientLayout from '../client-layout';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { MedicineCard } from '@/components/medicine-card';
import { useCollection, useFirestore, useMemoFirebase, useUser } from '@/firebase';
import { collection } from 'firebase/firestore';
import type { Medicine } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

function MedicinesPageContent() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const [searchQuery, setSearchQuery] = useState('');

  // This query is now memoized and will only be created when the user is logged in.
  // If the user is not logged in, it will be null, and useCollection will not run.
  const medicinesQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return collection(firestore, 'drugs');
  }, [firestore, user]);

  // useCollection will wait until medicinesQuery is not null.
  const { data: medicines, isLoading: medicinesLoading } = useCollection<Medicine>(medicinesQuery);

  const filteredMedicines = medicines?.filter(medicine =>
    medicine.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (medicine.description && medicine.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (medicine.category && medicine.category.toLowerCase().includes(searchQuery.toLowerCase()))
  ) || [];

  const isLoading = isUserLoading || (user && medicinesLoading);

  return (
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
        
        {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="flex flex-col space-y-3">
                        <Skeleton className="h-[200px] w-full rounded-xl" />
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-[200px]" />
                            <Skeleton className="h-4 w-[150px]" />
                        </div>
                    </div>
                ))}
            </div>
        ) : !user ? (
            <div className="text-center py-16 text-muted-foreground border-2 border-dashed rounded-lg">
                <h2 className="text-xl font-semibold text-foreground">Please Log In</h2>
                <p>You need to be logged in to view our medicine catalog.</p>
            </div>
        ) : (
            <>
              {filteredMedicines.length > 0 ? (
                 <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {filteredMedicines.map((medicine) => (
                      <MedicineCard key={medicine.id} medicine={medicine} />
                  ))}
                  </div>
              ) : (
                 <div className="text-center py-16 text-muted-foreground border-2 border-dashed rounded-lg">
                    <h2 className="text-xl font-semibold text-foreground">No Medicines Found</h2>
                    <p>Your search for "{searchQuery}" did not match any medicines.</p>
                </div>
              )}
            </>
        )}

      </div>
    </main>
  );
}

export default function MedicinesPage() {
  return (
    <ClientLayout>
      <MedicinesPageContent />
    </ClientLayout>
  );
}
