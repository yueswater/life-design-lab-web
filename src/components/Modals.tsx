import React, { useState } from 'react';
import { Metric } from '../types';
import { X } from 'lucide-react';

interface ModalsProps {
  showNewMetricModal: boolean;
  onCloseNewMetricModal: () => void;
  onCreateMetric: (newMetric: Metric) => void;
}

export const Modals: React.FC<ModalsProps> = ({
  showNewMetricModal,
  onCloseNewMetricModal,
  onCreateMetric,
}) => {
  const [title, setTitle] = useState('');
  const [type, setType] = useState<'simple' | 'calculated'>('simple');
  const [unit, setUnit] = useState('線上 / 實體一對一');

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newMetric: Metric = {
      id: `m-${Date.now()}`,
      title: title.trim(),
      type,
      unit: unit.trim() || '專屬陪伴',
      lastModifiedBy: 'Min (Coach)',
      lastModifiedDate: 'Just now',
      tags: ['[Custom] - 個人設計'],
      aggregation: 'Sum',
      dataSources: ['Zendesk', 'Stripe'],
      filters: [],
      assignedUser: {
        name: 'Min',
      },
    };

    onCreateMetric(newMetric);
    setTitle('');
    onCloseNewMetricModal();
  };

  return (
    <>
      {/* New Metric Creation Modal */}
      {showNewMetricModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-100 relative">
            <button
              onClick={onCloseNewMetricModal}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-[#0F172A] mb-4">新增生命設計目標 / Metric</h3>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  目標名稱 / Metric Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="例如：奧德賽之旅原型測試"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  指標類型 / Metric Type
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setType('simple')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      type === 'simple'
                        ? 'bg-[#FEF08A] text-slate-900 border border-amber-300'
                        : 'bg-slate-50 border border-slate-200 text-slate-600'
                    }`}
                  >
                    Simple Metric
                  </button>
                  <button
                    type="button"
                    onClick={() => setType('calculated')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      type === 'calculated'
                        ? 'bg-[#FEF08A] text-slate-900 border border-amber-300'
                        : 'bg-slate-50 border border-slate-200 text-slate-600'
                    }`}
                  >
                    Calculated Metric
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  單位 / Unit
                </label>
                <input
                  type="text"
                  placeholder="例如：線上 / 實體、百分比..."
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={onCloseNewMetricModal}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="bg-[#FACC15] hover:bg-[#EAB308] text-slate-900 font-bold text-xs px-5 py-2 rounded-xl cursor-pointer shadow-2xs"
                >
                  建立指標
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
