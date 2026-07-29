import { describe, expect, it } from 'vitest'
import { isServiceId } from './site-config.ts'

describe('isServiceId', () => {
  it('accepts every service route exposed by the site', () => {
    expect(isServiceId('one-on-one')).toBe(true)
    expect(isServiceId('workshop')).toBe(true)
    expect(isServiceId('small-group')).toBe(true)
    expect(isServiceId('lecture')).toBe(true)
  })

  it('rejects template-only and unknown service routes', () => {
    expect(isServiceId('small-class')).toBe(false)
    expect(isServiceId('keynote')).toBe(false)
    expect(isServiceId('unknown')).toBe(false)
  })
})
