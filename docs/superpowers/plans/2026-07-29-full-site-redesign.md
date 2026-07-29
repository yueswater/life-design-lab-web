# Full-Site Life Design Lab Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Apply the downloaded product-style design to the existing bilingual Next.js site while preserving all real content, API behavior, routes, and local assets.

**Architecture:** Keep `app/[locale]/page.tsx` as the client-side data and state coordinator, but move visual sections into focused `components/site/*` components. Keep server contracts unchanged, isolate carousel calculations in a tested pure module, use the four approved brand tokens globally, and restyle the existing service detail route with the same component language.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Tailwind CSS 4, next-intl, Lucide React, shadcn UI primitives, Vitest

## Global Constraints

- Existing `messages/zh-TW.json` and `messages/en.json` copy is authoritative.
- Preserve `getPosts`, `getBookedSlots`, and `createAppointment` behavior.
- Preserve service IDs `one-on-one`, `workshop`, `small-group`, and `lecture`.
- Preserve local service images, Min's portrait, and the paper-plane SVG.
- Use only `#196BDE`, `#FFFFFF`, `#023047`, `#FFDF65`, and transparent derivatives as brand colors.
- Use Lucide React for every decorative and interactive icon.
- Do not migrate Vite, Gemini, Motion, Metrics, login, Co-Editing, fake booking modals, remote people images, fake testimonials, or emoji icons.
- Preserve all unrelated user changes in the working tree.

---

### Task 1: Establish the verified shadcn baseline

**Files:**
- Modify: `app/globals.css`
- Modify: `package.json`
- Modify: `package-lock.json`
- Create: `components.json`
- Create: `components/ui/*.tsx`
- Create: `hooks/use-mobile.ts`
- Create: `lib/utils.ts`

**Interfaces:**
- Consumes: existing uncommitted shadcn 4.16.0 installation
- Produces: stable UI primitives and Lucide dependency for the redesign

- [ ] **Step 1: Verify the generated component baseline**

Run:

```bash
test "$(rg --files components/ui | wc -l | tr -d ' ')" -eq 60
npm run lint
npm test
npm run build
```

Expected: 60 component files, 8 passing tests, clean lint, successful build.

- [ ] **Step 2: Confirm generated compatibility fixes are present**

Check that `components/ui/carousel.tsx` defers its first Embla state sync and
that `hooks/use-mobile.ts` uses `useSyncExternalStore`.

```bash
rg -n "requestAnimationFrame|useSyncExternalStore" \
  components/ui/carousel.tsx hooks/use-mobile.ts
```

Expected: both compatibility patterns are present.

- [ ] **Step 3: Commit the isolated baseline**

```bash
git add app/globals.css package.json package-lock.json components.json \
  components hooks/use-mobile.ts lib/utils.ts
git commit -m "chore: add shadcn component library"
```

### Task 2: Define brand tokens and preserve-copy translation keys

**Files:**
- Modify: `app/globals.css`
- Modify: `messages/zh-TW.json`
- Modify: `messages/en.json`
- Create: `lib/site-config.ts`
- Test: `lib/site-config.test.ts`

**Interfaces:**
- Produces:
  - `SITE_COLORS`
  - `SERVICE_IDS`
  - `SERVICE_ICON_MAP`
  - `ServiceId`
  - translated accessibility and carousel labels

- [ ] **Step 1: Write the failing site configuration test**

Create `lib/site-config.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import {
  SERVICE_ICON_MAP,
  SERVICE_IDS,
  SITE_COLORS
} from './site-config.ts'

describe('site configuration', () => {
  it('uses the approved brand palette', () => {
    expect(SITE_COLORS).toEqual({
      sapphireSky: '#196BDE',
      white: '#FFFFFF',
      deepSpaceBlue: '#023047',
      royalGold: '#FFDF65'
    })
  })

  it('maps every real service to a Lucide component', () => {
    expect(SERVICE_IDS).toEqual([
      'one-on-one',
      'workshop',
      'small-group',
      'lecture'
    ])
    expect(Object.keys(SERVICE_ICON_MAP)).toEqual(SERVICE_IDS)
    expect(
      Object.values(SERVICE_ICON_MAP).every(
        (Icon) => typeof Icon === 'object' || typeof Icon === 'function'
      )
    ).toBe(true)
  })
})
```

