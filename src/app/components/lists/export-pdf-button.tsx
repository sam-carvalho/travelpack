"use client";

import { useTransition } from "react";
import toast from "react-hot-toast";

export function ExportPDFButton({
  tripId,
  packingListId,
  packingListName,
}: {
  tripId: string;
  packingListId: string;
  packingListName: string;
}) {
  const [pending, startTransition] = useTransition();

  const handleExport = () => {
    startTransition(async () => {
      const toastId = toast.loading("Generating PDF...");
      try {
        const res = await fetch(
          `/api/export-pdf?tripId=${tripId}&packingListId=${packingListId}`
        );
        if (!res.ok) throw new Error("Failed to generate PDF");
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${packingListName.trim()}.pdf`;
        link.click();
        window.URL.revokeObjectURL(url);
        toast.success("PDF downloaded!", { id: toastId });
      } catch (error) {
        toast.error("Could not export PDF", { id: toastId });
        console.error(error);
      }
    });
  };

  return (
    <button
      onClick={handleExport}
      className="px-4 py-2 text-sm font-medium border border-gray-300 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer"
      disabled={pending}
    >
      {pending ? "Generating..." : "Generate PDF"}
    </button>
  );
}
