# REVAKALP Website Brand Suite

Based on the original transparent REVAKALP gold wordmark supplied by the owner. Its distinctive crossing thread stroke and the wording **WEAVING LIFE INTO TIME** are retained.

## Recommended usage

- **Dark navigation / hero:** `logos/svg/revakalp-header-gold.svg` (no tagline, better at small sizes)
- **Full logo / dark footer / landing page:** `logos/svg/revakalp-primary-gold.svg`
- **Light background:** `logos/svg/revakalp-primary-burgundy.svg`
- **Single-colour light-on-dark:** `logos/svg/revakalp-primary-ivory.svg`
- **Favicon:** `icons/favicon.ico`
- **Mobile shortcut:** `icons/apple-touch-icon.png`
- **Social preview:** `social/revakalp-open-graph-1200x630.png`
- **App icons:** `icons/android-chrome-*.png`

SVGs are vector traces of the user's original small raster logo. They do not depend on fonts. They are sharper and scale better than the reference, but tracing does not recover all original design control points; a manual vector redraw would be needed for perfect print-master Bézier geometry.

## Integration

Put the files in your React/Vite `public/` folder, for example `public/branding/`. Then use:

```jsx
<img src="/branding/logos/svg/revakalp-header-gold.svg" alt="REVAKALP" className="h-12 w-auto" />
```

In `index.html`:

```html
<link rel="icon" type="image/x-icon" href="/branding/icons/favicon.ico" />
<link rel="apple-touch-icon" href="/branding/icons/apple-touch-icon.png" />
<meta property="og:image" content="https://YOUR-DOMAIN/branding/social/revakalp-open-graph-1200x630.png" />
```

Customize color variables with `developer/brand-tokens.css`. Preserve the logo's aspect ratio and quiet space; do not add decorative marks to the master logo.
