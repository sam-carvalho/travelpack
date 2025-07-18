"use client";

import { signOut } from "next-auth/react";

export function LogoutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/signin" })}
      className="font-lg font-bold text-red-600 hover:text-red-800 hover:underline cursor-pointer"
    >
      Logout
    </button>
  );
}
