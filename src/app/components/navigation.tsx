import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import { LogoutButton } from "./logout-button";

export default async function Navigation() {
  const session = await getServerSession(authOptions);
  const linkClasses = "hover:underline font-lg font-bold";

  return (
    <header className="flex justify-between items-center">
      <h1 className="text-2xl font-bold">
        <Link href="/">TravelPack</Link>
      </h1>

      <nav className="space-x-8">
        {session?.user ? (
          <>
            <Link href="/trips" className={linkClasses}>
              Trips
            </Link>
            <Link href="/templates" className={linkClasses}>
              Templates
            </Link>
            <Link href="/reports" className={linkClasses}>
              Reports
            </Link>
            <Link href="/profile" className={linkClasses}>
              Profile
            </Link>
            <LogoutButton />
          </>
        ) : (
          <>
            <Link href="/signin" className={linkClasses}>
              Sign In
            </Link>
            <Link
              href="/signup"
              className={`text-gray-600 ${linkClasses} hover:text-gray-800`}
            >
              Sign Up
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}
