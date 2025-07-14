"use client";

import { useActionState, useEffect } from "react";
import { signInUser } from "./actions";
import { signIn } from "next-auth/react";

export default function SignInPage() {
  const [state, action, pending] = useActionState(signInUser, undefined);

  useEffect(() => {
    if (!pending && !state?.errors && state?.email && state?.password) {
      signIn("credentials", {
        email: state.email,
        password: state.password,
        callbackUrl: "/trips",
      });
    }
  }, [state, pending]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f0f9ff] px-4">
      <form
        action={action}
        className="max-w-md w-full bg-white p-8 rounded-xl shadow-md space-y-4"
      >
        <h1 className="text-2xl font-bold text-blue-900 mb-4 text-center">
          Sign In
        </h1>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-blue-800 mb-1"
          >
            Email
          </label>
          <input
            type="email"
            name="email"
            required
            className="w-full px-4 py-2 border border-blue-200 rounded-md"
          />
          {state?.errors?.email && (
            <p className="text-red-600 text-sm mt-1">{state.errors.email[0]}</p>
          )}
        </div>

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
            className="w-full px-4 py-2 border border-blue-200 rounded-md"
          />
          {state?.errors?.password && (
            <p className="text-red-600 text-sm mt-1">
              {state.errors.password[0]}
            </p>
          )}
        </div>

        <button
          disabled={pending}
          type="submit"
          className="w-full bg-blue-900 text-white py-2 rounded-md font-semibold hover:bg-blue-800 transition"
        >
          {pending ? "Signing in..." : "Sign In"}
        </button>
      </form>
    </div>
  );
}
