export interface ReportRecord {
  label: string;
  count: number;
  context?: string;
}

export interface Trip {
  id: string;
  name: string;
  destination: string;
  startDate: string;
  endDate: string;
  notes?: string;
}
