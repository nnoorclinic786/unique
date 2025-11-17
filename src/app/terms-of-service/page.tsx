
import ClientLayout from '../client-layout';
import { Footer } from '@/components/footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function TermsOfServicePage() {
  return (
    <ClientLayout>
      <div className="flex flex-col min-h-screen">
        <main className="flex-1 bg-gray-50/50">
          <section className="w-full py-16 md:py-24">
            <div className="container mx-auto px-4 md:px-6">
              <Card className="max-w-4xl mx-auto shadow-lg">
                <CardHeader className="text-center">
                  <CardTitle className="font-headline text-3xl md:text-4xl">Terms of Service (TOS) – Unique Medicare</CardTitle>
                  <CardDescription>Effective Date: The date Unique Medicare app/website is launched</CardDescription>
                </CardHeader>
                <CardContent className="space-y-8 text-muted-foreground prose prose-sm max-w-none">
                  
                  <div>
                    <h2 className="text-xl font-headline font-bold text-foreground mb-2">1. Acceptance of Terms</h2>
                    <p>
                      By accessing or using the Unique Medicare app or services, you agree that all terms, rules, and decisions are solely governed by Unique Medicare. Continued use of the app confirms your unconditional acceptance of these Terms.
                    </p>
                  </div>

                  <div>
                    <h2 className="text-xl font-headline font-bold text-foreground mb-2">2. Company Rights</h2>
                    <p>Unique Medicare reserves full rights to:</p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Modify, update, or remove any feature, service, product, or price at any time without notice.</li>
                      <li>Approve, reject, or suspend any buyer account without giving a reason.</li>
                      <li>Cancel or modify orders at its sole discretion.</li>
                      <li>Make changes in delivery terms, availability, or product listing at any time.</li>
                    </ul>
                  </div>

                  <div>
                    <h2 className="text-xl font-headline font-bold text-foreground mb-2">3. No Buyer Rights or Guarantees</h2>
                    <p>Buyers do not receive any guaranteed rights under these terms.</p>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>Unique Medicare is not obligated to accept orders, provide services, or maintain account access.</li>
                        <li>Any offer, discount, or feature is provided voluntarily and may be withdrawn anytime.</li>
                    </ul>
                  </div>

                  <div>
                    <h2 className="text-xl font-headline font-bold text-foreground mb-2">4. Order Acceptance</h2>
                    <p>Placing an order does not guarantee approval. Unique Medicare may:</p>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>Accept or decline any order</li>
                        <li>Modify order quantity</li>
                        <li>Cancel any order without explanation</li>
                    </ul>
                  </div>

                  <div>
                    <h2 className="text-xl font-headline font-bold text-foreground mb-2">5. Limitation of Liability</h2>
                    <p>Unique Medicare is not responsible for:</p>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>Delay in delivery</li>
                        <li>Product unavailability</li>
                        <li>Technical errors</li>
                        <li>App downtime</li>
                        <li>Incorrect information uploaded by buyers</li>
                        <li>Any direct, indirect, or incidental damages</li>
                    </ul>
                  </div>

                  <div>
                    <h2 className="text-xl font-headline font-bold text-foreground mb-2">6. User Responsibility</h2>
                    <p>Buyers must ensure:</p>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>All information they provide is accurate</li>
                        <li>They do not misuse the app</li>
                        <li>They follow all instructions and policies of Unique Medicare</li>
                    </ul>
                  </div>

                  <div>
                    <h2 className="text-xl font-headline font-bold text-foreground mb-2">7. No Warranty</h2>
                    <p>
                      Unique Medicare provides all services as-is and without any warranty, whether expressed or implied.
                    </p>
                  </div>

                  <div>
                    <h2 className="text-xl font-headline font-bold text-foreground mb-2">8. Termination</h2>
                    <p>
                      Unique Medicare may suspend or terminate any buyer account at any time, without notice or explanation.
                    </p>
                  </div>
                  
                  <div>
                    <h2 className="text-xl font-headline font-bold text-foreground mb-2">9. Governing Law</h2>
                    <p>
                      All terms are governed by the laws under which Unique Medicare operates.
                    </p>
                  </div>

                </CardContent>
              </Card>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </ClientLayout>
  );
}
