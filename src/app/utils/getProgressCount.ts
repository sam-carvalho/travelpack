import { PackingList } from "../lib/types";

export const getProgressCounts = (list: PackingList) => {
  if (!list || !list.items) {
    return { totalCount: 0, progress: 0 };
  }
  const packedCount = list.items.filter((i) => i.packed).length;
  const totalCount = list.items.length;
  const progress =
    totalCount > 0 ? Math.round((packedCount / totalCount) * 100) : 0;
  return { totalCount, progress };
};
