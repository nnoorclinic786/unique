
import Link from 'next/link';
import { Logo } from './icons';

export function Footer() {
  return (
    <footer className="bg-secondary text-secondary-foreground">
      <div className="container mx-auto px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1 space-y-4">
             <Link href="/" className="flex items-center gap-2">
                <Logo className="h-10 w-10 text-primary" />
                <span className="font-headline text-lg font-semibold">
                    Unique Medicare
                </span>
            </Link>
            <p className="text-sm text-muted-foreground">
                Your trusted partner for wholesale pharmaceutical supplies.
            </p>
          </div>
          <div className="md:col-span-3 grid grid-cols-2 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-headline font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/medicines" className="text-muted-foreground hover:text-primary">Products</Link></li>
                <li><Link href="/account" className="text-muted-foreground hover:text-primary">Orders</Link></li>
                <li><Link href="/cart" className="text-muted-foreground hover:text-primary">Cart</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-headline font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="#" className="text-muted-foreground hover:text-primary">Help Center</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-primary">Terms of Service</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-primary">Privacy Policy</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-headline font-semibold mb-4">Contact</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>uniquemedicare786@gmail.com</li>
                <li>8299400552</li>
                <li>4/79, Diwan Mubarak, Farrukhabad</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-muted py-4">
        <div className="container mx-auto px-4 md:px-6 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Unique Medicare. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
