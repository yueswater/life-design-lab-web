# Favicon Replacement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the browser favicon with the supplied Life Design Lab SVG.

**Architecture:** Use the Next.js App Router `app/icon.svg` file convention and remove the obsolete ICO favicon. No page component or manual metadata changes are required.

**Tech Stack:** Next.js 16 App Router, SVG, npm scripts

## Global Constraints

- Use `/Users/anthonysung/Downloads/logo.svg` without changing its bytes.
- Replace only the favicon; do not change the header or other images.
- Preserve all existing uncommitted shadcn changes.

---

### Task 1: Replace the favicon asset

**Files:**
- Create: `app/icon.svg`
- Delete: `app/favicon.ico`

**Interfaces:**
- Consumes: `/Users/anthonysung/Downloads/logo.svg`
- Produces: Next.js-generated SVG favicon metadata and `/icon.svg`

- [x] **Step 1: Install the SVG favicon**

Copy `/Users/anthonysung/Downloads/logo.svg` byte-for-byte to `app/icon.svg`.

- [x] **Step 2: Remove the obsolete favicon**

Delete `app/favicon.ico` so the application exposes a single favicon source.

- [x] **Step 3: Verify asset integrity**

Run:

```bash
cmp /Users/anthonysung/Downloads/logo.svg app/icon.svg
test ! -e app/favicon.ico
```

Expected: both commands exit successfully with no output.

- [x] **Step 4: Verify the application**

Run:

```bash
npm run lint
npm test
npm run build
```

Expected: all commands exit successfully.

- [x] **Step 5: Verify generated favicon metadata**

Inspect the built HTML metadata and confirm it contains an icon link whose
URL points to `/icon.svg`.

- [x] **Step 6: Commit only favicon-scoped files**

```bash
git add app/icon.svg app/favicon.ico \
  docs/superpowers/plans/2026-07-29-favicon-replacement.md
git commit -m "feat: replace site favicon"
```
