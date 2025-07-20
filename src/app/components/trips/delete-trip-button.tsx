"use client";

import { useRef } from "react";

export function DeleteTripButton({
  userId,
  tripId,
  deleteTripAction,
}: {
  userId: string;
  tripId: string;
  deleteTripAction: (userId: string, tripId: string) => void;
}) {
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form
      ref={formRef}
      action={deleteTripAction.bind(null, userId, tripId)}
      onSubmit={(e) => {
        if (!confirm("Are you sure you want to delete this trip?")) {
          e.preventDefault();
        }
      }}
    >
      <button
        type="submit"
        className="cursor-pointer rounded-md border border-red-300 px-3 py-1 text-sm text-red-600 hover:bg-red-50"
      >
        Delete
      </button>
    </form>
  );
}
