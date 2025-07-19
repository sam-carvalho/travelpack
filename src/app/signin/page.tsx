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
    <div className="flex min-h-screen items-center justify-center bg-[#f0f9ff] px-4">
      <form
        action={action}
        className="w-full max-w-md space-y-4 rounded-xl bg-white p-8 shadow-md"
      >
        <h1 className="mb-4 text-center text-2xl font-bold text-blue-900">
          Sign In
        </h1>

        <div>
          <label
            htmlFor="email"
            className="mb-1 block text-sm font-medium text-blue-800"
          >
            Email
          </label>
          <input
            type="email"
            name="email"
            required
            className="w-full rounded-md border border-blue-200 px-4 py-2"
          />
          {state?.errors?.email && (
            <p className="mt-1 text-sm text-red-600">{state.errors.email[0]}</p>
          )}
        </div>

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
            className="w-full rounded-md border border-blue-200 px-4 py-2"
          />
          {state?.errors?.password && (
            <p className="mt-1 text-sm text-red-600">
              {state.errors.password[0]}
            </p>
          )}
        </div>

        <button
          disabled={pending}
          type="submit"
          className="w-full rounded-md bg-blue-900 py-2 font-semibold text-white transition hover:bg-blue-800"
        >
          {pending ? "Signing in..." : "Sign In"}
        </button>
      </form>
    </div>
  );
}
