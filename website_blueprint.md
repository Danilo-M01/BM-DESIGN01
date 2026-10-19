# BM DESIGN01 — Website Blueprint

> Agency-grade creative direction document for AI-assisted website development.
> Version 1.0 · June 2026

---

## 1. Business

**Studio Name:** BM DESIGN01
**Founded:** 2024
**Location:** Global
**Core Offering:** Visual storytelling, photography, motion, and creative direction for lifestyle brands.
**Contact:** office@bmdesign01.com

**Mission Statement:**
Every brand has a story worth telling. We create photography, motion, and creative direction that help businesses express their identity with clarity, consistency, and purpose.

**Core Beliefs:**
- Luxury — experiences create perception
- Authenticity — the strongest brands are built on real stories
- Every detail matters
- Creativity — ideas become experiences
- Perspective — we see brands differently

---

## 2. Brand

**Brand Personality:**
- Confident but never arrogant
- Culturally aware and globally inspired
- Refined and intentional in every touchpoint
- Warm and approachable beneath a polished surface
- Storytelling-driven, never template-driven

**Emotional Goal:**
Every visitor should leave the website feeling like they've experienced something — not just browsed a portfolio. The site should communicate: *"This is a studio that understands what it means to build something lasting."*

**Voice & Tone:**
- Speak with clarity and conviction
- Never use filler language or buzzwords
- Sound like a creative director, not a marketer
- Use short, intentional sentences
- Let the work speak first, words second

**Brand Values:**
1. Deep Listening — understanding people, purpose, and potential
2. Strategic Thinking — insight-driven clarity and long-term impact
3. Lasting Partnership — growing, adapting, and evolving together

---

## 3. Audience

**Primary Audience:**
- Business owners and founders who value visual identity
- Personal brands seeking authority and recognition
- Hospitality, fashion, beauty, and lifestyle companies
- Marketing directors at mid-to-large companies

**Secondary Audience:**
- Creative professionals seeking collaboration
- Event organizers and destination brands
- Tech and wellness companies looking for creative elevation

**Audience Psychology:**
- They've worked with agencies before and were disappointed
- They want something that *feels* different
- They value quality over quantity
- They make decisions based on perception and trust
- They want a partner, not a vendor

---

## 4. Positioning

**Category:** Creative Studio / Visual Storytelling
**Positioning Statement:**
BM DESIGN01 exists at the intersection of travel, design, and authentic experiences. We don't manufacture moments — we capture them.

**Differentiators:**
- Global perspective shaped by 15+ countries
- Creative style selection (9 distinct visual languages)
- Outcome-focused collections, not deliverable menus
- Long-term creative partnerships
- Culture, travel, and human connection at the core

**Competitive Landscape (Inspiration, not competition):**
Apple · Awwwards · Locomotive · Minimal Gallery · Studio Freight · Active Theory · Dogstudio · Basic Agency · Cuberto · Bruno Simon · Odama Studio · Stink Studios

---

## 5. Goals

**Website Goals:**
- Build strong brand perception
- Create memorable visual identity
- Global positioning
- Develop long-term value
- Reach global audience
- Stand out through originality

**Conversion Goals:**
- Drive partnership inquiries through the contact form
- Guide visitors to Book Collections or Describe Their Project
- Communicate the breadth and quality of creative styles

**Metrics:**
- Form submissions per month
- Average session duration > 3 minutes
- Bounce rate < 35%
- Lighthouse score > 95

---

## 6. Website Personality

**Overall Feel:**
The website should feel like an invitation into a creative process. Not a menu of services — an experience.

**Personality Traits:**
- Cinematic and immersive
- Unhurried and confident
- Elegant with purpose
- Alive with subtle motion
- Feels expensive without saying "expensive"

**Design Philosophy:**
- Apple never says "Premium iPhone." They simply show it. This site should do the same.
- The website shouldn't feel like a menu of services — it should feel like an invitation into your creative process.
- Every section should answer: *"What will it feel like to work with this studio?"*

---

## 7. Emotional Direction

**User Emotion Journey:**

