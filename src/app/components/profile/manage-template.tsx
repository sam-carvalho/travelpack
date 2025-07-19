"use client";

import { Templates } from "@/app/lib/types";
import { deleteTemplateAction } from "@/app/profile/actions";
import { startTransition } from "react";
import toast from "react-hot-toast";

export function ManageTemplates({
  userId,
  templates = [],
}: {
  userId: string;
  templates?: Templates[];
}) {
  const handleDelete = (templateId: string) => {
    if (!confirm("Are you sure you want to delete this template?")) return;

    startTransition(async () => {
      try {
        await deleteTemplateAction(userId, templateId);
        toast.success("Template deleted");
      } catch {
        toast.error("Failed to delete template");
      }
    });
  };

  return (
    <section className="mx-12 mb-20 max-w-xl space-y-4 rounded-xl border border-gray-200 bg-white p-8 shadow-lg">
      <h2 className="text-xl font-semibold">Saved Templates</h2>
      {templates.length === 0 ? (
        <p className="text-sm text-gray-500">
          You don’t have any templates yet.
        </p>
      ) : (
        <ul className="space-y-2">
          {templates.map((template) => (
            <li
              key={template.id}
              className="flex items-center justify-between border-b border-gray-300 pb-2"
            >
              <span className="text-gray-600">{template.name}</span>
              <div className="flex gap-2">
                <button
                  onClick={() => handleDelete(template.id)}
                  className="cursor-pointer text-sm text-red-600 hover:text-red-800"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
