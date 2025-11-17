
import ClientLayout from '../client-layout';
import { Footer } from '@/components/footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function DataProtectionAndSecurityPolicyPage() {
  return (
    <ClientLayout>
      <div className="flex flex-col min-h-screen">
        <main className="flex-1 bg-gray-50/50">
          <section className="w-full py-16 md:py-24">
            <div className="container mx-auto px-4 md:px-6">
              <Card className="max-w-4xl mx-auto shadow-lg">
                <CardHeader className="text-center">
                  <CardTitle className="font-headline text-3xl md:text-4xl">Data Protection &amp; Security Policy</CardTitle>
                  <CardDescription>Unique Medicare – Wholesale Chemist</CardDescription>
                  <p className="text-sm text-muted-foreground pt-2">Effective From: Launch date of the Unique Medicare mobile application and/or website.</p>
                </CardHeader>
                <CardContent className="space-y-8 text-muted-foreground prose prose-sm max-w-none">
                  
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Applicable To:</h3>
                    <p>All buyers, users, chemists, hospitals, clinics, and any entity using the platform.</p>
                  </div>

                  <div>
                    <h2 className="text-xl font-headline font-bold text-foreground mb-2">1. Purpose of the Policy</h2>
                    <p>This Data Protection &amp; Security Policy governs how Unique Medicare may collect, store, use, process, or secure buyer data. By using the app or website, the buyer agrees that Unique Medicare has full control and authority over all data collected through its platform.</p>
                    <p>Unique Medicare is not obligated to provide explanations, disclosures, or rights beyond what it chooses to allow.</p>
                  </div>

                  <div>
                    <h2 className="text-xl font-headline font-bold text-foreground mb-2">2. Data Collection Rights</h2>
                    <p>Unique Medicare may collect any data that is necessary or useful for business operations, including but not limited to:</p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Name, address, business details</li>
                      <li>Drug license number, GST, and registration information</li>
                      <li>Contact numbers and email addresses</li>
                      <li>Order history and purchase patterns</li>
                      <li>Device information, location data, and IP address</li>
                      <li>Payment-related details (without storing sensitive card/UPI credentials)</li>
                      <li>Any documents uploaded by the buyer</li>
                    </ul>
                    <p>All data may be collected with or without explicit consent, as permitted by applicable practices.</p>
                  </div>

                  <div>
                    <h2 className="text-xl font-headline font-bold text-foreground mb-2">3. Use of Data</h2>
                    <p>Unique Medicare may use collected data for any lawful business purpose, including but not limited to:</p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Order processing</li>
                      <li>Account verification</li>
                      <li>Regulatory compliance</li>
                      <li>Improving app/website performance</li>
                      <li>Fraud detection</li>
                      <li>Marketing, promotions, and offers</li>
                      <li>Business analytics</li>
                    </ul>
                    <p>Unique Medicare has no obligation to notify buyers on how their data is used.</p>
                  </div>

                  <div>
                    <h2 className="text-xl font-headline font-bold text-foreground mb-2">4. Data Storage &amp; Security</h2>
                    <p>Unique Medicare will take reasonable technical measures to secure data.</p>
                    <p>However, Unique Medicare is not liable for:</p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Data breaches</li>
                      <li>Unauthorized access</li>
                      <li>Hacking incidents</li>
                      <li>Technical failures</li>
                      <li>Server issues</li>
                      <li>Third-party breaches</li>
                    </ul>
                    <p>Buyers agree that they cannot claim compensation, refund, or damages in such events.</p>
                  </div>

                  <div>
                    <h2 className="text-xl font-headline font-bold text-foreground mb-2">5. Sharing of Data</h2>
                    <p>Unique Medicare may share buyer information with:</p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Logistics partners</li>
                      <li>Payment gateway providers</li>
                      <li>Regulatory authorities</li>
                      <li>Business associates or service partners</li>
                      <li>Law enforcement when required</li>
                      <li>Internal teams</li>
                    </ul>
                    <p>Sharing may happen without prior notification to the buyer. Unique Medicare is not accountable for how third parties handle the data once shared.</p>
                  </div>

                  <div>
                    <h2 className="text-xl font-headline font-bold text-foreground mb-2">6. Buyer Responsibilities</h2>
                    <p>Buyers are responsible for:</p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Keeping login credentials confidential</li>
                      <li>Maintaining secure access to their devices</li>
                      <li>Ensuring accuracy of the information they provide</li>
                    </ul>
                    <p>Unique Medicare will not be responsible for unauthorized access caused by buyer negligence.</p>
                  </div>

                  <div>
                    <h2 className="text-xl font-headline font-bold text-foreground mb-2">7. No Buyer Rights or Claims</h2>
                    <p>Buyers cannot claim:</p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Data access rights</li>
                      <li>Data correction rights</li>
                      <li>Data deletion rights</li>
                      <li>Data portability</li>
                      <li>Data usage details</li>
                      <li>Restriction of processing</li>
                    </ul>
                    <p>Unique Medicare is not obligated to comply with any such requests.</p>
                  </div>

                  <div>
                    <h2 className="text-xl font-headline font-bold text-foreground mb-2">8. Data Retention</h2>
                    <p>Unique Medicare may retain buyer data for as long as required for:</p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Business operations</li>
                      <li>Legal compliance</li>
                      <li>Records and analytics</li>
                    </ul>
                    <p>Even if the buyer deletes their account, Unique Medicare may still retain their data.</p>
                  </div>
                  
                  <div>
                    <h2 className="text-xl font-headline font-bold text-foreground mb-2">9. Third-Party Services &amp; Links</h2>
                    <p>Unique Medicare is not responsible for:</p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Data collected by third-party websites</li>
                      <li>Payment gateway data handling</li>
                      <li>External links accessed through the app/website</li>
                    </ul>
                    <p>Buyers interact with third parties at their own risk.</p>
                  </div>

                  <div>
                    <h2 className="text-xl font-headline font-bold text-foreground mb-2">10. Amendments to Policy</h2>
                    <p>Unique Medicare reserves the absolute right to modify, update, suspend, or terminate this policy at any time without the buyer’s consent or prior notice.</p>
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
