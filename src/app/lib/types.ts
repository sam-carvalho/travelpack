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

export interface CreateTripInput {
  name: string;
  destination: string;
  startDate: Date;
  endDate: Date;
  notes?: string;
}

export interface PackingList {
  id: string;
  name: string;
  tripId: string;
  items?: PackingListItem[];
}
export interface PackingListItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  packed: boolean;
}
