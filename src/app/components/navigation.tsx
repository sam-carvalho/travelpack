import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";

export default async function Navigation() {
  const session = await getServerSession(authOptions);

  return (
    <header className="p-4 flex justify-between items-center">
      <h1 className="text-2xl font-bold text-blue-900">
        <Link href="/">TravelPack</Link>
      </h1>

      <nav className="space-x-8">
        {session?.user ? (
          <>
            <Link
              href="/dashboard"
              className="text-blue-900 hover:underline font-lg font-bold"
            >
              Dashboard
            </Link>
            <Link
              href="/auth/logout"
              className="text-red-600 hover:underline font-lg font-bold"
            >
              Logout
            </Link>
          </>
        ) : (
          <>
            <Link
              href="/signin"
              className="text-blue-900 hover:underline font-lg font-bold"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="text-gray-600 hover:underline font-lg font-bold"
            >
              Sign Up
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}
