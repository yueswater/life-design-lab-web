import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Loader2,
  AlertCircle,
  Check,
  X,
  RotateCcw,
  Search,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  Triangle,
  Download,
} from 'lucide-react';
import {
  AdminAppointment,
  exportAppointmentsCsv,
  fetchAdminAppointments,
  updateAppointmentPaid,
  updateAppointmentStatus,
  updateAppointmentsStatusBatch,
} from '../lib/admin-api';
import { Select } from '../components/common/Select';
import { DatePicker } from '../components/common/DatePicker';
import { Popover } from '../components/common/Popover';
import { modulesData } from '../data/modulesData';
import { toDateKey } from '../lib/appointment-slots';

// Booking stores service as `module.title[lang].split('|')[0].trim()` — same
// derivation here keeps the filter list in sync with the actual module set.
const SERVICE_OPTIONS = modulesData.map((m) => m.title.zh.split('|')[0].trim());

const STATUS_FILTER_OPTIONS: { value: AdminAppointment['status'] | 'all'; label: string }[] = [
  { value: 'all', label: '全部狀態' },
  { value: 'pending', label: '待確認' },
  { value: 'confirmed', label: '已確認' },
  { value: 'cancelled', label: '已取消' },
];

// Appointment's local (Asia/Taipei) calendar date, for date-filter comparison.
function toTaipeiDateKey(iso: string): string {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Taipei',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(new Date(iso));
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? '';
  return `${get('year')}-${get('month')}-${get('day')}`;
}

const STATUS_LABEL: Record<AdminAppointment['status'], string> = {
  pending: '待確認',
  confirmed: '已確認',
  cancelled: '已取消',
};

const STATUS_STYLE: Record<AdminAppointment['status'], string> = {
  pending: 'bg-amber-50 text-amber-700',
  confirmed: 'bg-emerald-50 text-emerald-700',
  cancelled: 'bg-slate-100 text-slate-500',
};

function formatDateTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString('zh-TW', {
    timeZone: 'Asia/Taipei',
    month: '2-digit',
    day: '2-digit',
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

// Booking submission time — shown to the second so admins can tell apart
// near-simultaneous bookings.
function formatDateTimeWithSeconds(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString('zh-TW', {
    timeZone: 'Asia/Taipei',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
}

export default function AdminPage() {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState<AdminAppointment[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [paidBusyId, setPaidBusyId] = useState<string | null>(null);
  const [batchBusy, setBatchBusy] = useState(false);
  const [exportBusy, setExportBusy] = useState(false);
  const [query, setQuery] = useState('');
  const [dateStart, setDateStart] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 3);
    return toDateKey(d);
  });
  const [dateEnd, setDateEnd] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 3);
    return toDateKey(d);
  });
  const [serviceFilter, setServiceFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState<AdminAppointment['status'] | 'all'>('all');
  const [sortKey, setSortKey] = useState<'appointment_date' | 'created_at'>('appointment_date');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(0);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [cancelIds, setCancelIds] = useState<string[] | null>(null);
  const [cancelReason, setCancelReason] = useState('');

  const load = () => {
    setError(null);
    fetchAdminAppointments()
      .then(setAppointments)
      .catch((err) => {
        if (err instanceof Error && err.message === 'UNAUTHORIZED') {
          navigate('/admin/login', { replace: true });
          return;
        }
        setError(err instanceof Error ? err.message : '無法載入預約資料，請稍後再試。');
      });
  };

  useEffect(load, [navigate]);

  const hasActiveFilters =
    !!query || !!dateStart || !!dateEnd || serviceFilter !== 'all' || statusFilter !== 'all';

  const filtered = useMemo(() => {
    if (!appointments) return null;
    const q = query.trim().toLowerCase();
    const rows = appointments.filter((a) => {
      if (q) {
        const matchesQuery = [a.client_name, a.client_email, a.contact_detail]
          .filter(Boolean)
          .some((field) => field.toLowerCase().includes(q));
        if (!matchesQuery) return false;
      }
      const dateKey = toTaipeiDateKey(a.appointment_date);
      if (dateStart && dateKey < dateStart) return false;
      if (dateEnd && dateKey > dateEnd) return false;
      if (serviceFilter !== 'all' && a.service !== serviceFilter) return false;
      if (statusFilter !== 'all' && a.status !== statusFilter) return false;
      return true;
    });

    const sorted = [...rows].sort((a, b) => {
      const diff = new Date(a[sortKey]).getTime() - new Date(b[sortKey]).getTime();
      return sortDir === 'asc' ? diff : -diff;
    });
    return sorted;
  }, [appointments, query, dateStart, dateEnd, serviceFilter, statusFilter, sortKey, sortDir]);

  // Reset to the first page whenever the result set or page size changes
  useEffect(() => {
    setPage(0);
  }, [query, dateStart, dateEnd, serviceFilter, statusFilter, sortKey, sortDir, pageSize, appointments]);

  const pageCount = filtered ? Math.max(1, Math.ceil(filtered.length / pageSize)) : 1;
  const paginated = useMemo(() => {
    if (!filtered) return null;
    const start = page * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page, pageSize]);

  const toggleSelected = (id: string, checked: boolean) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (checked) next.add(id);
      else next.delete(id);
      return next;
    });
  };

  const toggleSelectAll = (checked: boolean) => {
    if (!paginated) return;
    setSelectedIds((prev) => {
      const next = new Set(prev);
      for (const a of paginated) {
        if (checked) next.add(a.id);
        else next.delete(a.id);
      }
      return next;
    });
  };

  const applyResult = (ids: string[], status: AdminAppointment['status'], reason?: string) => {
    setAppointments((prev) =>
      prev
        ? prev.map((a) =>
            ids.includes(a.id)
              ? { ...a, status, cancellation_reason: reason ?? a.cancellation_reason }
              : a
          )
        : prev
    );
  };

  const applyStatus = async (id: string, status: AdminAppointment['status'], reason?: string) => {
    setBusyId(id);
    try {
      await updateAppointmentStatus(id, status, reason);
      applyResult([id], status, reason);
    } catch (err) {
      setError(err instanceof Error ? err.message : '更新狀態失敗，請稍後再試。');
    } finally {
      setBusyId(null);
    }
  };

  const applyStatusBatch = async (
    ids: string[],
    status: AdminAppointment['status'],
    reason?: string
  ) => {
    setBatchBusy(true);
    try {
      await updateAppointmentsStatusBatch(ids, status, reason);
      applyResult(ids, status, reason);
      setSelectedIds(new Set());
    } catch (err) {
      setError(err instanceof Error ? err.message : '批次更新失敗，請稍後再試。');
    } finally {
      setBatchBusy(false);
    }
  };

  const handleTogglePaid = async (id: string, isPaid: boolean) => {
    setPaidBusyId(id);
    try {
      await updateAppointmentPaid(id, isPaid);
      setAppointments((prev) =>
        prev ? prev.map((a) => (a.id === id ? { ...a, is_paid: isPaid } : a)) : prev
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : '更新付款狀態失敗，請稍後再試。');
    } finally {
      setPaidBusyId(null);
    }
  };

  const handleExport = async () => {
    if (!filtered) return;
    setExportBusy(true);
    try {
      const blob = await exportAppointmentsCsv(filtered.map((a) => a.id));
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `appointments-${toDateKey(new Date())}.csv`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : '匯出失敗，請稍後再試。');
    } finally {
      setExportBusy(false);
    }
  };

  const openCancelDialog = (ids: string[]) => {
    setCancelReason('');
    setCancelIds(ids);
  };

  const confirmCancel = async () => {
    if (!cancelIds || !cancelReason.trim()) return;
    const ids = cancelIds;
    setCancelIds(null);
    if (ids.length === 1) {
      await applyStatus(ids[0], 'cancelled', cancelReason.trim());
    } else {
      await applyStatusBatch(ids, 'cancelled', cancelReason.trim());
    }
  };

  const toggleSort = (key: 'appointment_date' | 'created_at', dir: 'asc' | 'desc') => {
    setSortKey(key);
    setSortDir(dir);
  };

  const SortableHeader = ({
    label,
    sortField,
  }: {
    label: string;
    sortField: 'appointment_date' | 'created_at';
  }) => (
    <div className="flex items-center gap-1.5">
      <span>{label}</span>
      <span className="flex flex-col gap-0.5">
        <button
          type="button"
          onClick={() => toggleSort(sortField, 'asc')}
          aria-label={`依${label}升冪排序`}
          className={`cursor-pointer transition-colors ${
            sortKey === sortField && sortDir === 'asc' ? 'text-[#023047]' : 'text-slate-300 hover:text-slate-400'
          }`}
        >
          <Triangle className="h-2 w-2 fill-current" />
        </button>
        <button
          type="button"
          onClick={() => toggleSort(sortField, 'desc')}
          aria-label={`依${label}降冪排序`}
          className={`cursor-pointer transition-colors ${
            sortKey === sortField && sortDir === 'desc' ? 'text-[#023047]' : 'text-slate-300 hover:text-slate-400'
          }`}
        >
          <Triangle className="h-2 w-2 rotate-180 fill-current" />
        </button>
      </span>
    </div>
  );

  const selectedCount = selectedIds.size;
  const allPageSelected =
    !!paginated && paginated.length > 0 && paginated.every((a) => selectedIds.has(a.id));

  return (
    <div className="px-4 py-10 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-huninn text-2xl font-black text-[#023047]">預約管理後台</h1>
            {appointments && (
              <p className="mt-1 text-sm text-slate-500">
                共 {appointments.length} 筆預約
                {hasActiveFilters && filtered && `，符合篩選 ${filtered.length} 筆`}
              </p>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleExport}
              disabled={exportBusy || !filtered || filtered.length === 0}
              className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm font-semibold text-slate-700 transition-opacity hover:text-[#023047] disabled:cursor-not-allowed disabled:opacity-40"
            >
              {exportBusy ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Download className="h-3.5 w-3.5" />
              )}
              匯出資料
            </button>

            <Popover
              panelClassName="w-72 p-4"
              trigger={({ onClick, open }) => (
                <button
                  type="button"
                  onClick={onClick}
                  aria-expanded={open}
                  className={`flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm font-semibold cursor-pointer transition-colors ${
                    hasActiveFilters ? 'text-[#023047]' : 'text-slate-700 hover:text-[#023047]'
                  }`}
                >
                  <SlidersHorizontal className="h-3.5 w-3.5" />
                  篩選
                  {hasActiveFilters && (
                    <span className="h-1.5 w-1.5 rounded-full bg-[#FBD634]" />
                  )}
                </button>
              )}
            >
              <div className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-xs font-bold text-slate-500">日期範圍</label>
                  <div className="flex gap-3">
                    <div className="flex w-4 shrink-0 flex-col items-center py-[15px]">
                      <span className="h-2 w-2 shrink-0 rounded-full border-2 border-[#023047]" />
                      <span className="w-px flex-1 bg-slate-200" />
                      <span className="h-2 w-2 shrink-0 rounded-full bg-[#023047]" />
                    </div>
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-2">
                        <span className="w-14 shrink-0 whitespace-nowrap text-xs font-semibold text-slate-500">
                          起始時間
                        </span>
                        <DatePicker value={dateStart} onChange={setDateStart} placeholder="不限" className="flex-1" />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-14 shrink-0 whitespace-nowrap text-xs font-semibold text-slate-500">
                          結束時間
                        </span>
                        <DatePicker value={dateEnd} onChange={setDateEnd} placeholder="不限" className="flex-1" />
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-bold text-slate-500">服務項目</label>
                  <Select
                    value={serviceFilter}
                    onChange={setServiceFilter}
                    options={[
                      { value: 'all', label: '全部服務項目' },
                      ...SERVICE_OPTIONS.map((service) => ({ value: service, label: service })),
                    ]}
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-bold text-slate-500">狀態</label>
                  <Select value={statusFilter} onChange={setStatusFilter} options={STATUS_FILTER_OPTIONS} />
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setDateStart('');
                    setDateEnd('');
                    setServiceFilter('all');
                    setStatusFilter('all');
                  }}
                  className="w-full rounded-lg border border-slate-200 py-1.5 text-xs font-semibold text-slate-500 hover:border-slate-300 hover:text-slate-700 cursor-pointer"
                >
                  清除篩選
                </button>
              </div>
            </Popover>

            {/* Search: underline only, no boxed input */}
            <div className="flex items-center gap-2 border-b border-slate-300 pb-1.5 focus-within:border-[#023047]">
              <Search className="h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="搜尋姓名、電話或 Email"
                className="w-56 bg-transparent text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {error && (
          <p className="mt-6 flex items-center gap-1.5 rounded-xl bg-red-50 px-3 py-2.5 text-sm font-semibold text-red-700">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {error}
          </p>
        )}

        {!appointments && !error && (
          <div className="flex items-center gap-2 py-16 text-slate-400">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm font-semibold">載入中...</span>
          </div>
        )}

        {filtered && filtered.length === 0 && (
          <p className="mt-10 text-sm font-medium text-slate-400">
            {hasActiveFilters ? '此時段無預約。' : '目前還沒有預約。'}
          </p>
        )}

        {/* Batch action bar */}
        {selectedCount > 0 && (
          <div className="mt-6 flex items-center justify-between gap-3 rounded-xl bg-[#023047] px-4 py-3 text-white">
            <span className="text-sm font-bold">已選取 {selectedCount} 筆</span>
            <div className="flex items-center gap-2">
              {batchBusy ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <button
                    onClick={() => applyStatusBatch([...selectedIds], 'confirmed')}
                    className="flex items-center gap-1.5 rounded-full bg-[#FBD634] px-3.5 py-1.5 text-xs font-bold text-[#023047] hover:brightness-95 cursor-pointer"
                  >
                    <Check className="h-3.5 w-3.5" />
                    批次確認
                  </button>
                  <button
                    onClick={() => openCancelDialog([...selectedIds])}
                    className="flex items-center gap-1.5 rounded-full border border-white/30 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-white/10 cursor-pointer"
                  >
                    <X className="h-3.5 w-3.5" />
                    批次取消
                  </button>
                  <button
                    onClick={() => setSelectedIds(new Set())}
                    className="text-xs font-semibold text-white/60 hover:text-white cursor-pointer"
                  >
                    取消選取
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        {paginated && paginated.length > 0 && (
          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[960px] border-collapse text-left text-sm">
              <thead className="sticky top-0 z-10 bg-white">
                <tr className="border-b border-slate-200 text-xs font-bold uppercase tracking-wide text-slate-400">
                  <th className="w-8 py-3 pr-2">
                    <input
                      type="checkbox"
                      checked={allPageSelected}
                      onChange={(e) => toggleSelectAll(e.target.checked)}
                      className="h-3.5 w-3.5 cursor-pointer accent-[#023047]"
                    />
                  </th>
                  <th className="py-3 pr-4 font-bold">
                    <SortableHeader label="預約時間" sortField="appointment_date" />
                  </th>
                  <th className="py-3 pr-4 font-bold">姓名 / Email</th>
                  <th className="py-3 pr-4 font-bold">服務項目</th>
                  <th className="py-3 pr-4 font-bold">聯絡方式</th>
                  <th className="py-3 pr-4 font-bold">備註</th>
                  <th className="py-3 pr-4 font-bold">狀態</th>
                  <th className="py-3 pr-4 font-bold text-center">已付款</th>
                  <th className="py-3 pr-4 font-bold">
                    <SortableHeader label="操作時間" sortField="created_at" />
                  </th>
                  <th className="py-3 font-bold">操作</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((a) => (
                  <tr key={a.id} className="border-b border-slate-100 align-top">
                    <td className="py-3.5 pr-2">
                      <input
                        type="checkbox"
                        checked={selectedIds.has(a.id)}
                        onChange={(e) => toggleSelected(a.id, e.target.checked)}
                        className="h-3.5 w-3.5 cursor-pointer accent-[#023047]"
                      />
                    </td>
                    <td className="py-3.5 pr-4 font-semibold text-[#023047] whitespace-nowrap">
                      {formatDateTime(a.appointment_date)}
                    </td>
                    <td className="py-3.5 pr-4">
                      <div className="font-semibold text-slate-800">{a.client_name}</div>
                      <div className="text-xs text-slate-500">{a.client_email}</div>
                    </td>
                    <td className="py-3.5 pr-4 text-slate-700">{a.service || '—'}</td>
                    <td className="py-3.5 pr-4 text-slate-700">
                      {a.contact_platform} · {a.contact_detail}
                    </td>
                    <td className="py-3.5 pr-4 max-w-[200px] text-slate-500">{a.message || '—'}</td>
                    <td className="py-3.5 pr-4">
                      <span
                        className={`inline-block rounded-full px-2.5 py-1 text-xs font-bold ${STATUS_STYLE[a.status]}`}
                      >
                        {STATUS_LABEL[a.status]}
                      </span>
                      {a.status === 'cancelled' && a.cancellation_reason && (
                        <p className="mt-1 max-w-[160px] text-xs text-slate-400">
                          {a.cancellation_reason}
                        </p>
                      )}
                    </td>
                    <td className="py-3.5 pr-4 text-center">
                      <button
                        onClick={() => handleTogglePaid(a.id, !a.is_paid)}
                        disabled={paidBusyId === a.id}
                        aria-pressed={a.is_paid}
                        title={a.is_paid ? '已付款，點擊取消' : '尚未付款，點擊標記'}
                        className={`inline-flex h-6 w-6 items-center justify-center rounded-full border-2 transition-colors duration-200 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 ${
                          a.is_paid
                            ? 'border-[#023047] bg-[#023047]'
                            : 'border-slate-300 bg-white hover:border-[#023047]'
                        }`}
                      >
                        <Check
                          className={`h-3.5 w-3.5 text-white transition-all duration-200 ease-out ${
                            a.is_paid ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
                          }`}
                        />
                      </button>
                    </td>
                    <td className="py-3.5 pr-4 whitespace-nowrap text-xs text-slate-400">
                      {formatDateTimeWithSeconds(a.created_at)}
                    </td>
                    <td className="py-3.5">
                      <div className="flex items-center gap-1.5">
                        {busyId === a.id ? (
                          <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
                        ) : (
                          <>
                            {a.status !== 'confirmed' && (
                              <button
                                onClick={() => applyStatus(a.id, 'confirmed')}
                                title="標記為已確認"
                                className="flex h-7 w-7 items-center justify-center rounded-full text-emerald-600 hover:bg-emerald-50 cursor-pointer"
                              >
                                <Check className="h-4 w-4" />
                              </button>
                            )}
                            {a.status !== 'cancelled' && (
                              <button
                                onClick={() => openCancelDialog([a.id])}
                                title="標記為已取消"
                                className="flex h-7 w-7 items-center justify-center rounded-full text-red-500 hover:bg-red-50 cursor-pointer"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            )}
                            {a.status !== 'pending' && (
                              <button
                                onClick={() => applyStatus(a.id, 'pending')}
                                title="改回待確認"
                                className="flex h-7 w-7 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 cursor-pointer"
                              >
                                <RotateCcw className="h-4 w-4" />
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {filtered && filtered.length > 0 && (
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm">
            <div className="flex items-center gap-2 text-slate-500">
              <span>每頁顯示</span>
              <select
                value={pageSize}
                onChange={(e) => setPageSize(Number(e.target.value))}
                className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#FBD634]"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
              <span>筆</span>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-slate-500">
                第 {page + 1} / {pageCount} 頁
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  disabled={page === 0}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:border-slate-300 disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
                  disabled={page >= pageCount - 1}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:border-slate-300 disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Cancellation reason dialog (single or batch) */}
      {cancelIds && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
            <h2 className="text-base font-bold text-[#023047]">
              {cancelIds.length === 1 ? '取消預約' : `批次取消 ${cancelIds.length} 筆預約`}
            </h2>
            <label className="mt-4 block text-xs font-semibold text-slate-700 mb-1.5">
              取消原因（將附在通知信中寄給對方）
            </label>
            <textarea
              autoFocus
              rows={3}
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="例如：講師臨時有事，該時段無法開課"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#FBD634] resize-none"
            />
            <div className="mt-4 flex items-center gap-2">
              <button
                onClick={() => setCancelIds(null)}
                className="flex-1 rounded-xl bg-slate-100 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-200 cursor-pointer"
              >
                返回
              </button>
              <button
                onClick={confirmCancel}
                disabled={!cancelReason.trim()}
                className="flex-1 rounded-xl bg-red-500 py-2.5 text-sm font-bold text-white hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
              >
                確認取消並寄信
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
