#!/usr/bin/env python3
"""Generate SEO landing pages for Stratos Environmental."""
import os

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
V = "7"

HEADER = """<!DOCTYPE html>
<html lang="en-GB">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>{title}</title>
  <meta name="description" content="{desc}" />
  <meta name="robots" content="index, follow" />
  <link rel="canonical" href="https://stratosenvironmental.co.uk/{canonical}" />
  <link rel="icon" href="{prefix}favicon.svg" type="image/svg+xml" />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Sora:wght@600;700&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="{prefix}css/styles.css?v=""" + V + """" />
</head>
<body>
<header class="site-header"><div class="container"><nav class="nav" id="nav">
  <a href="{prefix}index.html" class="brand"><svg class="logo-mark" viewBox="0 0 64 64"><rect width="64" height="64" rx="15" fill="#15803d"/><path d="M44 18c-14 0-24 8-24 20 0 2 .4 4 1 6 7-13 15-16 21-18-6 4-12 9-16 20 2 .7 4 1 6 1 12 0 20-11 20-24 0-2 0-4-1-6-1 .5-2 .8-3 1z" fill="#8bc53f"/></svg><span>Stratos<small>Environmental</small></span></a>
  <ul class="nav-links">
    <li><a href="{prefix}index.html#services">Services</a></li>
    <li><a href="{prefix}index.html#how">How it works</a></li>
    <li><a href="{prefix}index.html#coverage">Areas</a></li>
    <li><a href="{prefix}index.html#faq">FAQs</a></li>
  </ul>
  <div class="nav-actions">
    <a class="nav-phone hide-tablet" href="tel:+447448730416"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/></svg> +44 7448 730416</a>
    <a href="{prefix}upload-invoice.html" class="btn btn-ghost hide-tablet">Upload Invoice</a>
    <a href="{prefix}quote.html" class="btn btn-primary">Free Quote</a>
    <button class="nav-toggle" id="navToggle" aria-label="Menu"><span></span><span></span><span></span></button>
  </div>
</nav></div></header>"""

FOOTER = """
<footer class="site-footer"><div class="container"><div class="footer-bottom" style="border:none;margin:0;padding:20px 0">
  <span>© <span id="year"></span> Stratos Environmental · Waste comparison broker</span>
  <span><a href="{prefix}index.html" style="color:#b9d3c2">Home</a> · <a href="{prefix}quote.html" style="color:#b9d3c2">Quote</a> · <a href="{prefix}upload-invoice.html" style="color:#b9d3c2">Upload invoice</a></span>
</div></div></footer>
<script src="{prefix}js/main.js?v=""" + V + """"></script>
</body></html>"""

RELATED = """
<h2>Related pages</h2>
<ul>{links}</ul>"""


def write_page(folder, slug, title, desc, eyebrow, h1, lead, body, quote_param="", related=None):
    prefix = "../" if folder else ""
    path = os.path.join(BASE, folder, slug + ".html") if folder else os.path.join(BASE, slug + ".html")
    canonical = f"{folder}/{slug}" if folder else slug
    quote_url = f"{prefix}quote.html{quote_param}"
    rel_html = ""
    if related:
        links = "".join(f'<li><a href="{prefix}{r[0]}">{r[1]}</a></li>' for r in related)
        rel_html = RELATED.format(links=links)
    html = HEADER.format(title=title, desc=desc, canonical=canonical, prefix=prefix)
    html += f"""
<section class="page-hero"><div class="container">
  <span class="eyebrow">{eyebrow}</span>
  <h1>{h1}</h1>
  <p class="lead">{lead}</p>
  <div class="hero-cta">
    <a href="{quote_url}" class="btn btn-primary btn-lg">Get a Free Quote</a>
    <a href="{prefix}upload-invoice.html" class="btn btn-ghost btn-lg">Upload Your Invoice</a>
  </div>
</div></section>
<section class="landing-body"><div class="container">{body}{rel_html}</div></section>
<section class="landing-cta"><div class="container">
  <h2>Compare providers — save on your waste bill</h2>
  <p>Free, no-obligation comparison through our licensed partner network across London.</p>
  <a href="{quote_url}" class="btn btn-primary btn-lg">Get a Free Quote</a>
</div></section>"""
    html += FOOTER.format(prefix=prefix)
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w") as f:
        f.write(html)
    return f"https://stratosenvironmental.co.uk/{canonical}"


