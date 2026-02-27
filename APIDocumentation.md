# API Documentation

**Base URL**
Use the `APP_URL` value from your environment as the base, and append `/api` to it.

**Authentication**
Auth uses Laravel Sanctum bearer tokens. For protected endpoints send `Authorization: Bearer <token>`.

**Content Types**
JSON requests use `Content-Type: application/json`.
File uploads (only `POST /api/checkout/orders` when sending `payment_receipt`) must use `multipart/form-data`.

**Common Errors**
`401` for missing/invalid auth on protected endpoints.
`404` with `{ "message": "..." }` for not found.
`422` for validation errors (Laravel default validation response).
`502` for upstream payment gateway errors (Mintpay status).

**Data Models**
Below are the JSON fields returned by the API. Fields marked nullable can be `null`.

**User**
Fields: `id`, `name`, `email`, `email_verified_at`, `mobile`, `provider_name`, `provider_id`, `avatar_url`, `created_at`, `updated_at`.
Notes: `password` and `remember_token` are hidden. Auth endpoints load `roles` so a `roles` array may appear.

**Brand**
Fields: `id`, `name`, `slug`, `created_at`, `updated_at`.

**Category**
Fields: `id`, `parent_id` (nullable), `name`, `slug`, `created_at`, `updated_at`.

**Collection**
Fields: `id`, `name`, `start_date` (nullable, `YYYY-MM-DD`), `end_date` (nullable, `YYYY-MM-DD`), `created_at`, `updated_at`.

**Color**
Fields: `id`, `name`, `hex` (nullable), `sort_order`, `created_at`, `updated_at`.

**Size**
Fields: `id`, `name`, `sort_order`, `created_at`, `updated_at`.

**Tax**
Fields: `id`, `name`, `rate`, `is_inclusive`, `created_at`, `updated_at`.

**Location**
Fields: `id`, `name`, `type` (`store` or `warehouse`), `created_at`, `updated_at`.

**Supplier**
Fields: `id`, `name`, `supplier_code`, `contact_person` (nullable), `email` (nullable), `phone` (nullable), `address` (nullable), `city` (nullable), `state` (nullable), `country` (nullable), `postal_code` (nullable), `tax_number` (nullable), `status` (`active` or `inactive`), `notes` (nullable), `created_at`, `updated_at`, `deleted_at` (nullable).

**Product Image**
Fields: `id`, `product_id`, `variant_id` (nullable), `path`, `is_primary`, `sort_order`, `created_at`, `updated_at`.

**Product Variant**
Fields: `id`, `product_id`, `sku`, `barcode` (nullable), `size_id` (nullable), `color_id` (nullable), `cost_price` (nullable), `mrp` (nullable), `selling_price`, `reorder_point` (nullable), `reorder_qty` (nullable), `weight_grams` (nullable), `status` (`active` or `inactive`), `created_at`, `updated_at`, `deleted_at` (nullable).

**Product Response**
This is the response shape from `GET /api/products` and `GET /api/products/{id}`.
Fields: `id`, `name`, `slug`, `sku_prefix` (nullable), `brand_id`, `category_id`, `collection_id` (nullable), `collection_name` (only in list), `season` (nullable), `description` (nullable), `care_instructions` (nullable), `material_composition` (nullable), `hs_code` (nullable), `default_tax_id` (nullable), `status`, `quantity`, `inquiry_only`, `show_price_inquiry_mode`, `variants`, `images`, `highlights`.
`variants` items: `id`, `sku`, `size_id`, `size_name`, `color` (object or null with `id`, `name`, `hex`), `colors` (array of color objects), `selling_price` (nullable if inquiry only), `quantity`, `status`.
`images` is an array of absolute image URLs.

**Stock Level**
Fields: `id`, `location_id`, `variant_id`, `on_hand`, `reserved`, `created_at`, `updated_at`.

**Stock Movement**
Fields: `id`, `variant_id`, `location_id`, `quantity`, `reason`, `reference_type` (nullable), `reference_id` (nullable), `notes` (nullable), `created_by` (nullable), `created_at`, `updated_at`.

**GRN**
Fields: `id`, `grn_number`, `supplier_id`, `purchase_order_id` (nullable), `received_date`, `status` (`pending`, `received`, `verified`), `remarks` (nullable), `location_id`, `created_at`, `updated_at`, `deleted_at` (nullable).

