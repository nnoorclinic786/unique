
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building, Phone, Mail, FileText, Fingerprint } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 bg-gray-50/50">
        <section className="w-full py-16 md:py-24 lg:py-32">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-headline font-bold">About Unique Medicare</h1>
              <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
                Your trusted, licensed partner for wholesale pharmaceutical supplies, located in Farrukhabad, Uttar Pradesh.
              </p>
            </div>
            <Card className="max-w-4xl mx-auto shadow-lg">
              <CardHeader>
                <CardTitle className="font-headline text-2xl">Business Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 text-muted-foreground">
                <div className="flex items-start gap-4">
                  <Building className="w-6 h-6 text-primary mt-1" />
                  <div>
                    <h3 className="font-semibold text-foreground">Unique Medicare</h3>
                    <p>4/79, Moh. Diwan Mubarak, Mau Darwaza</p>
                    <p>Farrukhabad, Uttar Pradesh – 209625</p>
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-6">
                    <div className="flex items-center gap-4">
                        <Phone className="w-5 h-5 text-primary" />
                        <div>
                            <h3 className="font-semibold text-foreground">Contact Number</h3>
                            <p>8299400552</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <Mail className="w-5 h-5 text-primary" />
                        <div>
                            <h3 className="font-semibold text-foreground">Email</h3>
                            <p>uniquemedicare786@gmail.com</p>
                        </div>
                    </div>
                </div>
                 <div>
                  <h3 className="text-xl font-headline font-bold text-foreground border-t pt-6 mt-6 mb-4">Licenses & Registration</h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                        <FileText className="w-5 h-5 text-primary" />
                        <div>
                            <h4 className="font-semibold text-foreground">Drug License Numbers</h4>
                            <p className="font-mono text-sm">UP7620B000799</p>
                            <p className="font-mono text-sm">UP7620B000796</p>
                        </div>
                    </div>
                     <div className="flex items-center gap-4">
                        <Fingerprint className="w-5 h-5 text-primary" />
                        <div>
                            <h4 className="font-semibold text-foreground">GSTIN</h4>
                            <p className="font-mono text-sm">09AZZPM9217H1ZI</p>
                        </div>
                    </div>
                  </div>
                </div>
                <div className="pt-6 border-t">
                    <p className="text-sm">
                        Unique Medicare provides wholesale distribution of medicines to retail chemists, hospitals, clinics, and doctors, ensuring quality service and reliable supply in compliance with all government regulations.
                    </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
