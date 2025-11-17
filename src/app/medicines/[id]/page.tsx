
'use client';

import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { useMedicineContext } from '@/context/medicines-context';
import { useCart } from '@/context/cart-context';
import { Header } from '@/components/header';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ChevronLeft, Plus, Pill, Building, Tag, Info, Package, Calendar, Minus } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';

export default function MedicineDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { medicines } = useMedicineContext();
  const { cartItems, addToCart, updateQuantity } = useCart();
  const { toast } = useToast();

  const id = params.id as string;
  const medicine = medicines.find((m) => m.id === id);
  const cartItem = medicine ? cartItems.find((item) => item.id === medicine.id) : undefined;

  if (!medicine) {
    return (
      <>
        <Header />
        <main className="flex-1 container mx-auto px-4 md:px-6 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold">Medicine not found</h1>
            <Button asChild className="mt-4">
              <Link href="/medicines">Back to Medicines</Link>
            </Button>
          </div>
        </main>
      </>
    );
  }

  const handleAddToCart = () => {
    addToCart(medicine);
    toast({
      title: "Added to Cart",
      description: `${medicine.name} has been added to your cart.`,
    });
  };

  const handleIncrement = () => {
    if (cartItem) {
      updateQuantity(medicine.id, cartItem.quantity + 1);
    }
  };

  const handleDecrement = () => {
    if (cartItem) {
      updateQuantity(medicine.id, cartItem.quantity - 1);
    }
  };
  
  const DetailItem = ({ icon, label, value }: { icon: React.ReactNode, label: string, value?: string | number | null }) => {
    if (!value) return null;
    return (
        <div className="flex items-start gap-3">
            <span className="text-muted-foreground mt-1">{icon}</span>
            <div>
                <p className="text-sm font-medium text-foreground">{label}</p>
                <p className="text-sm text-muted-foreground">{value}</p>
            </div>
        </div>
    )
  }

  return (
    <>
      <Header />
      <main className="flex-1 container mx-auto px-4 md:px-6 py-8">
        <div className="mb-6">
          <Button variant="outline" size="sm" onClick={() => router.back()}>
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </div>
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          <div>
            <div className="aspect-square w-full overflow-hidden rounded-lg border">
              <Image
                src={medicine.imageUrl}
                alt={medicine.name}
                width={800}
                height={800}
                className="object-cover w-full h-full"
              />
            </div>
          </div>
          <div className="flex flex-col gap-6">
            <div>
                <p className="text-sm font-medium text-primary">{medicine.category}</p>
                <h1 className="text-3xl lg:text-4xl font-headline font-bold">{medicine.name}</h1>
                <p className="mt-4 text-muted-foreground">{medicine.description}</p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
                <DetailItem icon={<Pill size={16}/>} label="Price Unit" value={medicine.priceUnit} />
                <DetailItem icon={<Package size={16}/>} label="Stock Unit" value={medicine.stockUnit} />
                <DetailItem icon={<Tag size={16}/>} label="Batch No." value={medicine.batchNumber} />
                <DetailItem icon={<Info size={16}/>} label="HSN Code" value={medicine.hsnCode} />
                <DetailItem icon={<Calendar size={16}/>} label="Mfg. Date" value={medicine.manufacturingDate} />
                <DetailItem icon={<Calendar size={16}/>} label="Expiry Date" value={medicine.expiryDate} />
                <DetailItem icon={<Building size={16}/>} label="Manufacturer" value={medicine.manufacturingCompany} />
                <DetailItem icon={<Building size={16}/>} label="Marketer" value={medicine.marketingCompany} />
            </div>
            
            <Separator />

            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <p className="text-3xl font-bold">₹{medicine.price.toFixed(2)}</p>
                 {!cartItem ? (
                    <Button size="lg" className="w-full sm:w-auto" onClick={handleAddToCart}>
                        <Plus className="mr-2 h-5 w-5" />
                        Add to Cart
                    </Button>
                ) : (
                    <div className="flex items-center gap-2">
                        <Button size="icon" variant="outline" className="h-12 w-12" onClick={handleDecrement}>
                            <Minus className="h-5 w-5" />
                        </Button>
                        <span className="font-bold text-2xl w-12 text-center">{cartItem.quantity}</span>
                        <Button size="icon" variant="outline" className="h-12 w-12" onClick={handleIncrement}>
                            <Plus className="h-5 w-5" />
                        </Button>
                    </div>
                )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