- [ ] **Step 2: Run the test to verify it fails**

Run:

```bash
npx vitest run lib/site-config.test.ts
```

Expected: FAIL because `lib/site-config.ts` does not exist.

- [ ] **Step 3: Implement the shared site configuration**

Create `lib/site-config.ts`:

```ts
import {
  MessageCircle,
  Mic2,
  Presentation,
  UsersRound,
  type LucideIcon
} from 'lucide-react'

export const SITE_COLORS = {
  sapphireSky: '#196BDE',
  white: '#FFFFFF',
  deepSpaceBlue: '#023047',
  royalGold: '#FFDF65'
} as const

export const SERVICE_IDS = [
  'one-on-one',
  'workshop',
  'small-group',
  'lecture'
] as const

export type ServiceId = (typeof SERVICE_IDS)[number]

export const SERVICE_ICON_MAP: Record<ServiceId, LucideIcon> = {
  'one-on-one': MessageCircle,
  workshop: Presentation,
  'small-group': UsersRound,
  lecture: Mic2
}
```

- [ ] **Step 4: Replace global brand tokens**

Update `app/globals.css` so shadcn/Tailwind tokens derive from:

```css
:root {
  --background: #ffffff;
  --foreground: #023047;
  --primary: #ffdf65;
  --primary-foreground: #023047;
  --secondary: color-mix(in srgb, #196bde 12%, #ffffff);
  --secondary-foreground: #023047;
  --accent: #196bde;
  --accent-foreground: #ffffff;
  --border: color-mix(in srgb, #023047 16%, #ffffff);
  --ring: #196bde;
}
```

Add reusable utilities for perspective, card depth, focus visibility, section
scroll margin, and reduced-motion behavior. Do not introduce new brand hex
values.

- [ ] **Step 5: Extend translations using original copy**

Add only structural/accessibility keys required by the new components:

```json
{
  "nav": {
    "openMenu": "開啟選單",
    "closeMenu": "關閉選單",
    "switchLanguage": "切換語言"
  },
  "intro": {
    "features": [
      "專屬生命設計流程",
      "設計思考方法",
      "啟動自己喜歡的人生"
    ]
  },
  "services": {
    "previous": "上一個服務",
    "next": "下一個服務",
    "counter": "服務 {current} / {total}"
  }
}
```

Add equivalent English keys using wording already present in `intro.body` and
`intro.highlight`. Remove only decorative emoji/symbol prefixes from booking,
about, and service-detail strings while retaining their words.

- [ ] **Step 6: Verify translations and configuration**

Run:

```bash
npx vitest run lib/site-config.test.ts
npm run lint
```

Expected: configuration tests and lint pass.

- [ ] **Step 7: Commit brand foundations**

```bash
git add app/globals.css messages/zh-TW.json messages/en.json \
  lib/site-config.ts lib/site-config.test.ts
git commit -m "feat: add Life Design Lab brand system"
```

### Task 3: Build tested carousel behavior

**Files:**
- Create: `lib/service-carousel.ts`
- Create: `lib/service-carousel.test.ts`

**Interfaces:**
- Produces:
  - `wrapIndex(index: number, total: number): number`
  - `getCarouselOffset(index: number, current: number, total: number): number`
  - `getSwipeDirection(startX: number, endX: number, threshold?: number): -1 | 0 | 1`

- [ ] **Step 1: Write failing carousel behavior tests**

Create `lib/service-carousel.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import {
  getCarouselOffset,
  getSwipeDirection,
  wrapIndex
} from './service-carousel.ts'

describe('service carousel', () => {
  it('wraps indices across both ends', () => {
    expect(wrapIndex(-1, 4)).toBe(3)
    expect(wrapIndex(4, 4)).toBe(0)
    expect(wrapIndex(5, 4)).toBe(1)
  })

  it('uses the shortest cyclic card offset', () => {
    expect(getCarouselOffset(3, 0, 4)).toBe(-1)
    expect(getCarouselOffset(1, 0, 4)).toBe(1)
    expect(getCarouselOffset(2, 0, 4)).toBe(2)
  })

  it('recognizes swipe direction after the threshold', () => {
    expect(getSwipeDirection(200, 120)).toBe(1)
    expect(getSwipeDirection(120, 200)).toBe(-1)
    expect(getSwipeDirection(120, 140)).toBe(0)
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

Run:

```bash
npx vitest run lib/service-carousel.test.ts
```

Expected: FAIL because the implementation module does not exist.

- [ ] **Step 3: Implement the pure carousel helpers**

Create `lib/service-carousel.ts`:

```ts
export function wrapIndex(index: number, total: number) {
  return ((index % total) + total) % total
}

