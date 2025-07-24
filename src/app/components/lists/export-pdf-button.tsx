"use client";

import { useTransition } from "react";
import toast from "react-hot-toast";

export function ExportPDFButton({
  packingListId,
  packingListName,
}: {
  packingListId: string;
  packingListName: string;
}) {
  const [pending, startTransition] = useTransition();

  const handleExport = () => {
    startTransition(async () => {
      const toastId = toast.loading("Generating PDF...");
      try {
        const res = await fetch(
          `/api/export-pdf?packingListId=${packingListId}`,
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
      className="cursor-pointer rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 text-sm font-medium hover:bg-gray-100"
      disabled={pending}
    >
      {pending ? "Generating..." : "Generate PDF"}
    </button>
  );
}
