# Decoupled Icon System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace every application emoji icon with a type-safe Lucide icon while keeping React and icon-library components out of content data.

**Architecture:** `ModuleItem` stores a semantic `ModuleIconKey`. A presentation-layer registry maps each key to a Lucide component, and UI components resolve the key at render time. Third-party brand icons use Font Awesome Brands only when one is actually rendered.

**Tech Stack:** React 19, TypeScript 5.8, Lucide React, Node test runner, Vite 6

## Global Constraints

- Content data must not import React, Lucide, or Font Awesome.
- Module data stores `iconKey`, never a rendered component.
- General interface icons use Lucide.
- Third-party social and product brand icons use Font Awesome Brands.
- The supplied Life Design Lab paper-plane SVG remains unchanged.
- Do not add unused Font Awesome dependencies while the UI has no brand icons.

---

### Task 1: Replace Emoji Data with Semantic Icon Keys

**Files:**
- Modify: `src/types.ts:1-13`
- Modify: `src/data/modulesData.ts:3-76`
- Create: `src/lib/module-icons.test.ts`

**Interfaces:**
- Produces: `ModuleIconKey = 'one-on-one' | 'workshop' | 'small-class' | 'keynote'`
- Produces: `ModuleItem.iconKey: ModuleIconKey`

- [ ] **Step 1: Write the failing semantic-key test**

Create `src/lib/module-icons.test.ts`:

```ts
import assert from 'node:assert/strict';
import test from 'node:test';
import { modulesData } from '../data/modulesData';

test('module data stores semantic icon keys instead of emoji', () => {
  assert.deepEqual(
    modulesData.map((module) => module.iconKey),
    ['one-on-one', 'workshop', 'small-class', 'keynote'],
  );
});
```

- [ ] **Step 2: Run the test and verify RED**

Run:

```bash
node --import tsx --test src/lib/module-icons.test.ts
```

Expected: FAIL because every current module returns `undefined` for
`module.iconKey`.

- [ ] **Step 3: Add the icon-key type and migrate module data**

Update `src/types.ts`:

```ts
export type ModuleIconKey =
  | 'one-on-one'
  | 'workshop'
  | 'small-class'
  | 'keynote';

export interface ModuleItem {
  id: string;
  iconKey: ModuleIconKey;
  title: string;
  subtitle: string;
  target: string;
  description: string;
  imageUrl: string;
  badge: string;
  format: string;
  duration: string;
  features: string[];
}
```

Replace the four `icon` values in `src/data/modulesData.ts`:

```ts
iconKey: 'one-on-one',
iconKey: 'workshop',
iconKey: 'small-class',
iconKey: 'keynote',
```

- [ ] **Step 4: Run the test and verify GREEN**

Run:

```bash
node --import tsx --test src/lib/module-icons.test.ts
```

Expected: PASS.

---

### Task 2: Add the Lucide Registry and Update Consumers

**Files:**
- Create: `src/lib/module-icons.ts`
- Modify: `src/lib/module-icons.test.ts`
- Modify: `src/components/Module3DCarousel.tsx:140-180`
- Modify: `src/components/ModuleDetailModal.tsx:1-55`

**Interfaces:**
- Consumes: `ModuleIconKey`, `ModuleItem.iconKey`
- Produces: `MODULE_ICON_MAP: Record<ModuleIconKey, LucideIcon>`

- [ ] **Step 1: Add the failing registry assertions**

Append to `src/lib/module-icons.test.ts`:

```ts
import {
  MessageCircle,
  Mic2,
  NotebookPen,
  UsersRound,
} from 'lucide-react';

test('the registry resolves each semantic key to its Lucide icon', async () => {
  let registry: {
    MODULE_ICON_MAP?: Record<string, unknown>;
  } = {};

  try {
    registry = await import('./module-icons');
  } catch {
    // The first run proves the registry does not exist yet.
  }

  assert.equal(registry.MODULE_ICON_MAP?.['one-on-one'], MessageCircle);
  assert.equal(registry.MODULE_ICON_MAP?.workshop, NotebookPen);
  assert.equal(registry.MODULE_ICON_MAP?.['small-class'], UsersRound);
  assert.equal(registry.MODULE_ICON_MAP?.keynote, Mic2);
});
```

- [ ] **Step 2: Run the test and verify RED**

Run:

```bash
node --import tsx --test src/lib/module-icons.test.ts
```

Expected: the semantic-key test passes and the registry test fails because
`MODULE_ICON_MAP` is undefined.

- [ ] **Step 3: Implement the presentation-layer registry**

Create `src/lib/module-icons.ts`:

```ts
import {
  MessageCircle,
  Mic2,
  NotebookPen,
  UsersRound,
  type LucideIcon,
} from 'lucide-react';
import type { ModuleIconKey } from '../types';

export const MODULE_ICON_MAP: Record<ModuleIconKey, LucideIcon> = {
  'one-on-one': MessageCircle,
  workshop: NotebookPen,
  'small-class': UsersRound,
  keynote: Mic2,
};
```

- [ ] **Step 4: Render registry icons in both module views**

In `Module3DCarousel`, resolve `item.iconKey` inside the module map:

```tsx
const ModuleIcon = MODULE_ICON_MAP[item.iconKey];
```

Replace `<span>{item.icon}</span>` with:

```tsx
<ModuleIcon aria-hidden="true" className="w-3.5 h-3.5" />
```

In `ModuleDetailModal`, resolve the icon after the null guard:

```tsx
const ModuleIcon = MODULE_ICON_MAP[module.iconKey];
```

Replace the title emoji with:

```tsx
<ModuleIcon aria-hidden="true" className="w-5 h-5" />
```

Import Lucide `Target` and replace the inline target emoji:

```tsx
<p className="mb-4 flex items-start gap-1.5 rounded-xl border border-amber-200/80 bg-amber-50 p-3 text-xs font-semibold text-amber-900">
  <Target aria-hidden="true" className="mt-0.5 w-4 h-4 shrink-0" />
  <span>適合對象：{module.target}</span>
</p>
```

- [ ] **Step 5: Run tests and static verification**

Run:

```bash
node --import tsx --test src/lib/module-icons.test.ts
npm run lint
npm run build
rg -n '[\x{1F000}-\x{1FAFF}\x{2600}-\x{27BF}]' src
git diff --check
```

Expected:

- both icon tests pass;
- TypeScript and Vite production build pass;
- emoji scan returns no application emoji icon literals;
- no whitespace errors.

- [ ] **Step 6: Commit the implementation**

```bash
git add src/types.ts src/data/modulesData.ts \
  src/lib/module-icons.ts src/lib/module-icons.test.ts \
  src/components/Module3DCarousel.tsx \
  src/components/ModuleDetailModal.tsx
git commit -m "refactor: replace emoji icon system"
```
