import { Template } from "@/generated/prisma";

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
export interface PackingListItem extends PackingListBaseItem {
  id: string;
  category?: Category | null;
}

export interface PackingListBaseItem {
  name: string;
  quantity: number;
  packed: boolean;
  packingListId: string;
  categoryId: string | null;
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

export interface Templates extends Template {
  items: {
    id: string;
    name: string;
    quantity: number;
    categoryId: string | null;
  }[];
}

export interface PackingReport {
  tripId: string;
  tripName: string;
  destination: string;
  startDate: string;
  endDate: string;
  items: { id: string; name: string; quantity: number }[];
}

export interface SearchFilters {
  keyword: string;
}
