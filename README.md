# Foundation for CDG Syndrome and Autism — website

Next.js 15 (App Router) + styled-components, bilingual (`/ge`, `/en`). Structure mirrors the SIDA project.

```bash
npm install
npm run dev     # http://localhost:3000 → redirects to /ge
npm run build
```

- Texts: `src/dictionary/ge.json`, `src/dictionary/en.json` (same keys in both)
- Links / contacts / bank details: `src/config/site.ts` — empty values are hidden or shown as "coming soon"
- Colors: `src/theme.ts` (logo green + Facebook cover cream/sage)
- Logos: `public/assets/logo/` (extracted from the brand-book PDF)

Pages: home, `/cdg`, `/autism`, `/rare-diseases`, `/about`, `/events`, `/beneficiary`, `/donate`, `/contact`.
