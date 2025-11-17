
'use client';

import Link from 'next/link';
import { Logo } from './icons';
import { Mail, Phone, MapPin } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

export function Footer() {
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const checkLoginStatus = () => {
      if (typeof window !== 'undefined' && localStorage.getItem('userLoggedIn') === 'true') {
        setIsUserLoggedIn(true);
      } else {
        setIsUserLoggedIn(false);
      }
    };

    checkLoginStatus();
    
    window.addEventListener('storage', checkLoginStatus);
    return () => {
      window.removeEventListener('storage', checkLoginStatus);
    };

  }, []);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    if (isUserLoggedIn) {
      router.push(href);
    } else {
      toast({
        title: "Access Denied",
        description: "Please sign up or log in first to access this page.",
        variant: "destructive"
      });
    }
  };

  const QuickLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
    <li>
      <a href={href} onClick={(e) => handleLinkClick(e, href)} className="text-muted-foreground hover:text-primary cursor-pointer">
        {children}
      </a>
    </li>
  );

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
                <QuickLink href="/medicines">Products</QuickLink>
                <QuickLink href="/account">Orders</QuickLink>
                <QuickLink href="/cart">Cart</QuickLink>
              </ul>
            </div>
            <div>
              <h3 className="font-headline font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/about" className="text-muted-foreground hover:text-primary">About Us</Link></li>
                <li><Link href="/privacy-policy" className="text-muted-foreground hover:text-primary">Privacy Policy</Link></li>
                <li><Link href="/terms-of-service" className="text-muted-foreground hover:text-primary">Terms of Service</Link></li>
                <li><Link href="/refund-policy" className="text-muted-foreground hover:text-primary">Refund & Cancellation Policy</Link></li>
                <li><Link href="/shipping-and-delivery-policy" className="text-muted-foreground hover:text-primary">Shipping & Delivery Policy</Link></li>
                <li><Link href="/return-and-replacement-policy" className="text-muted-foreground hover:text-primary">Return & Replacement Policy</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-primary">Payment Policy</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-primary">Data Protection & Security Policy</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-headline font-semibold mb-4">Contact Us</h3>
              <address className="space-y-2 text-sm not-italic text-muted-foreground">
                <p className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 mt-1 flex-shrink-0 text-primary" />
                  <span>4/79, Moh. Diwan Mubarak, Mau Darwaza, Farrukhabad, Uttar Pradesh – 209625</span>
                </p>
                <p className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-primary" />
                  <a href="tel:8299400552" className="hover:text-primary">8299400552</a>
                </p>
                <p className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-primary" />
                  <a href="mailto:uniquemedicare786@gmail.com" className="hover:text-primary">uniquemedicare786@gmail.com</a>
                </p>
              </address>
            </div>
          </div>
        </div>
        <div className="border-t border-muted-foreground/10 mt-8 pt-6 text-center text-xs text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} Unique Medicare. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
