
import Image from 'next/image';
import Link from 'next/link';
import type { Medicine } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Minus, ShoppingCart } from 'lucide-react';
import { useAppContext } from '@/context/app-context';
import { useToast } from '@/hooks/use-toast';

interface MedicineCardProps {
  medicine: Medicine;
}

export function MedicineCard({ medicine }: MedicineCardProps) {
  const { cartItems, addToCart, updateQuantity, medicines } = useAppContext();
  const { toast } = useToast();

  const liveMedicine = medicines.find(m => m.id === medicine.id) || medicine;

  const cartItem = cartItems.find((item) => item.id === liveMedicine.id);
  const stock = liveMedicine.totalStock || 0;

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    if(stock <= 0) {
      toast({ variant: 'destructive', title: 'Out of Stock' });
      return;
    }
    addToCart(liveMedicine);
    toast({
        title: "Added to Cart",
        description: `${liveMedicine.name} has been added to your cart.`,
    });
  };
  
  const handleIncrement = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    if (cartItem && stock > 0) {
        updateQuantity(liveMedicine.id, cartItem.quantity + 1);
    }
  };

  const handleDecrement = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    if (cartItem) {
        updateQuantity(liveMedicine.id, cartItem.quantity - 1);
    }
  };
  
  return (
    <Link href={`/medicines/${liveMedicine.id}`} className="flex h-full">
        <Card className="flex flex-col overflow-hidden transition-all hover:shadow-lg w-full">
        <CardHeader className="p-0 relative">
            <div className="aspect-[4/3] w-full overflow-hidden">
            {liveMedicine.imageUrl && (
                <Image
                src={liveMedicine.imageUrl}
                alt={liveMedicine.name}
                width={600}
                height={400}
                className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
                />
            )}
            </div>
            {stock <= 0 && (
                 <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className="text-white font-bold text-lg bg-destructive px-3 py-1 rounded-md">Out of Stock</span>
                </div>
            )}
        </CardHeader>
        <CardContent className="p-4 flex-grow">
            <CardTitle className="font-headline text-lg mb-1">{liveMedicine.name}</CardTitle>
            <CardDescription className="line-clamp-2 text-xs">{liveMedicine.description}</CardDescription>
        </CardContent>
        <CardFooter className="p-4 pt-0 flex justify-between items-center mt-auto">
            <p className="text-xl font-bold text-foreground">₹{liveMedicine.defaultPrice.toFixed(2)}</p>
            {!cartItem ? (
                <Button size="sm" onClick={handleAddToCart} disabled={stock <= 0}>
                    <ShoppingCart className="mr-2 h-4 w-4" /> Add
                </Button>
            ) : (
                <div className="flex items-center gap-2">
                    <Button size="icon" variant="outline" className="h-8 w-8" onClick={handleDecrement}>
                        <Minus className="h-4 w-4" />
                    </Button>
                    <span className="font-bold text-lg w-6 text-center">{cartItem.quantity}</span>
                    <Button size="icon" variant="outline" className="h-8 w-8" onClick={handleIncrement} disabled={stock <= 0}>
                        <Plus className="h-4 w-4" />
                    </Button>
                </div>
            )}
        </CardFooter>
        </Card>
    </Link>
  );
}
