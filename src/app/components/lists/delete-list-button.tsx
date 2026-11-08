"use client";

import { useRef } from "react";

export function DeleteListButton({
  packingListId,
  deletePackingListAction,
  label = "Delete",
  className,
}: {
  packingListId: string;
  deletePackingListAction: (packingListId: string) => void;
  label?: string;
  className?: string;
}) {
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form
      ref={formRef}
      action={deletePackingListAction.bind(null, packingListId)}
      onSubmit={(e) => {
        if (!confirm("Are you sure you want to delete this packing list?")) {
          e.preventDefault();
        }
      }}
    >
      <button
        type="submit"
        className={
          className
            ? className
            : `cursor-pointer rounded-md border border-red-300 px-3 py-1 text-sm text-red-600 hover:bg-red-50`
        }
      >
        {label}
      </button>
    </form>
  );
}
