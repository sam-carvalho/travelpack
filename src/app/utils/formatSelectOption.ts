import { Category } from "../lib/types";

export const formatOption = (label: string, value: string) => ({
  label,
  value,
});

export const buildOptions = (categories?: Category[]) => {
  if (!categories) return [];
  return categories.map((category) => formatOption(category.name, category.id));
};
