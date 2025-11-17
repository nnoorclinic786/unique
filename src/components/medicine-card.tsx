
import Image from 'next/image';
import Link from 'next/link';
import type { Medicine } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Minus } from 'lucide-react';
import { useAppContext } from '@/context/app-context';
import { useToast } from '@/hooks/use-toast';

interface MedicineCardProps {
  medicine: Medicine;
}

export function MedicineCard({ medicine }: MedicineCardProps) {
  const { cartItems, addToCart, updateQuantity } = useAppContext();
  const { toast } = useToast();
  const cartItem = cartItems.find((item) => item.id === medicine.id);

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    addToCart(medicine);
    toast({
        title: "Added to Cart",
        description: `${medicine.name} has been added to your cart.`,
    });
  };
  
  const handleIncrement = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    if (cartItem) {
        updateQuantity(medicine.id, cartItem.quantity + 1);
    }
  };

  const handleDecrement = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    if (cartItem) {
        updateQuantity(medicine.id, cartItem.quantity - 1);
    }
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
            {!cartItem ? (
                <Button size="sm" onClick={handleAddToCart}>
                    <Plus className="mr-2 h-4 w-4" /> Add to Cart
                </Button>
            ) : (
                <div className="flex items-center gap-2">
                    <Button size="icon" variant="outline" className="h-8 w-8" onClick={handleDecrement}>
                        <Minus className="h-4 w-4" />
                    </Button>
                    <span className="font-bold text-lg">{cartItem.quantity}</span>
                    <Button size="icon" variant="outline" className="h-8 w-8" onClick={handleIncrement}>
                        <Plus className="h-4 w-4" />
                    </Button>
                </div>
            )}
        </CardFooter>
        </Card>
    </Link>
  );
}
