
import Image from 'next/image';
import Link from 'next/link';
import type { Medicine } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useCart } from '@/context/cart-context';

interface MedicineCardProps {
  medicine: Medicine;
}

export function MedicineCard({ medicine }: MedicineCardProps) {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault(); // Prevent the link from firing
    addToCart(medicine);
  };
  
  return (
    <Link href={`/medicines/${medicine.id}`} className="flex h-full">
        <Card className="flex flex-col overflow-hidden transition-all hover:shadow-lg w-full">
        <CardHeader className="p-0">
            <div className="aspect-[3/2] w-full overflow-hidden">
            {medicine.imageUrl && (
                <Image
                src={medicine.imageUrl}
                alt={medicine.name}
                width={600}
                height={400}
                className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
                />
            )}
            </div>
        </CardHeader>
        <CardContent className="p-4 flex-grow">
            <CardTitle className="font-headline text-lg mb-1">{medicine.name}</CardTitle>
            <CardDescription className="line-clamp-2">{medicine.description}</CardDescription>
        </CardContent>
        <CardFooter className="p-4 pt-0 flex justify-between items-center mt-auto">
            <p className="text-xl font-bold text-foreground">₹{medicine.price.toFixed(2)}</p>
            <Button size="sm" onClick={handleAddToCart}>
            <Plus className="mr-2 h-4 w-4" /> Add to Cart
            </Button>
        </CardFooter>
        </Card>
    </Link>
  );
}
