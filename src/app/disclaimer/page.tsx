
import ClientLayout from '../client-layout';
import { Footer } from '@/components/footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function DisclaimerPage() {
  return (
    <ClientLayout>
      <div className="flex flex-col min-h-screen">
        <main className="flex-1 bg-gray-50/50">
          <section className="w-full py-16 md:py-24">
            <div className="container mx-auto px-4 md:px-6">
              <Card className="max-w-4xl mx-auto shadow-lg">
                <CardHeader className="text-center">
                  <CardTitle className="font-headline text-3xl md:text-4xl">Disclaimer</CardTitle>
                  <CardDescription>Unique Medicare – Wholesale Chemist</CardDescription>
                  <p className="text-sm text-muted-foreground pt-2">Effective From: Launch date of the Unique Medicare mobile application and/or website.</p>
                </CardHeader>
                <CardContent className="space-y-8 text-muted-foreground prose prose-sm max-w-none">
                  
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Applicable To:</h3>
                    <p>All buyers, retail chemists, hospitals, clinics, medical professionals, and users of the platform.</p>
                  </div>

                  <div>
                    <h2 className="text-xl font-headline font-bold text-foreground mb-2">1. General Disclaimer</h2>
                    <p>Unique Medicare provides its app and website “as is” and “as available”, without guaranteeing accuracy, completeness, reliability, suitability, or availability of any product, information, or service.</p>
                    <p>By using the platform, buyers agree that Unique Medicare holds no responsibility or liability for any consequences arising from usage of the platform.</p>
                  </div>
                  
                  <div>
                    <h2 className="text-xl font-headline font-bold text-foreground mb-2">2. No Medical Advice</h2>
                    <p>Unique Medicare is a wholesale chemist, not a medical advisory service.</p>
                    <p>Any information shown regarding medicines, dosage, usage, or side effects is general information only and may not be accurate.</p>
                    <p>Buyers must consult qualified medical professionals before using any medicine.</p>
                    <p>Unique Medicare is not liable for medical decisions or outcomes.</p>
                  </div>

                  <div>
                    <h2 className="text-xl font-headline font-bold text-foreground mb-2">3. Product Information Disclaimer</h2>
                    <p>Product descriptions, images, expiry dates, batch numbers, and availability displayed on the platform may vary from actual stock.</p>
                    <p>Unique Medicare does not guarantee accuracy of product details.</p>
                    <p>Buyers are responsible for verifying product information before purchase.</p>
                    <p>Unique Medicare is not accountable for any mismatch, misunderstanding, or incorrect interpretation.</p>
                  </div>

                  <div>
                    <h2 className="text-xl font-headline font-bold text-foreground mb-2">4. No Warranty</h2>
                    <p>Unique Medicare does not provide any warranty, guarantee, or representation, expressed or implied, regarding:</p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Product quality or performance</li>
                      <li>Availability or stock accuracy</li>
                      <li>Delivery timelines</li>
                      <li>Service continuity</li>
                      <li>App/website performance</li>
                      <li>Error-free operations</li>
                    </ul>
                    <p>All risks associated with using the platform lie entirely with the buyer.</p>
                  </div>

                  <div>
                    <h2 className="text-xl font-headline font-bold text-foreground mb-2">5. Limitation of Liability</h2>
                    <p>Unique Medicare shall not be liable for any loss, damage, expenses, or consequences arising from:</p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Use or misuse of products</li>
                      <li>Incorrect orders placed by the buyer</li>
                      <li>Delayed, failed, or partial delivery</li>
                      <li>Technical issues</li>
                      <li>App/website errors</li>
                      <li>Server downtime</li>
                      <li>Third-party logistics faults</li>
                      <li>Payment gateway issues</li>
                      <li>Typographical or system errors</li>
                      <li>Force majeure circumstances</li>
                    </ul>
                    <p>Buyer agrees that Unique Medicare’s decision is final and non-contestable.</p>
                  </div>

                  <div>
                    <h2 className="text-xl font-headline font-bold text-foreground mb-2">6. Third-Party Links &amp; Services</h2>
                    <p>The platform may contain links to third-party websites, services, or payment gateways.</p>
                    <p>Unique Medicare does not control or endorse any third-party content.</p>
                    <p>Buyers use such resources at their own risk.</p>
                    <p>Unique Medicare is not responsible for any loss or damage caused by third parties.</p>
                  </div>

                  <div>
                    <h2 className="text-xl font-headline font-bold text-foreground mb-2">7. Legal Compliance</h2>
                    <p>Unique Medicare follows standard regulatory guidelines for wholesalers. However:</p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Unique Medicare does not guarantee that buyer’s use of products complies with applicable laws.</li>
                      <li>It is the buyer’s responsibility to ensure valid drug licenses, GST compliance, business eligibility, and lawful use.</li>
                      <li>Unique Medicare holds no liability for violations committed by buyers.</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h2 className="text-xl font-headline font-bold text-foreground mb-2">8. App/Website Availability</h2>
                    <p>Unique Medicare reserves the right to:</p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Suspend</li>
                      <li>Modify</li>
                      <li>Limit</li>
                      <li>Interrupt</li>
                      <li>Terminate</li>
                    </ul>
                    <p>any part of the app or website at any time, without notice. Unique Medicare is not liable for downtime or service disruption.</p>
                  </div>

                  <div>
                    <h2 className="text-xl font-headline font-bold text-foreground mb-2">9. Indemnity</h2>
                    <p>Buyers agree to indemnify and protect Unique Medicare against all claims, damages, costs, legal actions, or liabilities arising due to:</p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Misuse of products</li>
                      <li>Violation of policies</li>
                      <li>Breach of terms</li>
                      <li>Misrepresentation</li>
                      <li>Non-compliance with laws</li>
                    </ul>
                    <p>This indemnity is unconditional and binding on all buyers.</p>
                  </div>

                  <div>
                    <h2 className="text-xl font-headline font-bold text-foreground mb-2">10. Policy Modification Rights</h2>
                    <p>Unique Medicare may update, change, or replace this Disclaimer at any time without informing the buyer. Continued use of the platform signifies acceptance of all changes.</p>
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
