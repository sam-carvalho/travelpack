import { DateTime } from "next-auth/providers/kakao";

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
  category?: Category;
  categoryId?: string | null;
  quantity: number;
  packed: boolean;
  packingListId: string;
}

export interface Category {
  id: string;
  name: string;
  userId: string;
}

export interface Option {
  readonly label: string;
  readonly value: string;
}

export interface CategorySelectProps {
  userId: string;
  tripId: string;
  packingListId: string;
  onChange: (category: Option | null) => void;
  categories?: Category[];
  className?: string;
  value: Option | null;
}