urls = []

# --- SERVICES ---
services = [
    ("commercial-waste-collection", "Commercial Waste Collection UK | Stratos Environmental",
     "Compare commercial waste collection providers for your business. Licensed partners, free quotes, better prices across London and the UK.",
     "Commercial waste comparison", "Commercial Waste Collection",
     "We compare commercial waste collection deals from licensed providers — find the best price and service for your business.",
     "<p>Stratos Environmental is a commercial waste broker. We compare quotes from multiple licensed collection partners so you get reliable service at a competitive price — without calling every supplier yourself.</p><h2>What's included</h2><ul><li>General and specialist waste streams</li><li>240L to 1100L bins and containers</li><li>Flexible collection frequencies</li><li>Duty of Care compliant documentation</li></ul><h2>How we help you save</h2><p>Upload your current invoice or tell us your requirements. We compare providers in our network and call you back with your best options — usually within minutes.</p>",
     "", [("services/general-waste.html", "General waste"), ("industries/restaurant-waste-collection.html", "Restaurant waste"), ("areas/commercial-waste-london.html", "London")]),
    ("general-waste", "General Waste Collection for Businesses | Stratos Environmental",
     "Compare general waste collection providers for UK businesses. Wheelie bins from 240L to 1100L through licensed partners.",
     "General waste", "General Waste Collection",
     "Compare general waste bin collection from licensed providers — reliable, compliant and competitively priced.",
     "<p>General waste is everyday non-recyclable business rubbish. We compare licensed providers to find you the right bin size, collection frequency and price.</p><h2>Bin sizes</h2><ul><li>240L (3–5 bags)</li><li>360L (5–7 bags)</li><li>660L (8–10 bags)</li><li>1100L (15–18 bags)</li></ul>",
     "?waste=General", [("services/commercial-waste-collection.html", "Commercial waste"), ("services/wheelie-bin-collection.html", "Wheelie bins")]),
    ("dry-mixed-recycling", "Dry Mixed Recycling Collection | Stratos Environmental",
     "Compare dry mixed recycling providers for businesses. Plastics, cans and packaging — save money vs general waste.",
     "Recycling", "Dry Mixed Recycling",
     "Compare dry mixed recycling collection — often cheaper than general waste and better for the environment.",
     "<p>Dry mixed recycling covers plastics, cans, packaging and other recyclables. We compare providers to find the best recycling deal for your business.</p><h2>Ideal for</h2><ul><li>Offices and retail</li><li>Restaurants (packaging)</li><li>Warehouses and distribution</li></ul>",
     "?waste=General%20Dry%20Recycling", [("services/commercial-recycling.html", "Commercial recycling"), ("industries/office-waste-collection.html", "Office waste")]),
    ("clinical-waste", "Clinical Waste Collection | Stratos Environmental",
     "Compare clinical and healthcare waste collection providers. Compliant collections for dental, care and medical settings.",
     "Clinical waste", "Clinical Waste Collection",
     "Compare compliant clinical waste collection through licensed healthcare waste partners.",
     "<p>Clinical waste requires specialist handling and documentation. We compare licensed providers for dental practices, care homes, clinics and other healthcare settings.</p><h2>Collections include</h2><ul><li>Clinical waste bags</li><li>240L to 1100L clinical bins</li><li>Sharps containers (via partners)</li></ul>",
     "?waste=Clinical", [("industries/dental-waste-collection.html", "Dental waste")]),
    ("confidential-waste", "Confidential Waste Collection | Stratos Environmental",
     "Compare confidential waste shredding and collection for businesses. Secure document disposal through licensed partners.",
     "Confidential waste", "Confidential Waste Collection",
     "Compare secure confidential waste and document shredding services for your business.",
     "<p>Confidential waste includes documents, records and data-bearing materials that must be destroyed securely. We compare licensed shredding and collection partners.</p><h2>Who needs this</h2><ul><li>Offices and professional services</li><li>Healthcare and dental</li><li>Retail with customer data</li></ul>",
     "", [("industries/office-waste-collection.html", "Office waste")]),
    ("hazardous-waste", "Hazardous Waste Collection | Stratos Environmental",
     "Compare hazardous waste collection for UK businesses. Licensed partners for compliant disposal.",
     "Hazardous waste", "Hazardous Waste Collection",
     "Compare hazardous waste collection and disposal through fully licensed specialist partners.",
     "<p>Hazardous waste requires specialist carriers and strict compliance. We compare licensed partners who can handle your specific waste types safely and legally.</p><p>Tell us what you need to dispose of and we'll find the right specialist provider.</p>",
     "", [("services/clinical-waste.html", "Clinical waste")]),
    ("wheelie-bin-collection", "Commercial Wheelie Bin Collection | Stratos Environmental",
     "Compare commercial wheelie bin collection for businesses. 240L to 1100L bins through licensed partners across London.",
     "Wheelie bins", "Wheelie Bin Collection",
     "Compare commercial wheelie bin collection — the right size, frequency and price for your business.",
     "<p>Wheelie bins are the most common commercial waste container. We compare providers for all standard sizes from 240L to 1100L.</p><h2>Choosing the right size</h2><p>Not sure? Tell us how many bags you produce per week and we'll recommend the right bin and collection schedule.</p>",
     "", [("services/general-waste.html", "General waste"), ("services/dry-mixed-recycling.html", "Recycling")]),
    ("skip-hire", "Commercial Skip Hire | Stratos Environmental",
     "Compare commercial skip hire for businesses. Builders' skips and roll-on roll-off through licensed partners.",
     "Skip hire", "Commercial Skip Hire",
     "Compare skip hire and container hire for construction, refurbishment and bulky waste.",
     "<p>Need a skip for a project or regular bulky waste? We compare licensed partners for builders' skips, FEL/REL containers and one-off collections.</p><h2>Common uses</h2><ul><li>Construction and refurbishment</li><li>Shop fit-outs</li><li>Clearances and bulky waste</li></ul>",
     "", [("services/commercial-waste-collection.html", "Commercial waste")]),
]

