import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Support",
  description: "Answers to common questions about TravelPack for iPhone.",
};

const faqs: { q: string; a: React.ReactNode }[] = [
  {
    q: "How do I add a template from this website?",
    a: (
      <>
        Open a template on the <Link href="/templates">templates page</Link> on your iPhone and tap Download. Open the
        file from Safari&apos;s downloads (or the Files app) and choose TravelPack. You&apos;ll see a preview, and
        nothing is saved until you tap Import. Imported templates are saved in Settings → Templates. To use one, open a trip and choose Add another list.
      </>
    ),
  },
  {
    q: "Where is my data stored? Is it backed up?",
    a: "Everything is stored on your iPhone. It's included in your normal iCloud or computer backups, and restoring a backup brings it back. TravelPack has no servers.",
  },
  {
    q: "Can I share a list with my family?",
    a: "Yes. On a trip, tap the More menu, then Share, to send the trip and its lists as a .travelpack file by AirDrop, Messages or email. They open it in TravelPack and review it before importing.",
  },
  {
    q: "Why don't I see “Draft a list with AI”?",
    a: "AI drafts need an iPhone that supports Apple Intelligence, with Apple Intelligence turned on in Settings. The rest of the app works without it.",
  },
  {
    q: "What's in TravelPack Pro?",
    a: "AI list drafts and unlimited custom templates. Everything else is free. Purchases restore with your Apple ID from Settings.",
  },
  {
    q: "How do I delete my data?",
    a: "In the app, go to Settings → Delete all data. Deleting the app removes everything too.",
  },
  {
    q: "I had an account on the old TravelPack website.",
    a: "The web app has been retired and its accounts are closed. TravelPack is now an iPhone app that doesn't need an account.",
  },
];

export default function Support() {
  return (
    <div className="mx-auto max-w-2xl px-4 pt-14 sm:px-6 sm:pt-20">
      <h1 className="text-4xl font-bold tracking-tight">Support</h1>
      <p className="mt-4 text-lg text-muted">Answers to common questions about TravelPack for iPhone.</p>

      <div className="mt-10 divide-y divide-border border-y border-border">
        {faqs.map((f) => (
          <details key={f.q} className="group py-5">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold [&::-webkit-details-marker]:hidden">
              {f.q}
              <span aria-hidden className="text-xl text-muted transition-transform group-open:rotate-45">
                +
              </span>
            </summary>
            <div className="prose-page -mt-1">
              <p>{f.a}</p>
            </div>
          </details>
        ))}
      </div>

      <section className="mt-12 rounded-2xl bg-surface-2 p-6">
        <h2 className="text-xl font-semibold">Still stuck?</h2>
        {site.supportEmail ? (
          <p className="mt-2 text-muted">
            Email{" "}
            <a className="font-medium text-accent underline underline-offset-2" href={`mailto:${site.supportEmail}`}>
              {site.supportEmail}
            </a>{" "}
            with your iPhone model and iOS version. We usually reply within two business days.
          </p>
        ) : (
          <p className="mt-2 text-muted">A support email will be listed here before the app launches.</p>
        )}
      </section>
    </div>
  );
}
