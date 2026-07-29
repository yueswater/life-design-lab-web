export function wrapIndex(index: number, total: number) {
  return ((index % total) + total) % total
}

export function getCarouselOffset(
  index: number,
  current: number,
  total: number
) {
  const rawOffset = wrapIndex(index - current, total)
  return rawOffset > total / 2 ? rawOffset - total : rawOffset
}

export function getSwipeDirection(
  startX: number,
  endX: number,
  threshold = 48
): -1 | 0 | 1 {
  const distance = endX - startX

  if (Math.abs(distance) < threshold) {
    return 0
  }

  return distance < 0 ? 1 : -1
}
