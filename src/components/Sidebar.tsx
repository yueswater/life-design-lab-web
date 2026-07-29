import React from 'react';
import { Metric } from '../types';
import { Database, Zap, Plus, Info } from 'lucide-react';

interface SidebarProps {
  metrics: Metric[];
  selectedMetricId: string;
  onSelectMetric: (id: string) => void;
  onAddNewMetric: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  metrics,
  selectedMetricId,
  onSelectMetric,
  onAddNewMetric,
}) => {
  const simpleMetrics = metrics.filter((m) => m.type === 'simple');
  const calculatedMetrics = metrics.filter((m) => m.type === 'calculated');

  return (
    <aside className="w-full md:w-64 lg:w-72 bg-slate-50/70 p-4 border-r border-slate-200/60 flex flex-col justify-between select-none">
      <div>
        {/* Navigation Top Header */}
        <div className="flex items-center justify-between mb-4 px-1">
          <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
            NAVIGATION
          </span>
          <span className="text-[10px] font-bold bg-[#FEF08A] text-amber-900 px-2 py-0.5 rounded-full border border-yellow-300">
            v2.4
          </span>
        </div>

        {/* Basic Information Pill */}
        <div className="mb-5">
          <div className="flex items-center gap-2.5 bg-white border border-slate-200/90 rounded-full px-3.5 py-2 text-xs font-semibold text-slate-800 shadow-2xs">
            <Info className="w-4 h-4 text-slate-500" />
            <span>Basic information</span>
          </div>
        </div>

        {/* Simple Metrics / 核心服務模組 Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between px-1 mb-2">
            <span className="text-xs font-bold text-slate-600">Simple metrics</span>
            <span className="text-[11px] font-bold bg-slate-200 text-slate-700 px-1.5 py-0.2 rounded-full min-w-[20px] text-center">
              {simpleMetrics.length}
            </span>
          </div>

          <div className="space-y-1">
            {simpleMetrics.map((metric) => {
              const isSelected = metric.id === selectedMetricId;
              return (
                <button
                  key={metric.id}
                  onClick={() => onSelectMetric(metric.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2 rounded-full text-xs font-medium transition-all text-left cursor-pointer ${
                    isSelected
                      ? 'bg-[#FEF08A] text-slate-900 font-semibold shadow-xs ring-1 ring-yellow-300'
                      : 'text-slate-600 hover:bg-slate-200/50 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate pr-2">
                    <Database
                      className={`w-3.5 h-3.5 flex-shrink-0 ${
                        isSelected ? 'text-amber-800' : 'text-slate-400'
                      }`}
                    />
                    <span className="truncate">{metric.title}</span>
                  </div>

                  {isSelected && (
                    <span className="w-2 h-2 rounded-full bg-sky-500 flex-shrink-0"></span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Calculated Metrics / 轉職案例與架構 Section */}
        <div>
          <div className="flex items-center justify-between px-1 mb-2">
            <span className="text-xs font-bold text-slate-600">Calculated Metrics</span>
            <span className="text-[11px] font-bold bg-slate-200 text-slate-700 px-1.5 py-0.2 rounded-full min-w-[20px] text-center">
              {calculatedMetrics.length}
            </span>
          </div>

          <div className="space-y-1">
            {calculatedMetrics.map((metric) => {
              const isSelected = metric.id === selectedMetricId;
              return (
                <button
                  key={metric.id}
                  onClick={() => onSelectMetric(metric.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2 rounded-full text-xs font-medium transition-all text-left cursor-pointer ${
                    isSelected
                      ? 'bg-[#FEF08A] text-slate-900 font-semibold shadow-xs ring-1 ring-yellow-300'
                      : 'text-slate-600 hover:bg-slate-200/50 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate pr-2">
                    <Zap
                      className={`w-3.5 h-3.5 flex-shrink-0 ${
                        isSelected ? 'text-amber-800' : 'text-slate-400'
                      }`}
                    />
                    <span className="truncate">{metric.title}</span>
                  </div>

                  {isSelected && (
                    <span className="w-2 h-2 rounded-full bg-sky-500 flex-shrink-0"></span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Add New Metric Button */}
      <div className="pt-6 mt-4 border-t border-slate-200/60">
        <button
          onClick={onAddNewMetric}
          className="w-full flex items-center justify-center gap-2 bg-white hover:bg-slate-100 text-slate-800 font-medium text-xs py-2 px-3 rounded-full border border-slate-300 shadow-2xs transition-all cursor-pointer active:scale-98"
        >
          <Plus className="w-3.5 h-3.5 text-slate-600" />
          <span>New Metric</span>
        </button>
      </div>
    </aside>
  );
};
