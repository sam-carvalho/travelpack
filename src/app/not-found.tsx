import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-4 py-28 text-center sm:px-6">
      <p className="font-semibold text-accent">404</p>
      <h1 className="mt-3 text-4xl font-bold tracking-tight">Page not found</h1>
      <p className="mt-4 text-muted">
        TravelPack is now an iPhone app, so the old web app pages are gone.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex rounded-xl bg-accent px-5 py-3 font-semibold text-on-accent hover:bg-accent-strong"
      >
        Go to the home page
      </Link>
    </div>
  );
}