**GRN Item**
Fields: `id`, `grn_id`, `product_id`, `variant_id` (nullable), `ordered_qty` (nullable), `received_qty`, `unit_cost`, `total_cost`, `notes` (nullable), `created_at`, `updated_at`.

**Payment Method**
Fields: `id`, `name`, `code`, `type` (`online` or `offline`), `gateway` (nullable), `description` (nullable), `icon_path` (nullable), `instructions` (nullable), `sort_order`, `settings` (nullable object), `active`, `created_at`, `updated_at`.

**Payment**
Fields: `id`, `cart_id` (nullable), `order_id` (nullable), `amount_paid`, `payment_method_id`, `gateway` (nullable), `gateway_payload` (nullable object), `gateway_response` (nullable object), `reference_number` (nullable), `payment_date` (nullable), `notes` (nullable), `discount_available`, `discount` (nullable), `payment_status`, `receipt_path` (nullable), `created_at`, `updated_at`.

**Order**
Fields: `id`, `order_number`, `user_id` (nullable), `payment_id` (nullable), `payment_method_id` (nullable), `status`, `payment_status`, `fulfillment_status`, `currency`, `subtotal`, `tax_total`, `discount_total`, `shipping_total`, `grand_total`, `billing_address` (nullable object), `shipping_address` (nullable object), `customer_name` (nullable), `customer_email` (nullable), `customer_phone` (nullable), `notes` (nullable), `created_at`, `updated_at`, `items` (array of Order Item).

**Order Item**
Fields: `id`, `order_id`, `product_id` (nullable), `product_variant_id` (nullable), `product_name`, `variant_name` (nullable), `sku` (nullable), `quantity`, `unit_price`, `line_total`, `meta` (nullable object), `created_at`, `updated_at`.

**Shipping Address**
Fields: `id`, `user_id`, `label` (nullable), `recipient_name`, `phone`, `address_line1`, `address_line2` (nullable), `city`, `state`, `postal_code`, `country`, `is_default`, `created_at`, `updated_at`.

**Cart Response**
Fields: `id`, `user_id` (nullable), `session_id` (nullable), `subtotal`, `tax_total`, `discount_total`, `grand_total`, `items`.
`items` fields: `id`, `product_variant_id`, `product_id`, `product_name`, `variant_display_name`, `variant_sku`, `size`, `color`, `quantity`, `unit_price`, `line_total`, `image_url` (nullable).

**Settings Responses**
`GET /api/settings/social-login` returns:
- `providers.google`: `enabled`, `client_id`, `redirect`.
- `providers.facebook`: `enabled`, `client_id`, `redirect`.
`GET /api/settings/hero-image` returns: `image_path`, `image_url`.
`GET /api/settings/welcome-popup` returns: `image_path`, `image_url`, `description`, `link_url`.

**Endpoints**
All endpoints below are relative to `/api`.

**GET /api/user**
Auth required.
Request: none.
Response: `200` User.

**POST /api/auth/register**
Auth: none.
Request body (JSON): `name`, `email`, `mobile` (nullable), `password`.
Response: `200` object with `token` and `user`.

**POST /api/auth/login**
Auth: none.
Request body (JSON): `email`, `password`.
Response: `200` object with `token` and `user`.
Response on invalid credentials: `422` with `{ "message": "Invalid credentials" }`.

**POST /api/auth/social/{provider}**
Auth: none.
Path params: `provider` must be `google` or `facebook`.
Request body (JSON): `access_token` or `id_token`.
Response: `200` object with `token` and `user`.
Response on unsupported provider: `422`.
Response on invalid token: `422` validation error.

**GET /api/auth/me**
Auth required.
Request: none.
Response: `200` User.

**POST /api/auth/logout**
Auth required.
Request: none.
Response: `200` with `{ "message": "Logged out" }`.

**GET /api/profile**
Auth required.
Request: none.
Response: `200` User.

**PUT /api/profile**
Auth required.
Request body (JSON): `name`, `email`, `mobile` (nullable).
Response: `200` with `{ "message": "Profile updated", "user": User }`.

**PUT /api/profile/password**
Auth required.
Request body (JSON): `current_password`, `password`, `password_confirmation`.
Response: `200` with `{ "message": "Password updated" }`.

