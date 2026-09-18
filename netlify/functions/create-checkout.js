// ============================================================================
// Stratos Environmental Ltd — create a Stripe Checkout Session for a custom amount.
//
// This runs on Netlify Functions (Node 18+, global fetch available). It talks
// to Stripe's REST API directly, so there are NO npm dependencies and no build
// step is required.
//
// SETUP (once):
//   Netlify dashboard → Site settings → Environment variables → add:
//     STRIPE_SECRET_KEY = sk_live_...   (or sk_test_... while testing)
//   Optionally:
//     SITE_URL = https://stratosenvironmental.co.uk   (used for redirects)
//
// The secret key is ONLY ever read here on the server — it is never sent to
// the browser and must never be committed to the repo.
// ============================================================================

const STRIPE_API = "https://api.stripe.com/v1/checkout/sessions";
const MIN_PENCE = 100; // £1.00
const MAX_PENCE = 5000000; // £50,000 safety ceiling

exports.handler = async function (event) {
  if (event.httpMethod !== "POST") {
    return json(405, { error: "Method not allowed" });
  }

  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    return json(500, { error: "Payments are not configured yet (missing STRIPE_SECRET_KEY)." });
  }

  let data;
  try {
    data = JSON.parse(event.body || "{}");
  } catch (e) {
    return json(400, { error: "Invalid request body." });
  }

  const amount = Math.round(Number(data.amount));
  const email = typeof data.email === "string" ? data.email.trim() : "";
  const invoiceRef = typeof data.invoiceRef === "string" ? data.invoiceRef.trim().slice(0, 120) : "";

  if (!Number.isFinite(amount) || amount < MIN_PENCE || amount > MAX_PENCE) {
    return json(400, { error: "Invalid amount." });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return json(400, { error: "Invalid email." });
  }

  const site = (process.env.SITE_URL || originFrom(event) || "https://stratosenvironmental.co.uk").replace(/\/$/, "");
  const description = invoiceRef ? `Payment — ${invoiceRef}` : "Payment to Stratos Environmental Ltd";

  // Stripe expects application/x-www-form-urlencoded with bracketed nested keys.
  const form = new URLSearchParams();
  form.append("mode", "payment");
  form.append("success_url", `${site}/pay.html?paid=1`);
  form.append("cancel_url", `${site}/pay.html?canceled=1`);
  form.append("customer_email", email);
  form.append("payment_method_types[0]", "card");
  form.append("line_items[0][quantity]", "1");
  form.append("line_items[0][price_data][currency]", "gbp");
  form.append("line_items[0][price_data][unit_amount]", String(amount));
  form.append("line_items[0][price_data][product_data][name]", description);
  if (invoiceRef) form.append("metadata[invoice_ref]", invoiceRef);

  try {
    const res = await fetch(STRIPE_API, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: form.toString(),
    });
    const session = await res.json();

    if (!res.ok) {
      const msg = session && session.error && session.error.message ? session.error.message : "Stripe error";
      return json(502, { error: msg });
    }
    return json(200, { url: session.url, id: session.id });
  } catch (err) {
    return json(502, { error: "Could not reach Stripe. Please try again." });
  }
};

function json(statusCode, body) {
  return {
    statusCode,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  };
}

function originFrom(event) {
  const proto = (event.headers && (event.headers["x-forwarded-proto"] || event.headers["X-Forwarded-Proto"])) || "https";
  const host = event.headers && (event.headers.host || event.headers.Host);
  return host ? `${proto}://${host}` : null;
}
