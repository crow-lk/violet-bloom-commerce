

## Purple Gradient Electronics Store — Full Plan

### 🎨 Design Theme
- Bold purple gradient color scheme throughout (deep violet to lavender)
- Modern, sleek UI suited for electronics/gadgets
- Glassmorphism-style cards and smooth hover animations
- Fully responsive (mobile-first)

---

### 📄 Pages & Features

#### 1. **Home Page**
- Hero banner with purple gradient background, featured product showcase, and CTA buttons
- Promotional banners section (discounts, offers, flash sales with countdown timers)
- Featured categories grid (Phones, Laptops, Accessories, Audio, Wearables, etc.)
- Trending/Best-selling products carousel
- Special offers section with discount badges (e.g., "30% OFF", "Buy 1 Get 1")
- Newsletter signup section

#### 2. **Shop Page**
- Product grid with filtering (by category, price range, brand, ratings)
- Sorting options (price low-high, newest, popularity, discount %)
- Search bar with auto-suggestions
- Discount/sale badges on product cards
- Pagination for 50+ products
- List/grid view toggle

#### 3. **Product Detail Page**
- Large product image gallery with zoom
- Product info: name, price, original price with strikethrough for discounts, description, specs
- Quantity selector and "Add to Cart" button
- "Buy with Mint Pay" button (BNPL option, placeholder for API integration)
- Related products section
- Product reviews/ratings section

#### 4. **Cart Page**
- Cart items list with quantity adjustment and remove option
- Promo/coupon code input field
- Order summary with subtotal, discount, and total
- "Proceed to Checkout" button

#### 5. **Checkout Page**
- Shipping information form (name, address, phone, email)
- Order summary sidebar
- Payment method selection: Card Payment (placeholder) and Mint Pay (placeholder with branding)
- Place order button
- Order confirmation screen

#### 6. **User Account Pages**
- Sign up / Login forms (UI only, ready for backend integration)
- Profile page with personal details
- Order history with order status tracking
- Wishlist page

---

### 🔧 Integrated Features

- **Mint Pay Button** — Prominent "Pay with Mintpay" option on product and checkout pages (UI placeholder, ready for API connection later)
- **WhatsApp Support Button** — Floating WhatsApp icon (bottom-right corner) linking to your support number, visible on all pages
- **Promotions & Offers System** — Discount badges, sale banners, countdown timers for flash deals, coupon code input at cart
- **Mock Product Data** — Pre-populated with sample electronics products so the store looks complete; easily replaceable with real API data later

---

### 📦 Data Architecture
- All product, cart, and user data managed with React state and local storage (no backend required initially)
- Clean service layer/hooks so you can easily swap in your own APIs when ready
- Cart persisted in local storage

