# Portfolio Template

A bold, modern, dark-themed portfolio starter inspired by Jesse Ermens' site, built with:

- **Next.js 15** (App Router) + **TypeScript**
- **Tailwind CSS** for styling
- **Framer Motion** for scroll-triggered animations and micro-interactions
- **Lenis** for smooth inertia scrolling
- **React Three Fiber / @react-three/drei** wired into deps for any 3D extensions you add later
- **lucide-react** for icons

Sections, in order:

1. Hero / Navigation (sticky header + burger menu)
2. Services (3-column "what I do")
3. Value props ("Stay one step ahead")
4. Selected work (hover-tilt project cards with "View live")
5. Expertise (tools grid + stats)
6. FAQ accordion
7. Footer / Contact

## Quick start

```bash
cd portfolio-template
npm install      # or pnpm install / yarn
npm run dev
```

Open http://localhost:3000.

## Folder structure

```
portfolio-template/
├── package.json
├── tsconfig.json
├── next.config.ts
├── tailwind.config.ts
├── postcss.config.mjs
├── public/                    # add /avatar.jpg, /resume.pdf, /og.png here
└── src/
    ├── app/
    │   ├── layout.tsx         # fonts, metadata, smooth scroll, nav
    │   ├── page.tsx           # composes the sections
    │   └── globals.css        # tailwind + design tokens + utilities
    ├── components/
    │   ├── SmoothScroll.tsx   # Lenis wrapper
    │   ├── Navigation.tsx     # sticky header + mobile burger menu
    │   ├── Hero.tsx           # parallax hero w/ reveal lines
    │   ├── Services.tsx       # 3-column services row
    │   ├── ValueProps.tsx     # "stay one step ahead"
    │   ├── Projects.tsx       # case-study grid wrapper
    │   ├── Expertise.tsx      # tools + stats
    │   ├── FAQ.tsx            # animated accordion
    │   ├── Footer.tsx         # contact + sitewide footer
    │   └── ui/
    │       ├── RevealText.tsx     # word-by-word mask reveal
    │       ├── MagneticButton.tsx # spring-following CTA
    │       └── ProjectCard.tsx    # 3D-tilt + glow hover card
    ├── data/
    │   ├── services.ts        # services list
    │   ├── projects.ts        # projects + cover images
    │   ├── expertise.ts       # tools + stats
    │   └── faq.ts             # FAQ Q&A
    └── lib/
        └── utils.ts           # `cn` class-merge helper
```

## Design tokens

Tweak in `tailwind.config.ts`:

- `colors.ink.*` — base dark palette (`ink-950` is the page background)
- `colors.accent.*` — accent / hover color (electric purple by default; swap for any vibrant hue)
- `fontFamily.display` — large headlines (Space Grotesk by default)
- `fontFamily.sans` — body copy (Inter)

The gradient text effect is in `globals.css` under `.gradient-text` — re-tune the stops to match your brand.

## Animation primitives

- `<RevealText />` — word-by-word reveal triggered on scroll. Drop in for any heading.
- `<MagneticButton />` — CTA that softly follows the cursor. `variant="primary" | "ghost"`.
- `<ProjectCard />` — 3D tilt + radial cursor glow + "View live" pill.

All animations honor `prefers-reduced-motion` via `useReducedMotion` where it matters.

---

# Next Steps — make it yours

### 1. Brand & identity
- [ ] Replace `YourName` / `YOURNAME` everywhere (search project for it). Hot spots: `Navigation.tsx` logo `Y`, `Footer.tsx` giant wordmark, `layout.tsx` metadata.
- [ ] In `tailwind.config.ts`, set `colors.accent.DEFAULT` to your signature color and re-balance the gradient stops in `globals.css → .gradient-text`.
- [ ] Swap fonts in `app/layout.tsx` if Space Grotesk + Inter isn't your vibe (any `next/font/google` family works).

### 2. Hero copy
- [ ] Edit the three headline lines in `components/Hero.tsx` (look for `<RevealLine>`).
- [ ] Update the supporting paragraph and the "Available for new projects" badge.
- [ ] The two CTA buttons jump to `#work` and `#contact` — repoint as needed.

