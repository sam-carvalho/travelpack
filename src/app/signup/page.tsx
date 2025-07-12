"use client";

import { useActionState } from "react";
import { createUser } from "./actions";

export default function SignUpPage() {
  const [state, action, pending] = useActionState(createUser, undefined);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f0f9ff] px-4">
      <form
        action={action}
        className="max-w-md w-full bg-white p-8 rounded-xl shadow-md space-y-4"
      >
        <h1 className="text-2xl font-bold text-blue-900 mb-4 text-center">
          Sign Up
        </h1>

        <div>
          <label
            className="block text-sm font-medium text-blue-800 mb-1"
            htmlFor="name"
          >
            Name
          </label>
          <input
            id="name"
            name="name"
            placeholder="Name"
            className="w-full px-4 py-2 border border-blue-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        {state?.errors?.name && <p>{state.errors.name}</p>}

        <div>
          <label
            className="block text-sm font-medium text-blue-800 mb-1"
            htmlFor="email"
          >
            Email
          </label>
          <input
            type="email"
            name="email"
            required
            className="w-full px-4 py-2 border border-blue-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        {state?.errors?.email && <p>{state.errors.email}</p>}

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-blue-800 mb-1"
          >
            Password
          </label>
          <input
            type="password"
            name="password"
            required
            className="w-full px-4 py-2 border border-blue-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
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
          className="w-full bg-blue-900 text-white py-2 rounded-md font-semibold hover:bg-blue-800 transition"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
}
