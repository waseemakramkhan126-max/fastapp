# Faster Home Delivery — Customer Portal Update

## Added pages
- `customer-order.html`: customer order form; no Google login or WhatsApp interaction.
- `order-track.html`: customer checks status using Order ID + checkout phone number.
- Existing login, admin/rider and app pages are preserved.

## IMPORTANT: one-time Supabase setup
The browser calls two restricted Supabase RPC functions. Before publishing:
1. Open the Supabase project already configured in `index-logic.js`.
2. Open **SQL Editor**.
3. Review and run `supabase/public-customer-portal.sql`.
4. Confirm your `orders` table uses a numeric `id` and includes the columns referenced by the SQL (`customer_phone`, `customer_name`, `delivery_address`, `area`, `order_details`, `status`, `dc_amount`, `rider_status`, `updated_at`, `bill_amount`). These are based on fields used by the existing app; if your live schema differs, adjust the SQL first.
5. Test one low-risk order and verify it appears in the existing admin/rider order list.

## Publish
Upload the contents of this project folder to your existing static hosting (or a new static site). Set `customer-order.html` as the public customer ordering link. Share that link with customers. Existing `index.html` remains the original sign-in/app entry page.

## Security and operational notes
- Public order creation is implemented as a `SECURITY DEFINER` database function, not unrestricted direct table insert.
- Tracking requires both the numeric order ID and the same phone number used at checkout. The tracking function returns only status-related fields.
- This does not send WhatsApp messages.
- The public form currently stores the typed city and block in `order_details` metadata and the society/area in the existing `area` column, because the existing order insert code does not show dedicated city/block order columns.
- The SQL is a deployment migration, not already applied to your live Supabase database. Until it is run and tested, the new pages will show an RPC error.
- Consider adding server-side rate limiting / CAPTCHA before wide public launch to reduce spam. Never expose a Supabase service-role key in browser code.
