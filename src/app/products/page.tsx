import { Header } from '@/components/header';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { products } from '@/lib/data';
import { ProductCard } from '@/components/product-card';

export default function ProductsPage() {
  return (
    <>
      <Header />
      <main className="flex-1 container mx-auto px-4 md:px-6 py-8">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
            <h1 className="text-3xl font-headline font-bold">Our Products</h1>
            <div className="relative w-full md:w-1/3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search for drugs..." className="pl-9" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
