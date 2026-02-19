# Logo for Aphamo Goat Aggregation

This folder is where the **navigation logo** is loaded from.

## Expected file

- `aphamo-logo.png` – main logo used in the top navigation

The HTML in `index.html` references:

```html
<img src="images/logo/aphamo-logo.png"
     alt="Aphamo Goat Aggregation logo"
     class="logo__img">
```

If `aphamo-logo.png` is missing, the image will simply be hidden (the site will still work, but only the text logo will show).

## How to add the logo

1. Export your logo from your design tool (or download it from the Aphamo Boerdery Facebook page or other brand source).
2. Save it into this folder as **`aphamo-logo.png`**.
   - Recommended size: around 200–400px wide (the CSS will scale it down to about 40px high in the nav).
   - Use a transparent PNG if possible so it works on light and dark backgrounds.
3. Refresh the site – the logo will appear automatically in the nav bar.

You can change the filename and update the `src` in `index.html` if you prefer a different naming convention.