| Section | Emotion to Create |
|---------|-------------------|
| Hero Experience | Awe, aspiration, "I need to know more" |
| Selected Work | Trust, credibility, "They do incredible work" |
| Collections | Clarity, excitement, "I can see myself in this" |
| Creative Styles | Discovery, visual delight, "This is unique" |
| Industries | Confidence, "They understand my world" |
| Creative Partnerships | Security, "This is a real relationship" |
| Build Your Vision | Empowerment, "My project is special too" |
| Testimonials | Social proof, trust, "Others feel the same" |
| FAQ | Clarity, comfort, "No more questions" |
| Contact | Motivation, "Let's start" |

---

## 8. Visual Direction

**Color System:**
```
Primary Background:    #0B0B0B (deep black)
Secondary Background:  #111111 (warm dark)
Card Background:       #171717 (elevated dark)
Primary Text:          #F6F6F4 (warm white)
Secondary Text:        #A8A8A8 (muted grey)
Accent:                #D7D2C8 (warm stone)
Accent Dim:            rgba(215, 210, 200, 0.15)
Border:                rgba(215, 210, 200, 0.08)
Border Hover:          rgba(215, 210, 200, 0.2)
```

**Typography:**
- Display Font: Manrope (headings, navigation, brand name)
- Body Font: Inter (paragraphs, labels, form fields)
- Headline Weight: 800
- Body Weight: 300–400
- Letter Spacing: Tight for headlines (-0.03em), wide for labels (0.2–0.3em)

**Photography Direction:**
- Dark, cinematic mood with natural tones
- Filter: brightness(0.8) saturate(0.9) at rest, lift on hover
- Subject-focused with intentional negative space
- Inspired by fashion editorials and travel photography
- Never stock photography. Always custom or curated.

**Video Direction:**
- Cinematic aspect ratios (21:9 for hero, 16:9 for content)
- Subtle motion, never distracting
- Muted color palette matching the brand
- WebM format preferred

