
import ClientLayout from './client-layout';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowRight, Truck, UserPlus, Pill, Building, Stethoscope, Hospital } from 'lucide-react';
import { Footer } from '@/components/footer';

const features = [
  {
    icon: <Truck className="w-8 h-8 text-primary" />,
    title: 'Streamlined Ordering',
    description: 'Place bulk orders with ease and get fast, reliable delivery to your doorstep.',
  },
  {
    icon: <UserPlus className="w-8 h-8 text-primary" />,
    title: 'Easy Buyer Onboarding',
    description: 'Quickly register your chemist, clinic, or hospital with all necessary documentation.',
  },
  {
    icon: <Pill className="w-8 h-8 text-primary" />,
    title: 'Comprehensive Drug Catalog',
    description: 'Access a wide range of authentic medicines from licensed distributors.',
  },
];

const targetAudience = [
  {
    icon: <Building className="w-10 h-10 text-accent" />,
    name: 'Retail Chemists',
  },
  {
    icon: <Stethoscope className="w-10 h-10 text-accent" />,
    name: 'Doctors',
  },
  {
    icon: <Hospital className="w-10 h-10 text-accent" />,
    name: 'Hospitals & Clinics',
  },
];

export default function LandingPage() {
  return (
    <ClientLayout>
      <main className="flex-1">
        <section className="w-full py-20 md:py-32 lg:py-40 bg-card">
          <div className="container mx-auto px-4 md:px-6 text-center">
            <div className="max-w-3xl mx-auto">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-headline font-bold tracking-tight text-foreground">
                Unique Medicare: Your Partner in Pharmaceutical Supply
              </h1>
              <p className="mt-6 text-lg md:text-xl text-muted-foreground">
                The one-stop solution for retail chemists, doctors, and hospitals to procure medicines efficiently. Simplified ordering, transparent pricing, and reliable delivery.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="font-headline">
                  <Link href="/signup">
                    Get Started <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="font-headline">
                  <Link href="/login">Browse Medicines</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="w-full py-16 md:py-24">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-headline font-bold">Why Choose Unique Medicare?</h2>
              <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
                We are dedicated to providing a seamless procurement experience for healthcare professionals and businesses.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <Card key={index} className="flex flex-col items-center text-center p-6 shadow-md hover:shadow-xl transition-shadow">
                  <CardHeader>
                    <div className="p-4 bg-primary/10 rounded-full inline-block mb-4">
                      {feature.icon}
                    </div>
                    <CardTitle className="font-headline">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardDescription>{feature.description}</CardDescription>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section id="audience" className="w-full py-16 md:py-24 bg-card">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-headline font-bold">Serving the Healthcare Community</h2>
              <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
                Our platform is tailored to meet the specific needs of various healthcare providers.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              {targetAudience.map((member) => (
                <div key={member.name} className="flex flex-col items-center gap-4">
                  <div className="p-5 bg-accent/10 rounded-full">{member.icon}</div>
                  <h3 className="text-xl font-headline font-medium">{member.name}</h3>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </ClientLayout>
  );
}
