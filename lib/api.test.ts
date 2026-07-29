import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  createAppointment,
  getBookedSlots,
  getPosts,
  type CreateAppointmentPayload
} from './api'

const originalApiUrl = process.env.NEXT_PUBLIC_API_URL

function jsonResponse(body: unknown, init?: ResponseInit) {
  return new Response(JSON.stringify(body), {
    headers: { 'Content-Type': 'application/json' },
    ...init
  })
}

beforeEach(() => {
  process.env.NEXT_PUBLIC_API_URL = 'http://localhost:3001'
})

afterEach(() => {
  if (originalApiUrl === undefined) {
    delete process.env.NEXT_PUBLIC_API_URL
  } else {
    process.env.NEXT_PUBLIC_API_URL = originalApiUrl
  }

  vi.unstubAllGlobals()
})

describe('getPosts', () => {
  it('loads posts from the API', async () => {
    const posts = [
      {
        id: '1',
        title: 'A post',
        content: 'Post content',
        created_at: '2026-01-01'
      }
    ]
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse(posts))
    vi.stubGlobal('fetch', fetchMock)

    await expect(getPosts()).resolves.toEqual(posts)
    expect(fetchMock).toHaveBeenCalledWith('http://localhost:3001/api/posts')
  })

  it('throws when the API rejects the request', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(jsonResponse({}, { status: 500 }))
    )

    await expect(getPosts()).rejects.toThrow('failed to fetch posts')
  })

  it('throws a configuration error when the API URL is missing', async () => {
    delete process.env.NEXT_PUBLIC_API_URL
    const fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)

    await expect(getPosts()).rejects.toThrow(
      'NEXT_PUBLIC_API_URL is not configured'
    )
    expect(fetchMock).not.toHaveBeenCalled()
  })
})

describe('getBookedSlots', () => {
  it('loads slots for the encoded date', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(jsonResponse(['09:00', '10:00']))
    vi.stubGlobal('fetch', fetchMock)

    await expect(getBookedSlots('2026-08-01')).resolves.toEqual([
      '09:00',
      '10:00'
    ])
    expect(fetchMock).toHaveBeenCalledWith(
      'http://localhost:3001/api/appointments?date=2026-08-01'
    )
  })

  it('throws when slots cannot be loaded', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(jsonResponse({}, { status: 500 }))
    )

    await expect(getBookedSlots('2026-08-01')).rejects.toThrow(
      'failed to fetch booked slots'
    )
  })
})

describe('createAppointment', () => {
  const payload: CreateAppointmentPayload = {
    name: 'Jasmine',
    email: 'jasmine@example.com',
    contactPlatform: 'Line ID',
    contactDetail: 'jasmine_line',
    notes: '',
    appointmentDate: '2026-08-01',
    slot: '09:00'
  }

  it('posts the appointment as JSON', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(jsonResponse({ success: true }, { status: 201 }))
    vi.stubGlobal('fetch', fetchMock)

    await createAppointment(payload)

    expect(fetchMock).toHaveBeenCalledWith(
      'http://localhost:3001/api/appointments',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }
    )
  })

  it('reports a booking conflict', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(jsonResponse({}, { status: 409 }))
    )

    await expect(createAppointment(payload)).rejects.toThrow(
      'slot already booked'
    )
  })

  it('reports other booking failures', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(jsonResponse({}, { status: 500 }))
    )

    await expect(createAppointment(payload)).rejects.toThrow(
      'failed to create appointment'
    )
  })
})
