import React from "react";
import { getProgressCounts } from "@/app/utils/getProgressCount";
import { getCurrentUser } from "@/app/lib/auth";
import { PackingListTable } from "./view-list-table";
import { CategoryService } from "@/services/category-service";
import { PackingList } from "@/generated/prisma";

export default async function ViewPackingList({ list }: { list: PackingList }) {
  const user = await getCurrentUser();
  const { totalCount, progress } = getProgressCounts(list);
  const categoryService = new CategoryService();
  const categories = await categoryService.getAllCategories(user.id);

  return (
    <PackingListTable
      list={list}
      userId={user.id}
      progress={progress}
      totalCount={totalCount}
      categories={categories}
    />
  );
}
