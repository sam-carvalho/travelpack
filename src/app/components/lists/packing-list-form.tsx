"use client";

import { useActionState } from "react";
import {
  createPackingList,
  updatePackingList,
} from "@/app/trips/[id]/packing-lists/actions";
import { unknown } from "zod";

export function PackingListForm({
  tripId,
  initialTitle,
  listId,
}: {
  tripId: string;
  initialTitle?: string;
  listId?: string;
}) {
  const action = async (
    _state: unknown,
    formData: FormData,
  ): Promise<{ message?: string; errors?: Record<string, string[]> }> => {
    if (listId) {
      return await updatePackingList(listId, formData);
    } else {
      return await createPackingList(unknown, formData);
    }
  };

  const [formState, formAction, pending] = useActionState(action, undefined);

  return (
    <form
      action={formAction}
      className="mx-12 mb-20 max-w-xl rounded-xl border border-gray-200 bg-white p-8 shadow-lg md:mx-auto"
    >
      <input type="hidden" name="tripId" value={tripId} />

      <div className="mb-12">
        <label className="block text-sm font-medium text-gray-700">
          Packing List Title
        </label>
        <input
          type="text"
          name="title"
          defaultValue={initialTitle}
          required
          className="mt-1 w-full rounded-lg border border-gray-400 px-4 py-2 shadow-sm focus:ring-indigo-500 focus:outline-none"
        />
        {formState?.errors?.title && (
          <p className="mt-1 text-sm text-red-600">{formState.errors.title}</p>
        )}
      </div>

      {formState?.message && (
        <p className="text-sm text-red-600">{formState.message}</p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full cursor-pointer rounded-md bg-gradient-to-r from-amber-500 to-pink-500 px-6 py-3 font-medium text-white shadow transition-all duration-300 hover:to-pink-800"
      >
        {pending
          ? listId
            ? "Saving..."
            : "Creating..."
          : listId
            ? "Save Changes"
            : "Create List"}
      </button>
    </form>
  );
}
