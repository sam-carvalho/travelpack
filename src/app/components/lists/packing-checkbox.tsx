"use client";

import { togglePackedAction } from "@/app/trips/[id]/packing-lists/actions";

export function PackingCheckbox({
  defaultChecked,
  tripId,
  itemId,
}: {
  defaultChecked: boolean;
  tripId: string;
  itemId: string;
}) {
  return (
    <form action={togglePackedAction}>
      <input type="hidden" name="tripId" value={tripId} />
      <input type="hidden" name="itemId" value={itemId} />
      <input
        type="checkbox"
        name="packed"
        defaultChecked={defaultChecked}
        className="form-checkbox h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
        onChange={(e) => {
          e.currentTarget.form?.requestSubmit();
        }}
      />
    </form>
  );
}
