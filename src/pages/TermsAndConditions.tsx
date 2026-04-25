import Layout from "@/components/layout/Layout";

export default function TermsAndConditions() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <h1 className="font-display text-3xl font-bold mb-8">Terms & Conditions</h1>
        <div className="prose prose-sm max-w-none space-y-6 text-muted-foreground">
          <p><strong>Last updated:</strong> February 15, 2026</p>

          <section>
            <h2 className="font-display text-xl font-semibold text-foreground">Introduction</h2>
            <p>Welcome to Chuttak Pay. These Terms and Conditions govern your use of our website and the purchase and sale of products from our platform. By accessing and using our website, you agree to comply with these terms. Please read them carefully before proceeding with any transactions.</p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-foreground">Use of the Website</h2>
            <p>a. You must be at least 16 years old to use our website or make purchases.</p>
            <p>b. You are responsible for maintaining the confidentiality of your account information, including your username and password.</p>
            <p>c. You agree to provide accurate and current information during the registration and checkout process.</p>
            <p>d. You may not use our website for any unlawful or unauthorized purposes.</p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-foreground">Product Information and Pricing</h2>
            <p>a. We strive to provide accurate product descriptions, images, and pricing information. However, we do not guarantee the accuracy or completeness of such information.</p>
            <p>b. Prices are subject to change without notice. Any promotions or discounts are valid for a limited time and may be subject to additional terms and conditions.</p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-foreground">Orders and Payments</h2>
            <p>a. By placing an order on our website, you are making an offer to purchase the selected products.</p>
            <p>b. We reserve the right to refuse or cancel any order for any reason, including but not limited to product availability, errors in pricing or product information, or suspected fraudulent activity.</p>
            <p>c. You agree to provide valid and up-to-date payment information and authorize us to charge the total order amount, including applicable taxes and shipping fees, to your chosen payment method.</p>
            <p>d. We use trusted third-party payment processors to handle your payment information securely. We do not store or have access to your full payment details.</p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-foreground">Shipping and Delivery</h2>
            <p>a. We will make reasonable efforts to ensure timely shipping and delivery of your orders.</p>
            <p>b. Shipping and delivery times provided are estimates and may vary based on your location and other factors.</p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-foreground">Returns and Refunds</h2>
            <p>Our Returns and Refund Policy governs the process and conditions for returning products and seeking refunds. Please refer to the policy provided on our website for more information.</p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-foreground">Intellectual Property</h2>
            <p>a. All content and materials on our website, including but not limited to text, images, logos, and graphics, are protected by intellectual property rights and are the property of Chuttak Pay or its licensors.</p>
            <p>b. You may not use, reproduce, distribute, or modify any content from our website without our prior written consent.</p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-foreground">Limitation of Liability</h2>
            <p>a. In no event shall Chuttak Pay, its directors, employees, or affiliates be liable for any direct, indirect, incidental, special, or consequential damages arising out of or in connection with your use of our website or the purchase and use of our products.</p>
            <p>b. We make no warranties or representations, express or implied, regarding the quality, accuracy, or suitability of the products offered on our website.</p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-foreground">Amendments and Termination</h2>
            <p>We reserve the right to modify, update, or terminate these Terms and Conditions at any time without prior notice. It is your responsibility to review these terms periodically for any changes.</p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-foreground">Contact Us</h2>
            <p>If you have any questions or concerns regarding these Terms & Conditions, please contact our customer support team at <a href="mailto:support@chuttakpay.lk" className="text-primary hover:underline">support@chuttakpay.lk</a>.</p>
          </section>
        </div>
      </div>
    </Layout>
  );
}
