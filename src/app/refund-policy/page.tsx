
import ClientLayout from '../client-layout';
import { Footer } from '@/components/footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function RefundPolicyPage() {
  return (
    <ClientLayout>
      <div className="flex flex-col min-h-screen">
        <main className="flex-1 bg-gray-50/50">
          <section className="w-full py-16 md:py-24">
            <div className="container mx-auto px-4 md:px-6">
              <Card className="max-w-4xl mx-auto shadow-lg">
                <CardHeader className="text-center">
                  <CardTitle className="font-headline text-3xl md:text-4xl">Refund &amp; Cancellation Policy</CardTitle>
                  <CardDescription>(Fully Protecting Unique Medicare – Wholesale Chemist)</CardDescription>
                  <p className="text-sm text-muted-foreground pt-2">Effective From: The date of launch of the Unique Medicare mobile application and/or website.</p>
                </CardHeader>
                <CardContent className="space-y-8 text-muted-foreground prose prose-sm max-w-none">
                  
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Applicable To:</h3>
                    <p>All buyers, users, retail chemists, doctors, hospitals, clinics, or any entity using the Unique Medicare platform.</p>
                  </div>

                  <div>
                    <h2 className="text-xl font-headline font-bold text-foreground mb-2">1. General Policy</h2>
                    <p>
                      Unique Medicare operates strictly as a wholesale chemist. All sales made through the mobile application or website are considered final, non-returnable, and non-refundable, except at the sole discretion of Unique Medicare.
                    </p>
                    <p>
                      By placing an order, the buyer agrees that Unique Medicare holds complete authority over acceptance, rejection, modification, or cancellation of any order.
                    </p>
                  </div>

                  <div>
                    <h2 className="text-xl font-headline font-bold text-foreground mb-2">2. No Refund Policy</h2>
                    <p>Once an order is placed, no refund will be provided under any circumstances.</p>
                    <p>Refunds will not be issued for:</p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Wrong product ordered by buyer</li>
                      <li>Change of mind</li>
                      <li>Quantity mismatch by buyer</li>
                      <li>Delayed delivery due to logistics, courier, transport, or force majeure</li>
                      <li>Any technical error from buyer’s side</li>
                    </ul>
                    <p>
                      A refund may be considered only if Unique Medicare decides so voluntarily. The buyer has no right to demand a refund.
                    </p>
                  </div>

                  <div>
                    <h2 className="text-xl font-headline font-bold text-foreground mb-2">3. Cancellation Policy</h2>
                    <p>Buyers cannot cancel an order once it is placed through the app/website.</p>
                    <p>Unique Medicare reserves the sole right to:</p>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>Cancel any order</li>
                        <li>Partially fulfill an order</li>
                        <li>Reject an order</li>
                        <li>Limit quantities</li>
                    </ul>
                    <p>If Unique Medicare cancels an order after payment is received, then only Unique Medicare may decide whether a refund will be issued.</p>
                  </div>

                  <div>
                    <h2 className="text-xl font-headline font-bold text-foreground mb-2">4. Return Policy</h2>
                    <p>No return of medicines, products, or goods is accepted after delivery.</p>
                    <p>Returns are not allowed due to:</p>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>Buyer’s mistake</li>
                        <li>Wrong order</li>
                        <li>Unsold stock</li>
                        <li>Expiry concerns</li>
                    </ul>
                     <p>Returns will be accepted only if Unique Medicare voluntarily chooses to accept under special cases.</p>
                  </div>
                  
                  <div>
                    <h2 className="text-xl font-headline font-bold text-foreground mb-2">5. Damaged, Leakage, or Missing Items</h2>
                    <p>Buyers must check the shipment at the time of delivery.</p>
                    <p>Claims for damaged or missing products will not be entertained after delivery is completed.</p>
                    <p>Unique Medicare has full discretion to accept or reject any complaint.</p>
                    <p>Decision taken by Unique Medicare will be final and binding.</p>
                  </div>

                  <div>
                    <h2 className="text-xl font-headline font-bold text-foreground mb-2">6. Order Verification & Compliance</h2>
                    <p>Unique Medicare may cancel or hold orders for verification of:</p>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>Drug license validity</li>
                        <li>GST details</li>
                        <li>Identity of buyer</li>
                        <li>Quantity limitations as per law</li>
                    </ul>
                    <p>Any delay caused due to verification will not make Unique Medicare liable in any way.</p>
                  </div>

                   <div>
                    <h2 className="text-xl font-headline font-bold text-foreground mb-2">7. No Liability Clause</h2>
                    <p>Unique Medicare is not responsible for:</p>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>Buyer’s technical issues</li>
                        <li>Network failure</li>
                        <li>Delay by courier or transporter</li>
                        <li>Wrong delivery address provided by buyer</li>
                        <li>Regulatory restrictions</li>
                        <li>Unavailability of stock</li>
                    </ul>
                    <p>Buyers agree that they cannot claim compensation, refund, or damages in any form.</p>
                  </div>

                  <div>
                    <h2 className="text-xl font-headline font-bold text-foreground mb-2">8. Policy Changes</h2>
                    <p>
                      Unique Medicare reserves the absolute right to modify, update, or terminate this policy at any time without prior notice to buyers.
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
