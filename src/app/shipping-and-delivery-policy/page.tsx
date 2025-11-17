
import ClientLayout from '../client-layout';
import { Footer } from '@/components/footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function ShippingAndDeliveryPolicyPage() {
  return (
    <ClientLayout>
      <div className="flex flex-col min-h-screen">
        <main className="flex-1 bg-gray-50/50">
          <section className="w-full py-16 md:py-24">
            <div className="container mx-auto px-4 md:px-6">
              <Card className="max-w-4xl mx-auto shadow-lg">
                <CardHeader className="text-center">
                  <CardTitle className="font-headline text-3xl md:text-4xl">Shipping &amp; Delivery Policy</CardTitle>
                  <CardDescription>(Fully Protecting Unique Medicare – Wholesale Chemist)</CardDescription>
                  <p className="text-sm text-muted-foreground pt-2">Effective From: Launch date of the Unique Medicare mobile application and/or website.</p>
                </CardHeader>
                <CardContent className="space-y-8 text-muted-foreground prose prose-sm max-w-none">
                  
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Applicable To:</h3>
                    <p>All buyers, retail chemists, hospitals, clinics, and medical professionals using the platform.</p>
                  </div>

                  <div>
                    <h2 className="text-xl font-headline font-bold text-foreground mb-2">1. General Shipping Terms</h2>
                    <p>Unique Medicare ships products only at its sole discretion.</p>
                    <p>Placing an order does not guarantee that the order will be shipped.</p>
                    <p>Unique Medicare may:</p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Ship partially</li>
                      <li>Delay shipment</li>
                      <li>Cancel shipping</li>
                      <li>Modify shipping terms</li>
                      <li>Hold shipment for verification</li>
                    </ul>
                    <p>without any obligation to inform or compensate the buyer.</p>
                  </div>

                  <div>
                    <h2 className="text-xl font-headline font-bold text-foreground mb-2">2. Shipping Timeline</h2>
                    <p>Delivery timelines displayed on the app/website are only estimates.</p>
                    <p>Unique Medicare does not guarantee delivery within any timeframe.</p>
                    <p>Any delay caused due to:</p>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>Courier partners</li>
                        <li>Transport issues</li>
                        <li>Weather conditions</li>
                        <li>Government restrictions</li>
                        <li>Stock unavailability</li>
                        <li>Verification processes</li>
                    </ul>
                    <p>will not make Unique Medicare liable for compensation, refund, or order cancellation.</p>
                  </div>

                  <div>
                    <h2 className="text-xl font-headline font-bold text-foreground mb-2">3. Shipping Charges</h2>
                    <p>Shipping charges may vary and are decided solely by Unique Medicare.</p>
                    <p>Charges are non-refundable under all circumstances.</p>
                    <p>Shipping charges may increase after order placement, and the buyer must comply without objection.</p>
                  </div>

                  <div>
                    <h2 className="text-xl font-headline font-bold text-foreground mb-2">4. Delivery Conditions</h2>
                    <p>Delivery will be made only at the address provided by the buyer, as per Unique Medicare’s acceptance.</p>
                    <p>The buyer must ensure:</p>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>Correct address</li>
                        <li>Valid drug license, if required</li>
                        <li>Availability at the delivery location</li>
                    </ul>
                    <p>Unique Medicare holds no responsibility for failed deliveries caused by buyer errors.</p>
                  </div>
                  
                  <div>
                    <h2 className="text-xl font-headline font-bold text-foreground mb-2">5. Buyer’s Responsibility at Delivery</h2>
                    <p>Buyer must inspect the package at the time of delivery.</p>
                    <p>After delivery is marked completed,:</p>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>Unique Medicare will not accept complaints regarding damage, leakage, expiry, shortage, or wrong items.</li>
                        <li>Unique Medicare is not liable for any claims or disputes.</li>
                    </ul>
                  </div>

                  <div>
                    <h2 className="text-xl font-headline font-bold text-foreground mb-2">6. No Liability for Third-Party Logistics</h2>
                    <p>If third-party courier or transporter is used, Unique Medicare is not responsible for:</p>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>Delayed delivery</li>
                        <li>Lost shipment</li>
                        <li>Wrong delivery</li>
                        <li>Damage during transit</li>
                        <li>Any negligence by logistics partners</li>
                    </ul>
                    <p>The buyer must follow up with the courier company directly if needed.</p>
                  </div>

                   <div>
                    <h2 className="text-xl font-headline font-bold text-foreground mb-2">7. Verification Before Shipping</h2>
                    <p>Unique Medicare may hold or delay shipments for verification of:</p>
                     <ul className="list-disc pl-5 space-y-1">
                        <li>Drug license</li>
                        <li>GST number</li>
                        <li>Business details</li>
                        <li>Identity proof</li>
                        <li>Quantity regulations</li>
                        <li>Stock availability</li>
                    </ul>
                    <p>Any delay due to verification will not obligate Unique Medicare to compensate or refund.</p>
                  </div>

                  <div>
                    <h2 className="text-xl font-headline font-bold text-foreground mb-2">8. Partial Delivery</h2>
                    <p>Unique Medicare may ship only part of the order depending on stock availability.</p>
                    <p>Buyer cannot demand cancellation or refund for unshipped items.</p>
                    <p>Unique Medicare may ship remaining items later or cancel them without liability.</p>
                  </div>
                  
                  <div>
                    <h2 className="text-xl font-headline font-bold text-foreground mb-2">9. Delivery Completion</h2>
                    <p>Delivery is considered successful when:</p>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>Courier marks it delivered, OR</li>
                        <li>Buyer/representative receives the package, OR</li>
                        <li>Package is handed over at the buyer’s location</li>
                    </ul>
                    <p>At this point, Unique Medicare holds no further responsibility.</p>
                  </div>

                  <div>
                    <h2 className="text-xl font-headline font-bold text-foreground mb-2">10. Policy Modification Rights</h2>
                    <p>Unique Medicare reserves the right to update, modify, change, suspend, or terminate this Shipping &amp; Delivery Policy anytime without prior notice to the buyer.</p>
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
