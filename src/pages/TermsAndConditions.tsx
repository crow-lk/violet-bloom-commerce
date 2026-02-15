import Layout from "@/components/layout/Layout";

export default function TermsAndConditions() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <h1 className="font-display text-3xl font-bold mb-8">Terms & Conditions</h1>
        <div className="prose prose-sm max-w-none space-y-6 text-muted-foreground">
          <p><strong>Last updated:</strong> February 15, 2026</p>

          <section>
            <h2 className="font-display text-xl font-semibold text-foreground">1. General</h2>
            <p>By accessing and using ChuttakPay, you agree to be bound by these terms and conditions. If you do not agree, please refrain from using our services.</p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-foreground">2. Orders & Payments</h2>
            <p>All orders are subject to availability. Prices are listed in LKR and may change without notice. Payment must be completed at the time of purchase via the available payment methods.</p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-foreground">3. Shipping & Delivery</h2>
            <p>We aim to deliver orders within the estimated timeframe. Delivery times may vary depending on location. ChuttakPay is not liable for delays caused by third-party logistics providers.</p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-foreground">4. Returns & Refunds</h2>
            <p>Items may be returned within 7 days of delivery if unused and in original packaging. Refunds will be processed within 5–10 business days after inspection.</p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-foreground">5. Intellectual Property</h2>
            <p>All content on this site, including logos, images, and text, is the property of ChuttakPay and may not be reproduced without permission.</p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-foreground">6. Limitation of Liability</h2>
            <p>ChuttakPay shall not be liable for any indirect or consequential damages arising from the use of our services or products.</p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-foreground">7. Contact</h2>
            <p>For questions about these terms, reach us at <a href="mailto:support@chuttakpay.lk" className="text-primary hover:underline">support@chuttakpay.lk</a>.</p>
          </section>
        </div>
      </div>
    </Layout>
  );
}
