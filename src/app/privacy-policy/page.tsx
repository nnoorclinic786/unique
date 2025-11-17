
import ClientLayout from '../client-layout';
import { Footer } from '@/components/footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function PrivacyPolicyPage() {
  return (
    <ClientLayout>
      <div className="flex flex-col min-h-screen">
        <main className="flex-1 bg-gray-50/50">
          <section className="w-full py-16 md:py-24">
            <div className="container mx-auto px-4 md:px-6">
              <Card className="max-w-4xl mx-auto shadow-lg">
                <CardHeader className="text-center">
                  <CardTitle className="font-headline text-3xl md:text-4xl">Privacy Policy – Unique Medicare</CardTitle>
                  <CardDescription>(Wholesale Chemist)</CardDescription>
                  <p className="text-sm text-muted-foreground pt-2">Effective From: The date Unique Medicare app/website is launched</p>
                </CardHeader>
                <CardContent className="space-y-8 text-muted-foreground prose prose-sm max-w-none">
                  <div>
                    <h2 className="text-xl font-headline font-bold text-foreground mb-2">1. Introduction</h2>
                    <p>
                      This Privacy Policy explains how Unique Medicare collects, stores, uses, or processes information.
                      By using the app or website, users agree that Unique Medicare holds complete authority over all data and may use it as required for business, regulatory, or operational purposes.
                    </p>
                    <p>
                      Unique Medicare is not obligated to notify or take consent from buyers for any data-related decisions.
                    </p>
                  </div>

                  <div>
                    <h2 className="text-xl font-headline font-bold text-foreground mb-2">2. Information We Collect</h2>
                    <p>
                      Unique Medicare may collect any information provided by users, including but not limited to:
                    </p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Full name</li>
                      <li>Mobile number</li>
                      <li>Email address</li>
                      <li>Business/shop details</li>
                      <li>Delivery addresses</li>
                      <li>Device information</li>
                      <li>App usage data</li>
                      <li>Order and transaction details</li>
                    </ul>
                    <p>
                      Unique Medicare may collect additional information anytime without informing the buyer.
                    </p>
                  </div>

                  <div>
                    <h2 className="text-xl font-headline font-bold text-foreground mb-2">3. How We Use Information</h2>
                    <p>
                      Unique Medicare may use the collected information for purposes including:
                    </p>
                     <ul className="list-disc pl-5 space-y-1">
                        <li>Account identification and verification</li>
                        <li>Order processing</li>
                        <li>Communication</li>
                        <li>Delivery operations</li>
                        <li>Internal analytics</li>
                        <li>System improvement</li>
                        <li>Legal and compliance requirements</li>
                    </ul>
                    <p>
                      Unique Medicare has full authority to use user information in any way necessary for business functioning.
                      Unique Medicare is not accountable to buyers for how data is used.
                    </p>
                  </div>

                  <div>
                    <h2 className="text-xl font-headline font-bold text-foreground mb-2">4. Sharing of Information</h2>
                    <p>
                      Unique Medicare may share user information with:
                    </p>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>Delivery partners</li>
                        <li>Suppliers</li>
                        <li>Service providers</li>
                        <li>Government authorities (if required)</li>
                        <li>Technical or database partners</li>
                    </ul>
                    <p>
                      This may occur without informing buyers, and Unique Medicare is not liable for how third parties handle such data.
                    </p>
                  </div>

                  <div>
                    <h2 className="text-xl font-headline font-bold text-foreground mb-2">5. No Guarantee of Data Protection</h2>
                     <p>While Unique Medicare attempts to maintain data security:</p>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>No system is fully secure.</li>
                        <li>Unique Medicare does not guarantee protection against data loss, hacking, unauthorized access, or technical failures.</li>
                        <li>Unique Medicare is not responsible for any buyer loss or damage due to data issues.</li>
                    </ul>
                  </div>

                  <div>
                    <h2 className="text-xl font-headline font-bold text-foreground mb-2">6. Buyer Responsibility</h2>
                    <p>Buyers are fully responsible for:</p>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>Accuracy of information provided</li>
                        <li>Protecting their login credentials</li>
                        <li>Using the app or website responsibly</li>
                    </ul>
                     <p>Unique Medicare assumes no responsibility for any errors made by buyers.</p>
                  </div>

                  <div>
                    <h2 className="text-xl font-headline font-bold text-foreground mb-2">7. No Buyer Rights or Claims</h2>
                    <p>This Privacy Policy does not give buyers:</p>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>Any legal rights</li>
                        <li>Any claim of privacy protection</li>
                        <li>Any right to demand data deletion, correction, or export</li>
                        <li>Any right to object to data usage</li>
                    </ul>
                    <p>All decisions regarding data are made solely by Unique Medicare.</p>
                  </div>

                  <div>
                    <h2 className="text-xl font-headline font-bold text-foreground mb-2">8. Policy Changes</h2>
                    <p>
                      Unique Medicare may change, edit, replace, or remove this Privacy Policy at any time without informing buyers.
                      Continued use of the app or website means the user automatically accepts the updated policy.
                    </p>
                  </div>
                  
                  <div>
                    <h2 className="text-xl font-headline font-bold text-foreground mb-2">9. Compliance</h2>
                    <p>
                      Where required by law, Unique Medicare may share or report user information.
                      Buyers cannot challenge or object to such actions.
                    </p>
                  </div>

                  <div>
                    <h2 className="text-xl font-headline font-bold text-foreground mb-2">10. Contact Information</h2>
                    <p>
                      For business-level queries (not buyer complaints), buyers may contact:
                    </p>
                     <ul className="list-none space-y-1">
                        <li>Unique Medicare – Wholesale Chemist</li>
                        <li>Phone number: 8299400552</li>
                    </ul>
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
