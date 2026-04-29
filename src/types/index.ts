export interface LabTool {
  id: string;
  icon: string;
  name: string;
  desc: string;
  status: 'live' | 'beta' | 'soon';
  version: string;
  colorClass: string;
}

export interface ResultCard {
  id: string;
  iconLetter: string;
  iconColorClass: string;
  source: string;
  sourceBold: string;
  title: string;
  desc: string;
  tags: { label: string; colorClass: string }[];
  date: string;
}

export interface SuggestionItem {
  query: string;
  label: string;
  tagClass: string;
  tagText: string;
}

export interface PAA {
  question: string;
  answer: string;
}

export type FilterTab = {
  label: string;
  count: number;
};
