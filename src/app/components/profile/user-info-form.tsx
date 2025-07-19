"use client";

import { useActionState } from "react";
import { User } from "@/generated/prisma";
import { updateUserInfoAction } from "@/app/profile/actions";

export function UpdateUserInfoForm({ user }: { user: User }) {
  const [state, formAction, pending] = useActionState(
    updateUserInfoAction,
    undefined,
  );

  return (
    <form
      id="update-user-form"
      action={formAction}
      className="mx-12 mb-20 max-w-xl space-y-4 rounded-xl border border-gray-200 bg-white p-8 shadow-lg"
    >
      <h2 className="text-xl font-semibold">Update Your Info</h2>

      <input type="hidden" name="userId" value={user.id} />

      <div>
        <label className="block text-sm font-medium text-gray-700">Name</label>
        <input
          name="name"
          defaultValue={user.name ?? ""}
          required
          className="mt-1 w-full rounded-lg border border-gray-400 px-3 py-2"
        />
        {state?.errors?.name && (
          <p className="text-sm text-red-600">{state.errors.name[0]}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          name="email"
          defaultValue={user.email}
          required
          className="mt-1 w-full rounded-lg border border-gray-400 px-3 py-2"
        />
        {state?.errors?.email && (
          <p className="text-sm text-red-600">{state.errors.email[0]}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          New Password
        </label>
        <input
          type="password"
          name="password"
          className="mt-1 w-full rounded-lg border border-gray-400 px-3 py-2"
        />
        {state?.errors?.password && (
          <p className="text-sm text-red-600">{state.errors.password[0]}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Confirm New Password
        </label>
        <input
          type="password"
          name="confirmPassword"
          className="mt-1 w-full rounded-lg border border-gray-400 px-3 py-2"
        />
        {state?.errors?.confirmPassword && (
          <p className="text-sm text-red-600">
            {state.errors.confirmPassword[0]}
          </p>
        )}
      </div>

      {state?.success && (
        <p className="text-green-600">Profile updated successfully!</p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full cursor-pointer rounded-md bg-gradient-to-r from-amber-500 to-pink-500 px-6 py-3 font-medium text-white shadow transition-all duration-300 hover:to-pink-800"
      >
        {pending ? "Saving..." : "Save Changes"}
      </button>
    </form>
  );
}