**GET /api/shipping-addresses**
Auth required.
Request: none.
Response: `200` array of Shipping Address.

**POST /api/shipping-addresses**
Auth required.
Request body (JSON): `label` (nullable), `recipient_name`, `phone`, `address_line1`, `address_line2` (nullable), `city`, `state`, `postal_code`, `country`, `is_default` (boolean, optional).
Response: `201` with `{ "message": "Shipping address created", "data": Shipping Address }`.

**PUT /api/shipping-addresses/{shippingAddress}**
Auth required.
Request body (JSON): same fields as create. All required except `label`, `address_line2`, `is_default`.
Response: `200` with `{ "message": "Shipping address updated", "data": Shipping Address }`.

**DELETE /api/shipping-addresses/{shippingAddress}**
Auth required.
Request: none.
Response: `200` with `{ "message": "Shipping address deleted" }`.

**POST /api/shipping-addresses/{shippingAddress}/make-default**
Auth required.
Request: none.
Response: `200` with `{ "message": "Default shipping address updated", "data": Shipping Address }`.

**GET /api/cart**
Auth: optional.
Request query: `session_id` is required for guests.
Response: `200` Cart Response.

**POST /api/cart/items**
Auth: optional.
Request body (JSON): `product_variant_id`, `quantity`, `session_id` (required for guests).
Response: `201` with `{ "message": "Item added to cart", "cart": Cart Response }`.
Response on inquiry only products or missing price: `422`.

**PUT /api/cart/items/{cartItem}**
Auth: optional.
Request body (JSON): `quantity` (optional), `product_variant_id` (optional), `session_id` (required).
Response: `200` with `{ "message": "Cart item updated", "cart": Cart Response }`.

**DELETE /api/cart/items/{cartItem}**
Auth: optional.
Request body (JSON): `session_id` (required).
Response: `200` with `{ "message": "Cart item removed", "cart": Cart Response }`.

**POST /api/cart/clear**
Auth: optional.
Request body (JSON): `session_id` (required for guests).
Response: `200` with `{ "message": "Cart cleared", "cart": Cart Response or null }`.

**POST /api/cart/merge**
Auth required.
Request body (JSON): `session_id` (guest cart session id to merge).
Response: `200` with `{ "message": "Cart merged", "cart": Cart Response }`.

**POST /api/checkout/payments**
Auth: optional.
Request body (JSON):
- `payment_method_id`.
- `session_id` (required for guests).
- `items` (optional string description).
- `customer.first_name`, `customer.last_name`, `customer.email`, `customer.phone`, `customer.address`, `customer.city`, `customer.country`, `customer.postal_code` (optional), `customer.postcode` (optional).
- `shipping` object (optional): `first_name`, `last_name`, `address_line1`, `address_line2`, `city`, `country`, `postal_code`, `email`, `phone`.
- `return_url`, `cancel_url`, `notify_url`, `success_url`, `fail_url` (optional URLs).
Response: `201` with `{ "message": "Payment initialized.", "payment": Payment, "checkout": <gateway specific> }`.

**POST /api/checkout/orders**
Auth: optional.
Request body (JSON or multipart):
- `payment_id` (nullable) or `payment_method_id` (nullable). One is required.
- `session_id` (required for guests).
- `currency` (optional, 3 letters).
- `shipping_total` (optional number).
- `notes` (optional string).
- `shipping.first_name`, `shipping.last_name`, `shipping.address_line1`, `shipping.address_line2` (optional), `shipping.city`, `shipping.country`, `shipping.postal_code` (optional), `shipping.email`, `shipping.phone`.
- `billing` object (optional): `first_name`, `last_name`, `address_line1`, `address_line2`, `city`, `country`, `postal_code`, `email`, `phone`.
- `payment_receipt` (file, required when payment method gateway is `manual_bank`).
Response: `201` with `{ "message": "Order placed successfully.", "order": Order }`.

**POST /api/payments/payhere/notify**
Auth: none (webhook).
Request body (JSON or form): must include `order_id`. Additional PayHere fields are passed through for verification.
Response: `200` with `{ "message": "Notification processed.", "verified": boolean, "status": "paid|pending|failed" }`.

