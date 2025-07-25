"use client";

import { useState, useTransition } from "react";
import { Category } from "@/app/lib/types";
import {
  createCategoryAction,
  deleteCategoryAction,
  updateCategoryAction,
} from "@/app/profile/actions";
import { EditCategoryModal } from "./edit-category-modal";

export function ManageUserCategoriesForm({
  userId,
  categories = [],
}: {
  userId: string;
  categories?: Category[];
}) {
  const [name, setName] = useState("");
  /* eslint-disable @typescript-eslint/no-unused-vars */
  const [_, startTransition] = useTransition();
  const [localCategories, setLocalCategories] = useState(categories);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    startTransition(async () => {
      const newCategory = await createCategoryAction(userId, name);
      setLocalCategories((prev) => [...prev, newCategory]);
      setName("");
    });
  };

  const handleEdit = (newName: string) => {
    if (!editingCategory) return;

    startTransition(async () => {
      await updateCategoryAction(userId, editingCategory.id, newName);
      setLocalCategories((prev) =>
        prev.map((cat) =>
          cat.id === editingCategory.id ? { ...cat, name: newName } : cat,
        ),
      );
      setEditingCategory(null);
    });
  };

  const handleDelete = (categoryId: string) => {
    const confirmed = confirm("Are you sure you want to delete this item?");
    if (!confirmed) return;
    startTransition(async () => {
      await deleteCategoryAction(userId, categoryId);
      setLocalCategories((prev) => prev.filter((cat) => cat.id !== categoryId));
    });
  };

  return (
    <section className="mx-12 mb-20 max-w-xl space-y-4 rounded-xl border border-gray-200 bg-white p-8 shadow-lg">
      <h2 className="text-xl font-semibold">Manage Your Categories</h2>

      <form onSubmit={handleCreate} className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Category Name
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="fmt-1 w-full rounded-lg border border-gray-400 px-3 py-2"
            required
          />

          <button
            type="submit"
            className="cursor-pointer rounded-md bg-gradient-to-r from-amber-500 to-pink-500 px-6 py-3 font-medium text-white shadow transition-all duration-300 hover:to-pink-800"
          >
            Add
          </button>
        </div>
      </form>

      {localCategories.length === 0 ? (
        <p className="text-sm text-gray-500">No categories yet.</p>
      ) : (
        <ul className="space-y-2">
          {localCategories.map((category) => (
            <li
              key={category.id}
              className="flex items-center justify-between border-b border-gray-300 pb-2"
            >
              <span className="text-gray-600">{category.name}</span>
              <div className="flex gap-2">
                <button
                  onClick={() => setEditingCategory(category)}
                  className="cursor-pointer text-sm text-blue-600 hover:text-blue-800"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(category.id)}
                  className="cursor-pointer text-sm text-red-600 hover:text-red-800"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
          <EditCategoryModal
            isOpen={!!editingCategory}
            initialName={editingCategory?.name || ""}
            onClose={() => setEditingCategory(null)}
            onSave={handleEdit}
          />
        </ul>
      )}
    </section>
  );
}
