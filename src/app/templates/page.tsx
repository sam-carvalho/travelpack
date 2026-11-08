import type { Metadata } from "next";
import Link from "next/link";
import { templates, tripTypeTitles } from "@/lib/templates";

export const metadata: Metadata = {
  title: "Templates",
  description: "Packing list templates for specific trips, ready to open in TravelPack for iPhone.",
};

export default function Templates() {
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6">
      <header className="pt-14 pb-10 sm:pt-20">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Templates</h1>
        <p className="mt-4 max-w-2xl text-lg text-muted">
          Packing lists for specific trips. Open one on your iPhone, download it, and TravelPack adds it to your
          templates after you review it.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {templates.map((t) => (
          <Link
            key={t.slug}
            href={`/templates/${t.slug}`}
            className="flex flex-col rounded-2xl border border-border bg-surface p-6 transition-colors hover:border-accent"
          >
            <h2 className="text-lg font-semibold">{t.name}</h2>
            <p className="mt-1.5 flex-1 text-muted">{t.summary}</p>
            <div className="mt-5 flex flex-wrap items-center gap-2 text-sm">
              {t.tripTypes.map((type) => (
                <span key={type} className="rounded-full bg-surface-2 px-2.5 py-0.5 text-muted">
                  {tripTypeTitles[type]}
                </span>
              ))}
              <span className="ml-auto font-medium text-accent">{t.items.length} items</span>
            </div>
          </Link>
        ))}
      </div>

      <section className="mt-16 grid gap-8 rounded-3xl bg-surface-2 px-6 py-10 sm:px-10 md:grid-cols-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">How it works</h2>
          <ol className="mt-4 list-decimal space-y-2 pl-5 text-muted">
            <li>Open a template on your iPhone and tap Download.</li>
            <li>Open the file from Safari&apos;s downloads and choose TravelPack.</li>
            <li>Check the preview and tap Import. To use it, open a trip and choose Add another list.</li>
          </ol>
        </div>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Have a great list?</h2>
          <p className="mt-4 text-muted">
            Community templates are coming. Soon you&apos;ll be able to share yours here and import other
            travelers&apos; lists. Every submission will be reviewed before it&apos;s published.
          </p>
        </div>
      </section>
    </div>
  );
}
