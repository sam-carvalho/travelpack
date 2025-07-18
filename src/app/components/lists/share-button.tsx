"use client";

import { exportPackingListToLink } from "@/app/trips/[id]/packing-lists/actions";
import { PackingList } from "@/generated/prisma";
import { useTransition } from "react";
import toast from "react-hot-toast";

export function ExportShareLinkButton({
  userId,
  list,
}: {
  userId: string;
  list: PackingList;
}) {
  const [isPending, startTransition] = useTransition();

  const handleExport = () => {
    startTransition(async () => {
      const toastId = toast.loading("Generating shareable link...");

      try {
        const url = await exportPackingListToLink(userId, list);
        await navigator.clipboard.writeText(url ?? "");
        toast.success("Link copied to clipboard!", { id: toastId });
      } catch (error) {
        console.error(error);
        toast.error("Failed to generate link", { id: toastId });
      }
    });
  };

  return (
    <button
      onClick={handleExport}
      disabled={isPending}
      className="px-4 py-2 text-sm font-medium border border-gray-300 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer"
    >
      {isPending ? "Generating..." : "Copy Shareable Link"}
    </button>
  );
}