**GET /api/payments/mintpay/status/{payment}**
Auth: none.
Path params: `payment` is the payment id.
Query params: `purchase_id` (optional, otherwise taken from payment gateway payload).
Response on success: `200` with `{ "message": "Mintpay status fetched.", "payment": Payment, "gateway": <mintpay payload> }`.
Response on missing credentials or invalid payment method: `422`.
Response when Mintpay reports missing order: `404`.
Response on gateway failure: `502`.

**GET /api/settings/social-login**
Auth: none.
Response: providers configuration (see Settings Responses above).

**GET /api/settings/hero-image**
Auth: none.
Response: hero image settings (see Settings Responses above).

**GET /api/settings/welcome-popup**
Auth: none.
Response: welcome popup settings (see Settings Responses above).

**Brands**
Fields: Brand.
- `GET /api/brands` Request: none. Response: `200` array of Brand.
- `GET /api/brands/{id}` Request: none. Response: `200` Brand or `404`.
- `GET /api/brands/{id}/edit` Request: none. Response: `200` Brand or `404`.
- `POST /api/brands` Request: Brand fields. Response: `500` because `store` is not implemented in the controller.
- `PUT /api/brands/{id}` Request: any Brand fields. Response: `200` with `{ "message": "Brand updated successfully", "data": Brand }` or `404`.
- `DELETE /api/brands/{id}` Request: none. Response: `200` with `{ "message": "Brand deleted successfully" }` or `404`.

**Categories**
Fields: Category.
- `GET /api/categories` Request: none. Response: `200` array of Category.
- `GET /api/categories/{id}` Request: none. Response: `200` Category or `404`.
- `GET /api/categories/{id}/edit` Request: none. Response: `200` Category or `404`.
- `POST /api/categories` Request: Category fields. Response: `500` because `store` is not implemented in the controller.
- `PUT /api/categories/{id}` Request: any Category fields. Response: `200` with `{ "message": "Category updated successfully", "data": Category }` or `404`.
- `DELETE /api/categories/{id}` Request: none. Response: `200` with `{ "message": "Category deleted successfully" }` or `404`.

**Collections**
Fields: Collection.
- `GET /api/collections` Request: none. Response: `200` array of Collection.
- `GET /api/collections/{id}` Request: none. Response: `200` Collection or `404`.
- `GET /api/collections/{id}/edit` Request: none. Response: `200` Collection or `404`.
- `POST /api/collections` Request: Collection fields. Response: `500` because `store` is not implemented in the controller.
- `PUT /api/collections/{id}` Request: any Collection fields. Response: `200` with `{ "message": "Collection updated successfully", "data": Collection }` or `404`.
- `DELETE /api/collections/{id}` Request: none. Response: `200` with `{ "message": "Collection deleted successfully" }` or `404`.

**Colors**
Fields: Color.
- `GET /api/colors` Request: none. Response: `200` array of Color.
- `GET /api/colors/{id}` Request: none. Response: `200` Color or `404`.
- `GET /api/colors/{id}/edit` Request: none. Response: `200` Color or `404`.
- `POST /api/colors` Request: Color fields. Response: `500` because `store` is not implemented in the controller.
- `PUT /api/colors/{id}` Request: any Color fields. Response: `200` with `{ "message": "Color updated successfully", "data": Color }` or `404`.
- `DELETE /api/colors/{id}` Request: none. Response: `200` with `{ "message": "Color deleted successfully" }` or `404`.

**Locations**
Fields: Location.
- `GET /api/locations` Request: none. Response: `200` array of Location.
- `GET /api/locations/{id}` Request: none. Response: `200` Location or `404`.
- `GET /api/locations/{id}/edit` Request: none. Response: `200` Location or `404`.
- `POST /api/locations` Request: Location fields. Response: `500` because `store` is not implemented in the controller.
- `PUT /api/locations/{id}` Request: any Location fields. Response: `200` with `{ "message": "Location updated successfully", "data": Location }` or `404`.
- `DELETE /api/locations/{id}` Request: none. Response: `200` with `{ "message": "Location deleted successfully" }` or `404`.

