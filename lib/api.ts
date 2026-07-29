export type Post = {
  id: string
  title: string
  content: string
  created_at: string
}

export type CreateAppointmentPayload = {
  name: string
  email: string
  contactPlatform: string
  contactDetail: string
  notes: string
  appointmentDate: string
  slot: string
}

function getApiBase() {
  const apiBase = process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, '')

  if (!apiBase) {
    throw new Error('NEXT_PUBLIC_API_URL is not configured')
  }

  return apiBase
}

export async function getPosts(): Promise<Post[]> {
  const response = await fetch(`${getApiBase()}/api/posts`)

  if (!response.ok) {
    throw new Error('failed to fetch posts')
  }

  return response.json()
}

export async function getBookedSlots(date: string): Promise<string[]> {
  const response = await fetch(
    `${getApiBase()}/api/appointments?date=${encodeURIComponent(date)}`
  )

  if (!response.ok) {
    throw new Error('failed to fetch booked slots')
  }

  return response.json()
}

export async function createAppointment(
  payload: CreateAppointmentPayload
): Promise<void> {
  const response = await fetch(`${getApiBase()}/api/appointments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })

  if (response.status === 409) {
    throw new Error('slot already booked')
  }

  if (!response.ok) {
    throw new Error('failed to create appointment')
  }
}