for s in services:
    urls.append(write_page("services", *s))

# Regenerate existing service pages with updated template
for slug, title, desc, eyebrow, h1, lead, body, qp, rel in [
    ("food-waste-collection", "Food Waste Collection for Businesses | Stratos Environmental",
     "Compare food waste collection providers for UK restaurants, cafés and catering. Licensed partners, hygienic collections.",
     "Food waste", "Food Waste Collection for Businesses",
     "Compare food waste collection deals from licensed providers — ideal for restaurants, cafés, catering and hospitality.",
     "<p>Food waste must be collected separately. We compare licensed partners for hygienic, reliable food waste collections.</p><h2>Ideal for</h2><ul><li>Restaurants and takeaways</li><li>Hotels and catering</li><li>Staff canteens</li></ul>",
     "?waste=Food%20Waste", [("industries/restaurant-waste-collection.html", "Restaurant waste")]),
    ("glass-recycling", "Glass Recycling for Businesses | Stratos Environmental",
     "Compare glass recycling collection for bars, pubs and restaurants. Licensed partners across London.",
     "Glass recycling", "Glass Recycling for Businesses",
     "Compare glass recycling providers for bars, pubs and restaurants — safe collection, competitive pricing.",
     "<p>Glass bottles and jars need dedicated collection. We compare licensed providers for your business.</p>",
     "?waste=Glass", [("industries/pub-waste-collection.html", "Pub waste")]),
    ("commercial-recycling", "Commercial Recycling Services | Stratos Environmental",
     "Compare commercial recycling providers for UK businesses. Dry mixed, cardboard and paper.",
     "Recycling", "Commercial Recycling for Businesses",
     "Compare dry mixed recycling and cardboard collection — better for the planet and your bottom line.",
     "<p>Recycling is often cheaper than general waste. We compare providers for all recycling streams.</p>",
     "?waste=General%20Dry%20Recycling", [("services/dry-mixed-recycling.html", "Dry mixed recycling")]),
]:
    urls.append(write_page("services", slug, title, desc, eyebrow, h1, lead, body, qp, rel))

