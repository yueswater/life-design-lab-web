export interface Localized {
  zh: string;
  en: string;
}

export interface LocalizedList {
  zh: string[];
  en: string[];
}

export type ModuleIconKey =
  | 'one-on-one'
  | 'workshop'
  | 'small-class'
  | 'keynote';

export interface ModuleItem {
  id: string;
  iconKey: ModuleIconKey;
  title: Localized;
  subtitle: Localized;
  target: Localized;
  description: Localized;
  imageUrl: string;
  badge: string;
  format: Localized;
  duration: Localized;
  features: LocalizedList;
}

export interface FilterRule {
  id: string;
  field: string;
  operator: string;
  value: string;
}

export interface Metric {
  id: string;
  title: string;
  type: 'simple' | 'calculated';
  unit: string;
  lastModifiedBy: string;
  lastModifiedDate: string;
  tags: string[];
  aggregation: 'Sum' | 'Average' | 'Count' | 'Max' | 'Min' | '核心理念' | '實作工作坊';
  dataSources: string[];
  filters: FilterRule[];
  assignedUser?: {
    name: string;
    avatar?: string;
  };
  quoteText?: string;
  quoteAuthor?: string;
  quoteDescription?: string;
}

export type NavTab = 'modules' | 'testimonials' | 'about';
