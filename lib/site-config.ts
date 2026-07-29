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

export function isServiceId(value: string): value is ServiceId {
  return SERVICE_IDS.some((serviceId) => serviceId === value)
}