# --- INDUSTRIES ---
industries = [
    ("restaurant-waste-collection", "Restaurant Waste Collection London | Stratos Environmental",
     "Compare restaurant waste collection providers in London. Food waste, glass, general waste and recycling.",
     "Restaurant waste", "Restaurant Waste Collection",
     "Compare waste collection deals for restaurants — food waste, glass, general waste and recycling through licensed partners.",
     "<p>Restaurants typically need multiple waste streams: food waste, glass, general waste and dry recycling. We compare providers to bundle everything at the best price.</p><h2>Common restaurant waste</h2><ul><li>Food waste (120L/240L)</li><li>Glass recycling</li><li>General waste</li><li>Cardboard and packaging</li></ul>",
     "", [("services/food-waste-collection.html", "Food waste"), ("areas/commercial-waste-london.html", "London")]),
    ("pub-waste-collection", "Pub Waste Collection London | Stratos Environmental",
     "Compare pub waste collection in London. Glass, general waste and recycling for bars and pubs.",
     "Pub waste", "Pub Waste Collection",
     "Compare waste collection for pubs and bars — glass recycling, general waste and more.",
     "<p>Pubs produce significant glass waste plus general rubbish. We compare licensed providers who understand hospitality collections.</p>",
     "", [("services/glass-recycling.html", "Glass recycling")]),
    ("cafe-waste-collection", "Café Waste Collection London | Stratos Environmental",
     "Compare café waste collection providers. Food waste, coffee grounds and general waste.",
     "Café waste", "Café Waste Collection",
     "Compare waste collection for cafés and coffee shops — food waste and general collections.",
     "<p>Cafés need food waste collections plus general waste and often cardboard recycling. We find you the best combined deal.</p>",
     "", [("industries/restaurant-waste-collection.html", "Restaurant waste")]),
    ("hotel-waste-collection", "Hotel Waste Collection London | Stratos Environmental",
     "Compare hotel waste collection providers. Multi-stream waste for hospitality businesses.",
     "Hotel waste", "Hotel Waste Collection",
     "Compare waste collection for hotels — general, recycling, food waste and glass through licensed partners.",
     "<p>Hotels often need multiple bin types across kitchen, bar, rooms and back-of-house. We compare providers for multi-site and high-volume collections.</p>",
     "", [("services/commercial-waste-collection.html", "Commercial waste")]),
    ("gym-waste-collection", "Gym Waste Collection London | Stratos Environmental",
     "Compare gym and leisure centre waste collection. General waste and recycling for fitness businesses.",
     "Gym waste", "Gym Waste Collection",
     "Compare waste collection for gyms, studios and leisure centres.",
     "<p>Gyms typically need general waste and dry mixed recycling. We compare providers for reliable, cost-effective collections.</p>",
     "", [("industries/office-waste-collection.html", "Office waste")]),
    ("office-waste-collection", "Office Waste Collection London | Stratos Environmental",
     "Compare office waste collection in London. Recycling, confidential waste and general collections.",
     "Office waste", "Office Waste Collection",
     "Compare office waste collection — recycling, confidential waste and general rubbish through licensed partners.",
     "<p>Offices benefit from dry mixed recycling (often cheaper than general waste) plus optional confidential waste shredding. We compare the best deals.</p>",
     "", [("services/confidential-waste.html", "Confidential waste"), ("services/dry-mixed-recycling.html", "Recycling")]),
    ("dental-waste-collection", "Dental Waste Collection London | Stratos Environmental",
     "Compare dental waste and clinical waste collection. Compliant collections for dental practices.",
     "Dental waste", "Dental Waste Collection",
     "Compare clinical waste collection for dental practices — compliant, reliable, competitively priced.",
     "<p>Dental practices need compliant clinical waste collection. We compare licensed healthcare waste partners.</p>",
     "?waste=Clinical", [("services/clinical-waste.html", "Clinical waste")]),
    ("school-waste-collection", "School Waste Collection London | Stratos Environmental",
     "Compare school and nursery waste collection. General waste and recycling for education settings.",
     "School waste", "School Waste Collection",
     "Compare waste collection for schools, nurseries and education settings.",
     "<p>Schools need reliable, compliant waste collections during term time. We compare providers who serve education settings across London.</p>",
     "", [("services/general-waste.html", "General waste")]),
    ("retail-waste-collection", "Retail Waste Collection London | Stratos Environmental",
     "Compare retail waste collection. Cardboard, packaging and general waste for shops.",
     "Retail waste", "Retail Waste Collection",
     "Compare waste collection for retail shops — cardboard, packaging and general waste.",
     "<p>Retail businesses often produce large volumes of cardboard and packaging. We compare providers for recycling and general waste collections.</p>",
     "", [("services/dry-mixed-recycling.html", "Recycling")]),
    ("warehouse-waste-collection", "Warehouse Waste Collection London | Stratos Environmental",
     "Compare warehouse waste collection. High-volume general waste and recycling.",
     "Warehouse waste", "Warehouse Waste Collection",
     "Compare waste collection for warehouses and distribution centres — high volume, flexible schedules.",
     "<p>Warehouses need larger bins and flexible collection schedules. We compare providers for 660L, 1100L and FEL/REL containers.</p>",
     "", [("services/skip-hire.html", "Skip hire")]),
]

