const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3001';

export interface AdminAppointment {
  id: string;
  created_at: string;
  updated_at: string;
  appointment_date: string;
  client_name: string;
  client_email: string;
  service: string | null;
  contact_platform: string;
  contact_detail: string;
  message: string | null;
  status: 'pending' | 'confirmed' | 'cancelled';
  cancellation_reason: string | null;
  is_paid: boolean;
}

async function parseError(response: Response, fallback: string): Promise<string> {
  const body = await response.json().catch(() => ({}));
  return typeof body?.error === 'string' ? body.error : fallback;
}

export async function adminLogin(username: string, password: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/admin/login`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  if (!response.ok) {
    throw new Error(await parseError(response, '登入失敗，請稍後再試。'));
  }
}

export async function adminLogout(): Promise<void> {
  await fetch(`${API_BASE_URL}/api/admin/logout`, {
    method: 'POST',
    credentials: 'include',
  });
}

export async function fetchAdminSession(): Promise<boolean> {
  const response = await fetch(`${API_BASE_URL}/api/admin/session`, {
    credentials: 'include',
  });
  if (!response.ok) return false;
  const body = await response.json().catch(() => ({ authenticated: false }));
  return Boolean(body.authenticated);
}

export async function fetchAdminAppointments(): Promise<AdminAppointment[]> {
  const response = await fetch(`${API_BASE_URL}/api/admin/appointments`, {
    credentials: 'include',
  });
  if (response.status === 401) {
    throw new Error('UNAUTHORIZED');
  }
  if (!response.ok) {
    throw new Error(await parseError(response, '無法載入預約資料，請稍後再試。'));
  }
  return response.json();
}

export async function updateAppointmentStatus(
  id: string,
  status: AdminAppointment['status'],
  reason?: string
): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/admin/appointments/${id}`, {
    method: 'PATCH',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status, reason }),
  });
  if (!response.ok) {
    throw new Error(await parseError(response, '更新狀態失敗，請稍後再試。'));
  }
}

export async function updateAppointmentPaid(id: string, isPaid: boolean): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/admin/appointments/${id}/paid`, {
    method: 'PATCH',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ isPaid }),
  });
  if (!response.ok) {
    throw new Error(await parseError(response, '更新付款狀態失敗，請稍後再試。'));
  }
}

export async function updateAppointmentsStatusBatch(
  ids: string[],
  status: AdminAppointment['status'],
  reason?: string
): Promise<number> {
  const response = await fetch(`${API_BASE_URL}/api/admin/appointments/batch`, {
    method: 'PATCH',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ids, status, reason }),
  });
  if (!response.ok) {
    throw new Error(await parseError(response, '批次更新失敗，請稍後再試。'));
  }
  const body = await response.json().catch(() => ({ updated: 0 }));
  return typeof body.updated === 'number' ? body.updated : 0;
}
