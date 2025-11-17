
import ClientLayout from '../client-layout';
import { Footer } from '@/components/footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function ReturnAndReplacementPolicyPage() {
  return (
    <ClientLayout>
      <div className="flex flex-col min-h-screen">
        <main className="flex-1 bg-gray-50/50">
          <section className="w-full py-16 md:py-24">
            <div className="container mx-auto px-4 md:px-6">
              <Card className="max-w-4xl mx-auto shadow-lg">
                <CardHeader className="text-center">
                  <CardTitle className="font-headline text-3xl md:text-4xl">Return &amp; Replacement Policy</CardTitle>
                  <CardDescription>Unique Medicare – Wholesale Chemist</CardDescription>
                  <p className="text-sm text-muted-foreground pt-2">Effective From: Launch date of the Unique Medicare mobile application and/or website.</p>
                </CardHeader>
                <CardContent className="space-y-8 text-muted-foreground prose prose-sm max-w-none">
                  
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Applicable To:</h3>
                    <p>All buyers including retail chemists, hospitals, clinics, and medical professionals.</p>
                  </div>

                  <div>
                    <h2 className="text-xl font-headline font-bold text-foreground mb-2">1. General Policy – No Return, No Replacement</h2>
                    <p>All products sold by Unique Medicare are strictly non-returnable and non-replaceable. By purchasing through the app or website, the buyer agrees that:</p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>No item can be returned, under any circumstances.</li>
                      <li>No replacement will be provided for any product.</li>
                      <li>All sales are final and completed once Unique Medicare dispatches the order.</li>
                      <li>The buyer has no right to claim, demand, or request return or replacement.</li>
                    </ul>
                  </div>

                  <div>
                    <h2 className="text-xl font-headline font-bold text-foreground mb-2">2. Buyer Responsibility</h2>
                    <p>It is the buyer’s responsibility to:</p>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>Check product details carefully before ordering.</li>
                        <li>Ensure correct medicine, strength, brand, and quantity.</li>
                        <li>Provide accurate drug license and business details.</li>
                    </ul>
                    <p>Unique Medicare is not responsible for buyer’s mistakes or misunderstandings.</p>
                  </div>

                  <div>
                    <h2 className="text-xl font-headline font-bold text-foreground mb-2">3. Conditions Where Return or Replacement is Not Allowed</h2>
                    <p>Unique Medicare will not accept returns or replacements due to:</p>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>Wrong product ordered by buyer</li>
                        <li>Wrong quantity ordered</li>
                        <li>Unused or unsold stock</li>
                        <li>Change of mind</li>
                        <li>Misinterpretation of product description</li>
                        <li>Expiry concerns after delivery</li>
                        <li>Any technical issue on buyer’s device</li>
                        <li>Delay in delivery</li>
                        <li>Damaged packaging after delivery</li>
                        <li>Products opened, used, or altered by buyer</li>
                    </ul>
                    <p>Unique Medicare holds zero liability in any of the above cases.</p>
                  </div>
                  
                  <div>
                    <h2 className="text-xl font-headline font-bold text-foreground mb-2">4. Damaged, Leaked, or Missing Items</h2>
                    <p>Buyer must check the package at the time of delivery.</p>
                    <p>Claims for damage, leakage, shortage, or missing items will not be accepted after delivery is completed.</p>
                    <p>Unique Medicare has full authority to accept or reject any complaint without explanation.</p>
                    <p>Even if the buyer submits a complaint, Unique Medicare is not obligated to replace or accept returns.</p>
                  </div>

                  <div>
                    <h2 className="text-xl font-headline font-bold text-foreground mb-2">5. Product Quality & Authenticity</h2>
                    <p>All products are sourced as per standard wholesale practices.</p>
                    <p>Unique Medicare does not provide any guarantee, warranty, or condition regarding product quality or performance.</p>
                    <p>Once products are delivered, Unique Medicare has no responsibility toward product storage, handling, or deterioration.</p>
                  </div>

                   <div>
                    <h2 className="text-xl font-headline font-bold text-foreground mb-2">6. Return Shipment</h2>
                    <p>Under no situation will Unique Medicare arrange or accept return shipments. If the buyer sends any product back without approval:</p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>The shipment will be rejected, and</li>
                      <li>Unique Medicare will not be liable to return the product or refund the amount.</li>
                    </ul>
                  </div>

                  <div>
                    <h2 className="text-xl font-headline font-bold text-foreground mb-2">7. Exceptional Cases (Optional & Voluntary Only)</h2>
                    <p>Unique Medicare may, at its sole and absolute discretion, choose to accept a return or provide a replacement, but:</p>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>This is not a right of the buyer.</li>
                        <li>It is not mandatory for Unique Medicare.</li>
                        <li>Unique Medicare may apply additional charges, deductions, or conditions.</li>
                        <li>The buyer must comply without objection.</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h2 className="text-xl font-headline font-bold text-foreground mb-2">8. Final Authority</h2>
                    <p>
                      The decision of Unique Medicare regarding returns and replacements is final, binding, and non-contestable.
                    </p>
                  </div>

                  <div>
                    <h2 className="text-xl font-headline font-bold text-foreground mb-2">9. Policy Changes</h2>
                    <p>Unique Medicare reserves the right to modify or terminate this policy at any time without prior notice.</p>
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