for i in industries:
    urls.append(write_page("industries", *i))

# --- LONDON AREAS ---
areas = [
    ("commercial-waste-london", "Commercial Waste Collection London | Stratos Environmental",
     "Compare commercial waste providers in London. Free quotes from licensed collection partners.",
     "London", "Commercial Waste Collection London",
     "We help London businesses compare commercial waste providers and find a better deal.",
     "<p>Stratos Environmental is a London-based commercial waste broker. We compare quotes from licensed partners across every borough.</p><h2>Industries we serve</h2><ul><li>Restaurants, pubs and cafés</li><li>Offices and retail</li><li>Hotels and hospitality</li><li>Healthcare and dental</li></ul>",
     "", [("industries/restaurant-waste-collection.html", "Restaurant waste"), ("services/commercial-waste-collection.html", "Services")]),
    ("commercial-waste-wandsworth", "Commercial Waste Wandsworth | Stratos Environmental",
     "Compare commercial waste providers in Wandsworth SW18. Free quotes for local businesses.",
     "Wandsworth · SW18", "Commercial Waste Collection Wandsworth",
     "Compare trusted commercial waste providers for Wandsworth businesses.",
     "<p>Businesses in Wandsworth can save by comparing waste providers through Stratos Environmental. We cover SW18 and surrounding areas.</p>",
     "", [("areas/commercial-waste-london.html", "London")]),
    ("commercial-waste-putney", "Commercial Waste Putney | Stratos Environmental",
     "Compare commercial waste in Putney SW15. Restaurants, offices and retail.",
     "Putney · SW15", "Commercial Waste Collection Putney",
     "Find a better commercial waste deal in Putney SW15.",
     "<p>Putney businesses — from riverside restaurants to high street shops — can compare providers and save on waste costs.</p>",
     "", [("areas/commercial-waste-wandsworth.html", "Wandsworth")]),
    ("commercial-waste-battersea", "Commercial Waste Battersea | Stratos Environmental",
     "Compare commercial waste in Battersea SW11 and Nine Elms.",
     "Battersea · SW11", "Commercial Waste Collection Battersea",
     "Compare commercial waste deals for Battersea and Nine Elms businesses.",
     "<p>Battersea and Nine Elms are growing fast. We compare providers for new offices, restaurants and developments.</p>",
     "", [("areas/commercial-waste-london.html", "London")]),
    ("commercial-waste-clapham", "Commercial Waste Clapham | Stratos Environmental",
     "Compare commercial waste in Clapham SW4 and SW11. Pubs, restaurants and offices.",
     "Clapham · SW4", "Commercial Waste Collection Clapham",
     "Compare waste providers for Clapham businesses — pubs, restaurants and offices.",
     "<p>Clapham's busy high street and hospitality scene means lots of food waste, glass and general collections. We compare the best local deals.</p>",
     "", [("industries/pub-waste-collection.html", "Pub waste")]),
    ("commercial-waste-chelsea", "Commercial Waste Chelsea | Stratos Environmental",
     "Compare commercial waste in Chelsea SW3. Retail, restaurants and offices.",
     "Chelsea · SW3", "Commercial Waste Collection Chelsea",
     "Compare commercial waste providers for Chelsea businesses.",
     "<p>Chelsea businesses including retail, restaurants and professional offices can compare providers for better waste prices.</p>",
     "", [("areas/commercial-waste-london.html", "London")]),
    ("commercial-waste-fulham", "Commercial Waste Fulham | Stratos Environmental",
     "Compare commercial waste in Fulham SW6. Local business waste comparison.",
     "Fulham · SW6", "Commercial Waste Collection Fulham",
     "Compare waste collection deals for Fulham businesses.",
     "<p>Fulham pubs, restaurants and shops can save by comparing waste providers through our licensed partner network.</p>",
     "", [("areas/commercial-waste-chelsea.html", "Chelsea")]),
    ("commercial-waste-richmond", "Commercial Waste Richmond | Stratos Environmental",
     "Compare commercial waste in Richmond TW9 and TW10.",
     "Richmond · TW9", "Commercial Waste Collection Richmond",
     "Compare commercial waste providers for Richmond businesses.",
     "<p>Richmond businesses benefit from comparing multiple waste providers. We cover TW9, TW10 and surrounding areas.</p>",
     "", [("areas/commercial-waste-london.html", "London")]),
    ("commercial-waste-wimbledon", "Commercial Waste Wimbledon | Stratos Environmental",
     "Compare commercial waste in Wimbledon SW19. Shops, offices and hospitality.",
     "Wimbledon · SW19", "Commercial Waste Collection Wimbledon",
     "Compare waste collection for Wimbledon businesses.",
     "<p>Wimbledon town centre and surrounding business parks — we compare providers for reliable, cost-effective collections.</p>",
     "", [("areas/commercial-waste-wandsworth.html", "Wandsworth")]),
    ("commercial-waste-westminster", "Commercial Waste Westminster | Stratos Environmental",
     "Compare commercial waste in Westminster SW1. Offices, hotels and hospitality.",
     "Westminster · SW1", "Commercial Waste Collection Westminster",
     "Compare commercial waste for Westminster businesses — offices, hotels and retail.",
     "<p>Westminster's mix of offices, hotels and hospitality needs reliable multi-stream waste collections. We compare the best providers.</p>",
     "", [("industries/hotel-waste-collection.html", "Hotel waste")]),
    ("commercial-waste-camden", "Commercial Waste Camden | Stratos Environmental",
     "Compare commercial waste in Camden NW1. Restaurants, retail and offices.",
     "Camden · NW1", "Commercial Waste Collection Camden",
     "Compare waste providers for Camden businesses.",
     "<p>Camden's vibrant food and retail scene produces food waste, glass and general rubbish. We find you the best combined deal.</p>",
     "", [("industries/restaurant-waste-collection.html", "Restaurant waste")]),
]

