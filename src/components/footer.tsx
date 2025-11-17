
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

  const QuickLink = ({ href, children }: { href: string; children: React.ReactNode; }) => (
    <li>
      <a href={href} onClick={(e) => handleLinkClick(e, href)} className="text-muted-foreground hover:text-primary transition-colors cursor-pointer">
        {children}
      </a>
    </li>
  );
  
  const PolicyLink = ({ href, children }: { href: string; children: React.ReactNode; }) => (
    <li>
        <Link href={href} className="text-muted-foreground hover:text-primary transition-colors">
            {children}
        </Link>
    </li>
  );

  return (
    <footer className="bg-secondary text-secondary-foreground">
      <div className="container mx-auto px-4 md:px-6">
        <div className="py-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          <div className="md:col-span-2 lg:col-span-2 space-y-4">
             <Link href="/" className="flex items-center gap-2">
                <Logo className="h-10 w-10 text-primary" />
                <span className="font-headline text-lg font-semibold">
                    Unique Medicare
                </span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-sm">
                Your trusted, licensed partner for wholesale pharmaceutical supplies, located in Farrukhabad, Uttar Pradesh.
            </p>
          </div>
          <div>
            <h3 className="font-headline font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
                <QuickLink href="/medicines">Products</QuickLink>
                <QuickLink href="/account">My Account</QuickLink>
                <QuickLink href="/cart">Cart & Orders</QuickLink>
            </ul>
          </div>
          <div>
            <h3 className="font-headline font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-sm">
                <PolicyLink href="/about">About Us</PolicyLink>
                <PolicyLink href="/privacy-policy">Privacy Policy</PolicyLink>
                <PolicyLink href="/terms-of-service">Terms of Service</PolicyLink>
            </ul>
          </div>
           <div>
              <h3 className="font-headline font-semibold mb-4">Contact Us</h3>
              <address className="space-y-3 text-sm not-italic text-muted-foreground">
                <p className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 mt-1 flex-shrink-0 text-primary" />
                  <span>4/79, Moh. Diwan Mubarak, Mau Darwaza, Farrukhabad, Uttar Pradesh – 209625</span>
                </p>
                <p className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-primary" />
                  <a href="tel:8299400552" className="hover:text-primary transition-colors">8299400552</a>
                </p>
                <p className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-primary" />
                  <a href="mailto:uniquemedicare786@gmail.com" className="hover:text-primary transition-colors">uniquemedicare786@gmail.com</a>
                </p>
              </address>
            </div>
        </div>
        
         <div className="border-t border-muted-foreground/10 py-6">
            <h3 className="font-headline font-semibold mb-4">Our Policies</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-6 gap-y-2 text-sm">
                <PolicyLink href="/refund-policy">Refund & Cancellation</PolicyLink>
                <PolicyLink href="/shipping-and-delivery-policy">Shipping & Delivery</PolicyLink>
                <PolicyLink href="/return-and-replacement-policy">Return & Replacement</PolicyLink>
                <PolicyLink href="/payment-policy">Payment Policy</PolicyLink>
                <PolicyLink href="/data-protection-and-security-policy">Data Protection & Security</PolicyLink>
            </div>
         </div>

        <div className="border-t border-muted-foreground/10 mt-6 py-6 text-xs text-muted-foreground space-y-4">
            <p>
                <span className="font-bold">Disclaimer:</span> All information provided on this platform, including product descriptions, is for informational purposes only. It is not intended to be a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.
            </p>
            <p>&copy; {new Date().getFullYear()} Unique Medicare. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
