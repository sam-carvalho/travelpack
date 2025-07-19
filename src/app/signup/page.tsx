"use client";

import { useActionState } from "react";
import { createUser } from "./actions";

export default function SignUpPage() {
  const [state, action, pending] = useActionState(createUser, undefined);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f0f9ff] px-4">
      <form
        action={action}
        className="w-full max-w-md space-y-4 rounded-xl bg-white p-8 shadow-md"
      >
        <h1 className="mb-4 text-center text-2xl font-bold text-blue-900">
          Sign Up
        </h1>

        <div>
          <label
            className="mb-1 block text-sm font-medium text-blue-800"
            htmlFor="name"
          >
            Name
          </label>
          <input
            id="name"
            name="name"
            placeholder="Name"
            className="w-full rounded-md border border-blue-200 px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
        </div>
        {state?.errors?.name && <p>{state.errors.name}</p>}

        <div>
          <label
            className="mb-1 block text-sm font-medium text-blue-800"
            htmlFor="email"
          >
            Email
          </label>
          <input
            type="email"
            name="email"
            required
            className="w-full rounded-md border border-blue-200 px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
        </div>
        {state?.errors?.email && <p>{state.errors.email}</p>}

        <div>
          <label
            htmlFor="password"
            className="mb-1 block text-sm font-medium text-blue-800"
          >
            Password
          </label>
          <input
            type="password"
            name="password"
            required
            className="w-full rounded-md border border-blue-200 px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
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
          className="w-full rounded-md bg-blue-900 py-2 font-semibold text-white transition hover:bg-blue-800"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
}
