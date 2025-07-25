"use client";

import { Suspense, useActionState, useEffect } from "react";
import { signInUser } from "./actions";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";

function SignInForm() {
  const [state, action, pending] = useActionState(signInUser, undefined);
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/trips";

  useEffect(() => {
    if (!pending && !state?.errors && state?.email && state?.password) {
      signIn("credentials", {
        email: state.email,
        password: state.password,
        callbackUrl,
      });
    }
  }, [state, pending, callbackUrl]);

  return (
    <div className="xs:mt-10 mt-8 flex w-xl items-center justify-center sm:mt-50">
      <form
        action={action}
        className="w-full max-w-lg space-y-12 rounded-xl bg-white p-8 shadow-md"
      >
        <h1 className="mb-4 text-center text-2xl font-bold">Sign In</h1>

        <div>
          <label htmlFor="email" className="mb-1 block text-sm font-medium">
            Email
          </label>
          <input
            type="email"
            name="email"
            required
            className="w-full rounded-md border border-gray-200 bg-stone-50 px-4 py-2"
          />
          {state?.errors?.email && (
            <p className="mt-1 text-sm text-red-600">{state.errors.email[0]}</p>
          )}
        </div>

        <div>
          <label htmlFor="password" className="mb-1 block text-sm font-medium">
            Password
          </label>
          <input
            type="password"
            name="password"
            required
            className="w-full rounded-md border border-gray-200 bg-stone-50 px-4 py-2"
          />
        </div>

        <button
          disabled={pending}
          type="submit"
          className="w-full cursor-pointer rounded-md bg-gradient-to-r from-amber-500 to-pink-500 py-2 font-semibold text-white transition-all duration-300 hover:to-pink-600"
        >
          {pending ? "Signing in..." : "Sign In"}
        </button>

        {state?.errors?.password && (
          <p className="mt-2 text-sm text-red-600">
            Invalid email or password.
          </p>
        )}

        <div>
          {state?.message && (
            <p className="mt-1 text-sm text-red-600">{state.message}</p>
          )}
        </div>
      </form>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense>
      <SignInForm />
    </Suspense>
  );
}
