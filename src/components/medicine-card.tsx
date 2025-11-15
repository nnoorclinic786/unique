import Image from 'next/image';
import type { Medicine } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';

interface MedicineCardProps {
  medicine: Medicine;
}

export function MedicineCard({ medicine }: MedicineCardProps) {
  const image = PlaceHolderImages.find(img => img.id === medicine.imageId);

  return (
    <Card className="flex flex-col overflow-hidden transition-all hover:shadow-lg">
      <CardHeader className="p-0">
        <div className="aspect-[3/2] w-full overflow-hidden">
          {image && (
            <Image
              src={image.imageUrl}
              alt={medicine.name}
              width={600}
              height={400}
              data-ai-hint={image.imageHint}
              className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
            />
          )}
        </div>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <CardTitle className="font-headline text-lg mb-1">{medicine.name}</CardTitle>
        <CardDescription>{medicine.description}</CardDescription>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between items-center">
        <p className="text-xl font-bold text-foreground">₹{medicine.price.toFixed(2)}</p>
        <Button size="sm">
          <Plus className="mr-2 h-4 w-4" /> Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
}
