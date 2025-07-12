import Image from "next/image";

export default function Hero() {
  return (
    <section className="max-w-screen-xl mx-auto px-4 flex flex-col lg:flex-row items-center justify-between gap-16">
      <div className="text-left flex-1">
        <h1 className="text-6xl font-extrabold tracking-tight text-blue-900">
          Simplify Your Travel Planning
        </h1>
        <p className="mt-4 text-2xl text-blue-900">
          Organize your trips and packing lists like a pro.
        </p>
        <a
          href="/signup"
          className="inline-block mt-8 bg-blue-900 text-white px-10 py-4 rounded-lg text-lg font-semibold hover:bg-blue-800 transition"
        >
          Get Started
        </a>
      </div>

      <div className="p-6 rounded-xl flex-1">
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
