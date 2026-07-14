# Stratos Environmental — Website

A fast, modern marketing site for **stratosenvironmental.co.uk**, a commercial
waste collection & recycling business. Built as a lightweight static site
(plain HTML/CSS/JS) so it's easy to host anywhere and cheap to run.

## Structure

```
stratos-environmental-website/
├── index.html        # Homepage (hero, services, how it works, coverage, reviews, contact)
├── quote.html        # Multi-step "Get a Free Quote" wizard
├── favicon.svg       # Site icon / logo mark
├── css/
│   └── styles.css    # Design system + all page styles
└── js/
    ├── main.js       # Mobile nav + footer year
    └── quote.js      # Quote wizard logic + form submission
```

## Preview locally

No build step needed. From this folder run any static server, e.g.:

```bash
python3 -m http.server 8080
```

Then open http://localhost:8080

## Receiving quote submissions by email  ⭐ IMPORTANT

The quote form works out of the box in **demo mode** (it validates and shows the
thank-you screen, but does not email anyone). To actually receive leads:

1. Go to <https://web3forms.com> and enter the email address where you want
   quotes delivered. It's free and gives you an **Access Key**.
2. Open `js/quote.js` and paste the key into:

   ```js
   var CONFIG = {
     WEB3FORMS_KEY: "your-access-key-here",
     ...
   };
   ```

3. Submit a test quote — it should arrive in your inbox.

(You can swap in Formspree, Getform, or your own backend just as easily —
the submission happens in the `form.addEventListener("submit", ...)` block.)

## Things to update with your real details

These are placeholders — search & replace across the project:

| Placeholder | Where | Replace with |
|-------------|-------|--------------|
| `+44 7448 730416` | header, footer, CTA (both HTML files) | your real phone number |
| `info@stratosenvironmental.co.uk` | footer, index.html | your real email |
| `London, United Kingdom` | footer | your address |
| Testimonials in `index.html` (`#reviews`) | real customer reviews |
| Trust-bar stats in `index.html` (`.trustbar`) | real figures if you have them |

> Note: update the other placeholders (email, address, testimonials) before
> going live.

## Deploying

Because it's static, you can host it for free/cheap on any of these:

- **Netlify** or **Vercel** — drag-and-drop the folder, or connect the git repo.
- **Cloudflare Pages** — connect the repo, no build command, output dir = `/`.
- **GitHub Pages** — push to a repo and enable Pages on the `main` branch.

Point your `stratosenvironmental.co.uk` domain at whichever host you pick.

## Customising

- **Colours / fonts:** edit the CSS variables at the top of `css/styles.css`
  (`--green-600`, `--ink`, `--font-head`, etc.).
- **Services / bin sizes:** edit the cards in the `#services` section of `index.html`.
- **Quote steps / options:** edit the `.step-panel` blocks in `quote.html`
  (the JS adapts automatically).
