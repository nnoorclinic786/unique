
import ClientLayout from '../client-layout';
import { Footer } from '@/components/footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function PaymentPolicyPage() {
  return (
    <ClientLayout>
      <div className="flex flex-col min-h-screen">
        <main className="flex-1 bg-gray-50/50">
          <section className="w-full py-16 md:py-24">
            <div className="container mx-auto px-4 md:px-6">
              <Card className="max-w-4xl mx-auto shadow-lg">
                <CardHeader className="text-center">
                  <CardTitle className="font-headline text-3xl md:text-4xl">Payment Policy</CardTitle>
                  <CardDescription>Unique Medicare – Wholesale Chemist</CardDescription>
                  <p className="text-sm text-muted-foreground pt-2">Effective From: Launch date of the Unique Medicare mobile application and/or website.</p>
                </CardHeader>
                <CardContent className="space-y-8 text-muted-foreground prose prose-sm max-w-none">
                  
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Applicable To:</h3>
                    <p>All buyers including retail chemists, hospitals, clinics, doctors, and other registered users.</p>
                  </div>

                  <div>
                    <h2 className="text-xl font-headline font-bold text-foreground mb-2">1. Payment Terms</h2>
                    <p>All payments for orders placed through the Unique Medicare platform must be made in full and in advance, unless otherwise allowed by Unique Medicare.</p>
                    <p>Unique Medicare reserves the right to reject or cancel any order if payment is incomplete, delayed, or fails due to buyer’s error.</p>
                    <p>Buyer has no right to claim or demand processing of an order until payment is successfully received by Unique Medicare.</p>
                  </div>

                  <div>
                    <h2 className="text-xl font-headline font-bold text-foreground mb-2">2. Accepted Payment Methods</h2>
                    <p>Unique Medicare may accept payments through:</p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Online payment methods (UPI, net banking, wallets, etc.)</li>
                      <li>Bank transfer</li>
                      <li>Any other mode approved solely by Unique Medicare</li>
                    </ul>
                    <p>Unique Medicare may add or remove payment methods at any time without notice.</p>
                  </div>
                  
                  <div>
                    <h2 className="text-xl font-headline font-bold text-foreground mb-2">3. No Payment-Related Refunds</h2>
                    <p>Payments once made are non-refundable under all circumstances, including but not limited to:</p>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>Buyer placing the wrong order</li>
                        <li>Change of mind</li>
                        <li>Quantity error</li>
                        <li>Duplicate order</li>
                        <li>Delayed delivery</li>
                        <li>Technical issues on buyer’s device</li>
                        <li>Order cancellation initiated by the buyer</li>
                    </ul>
                    <p>Even if Unique Medicare cancels an order, a refund will be issued only if Unique Medicare voluntarily decides to do so.</p>
                  </div>

                  <div>
                    <h2 className="text-xl font-headline font-bold text-foreground mb-2">4. Payment Verification</h2>
                    <p>Unique Medicare may hold or delay orders for verification of:</p>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>Buyer’s identity</li>
                        <li>Drug license</li>
                        <li>GST details</li>
                        <li>Payment authenticity</li>
                        <li>Suspicious transactions</li>
                    </ul>
                    <p>Any delay due to verification does not make Unique Medicare liable to compensate the buyer.</p>
                  </div>

                  <div>
                    <h2 className="text-xl font-headline font-bold text-foreground mb-2">5. Failure or Delay in Payment</h2>
                    <p>If payment is:</p>
                     <ul className="list-disc pl-5 space-y-1">
                        <li>Failed</li>
                        <li>Pending</li>
                        <li>Delayed</li>
                        <li>Held by bank/payment gateway</li>
                    </ul>
                    <p>Unique Medicare is not responsible for any loss, delay, or inconvenience caused to the buyer.</p>
                    <p>Order processing will not begin until payment is fully confirmed in Unique Medicare’s account.</p>
                  </div>

                  <div>
                    <h2 className="text-xl font-headline font-bold text-foreground mb-2">6. Extra Charges</h2>
                    <p>Unique Medicare reserves the right to apply:</p>
                     <ul className="list-disc pl-5 space-y-1">
                        <li>Convenience fees</li>
                        <li>Online transaction fees</li>
                        <li>Shipping charges</li>
                        <li>Handling charges</li>
                        <li>Special packing charges</li>
                    </ul>
                    <p>Buyer must pay all applicable charges without objection.</p>
                  </div>

                   <div>
                    <h2 className="text-xl font-headline font-bold text-foreground mb-2">7. Chargebacks &amp; Disputes</h2>
                    <p>Buyers are strictly prohibited from raising chargebacks or payment disputes against Unique Medicare.</p>
                    <p>If a buyer files a chargeback, Unique Medicare may:</p>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>Suspend or terminate the buyer’s account</li>
                        <li>Cancel all pending orders</li>
                        <li>Take legal or financial action as permitted</li>
                    </ul>
                    <p>Decision of Unique Medicare is final and non-negotiable.</p>
                  </div>

                  <div>
                    <h2 className="text-xl font-headline font-bold text-foreground mb-2">8. Credit Facility (If Provided)</h2>
                    <p>If Unique Medicare provides credit to select buyers:</p>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>It is purely optional and discretionary.</li>
                        <li>Terms may be changed, suspended, or withdrawn without notice.</li>
                        <li>Buyer must clear dues on time; delays may result in:
                          <ul className="list-disc pl-8">
                            <li>Interest/penalty charges</li>
                            <li>Order suspension</li>
                            <li>Account deactivation</li>
                            <li>Legal action</li>
                          </ul>
                        </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h2 className="text-xl font-headline font-bold text-foreground mb-2">9. No Responsibility for Bank or Gateway Errors</h2>
                     <p>Unique Medicare is not liable for:</p>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>Bank server issues</li>
                        <li>Payment gateway errors</li>
                        <li>Double deductions</li>
                        <li>Delay in bank settlement</li>
                        <li>Technical glitches during payment</li>
                    </ul>
                    <p>The buyer must coordinate directly with the bank/payment gateway.</p>
                  </div>

                  <div>
                    <h2 className="text-xl font-headline font-bold text-foreground mb-2">10. Policy Modification Rights</h2>
                    <p>Unique Medicare reserves the absolute right to modify, update, or terminate this Payment Policy at any time without prior notice.</p>
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
