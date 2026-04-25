import Layout from "@/components/layout/Layout";

export default function RefundPolicy() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <h1 className="font-display text-3xl font-bold mb-8">Refund Policy</h1>
        <div className="prose prose-sm max-w-none space-y-6 text-muted-foreground">
          <p><strong>Last updated:</strong> February 15, 2026</p>

          <section>
            <h2 className="font-display text-xl font-semibold text-foreground">Returns</h2>
            <p>We accept returns within 7 days from the date of purchase. To be eligible for a return, your item must be unused and in the same condition that you received it. It must also be in the original packaging.</p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-foreground">Refunds</h2>
            <p>Once we receive your return and inspect the item, we will notify you of the status of your refund. If your return is approved, we will initiate a refund to your original method of payment. Please note that the refund amount will exclude any shipping charges incurred during the initial purchase.</p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-foreground">Exchanges</h2>
            <p>If you would like to exchange your item for a different size, color, or style, please contact our customer support team within 7 days of receiving your order. We will provide you with further instructions on how to proceed with the exchange.</p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-foreground">Non-Returnable Items</h2>
            <p>Certain items are non-returnable and non-refundable. These include:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Gift cards</li>
              <li>Downloadable software products</li>
              <li>Personalized or custom-made items</li>
              <li>Perishable goods</li>
              <li>Damaged or Defective Items</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-foreground">Damaged or Defective Items</h2>
            <p>In the unfortunate event that your item arrives damaged or defective, please contact us immediately. We will arrange for a replacement or issue a refund, depending on your preference and product availability.</p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-foreground">Return Shipping</h2>
            <p>You will be responsible for paying the shipping costs for returning your item unless the return is due to our error (e.g., wrong item shipped, defective product). In such cases, we will provide you with a prepaid shipping label.</p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-foreground">Processing Time</h2>
            <p>Refunds and exchanges will be processed within 7 business days after we receive your returned item. Please note that it may take additional time for the refund to appear in your account, depending on your payment provider.</p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-foreground">Contact Us</h2>
            <p>If you have any questions or concerns regarding our refund policy, please contact our customer support team. We are here to assist you and ensure your shopping experience with us is enjoyable and hassle-free.</p>
          </section>
        </div>
      </div>
    </Layout>
  );
}
