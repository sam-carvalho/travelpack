import Image from "next/image";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import Link from "next/link";

export default async function Hero() {
  const session = await getServerSession(authOptions);
  const ctaClasses =
    "inline-block mt-8 bg-gradient-to-r from-amber-500 to-pink-500 text-white px-10 py-4 rounded-lg text-lg font-semibold hover:to-pink-600 transition-all duration-300";

  return (
    <section className="mx-auto flex max-w-screen-xl flex-col items-center justify-between gap-16 lg:flex-row">
      <div className="flex-1 text-left">
        <h1 className="text-6xl font-extrabold tracking-tight">
          Simplify Your Travel Planning
        </h1>
        <p className="mt-4 text-2xl">
          Organize your trips and packing lists like a pro.
        </p>
        {session?.user ? (
          <Link href="/trips" className={ctaClasses}>
            Get Started
          </Link>
        ) : (
          <Link href="/signup" className={ctaClasses}>
            Get Started
          </Link>
        )}
      </div>

      <div className="flex-1 rounded-xl p-6">
        <Image
          src="/images/hero.png"
          alt="Travel planning illustration"
          width={600}
          height={500}
          priority
        />
      </div>
    </section>
  );
}
