"use client";

import { createTemplateAction } from "@/app/trips/[id]/packing-lists/actions";
import { useTransition } from "react";
import toast from "react-hot-toast";

export function CreateTemplateButton({
  userId,
  packingListId,
  packingListName,
}: {
  userId: string;
  packingListId: string;
  packingListName: string;
}) {
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    startTransition(async () => {
      const template = await createTemplateAction(
        userId,
        packingListId,
        packingListName
      );
      if (template) toast.success("Template created!");
    });
  };

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      className="cursor-pointer px-4 py-2 text-sm font-medium bg-gradient-to-r from-amber-500 to-pink-500 text-white rounded-lg hover:to-pink-800 transition-all duration-300"
    >
      {isPending ? "Creating..." : "Save as Template"}
    </button>
  );
}