### 3. Add your photo / avatar
- [ ] Drop a square photo at `public/avatar.jpg`.
- [ ] In `Hero.tsx` (or wherever you want it), use `<Image src="/avatar.jpg" alt="..." width={...} height={...} />` from `next/image`.
- [ ] Tip: a circular avatar in the nav looks great — replace the `Y` placeholder in `Navigation.tsx` with `<Image src="/avatar.jpg" ... className="rounded-full" />`.

### 4. Resume / CV
- [ ] Drop your file at `public/resume.pdf`.
- [ ] In `Footer.tsx`, add a link in the `SOCIALS` array: `{ label: "Resume", href: "/resume.pdf" }`.

### 5. Projects
- [ ] Edit `src/data/projects.ts`. Each project takes:
  - `slug`, `title`, `client`, `year`
  - `tags` (any of `Design | Development | Motion | Branding | 3D` — extend the union if you need more)
  - `cover` (recommend 1600×1100 webp/jpg in `public/projects/`, then `cover: "/projects/atelier-nova.jpg"`)
  - `liveUrl` (optional — when set, the "View live" pill appears)
  - `accent` (Tailwind gradient classes used as a colored overlay; pick anything from the palette)
- [ ] For real case-study pages, create `src/app/work/[slug]/page.tsx` and link to it from the card.

### 6. Services
- [ ] Edit `src/data/services.ts`. Three is the magic number visually — if you go to four, change `md:grid-cols-3` to `md:grid-cols-4` in `Services.tsx`.

### 7. Expertise / tools
- [ ] Edit `src/data/expertise.ts`. The `ToolGlyph` component currently shows the first letter of each tool — swap it for actual SVG logos by:
  1. Drop SVGs in `public/logos/figma.svg`, etc.
  2. Replace `ToolGlyph` in `Expertise.tsx` with `<Image src={`/logos/${tool.name.toLowerCase()}.svg`} ... />`.
- [ ] Update `STATS` numbers (projects shipped, years, etc.).

### 8. FAQ
- [ ] Edit `src/data/faq.ts`. Order matters — the first item is open by default. Change the default in `FAQ.tsx` (`useState<number | null>(0)` → `null`) if you'd rather all be closed.

### 9. Contact
- [ ] In `Footer.tsx`, replace `hello@example.com` with your real email and update the `SOCIALS` array URLs.
- [ ] If you want a contact form instead, `app/contact/page.tsx` is a great place — wire it to Resend, Formspree, or a Next.js Route Handler.

### 10. SEO & social previews
- [ ] In `app/layout.tsx`:
  - Set `metadataBase: new URL("https://yourdomain.com")`
  - Update title / description / keywords
  - Drop `public/og.png` (1200×630) and add it under `openGraph.images`
- [ ] Add `app/sitemap.ts` and `app/robots.ts` once your routes settle.

### 11. Deploy
- [ ] `vercel` (or push to GitHub and import on vercel.com). It's a stock Next 15 app — no config needed.
- [ ] Set the production domain, then come back and update `metadataBase`.

### 12. Optional polish
- [ ] **3D hover scene**: `@react-three/fiber` and `@react-three/drei` are already installed. Add a `<Canvas>` inside the Hero or a Project card with a subtle floating mesh.
- [ ] **Cursor follower**: a small custom cursor pairs nicely with the magnetic buttons.
- [ ] **Page transitions**: wrap the app with Framer Motion's `<AnimatePresence mode="wait">` if you add multi-page case studies.
- [ ] **Analytics**: drop in `@vercel/analytics` or Plausible — both one-line installs.

---

## Accessibility & performance notes

- All sections have semantic landmarks (`<section aria-label="…">`) and the nav is keyboard-operable with an explicit skip link.
- Reduced-motion users get muted text reveals automatically.
- Lenis is destroyed on unmount — no leaked rAF loops.
- Images use `next/image` with `sizes` set; replace remote Unsplash covers with self-hosted files for best LCP.
- Lighthouse target out of the box: 95+ across the board once you swap to optimized local assets.

Have fun. Ship it.

## Woke GPT harness

Local open-source model harness with estimated energy, electricity cost, and CO₂e: [`apps/woke-gpt`](apps/woke-gpt/README.md).
