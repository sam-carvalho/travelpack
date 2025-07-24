"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { deleteTemplateAction } from "@/app/profile/actions";

export function DeleteTemplateButton({
  userId,
  templateId,
}: {
  userId: string;
  templateId: string;
}) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleDelete = () => {
    if (!confirm("Are you sure you want to delete this template?")) return;

    startTransition(async () => {
      try {
        await deleteTemplateAction(userId, templateId);
        toast.success("Template deleted");
        router.refresh();
      } catch {
        toast.error("Failed to delete template");
      }
    });
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className="cursor-pointer rounded bg-red-600 px-3 py-1 text-white hover:bg-red-700 disabled:opacity-50"
    >
      Delete
    </button>
  );
}