export function getCarouselOffset(
  index: number,
  current: number,
  total: number
) {
  const raw = wrapIndex(index - current, total)
  return raw > total / 2 ? raw - total : raw
}

export function getSwipeDirection(
  startX: number,
  endX: number,
  threshold = 48
): -1 | 0 | 1 {
  const distance = endX - startX
  if (Math.abs(distance) < threshold) return 0
  return distance < 0 ? 1 : -1
}
```

- [ ] **Step 4: Run focused and full tests**

Run:

```bash
npx vitest run lib/service-carousel.test.ts
npm test
```

Expected: 11 total tests pass.

- [ ] **Step 5: Commit carousel behavior**

```bash
git add lib/service-carousel.ts lib/service-carousel.test.ts
git commit -m "feat: add service carousel behavior"
```

### Task 4: Build the site shell and top content sections

**Files:**
- Create: `components/site/site-header.tsx`
- Create: `components/site/section-heading.tsx`
- Create: `components/site/hero-section.tsx`
- Create: `components/site/testimonials-section.tsx`

**Interfaces:**
- `SiteHeader`: no data props; consumes `next-intl` and locale navigation
- `SectionHeading`: `{ eyebrow: string; title: string; centered?: boolean }`
- `HeroSection`: no props; consumes `intro` translations
- `TestimonialsSection`: no props; consumes `testimonials` translations

- [ ] **Step 1: Implement the reusable section heading**

Create `components/site/section-heading.tsx` with:

```tsx
import { Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

export function SectionHeading({
  eyebrow,
  title,
  centered = false
}: {
  eyebrow: string
  title: string
  centered?: boolean
}) {
  return (
    <div className={cn('space-y-3', centered && 'text-center')}>
      <span className="inline-flex items-center gap-2 rounded-full border border-brand-blue/20 bg-brand-blue/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-brand-navy">
        <Sparkles aria-hidden className="size-3.5" />
        {eyebrow}
      </span>
      <h2 className="text-3xl font-black tracking-tight text-brand-navy sm:text-4xl">
        {title}
      </h2>
    </div>
  )
}
```

- [ ] **Step 2: Implement the responsive site header**

Create `components/site/site-header.tsx` using `Image`, Lucide `Menu`, `X`,
`CalendarDays`, and `Languages`, plus `useLocale`, `useTranslations`, and the
localized navigation helpers. It must:

```tsx
const links = [
  ['#intro', t('intro')],
  ['#services', t('services')],
  ['#blog', t('blog')],
  ['#about', t('about')]
] as const
```

Render the paper-plane `/icon.svg`, the original `Life Design Lab` name,
desktop links, real booking CTA, locale toggle, and a state-controlled mobile
panel. Close the mobile panel after navigation.

- [ ] **Step 3: Implement the hero using existing copy**

Create `components/site/hero-section.tsx`. Use `t('headingPrimary')`,
`t('headingAccent')`, `t('body')`, `t.rich('highlight')`, and
`t.raw('features')`. Map the three feature strings to Lucide
`Compass`, `Layers3`, and `RefreshCw`; do not add template wording.

- [ ] **Step 4: Implement the real testimonial cards**

Create `components/site/testimonials-section.tsx` with exactly Shawn and Wu.
Each card uses `Quote`, a text-based identity badge, existing lead/quote/
attribution copy, and an absolutely positioned Royal Gold hover layer. Do not
use remote images or invented people.

- [ ] **Step 5: Verify shell components**

Run:

```bash
npm run lint
npm run build
```

Expected: both commands pass.

- [ ] **Step 6: Commit the shell**

```bash
git add components/site/site-header.tsx \
  components/site/section-heading.tsx \
  components/site/hero-section.tsx \
  components/site/testimonials-section.tsx
git commit -m "feat: add redesigned site shell"
```

### Task 5: Build the services, articles, about, and footer sections

**Files:**
- Create: `components/site/services-carousel.tsx`
- Create: `components/site/articles-section.tsx`
- Create: `components/site/about-section.tsx`
- Create: `components/site/site-footer.tsx`

**Interfaces:**
- `ServicesCarousel`: no data props; consumes service translations and config
- `ArticlesSection`: `{ posts: Post[]; loading: boolean }`
- `AboutSection`: no props; consumes translations
- `SiteFooter`: no props; consumes translations and current year

- [ ] **Step 1: Implement the depth services carousel**

Create `components/site/services-carousel.tsx` as a client component. Use:

```tsx
const [currentIndex, setCurrentIndex] = useState(0)
const touchStartX = useRef<number | null>(null)
const next = useCallback(
  () => setCurrentIndex((index) => wrapIndex(index + 1, SERVICE_IDS.length)),
  []
)
const previous = useCallback(
  () => setCurrentIndex((index) => wrapIndex(index - 1, SERVICE_IDS.length)),
  []
)
```

Use `getCarouselOffset` for active/left/right/back transforms. Use the local
`/services/${id}.jpg`, translated title/subtitle/description/tag, and
`SERVICE_ICON_MAP`. Render Lucide `ChevronLeft`, `ChevronRight`, `ArrowRight`,
`CalendarDays`, and `CheckCircle2`. Support keyboard events only while the
carousel section contains focus, and support touch start/end with
`getSwipeDirection`.

- [ ] **Step 2: Implement the real article section**

Create `components/site/articles-section.tsx`. Render loading with Lucide
`LoaderCircle`, empty with `FileText`, and posts with `BookOpen`. Preserve
`Post.title`, `Post.content`, and `Post.created_at`; do not fabricate excerpts
or links.

- [ ] **Step 3: Implement the About section**

Create `components/site/about-section.tsx` using the local
`/mindsay-avatar.png`, existing roles/name/bullets/quote/paragraphs/Instagram
copy, and Lucide `BadgeCheck`, `Quote`, `Instagram`, and `ExternalLink`.

- [ ] **Step 4: Implement the footer**

Create `components/site/site-footer.tsx` using `/icon.svg`, current copyright
copy, and no invented privacy, terms, login, or Co-Editing links.

- [ ] **Step 5: Verify content sections**

Run:

```bash
npm run lint
npm run build
```

Expected: both commands pass.

- [ ] **Step 6: Commit content sections**

```bash
git add components/site/services-carousel.tsx \
  components/site/articles-section.tsx \
  components/site/about-section.tsx \
  components/site/site-footer.tsx
git commit -m "feat: add redesigned content sections"
```

### Task 6: Preserve and redesign the booking flow

**Files:**
- Create: `components/site/booking-section.tsx`
- Modify: `app/[locale]/page.tsx`
- Test: `lib/api.test.ts`

**Interfaces:**
- `BookingSectionProps`:

```ts
type BookingFormData = {
  name: string
  email: string
  contactPlatform: string
  contactDetail: string
  notes: string
}

type BookingSectionProps = {
  selectedDate: Date
  selectedSlot: string
  bookedSlots: string[]
  formData: BookingFormData
  isSubmitting: boolean
  submitMessage: string
  onDateChange: (value: Date | null | [Date | null, Date | null]) => void
  onSlotChange: (slot: string) => void
  onFormDataChange: (value: BookingFormData) => void
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void
}
```

- [ ] **Step 1: Implement the booking presentation component**

Create `components/site/booking-section.tsx` with the existing `react-calendar`
control, time slots, form fields, and translated labels. Use Lucide
`CalendarDays`, `Clock3`, `ShieldCheck`, `MessagesSquare`, `Send`,
`CircleCheck`, `CircleAlert`, and `LoaderCircle`. Determine feedback icon from
the existing message state rather than embedding emoji in the message.

- [ ] **Step 2: Recompose the homepage**

Rewrite `app/[locale]/page.tsx` so it retains existing state, effects,
`fetchPosts`, `fetchBookedSlots`, `handleSubmitAppointment`, date formatting,
contact placeholders, and API payloads, but renders:

```tsx
<main>
  <SiteHeader />
  <HeroSection />
  <TestimonialsSection />
  <ServicesCarousel />
  <ArticlesSection posts={posts} loading={loadingPosts} />
  <BookingSection {...bookingProps} />
  <AboutSection />
  <SiteFooter />
</main>
```

Keep the current `slot already booked` branch and refresh booked slots after a
successful submission.

- [ ] **Step 3: Run API regression tests**

Run:

```bash
npm test
```

Expected: all API and carousel/config tests pass.

- [ ] **Step 4: Run static verification**

Run:

```bash
npm run lint
npm run build
```

Expected: lint, TypeScript, static generation, and `/icon.svg` route pass.

- [ ] **Step 5: Commit the homepage and booking flow**

```bash
git add components/site/booking-section.tsx 'app/[locale]/page.tsx'
git commit -m "feat: redesign homepage booking flow"
```

### Task 7: Redesign service detail pages

**Files:**
- Modify: `app/[locale]/services/[id]/page.tsx`

**Interfaces:**
- Consumes: `SERVICE_IDS`, `SERVICE_ICON_MAP`, existing `serviceDetail` data
- Produces: unchanged localized service routes with redesigned presentation

- [ ] **Step 1: Replace duplicated service constants**

Import `SERVICE_IDS`, `SERVICE_ICON_MAP`, and `ServiceId` from
`lib/site-config.ts`. Keep `isServiceId` as:

```ts
function isServiceId(value: string): value is ServiceId {
  return SERVICE_IDS.some((serviceId) => serviceId === value)
}
```

- [ ] **Step 2: Apply the shared visual system**

Rebuild the page using the approved palette, local hero image, Lucide
`ArrowLeft`, per-service icon, `Lightbulb`, `ListChecks`, `CheckCircle2`,
`BadgeDollarSign`, `CalendarDays`, and `ArrowRight`. Preserve every current
translation lookup, table row, deliverable, price, image, and booking link.
Replace the emoji notice and textual arrows with Lucide components.

- [ ] **Step 3: Preserve not-found behavior**

Restyle the invalid-ID state with `CircleAlert` and the existing translated
not-found strings. Keep `router.push('/')`.

- [ ] **Step 4: Verify all localized service routes**

Run:

```bash
npm run lint
npm run build
```

Expected: service detail route builds successfully for dynamic IDs.

- [ ] **Step 5: Commit detail-page redesign**

```bash
git add 'app/[locale]/services/[id]/page.tsx'
git commit -m "feat: redesign service detail pages"
```

### Task 8: Perform browser and repository verification

**Files:**
- Modify only if verification exposes a defect

**Interfaces:**
- Consumes: completed redesign
- Produces: verified bilingual, responsive, accessible application

- [ ] **Step 1: Run the full automated gate**

Run:

```bash
npm test
npm run lint
npm run build
git diff --check
```

Expected: all tests pass, lint and build succeed, no whitespace errors.

- [ ] **Step 2: Start the application**

Run:

```bash
make dev
```

Expected: Next.js reports a ready URL using its configured development port.

- [ ] **Step 3: Inspect both locales on desktop**

Use the in-app browser to inspect `/zh-TW` and `/en`. Confirm:

- paper-plane logo and sticky navigation
- preserved translated copy
- testimonial hover treatment
- carousel navigation and service links
- article loading/empty/data state
- booking form and status UI
- About and footer
- no console or hydration errors

- [ ] **Step 4: Inspect mobile behavior**

At a mobile viewport, verify the Lucide menu, locale switcher, single-column
sections, touch carousel, booking controls, and no horizontal overflow.

- [ ] **Step 5: Verify service routes and favicon**

Open one service detail route in each locale, follow the booking CTA, and
confirm generated HTML contains:

```html
<link rel="icon" href="/icon.svg?...">
```

- [ ] **Step 6: Scan forbidden template artifacts**

Run:

```bash
rg -n "Gemini|Co-Editing|Metrics|Unsplash|Try For Free|System Activity" \
  app components messages lib
rg -n "[🎉❌⚠️🌐💡💬📝🏫🎙️]" app components messages lib
```

Expected: no downloaded-template fake feature or decorative emoji remains.

- [ ] **Step 7: Commit verification fixes if needed**

If browser verification required fixes, stage only those files and commit:

```bash
git add -u -- app components messages lib
git commit -m "fix: polish responsive redesign"
```