**Products**
Fields: Product Response.
- `GET /api/products` Request: none. Response: `200` array of Product Response.
- `GET /api/products/{id}` Request: none. Response: `200` Product Response or `404`.
- `GET /api/products/{id}/edit` Request: none. Response: same as show.
- `POST /api/products` Request: Product fields. Response: `500` because `store` is not implemented in the controller.
- `PUT /api/products/{id}` Request: any Product fields. Response: `200` with `{ "message": "Product updated successfully", "data": Product }` or `404`.
- `DELETE /api/products/{id}` Request: none. Response: `200` with `{ "message": "Product deleted successfully" }` or `404`.

**Product Images**
Fields: Product Image.
- `GET /api/product-images` Request: none. Response: `200` array of Product Image.
- `GET /api/product-images/{id}` Request: none. Response: `200` Product Image or `404`.
- `GET /api/product-images/{id}/edit` Request: none. Response: same as show.
- `POST /api/product-images` Request: Product Image fields. Response: `500` because `store` is not implemented in the controller.
- `PUT /api/product-images/{id}` Request: any Product Image fields. Response: `200` with `{ "message": "ProductImage updated successfully", "data": Product Image }` or `404`.
- `DELETE /api/product-images/{id}` Request: none. Response: `200` with `{ "message": "ProductImage deleted successfully" }` or `404`.

**Product Variants**
Fields: Product Variant.
- `GET /api/product-variants` Request: none. Response: `200` array of Product Variant.
- `GET /api/product-variants/{id}` Request: none. Response: `200` Product Variant or `404`.
- `GET /api/product-variants/{id}/edit` Request: none. Response: same as show.
- `POST /api/product-variants` Request: Product Variant fields. Response: `500` because `store` is not implemented in the controller.
- `PUT /api/product-variants/{id}` Request: any Product Variant fields. Response: `200` with `{ "message": "ProductVariant updated successfully", "data": Product Variant }` or `404`.
- `DELETE /api/product-variants/{id}` Request: none. Response: `200` with `{ "message": "ProductVariant deleted successfully" }` or `404`.

**Sizes**
Fields: Size.
- `GET /api/sizes` Request: none. Response: `200` array of Size.
- `GET /api/sizes/{id}` Request: none. Response: `200` Size or `404`.
- `GET /api/sizes/{id}/edit` Request: none. Response: same as show.
- `POST /api/sizes` Request: Size fields. Response: `500` because `store` is not implemented in the controller.
- `PUT /api/sizes/{id}` Request: any Size fields. Response: `200` with `{ "message": "Size updated successfully", "data": Size }` or `404`.
- `DELETE /api/sizes/{id}` Request: none. Response: `200` with `{ "message": "Size deleted successfully" }` or `404`.

**Taxes**
Fields: Tax.
- `GET /api/taxes` Request: none. Response: `200` array of Tax.
- `GET /api/taxes/{id}` Request: none. Response: `200` Tax or `404`.
- `GET /api/taxes/{id}/edit` Request: none. Response: same as show.
- `POST /api/taxes` Request: Tax fields. Response: `500` because `store` is not implemented in the controller.
- `PUT /api/taxes/{id}` Request: any Tax fields. Response: `200` with `{ "message": "Tax updated successfully", "data": Tax }` or `404`.
- `DELETE /api/taxes/{id}` Request: none. Response: `200` with `{ "message": "Tax deleted successfully" }` or `404`.

**GRN**
Fields: GRN.
- `GET /api/grn` Request: none. Response: `200` array of GRN.
- `GET /api/grn/{id}` Request: none. Response: `200` GRN or `404`.
- `GET /api/grn/{id}/edit` Request: none. Response: same as show.
- `POST /api/grn` Request: GRN fields. Response: `500` because `store` is not implemented in the controller.
- `PUT /api/grn/{id}` Request: any GRN fields. Response: `200` with `{ "message": "Grn updated successfully", "data": GRN }` or `404`.
- `DELETE /api/grn/{id}` Request: none. Response: `200` with `{ "message": "Grn deleted successfully" }` or `404`.

**GRN Items**
Fields: GRN Item.
- `GET /api/grn-items` Request: none. Response: `200` array of GRN Item.
- `GET /api/grn-items/{id}` Request: none. Response: `200` GRN Item or `404`.
- `GET /api/grn-items/{id}/edit` Request: none. Response: same as show.
- `POST /api/grn-items` Request: GRN Item fields. Response: `500` because `store` is not implemented in the controller.
- `PUT /api/grn-items/{id}` Request: any GRN Item fields. Response: `200` with `{ "message": "GrnItem updated successfully", "data": GRN Item }` or `404`.
- `DELETE /api/grn-items/{id}` Request: none. Response: `200` with `{ "message": "GrnItem deleted successfully" }` or `404`.

