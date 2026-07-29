import React, { useState } from 'react';
import { Metric, FilterRule } from '../types';
import {
  Database,
  Trash2,
  Plus,
  X,
  SlidersHorizontal,
  ChevronDown,
  Check,
  User,
  Quote,
} from 'lucide-react';

interface MetricEditorProps {
  metric: Metric;
  onUpdateMetric: (updated: Metric) => void;
  onDeleteMetric: (id: string) => void;
}

const AVAILABLE_DATA_SOURCES = ['Zendesk', 'Stripe', 'Intercom', 'PostgreSQL'];

export const MetricEditor: React.FC<MetricEditorProps> = ({
  metric,
  onUpdateMetric,
  onDeleteMetric,
}) => {
  const [newTagInput, setNewTagInput] = useState('');
  const [showAddTag, setShowAddTag] = useState(false);

  // Field change handlers
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdateMetric({ ...metric, title: e.target.value });
  };

  const handleUnitChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdateMetric({ ...metric, unit: e.target.value });
  };

  const handleAggregationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onUpdateMetric({
      ...metric,
      aggregation: e.target.value as Metric['aggregation'],
    });
  };

  // Tags management
  const handleRemoveTag = (tagToRemove: string) => {
    onUpdateMetric({
      ...metric,
      tags: metric.tags.filter((t) => t !== tagToRemove),
    });
  };

  const handleAddTagSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTagInput.trim() && !metric.tags.includes(newTagInput.trim())) {
      onUpdateMetric({
        ...metric,
        tags: [...metric.tags, newTagInput.trim()],
      });
      setNewTagInput('');
      setShowAddTag(false);
    }
  };

  // Data Sources management
  const handleToggleDataSource = (source: string) => {
    const isSelected = metric.dataSources.includes(source);
    let updatedSources: string[];
    if (isSelected) {
      updatedSources = metric.dataSources.filter((s) => s !== source);
    } else {
      updatedSources = [...metric.dataSources, source];
    }
    onUpdateMetric({ ...metric, dataSources: updatedSources });
  };

  // Filter rules management
  const handleAddFilterRule = () => {
    const newRule: FilterRule = {
      id: `rule-${Date.now()}`,
      field: 'Customer Plan',
      operator: 'equals',
      value: 'Enterprise',
    };
    onUpdateMetric({
      ...metric,
      filters: [...metric.filters, newRule],
    });
  };

  const handleRemoveFilterRule = (id: string) => {
    onUpdateMetric({
      ...metric,
      filters: metric.filters.filter((f) => f.id !== id),
    });
  };

  const handleUpdateFilterRule = (
    id: string,
    key: keyof FilterRule,
    value: string
  ) => {
    onUpdateMetric({
      ...metric,
      filters: metric.filters.map((f) => (f.id === id ? { ...f, [key]: value } : f)),
    });
  };

  return (
    <main className="flex-1 bg-white p-6 md:p-8 overflow-y-auto">
      {/* Top Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-8 border-b border-slate-100">
        <div className="flex items-start gap-3.5">
          {/* Navy Database Icon */}
          <div className="w-10 h-10 rounded-xl bg-[#0F172A] flex items-center justify-center text-white shadow-sm flex-shrink-0 mt-0.5">
            <Database className="w-5 h-5 text-amber-300" />
          </div>

          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#0F172A] tracking-tight">
              Edit Metric: {metric.title}
            </h2>
            <div className="flex items-center gap-2 text-xs font-medium text-slate-500 mt-1">
              <span className="text-sky-600 font-semibold">
                {metric.type === 'simple' ? 'Simple Metric' : 'Calculated Metric'}
              </span>
              <span>•</span>
              <span>Last modified: {metric.lastModifiedBy}</span>
            </div>
          </div>
        </div>

        {/* Delete Action */}
        <button
          onClick={() => onDeleteMetric(metric.id)}
          className="flex items-center gap-1.5 text-rose-600 hover:text-rose-700 hover:bg-rose-50 text-xs font-semibold px-3 py-1.5 rounded-lg border border-transparent hover:border-rose-200 transition-all cursor-pointer self-start sm:self-auto"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Delete</span>
        </button>
      </div>

      <div className="space-y-8 max-w-4xl">
        {/* Quote Block if available for student case studies */}
        {metric.quoteText && (
          <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-4 sm:p-5 relative">
            <Quote className="w-6 h-6 text-amber-400 mb-2 opacity-60" />
            <p className="text-xs sm:text-sm text-slate-800 font-medium italic leading-relaxed mb-2">
              「 {metric.quoteText} 」
            </p>
            <p className="text-xs font-bold text-amber-900">
              —— {metric.quoteDescription || metric.quoteAuthor}
            </p>
          </div>
        )}

        {/* SECTION 1: Basic Information */}
        <section>
          <h3 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider mb-3">
            Basic Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Display Title */}
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1.5">
                Display Title
              </label>
              <input
                type="text"
                value={metric.title}
                onChange={handleTitleChange}
                className="w-full bg-slate-50/60 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:bg-white transition-all"
              />
            </div>

            {/* Unit Input with User Badge */}
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1.5">
                Unit
              </label>
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={metric.unit}
                  onChange={handleUnitChange}
                  className="w-full bg-slate-50/60 border border-slate-200 rounded-xl px-3.5 py-2.5 pr-28 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:bg-white transition-all"
                />
                
                {/* User Tag inside Unit input */}
                {metric.assignedUser && (
                  <div className="absolute right-2 flex items-center gap-1 bg-[#1E40AF] text-white text-[11px] font-semibold px-2.5 py-1 rounded-full shadow-2xs">
                    <User className="w-3 h-3 text-sky-200" />
                    <span>{metric.assignedUser.name}</span>
                    <ChevronDown className="w-3 h-3 text-sky-200" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: Metric Configuration */}
        <section>
          <h3 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider mb-3">
            Metric Configuration
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
            {/* Metric Tags */}
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1.5">
                Metric Tags
              </label>
              <div className="flex flex-wrap items-center gap-1.5 min-h-[42px] p-2 bg-slate-50/60 border border-slate-200 rounded-xl">
                {metric.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 bg-slate-200/80 text-slate-700 text-xs font-medium px-2.5 py-1 rounded-lg"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}

                {showAddTag ? (
                  <form onSubmit={handleAddTagSubmit} className="inline-flex items-center">
                    <input
                      type="text"
                      autoFocus
                      value={newTagInput}
                      onChange={(e) => setNewTagInput(e.target.value)}
                      placeholder="Tag name..."
                      className="text-xs bg-white border border-amber-400 rounded px-2 py-0.5 w-24 focus:outline-none"
                    />
                  </form>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowAddTag(true)}
                    className="text-xs font-medium text-slate-500 hover:text-slate-800 flex items-center gap-1 px-2 py-1 rounded hover:bg-slate-200/50 transition-colors cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add tag</span>
                  </button>
                )}
              </div>
            </div>

            {/* Aggregation */}
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1.5">
                Aggregation
              </label>
              <div className="relative">
                <select
                  value={metric.aggregation}
                  onChange={handleAggregationChange}
                  className="w-full appearance-none bg-slate-50/60 border border-slate-200 rounded-xl px-3.5 py-2.5 pr-8 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:bg-white transition-all cursor-pointer"
                >
                  <option value="Sum">Sum</option>
                  <option value="Average">Average</option>
                  <option value="Count">Count</option>
                  <option value="Max">Max</option>
                  <option value="Min">Min</option>
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
              </div>
            </div>

            {/* Data Sources */}
            <div className="md:col-span-1">
              <label className="block text-xs font-medium text-slate-500 mb-1.5">
                Data Sources
              </label>
              <div className="flex flex-wrap gap-1.5 p-1 bg-slate-50/60 border border-slate-200 rounded-xl min-h-[42px] items-center">
                {AVAILABLE_DATA_SOURCES.map((source) => {
                  const active = metric.dataSources.includes(source);
                  return (
                    <button
                      key={source}
                      type="button"
                      onClick={() => handleToggleDataSource(source)}
                      className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                        active
                          ? 'bg-[#064E3B] text-white shadow-2xs'
                          : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {active && <Check className="w-3 h-3 text-emerald-300" />}
                      <span>{source}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 3: Field Filters */}
        <section className="pt-2">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider">
                Field Filters
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Filter records before calculating the metric
              </p>
            </div>

            <button
              onClick={handleAddFilterRule}
              className="flex items-center gap-1.5 bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 text-xs font-semibold px-3 py-1.5 rounded-full transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add filter rule</span>
            </button>
          </div>

          {/* Filter Rules List */}
          <div className="space-y-2.5">
            {metric.filters.length === 0 ? (
              <div className="bg-slate-50/50 border border-dashed border-slate-200 rounded-xl p-6 text-center text-xs text-slate-400">
                No filter rules applied. All records are included in calculations.
              </div>
            ) : (
              metric.filters.map((rule) => (
                <div
                  key={rule.id}
                  className="flex flex-wrap items-center gap-2 sm:gap-3 bg-slate-50/80 border border-slate-200 rounded-xl p-2.5 text-xs"
                >
                  <SlidersHorizontal className="w-4 h-4 text-slate-400 ml-1" />

                  {/* Field Selector / Badge */}
                  <div className="bg-white border border-slate-200 font-semibold text-slate-700 px-3 py-1.5 rounded-lg flex items-center gap-1">
                    <input
                      type="text"
                      value={rule.field}
                      onChange={(e) =>
                        handleUpdateFilterRule(rule.id, 'field', e.target.value)
                      }
                      className="w-28 focus:outline-none bg-transparent"
                    />
                  </div>

                  {/* Operator */}
                  <div className="bg-slate-200/70 font-medium text-slate-600 px-2.5 py-1.5 rounded-lg flex items-center gap-1">
                    <select
                      value={rule.operator}
                      onChange={(e) =>
                        handleUpdateFilterRule(rule.id, 'operator', e.target.value)
                      }
                      className="bg-transparent focus:outline-none cursor-pointer"
                    >
                      <option value="equals">equals</option>
                      <option value="contains">contains</option>
                      <option value="in">in</option>
                      <option value="greater_than">greater than</option>
                      <option value="less_than">less than</option>
                    </select>
                  </div>

                  {/* Value */}
                  <div className="bg-white border border-slate-200 font-semibold text-slate-800 px-3 py-1.5 rounded-lg flex-1 min-w-[120px]">
                    <input
                      type="text"
                      value={rule.value}
                      onChange={(e) =>
                        handleUpdateFilterRule(rule.id, 'value', e.target.value)
                      }
                      className="w-full focus:outline-none bg-transparent"
                    />
                  </div>

                  {/* Delete Rule */}
                  <button
                    onClick={() => handleRemoveFilterRule(rule.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer ml-auto"
                    title="Remove filter rule"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </main>
  );
};
