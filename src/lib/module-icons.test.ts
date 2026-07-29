import assert from 'node:assert/strict';
import test from 'node:test';
import {
  MessageCircle,
  Mic2,
  NotebookPen,
  UsersRound,
} from 'lucide-react';
import { modulesData } from '../data/modulesData';

test('module data stores semantic icon keys instead of emoji', () => {
  assert.deepEqual(
    modulesData.map((module) => module.iconKey),
    ['one-on-one', 'workshop', 'small-class', 'keynote'],
  );
});

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
