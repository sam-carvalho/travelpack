import Link from "next/link";
import AppStoreButton from "@/components/app-store-button";
import Phone from "@/components/phone";
import { templates } from "@/lib/templates";

const highlights = [
  {
    title: "Builds itself",
    body: "Pick beach, city or ski and how many nights. TravelPack combines the right templates and scales quantities, so five nights means six pairs of socks.",
  },
  {
    title: "Learns from every trip",
    body: "A quick review after you're home flags what you never used and adds what you forgot, so the next list is shorter and better.",
  },
  {
    title: "Helps on the day",
    body: "A pack-last checklist for the morning you leave, reminders before you go, and a repack check on the way home.",
  },
];

const steps = [
  { title: "Tell it about the trip", body: "Where, when, and what kind of trip." },
  { title: "Get a list in seconds", body: "From templates, your past trips, or an on-device AI draft you review." },
  { title: "Pack and tick", body: "By category or by bag, with progress for each." },
];

export default function Home() {
  return (
    <>
      <section className="mx-auto grid max-w-6xl items-center gap-12 px-4 pt-14 pb-16 sm:px-6 lg:grid-cols-[1.15fr_1fr] lg:pt-20">
        <div>
          <p className="mb-4 inline-flex rounded-full bg-accent-soft px-3 py-1 text-sm font-medium text-accent-strong">
            Now an iPhone app
          </p>
          <h1 className="text-4xl leading-[1.08] font-bold tracking-tight text-balance sm:text-6xl">
            Packing lists that build themselves.
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted sm:text-xl">
            TravelPack turns your trip into a ready packing list, scales it to the number of nights, and learns
            what you forget. Everything stays on your iPhone.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <AppStoreButton />
            <Link href="/features" className="font-semibold text-accent hover:text-accent-strong">
              See all features →
            </Link>
          </div>
        </div>
        <div className="relative mx-auto w-[62%] max-w-[300px] lg:w-full">
          <Phone src="/screens/trip.png" alt="A trip in TravelPack with its packing list and a suggestion from past trips" priority />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid gap-4 md:grid-cols-3">
          {highlights.map((h) => (
            <div key={h.title} className="rounded-2xl border border-border bg-surface p-6">
              <h2 className="text-lg font-semibold">{h.title}</h2>
              <p className="mt-2 leading-relaxed text-muted">{h.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-24 grid max-w-6xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2">
        <div className="order-2 mx-auto w-[62%] max-w-[300px] lg:order-1">
          <Phone src="/screens/list.png" alt="A packing list where underwear, socks and t-shirts are scaled to five" />
        </div>
        <div className="order-1 lg:order-2">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">From trip to packed in three steps</h2>
          <ol className="mt-8 space-y-6">
            {steps.map((s, i) => (
              <li key={s.title} className="flex gap-4">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent text-on-accent font-semibold">
                  {i + 1}
                </span>
                <div>
                  <h3 className="font-semibold">{s.title}</h3>
                  <p className="mt-1 text-muted">{s.body}</p>
                </div>
              </li>
            ))}
          </ol>
          <p className="mt-8 text-muted">
            One simple list, or split by carry-on and checked bag. Your choice, per list.
          </p>
        </div>
      </section>

      <section className="mx-auto mt-24 max-w-6xl px-4 sm:px-6">
        <div className="rounded-3xl bg-surface-2 px-6 py-12 sm:px-12">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Private by design</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-3">
            <p className="text-muted">
              <strong className="block text-text">No account.</strong> Open the app and start packing.
            </p>
            <p className="text-muted">
              <strong className="block text-text">On your iPhone.</strong> Trips, lists and documents never leave
              your device.
            </p>
            <p className="text-muted">
              <strong className="block text-text">No tracking.</strong> No ads, no analytics in the app. AI drafts
              run on device.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-24 max-w-6xl px-4 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Start from a template</h2>
            <p className="mt-3 max-w-xl text-muted">
              Lists for specific trips, ready to open in TravelPack and make your own.
            </p>
          </div>
          <Link href="/templates" className="font-semibold text-accent hover:text-accent-strong">
            Browse all {templates.length} →
          </Link>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {templates.slice(0, 4).map((t) => (
            <Link
              key={t.slug}
              href={`/templates/${t.slug}`}
              className="rounded-2xl border border-border bg-surface p-5 transition-colors hover:border-accent"
            >
              <h3 className="font-semibold">{t.name}</h3>
              <p className="mt-1.5 text-sm text-muted">{t.summary}</p>
              <p className="mt-3 text-sm font-medium text-accent">{t.items.length} items</p>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