**Icon Rules:**
- All icons must be SVG
- Stroke-based, not filled
- 1.5–2px stroke width
- Match accent color (#D7D2C8)

---

## 9. Motion Direction

**Animation Libraries (Recommended):**
- GSAP animations
- Framer Motion
- Lenis smooth scrolling
- ScrollTrigger storytelling
- SplitType text reveal
- Motion One
- Three.js (when appropriate)
- React Three Fiber (3D scenes)
- CSS hardware accelerated animations
- WebGL interactions
- Lottie animations
- SVG path animations

**Motion Language:**
- Entrance: fade-up with 30px translate, 0.6s duration
- Text reveal: clip from bottom, 0.8s with ease-smooth
- Hover: subtle scale or translate, never more than 4px
- Transitions: ease-smooth cubic-bezier(0.16, 1, 0.3, 1)
- All animations at 60fps

**Scroll Behaviour:**

Selected behaviors for this project:
- [x] Sticky storytelling
- [x] Text reveal
- [x] Progressive reveal
- [x] Pinned sections
- [x] Infinite marquee
- [x] Mouse reactive elements
- [x] Magnetic buttons
- [ ] Horizontal scrolling
- [ ] Product follows scroll
- [ ] Scene transitions
- [ ] Layered parallax
- [ ] Object transformations
- [ ] Camera zoom
- [ ] Scroll controlled timeline
- [ ] Before / After interactions
- [ ] Scroll snapping
- [ ] Morphing elements
- [ ] Animated masks
- [ ] Video transitions
- [ ] Image sequence animation

**Cursor Behaviour:**
- Default cursor throughout
- Pointer on interactive elements
- Optional: custom cursor with magnetic effect on CTAs

**Loading Experience:**
- Branded loader with "BM DESIGN01" text fade-in
- Progress line animation
- Percentage counter (bottom-right)
- Smooth fade-out with translateY(-20px)
- Hero reveal sequence triggered on complete

---

## 10. Technical Direction

**Development Stack — Frontend:**
- [x] Next.js
- [x] React
- [x] Tailwind CSS
- [x] TypeScript
- [x] GSAP
- [x] Framer Motion
- [x] Lenis
- [x] React Three Fiber
- [x] Three.js
- [x] Motion One
- [x] Lottie
- [x] Shadcn/UI
- [x] Radix UI
- [x] Embla Carousel
- [x] Swiper
- [x] React Hook Form
- [x] Zod
- [x] TanStack Query

**Development Stack — Backend:**
- [x] Supabase
- [x] Prisma
- [x] PostgreSQL
- [x] Stripe
- [x] Resend
- [x] Cloudinary
- [x] Vercel

**Current Implementation:**
Static HTML/CSS/JS with vanilla approach. Framework migration is a future feature.

---

## 11. Content Strategy

**Site Structure (Dream Structure):**
1. Hero (Vision)
2. Selected Work
3. Collections
4. Creative Styles
5. Industries We Create For
6. Creative Partnerships
7. Build Your Own Project
8. Testimonials
9. FAQ
10. Contact

**Storytelling Flow:**
Hero → "Here's who we are" → "Here's what we've done" → "Here's what we offer" → "Here's our visual language" → "Here's who we serve" → "Here's how we partner" → "Here's your custom path" → "Here's what others say" → "Here's your questions answered" → "Here's how to start"

**Content Rules:**
- Don't sell "content." Sell Creative Systems.
- Don't sell "9 posts." Sell "One Month Content System."
- Collections are about goals, not deliverables.
- Remove the word "Premium" everywhere — if everything is premium, nothing is premium.
- Apple never says "Premium iPhone." The site should do the same.

---

## 12. Component Library

**Hero Experience:**
- Emotion to create: Awe, aspiration
- Visual focus: Full-bleed background image with dark gradient overlay
- Animation behavior: Line-by-line text reveal, staggered fade-up for sub-elements
- CTA placement: Bottom-left, two buttons inline
- Scroll transition: Stats bar at viewport bottom edge
- Exit animation: Natural scroll fade

**Section Header:**
- Label (uppercase, accented, with line prefix)
- Title (large display font, reveal-text animation)
- Optional description (body font, secondary color)

**Work Item:**
- Image with cover crop and hover zoom-out
- Gradient overlay with hover opacity change
- Info panel (category + name) revealed on hover
- Filterable by data-category attribute

**Collection Card:**
- Dark card with hover background shift
- Accent border-top on hover
- Title, goal line, description, includes list, CTA
- Flexible height with auto margin on CTA

**Style Card:**
- Visual block (gradient or image, 4:5 aspect ratio)
- Info panel below (name + description)
- Border with hover lift effect

**Industry Item:**
- Full-width row with hover background
- Name (display font) + arrow icon
- Arrow appears on hover with smooth transition

**FAQ Item:**
- Accordion with +/- icon toggle
- Max-height animation for answer panel
- Only one open at a time

**Testimonial Card:**
- Quote mark (decorative, 56px, low opacity)
- Text (display font, 300 weight)
- Author block (avatar initials, name, role)

**Contact Form:**
- 2-column grid for short fields
- Full-width textarea
- Premium dark inputs with accent focus border
- Submit button as btn-primary

---

## 13. Responsive Rules

**Breakpoints:**
- Desktop: > 1200px (full layout, 3-column grids)
- Tablet: 900px – 1200px (2-column grids, reduced padding)
- Mobile: < 900px (single column, hamburger nav, stacked layouts)
- Small mobile: < 600px (minimal padding, vertical footer)

**Rules:**
- Navigation collapses to hamburger at 900px
- Hero stats become single column at 900px
- Work editorial grid becomes single column at 900px
- Collection cards stack to 2 columns at 1200px, 1 column at 900px
- Style cards stack to 2 columns at 900px, 1 column at 600px
- Industries grid becomes single column at 1100px
- Contact layout stacks at 1200px
- Form rows become single column at 900px

---

## 14. Performance Rules

**Performance Budget:**
- First Contentful Paint: < 1.5s
- Largest Contentful Paint: < 2.5s
- Total Blocking Time: < 200ms
- Cumulative Layout Shift: < 0.1
- Lighthouse Performance: > 95

**Asset Rules:**
- All images must use WebP format
- All videos must use WebM format
- All icons must be inline SVG
- Lazy-load everything below the fold
- Use fetchpriority="high" for hero image
- content-visibility: auto on all images

**Code Standards:**
- Prefer CSS transforms over layout animations
- Use translate3d for GPU compositing
- Use will-change sparingly and only on animated properties
- Use requestAnimationFrame for scroll-driven logic
- Use passive event listeners for scroll/touch
- Use IntersectionObserver instead of scroll position checks

---

## 15. SEO Rules

**Structure:**
- Single H1 per page (hero headline)
- Proper heading hierarchy (H1 > H2 > H3 > H4)
- Semantic HTML5 elements (section, nav, footer, article)
- Unique, descriptive IDs on all interactive elements
- Alt text on every image

**Meta Tags:**
- Title: "BM DESIGN01 — Visual Storytelling & Lifestyle Brands"
- Description: "BM DESIGN01 creates photography, motion, and creative direction that help businesses express their identity with clarity, consistency, and purpose."
- Author: "BM DESIGN01"

**Technical SEO:**
- Fast page load (LCP < 2.5s)
- Mobile-friendly responsive design
- Proper canonical URLs
- Structured data (Organization schema)
- Sitemap.xml and robots.txt

---

## 16. AI Rules

**DO NOT:**
- Create generic sections
- Use template layouts
- Repeat card designs
- Overuse gradients
- Use stock photography
- Make anything look like a landing page template

**EVERY section must:**
- Have a clear purpose
- Answer: "What will it feel like to work with this studio?"
- Support the brand narrative

**EVERY animation must:**
- Improve storytelling
- Feel intentional, not decorative
- Run at 60fps
- Respect prefers-reduced-motion

**EVERY image must:**
- Support the narrative
- Use WebP format
- Have descriptive alt text
- Be lazy-loaded below the fold

**EVERY transition should:**
- Feel intentional
- Use the ease-smooth cubic-bezier
- Never exceed 0.8s duration for UI elements

**Design Rules:**
- Whitespace is part of the design
- Motion should feel premium, not distracting
- Always prioritize readability
- Every interaction should feel responsive
- Use asymmetry only when it improves composition
- Never say "Premium" — show it instead

**Typography Rules:**
- Headlines: Manrope, 800 weight, tight tracking
- Body: Inter, 300–400 weight, generous line-height
- Labels: 11px, 500–600 weight, 0.2–0.3em letter-spacing, uppercase

**Spacing System:**
- Section padding: 160px vertical
- Container max-width: 1400px
- Container padding: 60px horizontal (desktop), 40px (tablet), 20px (mobile)
- Card padding: 48px 40px
- Grid gaps: 20px (cards), 40px (editorial)
- Element spacing: 8px, 12px, 16px, 20px, 24px, 28px, 32px, 40px, 48px, 60px, 80px, 100px, 160px

**Grid System:**
- Max container: 1400px centered
- Desktop grids: 2-column (editorial), 3-column (cards, styles)
- Tablet grids: 2-column or stacked
- Mobile: single column

**Color Usage Rules:**
- Background always dark (#0B0B0B or #111111)
- Cards slightly elevated (#171717)
- Primary text warm white (#F6F6F4)
- Secondary text muted (#A8A8A8)
- Accent for labels, CTAs, interactive elements (#D7D2C8)
- Never use pure white (#FFFFFF) or pure black (#000000)
- Borders always semi-transparent accent

---

## 17. Future Features

**Phase 2:**
- Individual project case study pages
- Blog / Journal section
- Client portal
- Online booking system
- Multi-language support

**Phase 3:**
- E-commerce for digital products (presets, guides)
- 3D visual experiences (Three.js / R3F)
- Interactive creative style quiz
- Video backgrounds on hero
- Sound design (optional ambient audio)
- Dark/light mode toggle

**Phase 4:**
- CMS integration (Sanity or Contentful)
- Analytics dashboard
- A/B testing framework
- Performance monitoring
- Automated social media preview generation

---

*This document is the creative and technical foundation for every BM DESIGN01 web project. When filled and applied, it gives any developer or AI system the context needed to build a website that feels like it was created by a world-class creative studio.*
