import Link from "next/link";
import { authOptions } from "@/app/lib/auth";
import { LogoutButton } from "./logout-button";
import NavigationItems from "./navigation-items";
import { getServerSession } from "next-auth";

export default async function Navigation() {
  const session = await getServerSession(authOptions);

  const navLinks = session?.user ? (
    <>
      <Link
        href="/trips"
        className="block py-2 text-lg font-bold hover:underline"
      >
        Trips
      </Link>
      <Link
        href="/reports"
        className="block py-2 text-lg font-bold hover:underline"
      >
        Reports
      </Link>
      <Link
        href="/profile"
        className="block py-2 text-lg font-bold hover:underline"
      >
        Profile
      </Link>
      <LogoutButton />
    </>
  ) : (
    <>
      <Link
        href="/signin"
        className="block py-2 text-lg font-bold hover:underline"
      >
        Sign In
      </Link>
      <Link
        href="/signup"
        className="block py-2 text-lg font-bold text-gray-600 hover:text-gray-800"
      >
        Sign Up
      </Link>
    </>
  );

  return <NavigationItems navLinks={navLinks} />;
}
