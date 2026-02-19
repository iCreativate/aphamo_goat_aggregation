# Aphamo Goat Aggregation

**South Africa's Premier Goat Aggregation & Learning Hub – Buy, Sell, Connect, Master Goat Farming.**

This repository contains the website concept, design system, and static foundation for the Aphamo Goat Aggregation platform.

## Contents

- **CONCEPT.md** – Full website concept: sitemap, page descriptions, layout suggestions, color palette, fonts, visual style guide, unique selling points, and technical notes.
- **index.html** – Homepage with hero, stats, featured listings, breed spotlights, training teaser, testimonials, blog teaser, and CTAs.
- **styles/** – Design system and components:
  - `variables.css` – Design tokens (colors, typography, spacing, radii).
  - `base.css` – Reset, body, typography, container.
  - `components.css` – Buttons, cards, stats strip, grids.
  - `header-footer.css` – Header, nav, footer, WhatsApp float.
  - `home.css` – Homepage-specific sections.
  - `main.css` – Imports (including Google Fonts: Poppins, Inter).

## Design

- **Theme:** Professional, approachable, earthy (savanna oranges, veld greens, terracotta, cream, gold accents).
- **Fonts:** Poppins (headings), Inter (body).
- **Layout:** Mobile-first, responsive, fast-loading.

## Run locally

Serve the project with any static server. Examples:

```bash
# Python
python3 -m http.server 8000

# Node (npx)
npx serve .

# PHP
php -S localhost:8000
```

Then open `http://localhost:8000` in your browser.

## Next steps

1. Replace placeholder images with real SA goat/farm photography.
2. Add Listings, Breeds, Training, The Hub, Sell, About, Blog, Contact pages.
3. Implement backend (listings, user accounts, courses, payments).
4. Add WhatsApp number to the float link (`href="https://wa.me/27XXXXXXXXX"`).
5. Ensure POPIA compliance and SSL on production.

---

*Concept and design for Aphamo Goat Aggregation – targeting South African goat farmers, breeders, and buyers across all major breeds and provinces.*
