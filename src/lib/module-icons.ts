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