for a in areas:
    urls.append(write_page("areas", *a))

# --- BLOG ---
blogs = [
    ("commercial-waste-collection-cost", "How Much Does Commercial Waste Collection Cost? | Stratos Environmental",
     "Guide to commercial waste collection costs in the UK. What affects price and how to save money by comparing providers.",
     "Waste costs guide", "How Much Does Commercial Waste Collection Cost?",
     "A practical guide to what UK businesses pay for waste collection — and how to get a better deal.",
     "<p>Commercial waste costs depend on waste type, bin size, collection frequency and location. London businesses typically pay £15–£40 per collection for a standard wheelie bin, but prices vary widely.</p><h2>What affects your price</h2><ul><li>Bin size (240L vs 1100L)</li><li>How often bins are emptied</li><li>Waste type (recycling is often cheaper)</li><li>Number of waste streams</li><li>Contract length</li></ul><h2>How to save money</h2><p>Compare multiple providers — or upload your current invoice to Stratos Environmental and we'll try to beat your price through our partner network.</p>",
     "", [("upload-invoice.html", "Upload your invoice"), ("quote.html", "Get a quote")]),
    ("how-to-switch-waste-providers", "How to Switch Waste Providers | Stratos Environmental",
     "Step-by-step guide to switching commercial waste providers in the UK. Contracts, notice periods and avoiding penalties.",
     "Switching guide", "How to Switch Commercial Waste Providers",
     "Everything you need to know about switching waste suppliers — without getting caught by contract traps.",
     "<p>Many businesses overpay because switching feels complicated. Here's how to do it smoothly.</p><h2>Steps to switch</h2><ol><li>Check your current contract end date and notice period</li><li>Get comparison quotes (we can do this for you)</li><li>Give notice to your current supplier</li><li>Arrange bin delivery and first collection with your new provider</li></ol><h2>We can help</h2><p>Stratos Environmental compares providers and handles the setup through our licensed partner network. Upload your invoice or request a free quote.</p>",
     "", [("quote.html", "Get a quote")]),
    ("wheelie-bin-size-guide", "What Size Wheelie Bin Do I Need? | Stratos Environmental",
     "Guide to commercial wheelie bin sizes: 240L, 360L, 660L and 1100L. Choose the right bin for your business.",
     "Bin size guide", "What Size Wheelie Bin Do I Need?",
     "240L, 360L, 660L or 1100L? A simple guide to choosing the right commercial wheelie bin.",
     "<p>Choosing the wrong bin size means paying for collections you don't need — or overflowing bins between pickups.</p><h2>Quick guide</h2><ul><li><strong>240L</strong> — Small cafés, offices (3–5 bags)</li><li><strong>360L</strong> — Medium offices, small restaurants (5–7 bags)</li><li><strong>660L</strong> — Busy restaurants, retail (8–10 bags)</li><li><strong>1100L</strong> — High volume sites (15–18 bags)</li></ul><p>Not sure? Tell us your business type and we'll recommend the right size when you <a href=\"../quote.html\">request a quote</a>.</p>",
     "", [("services/wheelie-bin-collection.html", "Wheelie bin collection")]),
    ("restaurant-waste-regulations", "Commercial Waste Regulations for Restaurants | Stratos Environmental",
     "Waste regulations UK restaurants must follow. Food waste, Duty of Care and licensed carriers explained.",
     "Regulations", "Waste Regulations for Restaurants",
     "What UK restaurants must know about waste law — food waste separation, Duty of Care and licensed carriers.",
     "<p>UK restaurants must use licensed waste carriers and keep waste transfer notes. Since 2023, many businesses must separate food waste from general waste.</p><h2>Key requirements</h2><ul><li>Use a registered waste carrier</li><li>Keep Duty of Care documentation for 2 years</li><li>Separate food waste where required</li><li>Store waste safely before collection</li></ul><p>All collections arranged through Stratos Environmental use licensed, compliant partners.</p>",
     "", [("industries/restaurant-waste-collection.html", "Restaurant waste")]),
    ("best-waste-company-london", "How to Find the Best Waste Company in London | Stratos Environmental",
     "Tips for finding the best commercial waste company in London. Compare prices, service and compliance.",
     "London guide", "How to Find the Best Waste Company in London",
     "Don't just pick the first supplier — here's how to find the best waste deal in London.",
     "<p>London has dozens of waste collectors. Prices and service quality vary enormously. The best approach is to compare multiple quotes rather than accepting a renewal from your current supplier.</p><h2>What to compare</h2><ul><li>Price per collection and any rental charges</li><li>Collection reliability and flexibility</li><li>Bin sizes and waste streams offered</li><li>Contract length and exit terms</li><li>Customer service and response times</li></ul><p>Stratos Environmental does this comparison for you — free and with no obligation.</p>",
     "", [("areas/commercial-waste-london.html", "London waste")]),
]

for b in blogs:
    urls.append(write_page("blog", *b))

# Write sitemap
sitemap_urls = [
    "https://stratosenvironmental.co.uk/",
    "https://stratosenvironmental.co.uk/quote",
    "https://stratosenvironmental.co.uk/upload-invoice",
] + urls

with open(os.path.join(BASE, "sitemap.xml"), "w") as f:
    f.write('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n')
    for u in sitemap_urls:
        pri = "1.0" if u.endswith(".co.uk/") else ("0.9" if "quote" in u or "upload" in u else "0.8")
        f.write(f"  <url><loc>{u}</loc><changefreq>monthly</changefreq><priority>{pri}</priority></url>\n")
    f.write("</urlset>\n")

print(f"Generated {len(urls)} pages + sitemap ({len(sitemap_urls)} URLs total)")
