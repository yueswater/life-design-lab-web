import React from 'react';
import { Metric } from '../types';
import { Sidebar } from './Sidebar';
import { MetricEditor } from './MetricEditor';

interface DashboardContainerProps {
  metrics: Metric[];
  selectedMetricId: string;
  onSelectMetric: (id: string) => void;
  onUpdateMetric: (metric: Metric) => void;
  onDeleteMetric: (id: string) => void;
  onAddNewMetric: () => void;
}

export const DashboardContainer: React.FC<DashboardContainerProps> = ({
  metrics,
  selectedMetricId,
  onSelectMetric,
  onUpdateMetric,
  onDeleteMetric,
  onAddNewMetric,
}) => {
  const selectedMetric =
    metrics.find((m) => m.id === selectedMetricId) || metrics[0];

  return (
    <div className="w-full max-w-6xl mx-auto px-2 sm:px-6 pb-16">
      {/* Outer Warm Yellow Tint Frame matching Trevanta UI */}
      <div className="bg-[#FEFDE8] p-3 sm:p-5 rounded-3xl border border-yellow-200/90 shadow-xl shadow-amber-900/5">
        {/* Inner Card Container */}
        <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden flex flex-col md:flex-row min-h-[620px]">
          {/* Sidebar */}
          <Sidebar
            metrics={metrics}
            selectedMetricId={selectedMetricId}
            onSelectMetric={onSelectMetric}
            onAddNewMetric={onAddNewMetric}
          />

          {/* Main Metric Editor */}
          {selectedMetric ? (
            <MetricEditor
              metric={selectedMetric}
              onUpdateMetric={onUpdateMetric}
              onDeleteMetric={onDeleteMetric}
            />
          ) : (
            <div className="flex-1 p-12 text-center text-slate-400 flex flex-col items-center justify-center">
              <p className="text-sm font-medium mb-3">No metric selected.</p>
              <button
                onClick={onAddNewMetric}
                className="bg-amber-400 text-slate-900 font-semibold text-xs px-4 py-2 rounded-full shadow-2xs"
              >
                Create New Metric
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