**Stock Levels**
Fields: Stock Level.
- `GET /api/stock-levels` Request: none. Response: `200` array of Stock Level.
- `GET /api/stock-levels/{id}` Request: none. Response: `200` Stock Level or `404`.
- `GET /api/stock-levels/{id}/edit` Request: none. Response: same as show.
- `POST /api/stock-levels` Request: Stock Level fields. Response: `500` because `store` is not implemented in the controller.
- `PUT /api/stock-levels/{id}` Request: any Stock Level fields. Response: `200` with `{ "message": "StockLevel updated successfully", "data": Stock Level }` or `404`.
- `DELETE /api/stock-levels/{id}` Request: none. Response: `200` with `{ "message": "StockLevel deleted successfully" }` or `404`.

**Stock Movements**
Fields: Stock Movement.
- `GET /api/stock-movements` Request: none. Response: `200` array of Stock Movement.
- `GET /api/stock-movements/{id}` Request: none. Response: `200` Stock Movement or `404`.
- `GET /api/stock-movements/{id}/edit` Request: none. Response: same as show.
- `POST /api/stock-movements` Request: Stock Movement fields. Response: `500` because `store` is not implemented in the controller.
- `PUT /api/stock-movements/{id}` Request: any Stock Movement fields. Response: `200` with `{ "message": "StockMovement updated successfully", "data": Stock Movement }` or `404`.
- `DELETE /api/stock-movements/{id}` Request: none. Response: `200` with `{ "message": "StockMovement deleted successfully" }` or `404`.

**Suppliers**
Fields: Supplier.
- `GET /api/suppliers` Request: none. Response: `200` array of Supplier.
- `GET /api/suppliers/{id}` Request: none. Response: `200` Supplier or `404`.
- `GET /api/suppliers/{id}/edit` Request: none. Response: same as show.
- `POST /api/suppliers` Request: Supplier fields. Response: `500` because `store` is not implemented in the controller.
- `PUT /api/suppliers/{id}` Request: any Supplier fields. Response: `200` with `{ "message": "Supplier updated successfully", "data": Supplier }` or `404`.
- `DELETE /api/suppliers/{id}` Request: none. Response: `200` with `{ "message": "Supplier deleted successfully" }` or `404`.

**Payments**
Fields: Payment.
- `GET /api/payments` Request: none. Response: `200` array of Payment.
- `GET /api/payments/{id}` Request: none. Response: `200` Payment or `404`.
- `GET /api/payments/{id}/edit` Request: none. Response: same as show.
- `POST /api/payments` Request: Payment fields. Response: `500` because `store` is not implemented in the controller.
- `PUT /api/payments/{id}` Request: any Payment fields. Response: `200` with `{ "message": "Payment updated successfully", "data": Payment }` or `404`.
- `DELETE /api/payments/{id}` Request: none. Response: `200` with `{ "message": "Payment deleted successfully" }` or `404`.

**Payment Methods**
Fields: Payment Method.
- `GET /api/payment-methods` Request: none. Response: `200` array of Payment Method (ordered by `sort_order`, then `name`).
- `GET /api/payment-methods/{paymentMethod}` Request: none. Response: `200` Payment Method or `404`.
- `GET /api/payment-methods/{paymentMethod}/edit` Request: none. Response: same as show.
- `POST /api/payment-methods` Request body (JSON): `name`, `code`, `type`, `gateway`, `description` (nullable), `instructions` (nullable), `sort_order` (nullable), `active` (boolean), `settings` (nullable object). Response: `201` with `{ "message": "Payment method created successfully.", "data": Payment Method }`.
- `PUT /api/payment-methods/{paymentMethod}` Request body (JSON): same fields as create, all optional. Response: `200` with `{ "message": "Payment method updated successfully.", "data": Payment Method }`.
- `DELETE /api/payment-methods/{paymentMethod}` Request: none. Response: `200` with `{ "message": "Payment method deleted successfully." }`.
