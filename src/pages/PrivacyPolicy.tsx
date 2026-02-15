import Layout from "@/components/layout/Layout";

export default function PrivacyPolicy() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <h1 className="font-display text-3xl font-bold mb-8">Privacy Policy</h1>
        <div className="prose prose-sm max-w-none space-y-6 text-muted-foreground">
          <p><strong>Last updated:</strong> February 15, 2026</p>

          <section>
            <h2 className="font-display text-xl font-semibold text-foreground">1. Information We Collect</h2>
            <p>We collect personal information you provide when placing orders, creating an account, or contacting us. This includes your name, email address, phone number, shipping address, and payment details.</p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-foreground">2. How We Use Your Information</h2>
            <p>Your information is used to process orders, communicate updates, improve our services, and provide customer support. We do not sell your personal data to third parties.</p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-foreground">3. Data Security</h2>
            <p>We implement industry-standard security measures to protect your personal information. All payment transactions are processed through secure, encrypted channels.</p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-foreground">4. Cookies</h2>
            <p>We use cookies to enhance your browsing experience, remember preferences, and analyze site traffic. You can manage cookie settings through your browser.</p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-foreground">5. Third-Party Services</h2>
            <p>We may share necessary information with payment processors and delivery partners to fulfill your orders. These partners are bound by their own privacy policies.</p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-foreground">6. Contact Us</h2>
            <p>For privacy-related inquiries, contact us at <a href="mailto:support@chuttakpay.lk" className="text-primary hover:underline">support@chuttakpay.lk</a>.</p>
          </section>
        </div>
      </div>
    </Layout>
  );
}
