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
