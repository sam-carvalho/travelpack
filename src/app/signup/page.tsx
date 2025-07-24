"use client";

import { useActionState } from "react";
import { createUser } from "./actions";

export default function SignUpPage() {
  const [state, action, pending] = useActionState(createUser, undefined);

  return (
    <div className="mt-14 flex w-xl items-center justify-center sm:mt-50">
      <form
        action={action}
        className="w-full max-w-lg space-y-8 rounded-xl bg-white p-8 shadow-md"
      >
        <h1 className="mb-4 text-center text-2xl font-bold">Sign Up</h1>

        <div>
          <label className="mb-1 block text-sm font-medium" htmlFor="name">
            Name
          </label>
          <input
            id="name"
            name="name"
            className="w-full rounded-md border border-gray-200 px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
        </div>
        {state?.errors?.name && <p>{state.errors.name}</p>}

        <div>
          <label className="mb-1 block text-sm font-medium" htmlFor="email">
            Email
          </label>
          <input
            type="email"
            name="email"
            required
            className="w-full rounded-md border border-gray-200 px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
        </div>
        {state?.errors?.email && <p>{state.errors.email}</p>}

        <div>
          <label htmlFor="password" className="mb-1 block text-sm font-medium">
            Password
          </label>
          <input
            type="password"
            name="password"
            required
            className="w-full rounded-md border border-gray-200 px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
        </div>
        {state?.errors?.password && (
          <div>
            <p>Password must:</p>
            <ul>
              {state.errors.password.map((error) => (
                <li key={error}>- {error}</li>
              ))}
            </ul>
          </div>
        )}

        <button
          disabled={pending}
          type="submit"
          className="w-full cursor-pointer rounded-md bg-gradient-to-r from-amber-500 to-pink-500 py-2 font-semibold text-white transition-all duration-300 hover:to-pink-600"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
}
