# Full-Site Life Design Lab Redesign

## Goal

Apply the visual system and interaction patterns from
`/Users/anthonysung/Downloads/生命設計實驗室-life-design-lab` to the
existing Next.js web application while preserving its real content,
internationalization, Supabase-backed articles, booking availability, booking
submission, service detail pages, and local assets.

The existing `messages/zh-TW.json` and `messages/en.json` copy is authoritative.
Template copy must not replace or rewrite the current brand content.

## Source Boundaries

The downloaded Vite application is a visual and interaction reference only.
Reuse its layout concepts:

- sticky product-style navigation
- prominent hero typography and feature badges
- yellow left-to-right testimonial hover fill
- depth-based four-card service carousel
- compact labels, cards, and footer treatments

Do not migrate:

- Vite or Gemini dependencies
- Metrics CRUD or dashboard state
- fake login, Co-Editing, local status, or activity controls
- fake booking modals
- hard-coded Chinese-only content
- external Unsplash people or service images
- emoji used as decorative icons
- unused source components that are not part of the rendered reference page

## Brand System

Use only the approved brand colors and transparent derivatives:

- Sapphire Sky: `#196BDE`
- White: `#FFFFFF`
- Deep Space Blue: `#023047`
- Royal Gold: `#FFDF65`

Royal Gold is the primary action, selected-state, and hover-fill color. Deep
Space Blue is the main text, icon, and dark-surface color. Sapphire Sky is the
link, focus-ring, and secondary-interaction color. White is the principal page
background. Borders, shadows, and subtle surfaces derive from these colors by
opacity rather than introducing Slate or Amber as brand colors.

Use the existing paper-plane SVG in the navigation brand. Use Lucide React for
every decorative and interactive icon. Remove emoji from button labels,
status messages, service icons, and decorative copy; pair the original text
with Lucide icons instead.

## Homepage Architecture

Refactor the monolithic homepage into focused client components while retaining
the existing API calls and page-level data flow:

1. **Navbar**
   - sticky translucent header
   - paper-plane brand logo and current site name
   - anchor links to the existing sections
   - locale switcher for `zh-TW` and `en`
   - desktop navigation and a Lucide `Menu`/`X` mobile menu
   - real booking CTA that scrolls to `#booking`

2. **Hero**
   - preserve the current introduction heading, body, and highlighted copy
   - use the downloaded design's large type, restrained gradient accent, and
     three feature badges
   - source all user-facing text from the existing locale messages

3. **Testimonials**
   - preserve the real Shawn and Wu testimonial content
   - use the downloaded design's responsive card layout and Royal Gold
     left-to-right hover fill
   - do not import the two additional invented testimonials or remote portraits

4. **Services**
   - preserve the existing service IDs:
     `one-on-one`, `workshop`, `small-group`, and `lecture`
   - preserve existing local images and translated service content
   - present the services in the downloaded design's depth carousel
   - use Lucide `MessageCircle`, `Presentation`, `UsersRound`, and `Mic2`
   - support previous/next buttons, keyboard arrow navigation, direct card
     selection, and touch swipe
   - link "view details" to the existing localized service detail route
   - scroll "book now" to the real inline booking form

5. **Articles**
   - preserve `getPosts()` and the existing loading, empty, and post states
   - restyle article cards with the approved design system

6. **Booking**
   - preserve `getBookedSlots()` and `createAppointment()`
   - preserve date, time-slot, contact, validation, conflict, and submission
     behavior
   - restyle the inline form rather than replacing it with a modal
   - remove emoji from translated status and CTA strings
   - render success, conflict, and error feedback with Lucide icons and text so
     meaning does not depend on color alone

7. **About and Footer**
   - preserve Min's local portrait, biography, credentials, Instagram link, and
     existing footer copy
   - apply the new card, badge, and footer language without inventing links or
     policies

## Service Detail Pages

Restyle every localized service detail page with the same brand tokens,
navigation language, typography, cards, tables, CTA treatment, and Lucide
icons. Preserve all current translated descriptions, structures,
deliverables, prices, service images, route IDs, and booking anchor behavior.

## Responsive and Accessibility Behavior

- Use a single-column flow on small screens and the downloaded design's wider
  product-style composition on desktop.
- Keep interactive targets at least 44 CSS pixels where practical.
- Provide visible Sapphire Sky focus rings and meaningful accessible labels.
- Preserve semantic headings, form labels, button types, and alt text.
- Pause or simplify depth and hover effects for `prefers-reduced-motion`.
- Keep the active carousel card readable without hover and prevent side cards
  from blocking the active card on narrow screens.

## Data and Error Flow

The redesign must not change server contracts. Continue consuming:

- `getPosts(): Promise<Post[]>`
- `getBookedSlots(date: string): Promise<string[]>`
- `createAppointment(input): Promise<void>`

Loading, empty, success, conflict, and generic failure states remain explicit
in both locales. A visual failure must never remove a booking record, modify
Supabase data, or silently fall back to template data.

## Verification

- Existing API unit tests remain green.
- ESLint and the production build pass.
- Both `/zh-TW` and `/en` render without hydration or console errors.
- Desktop and mobile layouts are visually inspected.
- Navigation anchors, locale switching, carousel buttons, arrow keys, touch
  behavior, service detail links, and booking interactions are exercised.
- The browser metadata continues to reference the existing SVG favicon.
- No fake template feature, emoji icon, or non-Lucide icon remains in the
  redesigned interface.
