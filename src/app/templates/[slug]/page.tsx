import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  categoriesOf,
  fileName,
  findTemplate,
  quantityFor,
  templates,
  tripTypeTitles,
  type TemplateItem,
} from "@/lib/templates";

const exampleNights = 4;

export function generateStaticParams() {
  return templates.map((t) => ({ slug: t.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: PageProps<"/templates/[slug]">): Promise<Metadata> {
  const template = findTemplate((await params).slug);
  return template ? { title: `${template.name} template`, description: template.summary } : {};
}

function scalingNote(item: TemplateItem) {
  if (!item.scaling || item.scaling === "fixed") return null;
  const rule = `${item.quantity} per ${item.scaling === "perNight" ? "night" : "day"}`;
  const offset = item.offset ?? 0;
  return offset ? `${rule}, ${offset > 0 ? "+" : "−"}${Math.abs(offset)}` : rule;
}

export default async function TemplatePage({ params }: PageProps<"/templates/[slug]">) {
  const template = findTemplate((await params).slug);
  if (!template) notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6">
      <nav className="pt-10 text-sm">
        <Link href="/templates" className="text-muted hover:text-text">
          ← All templates
        </Link>
      </nav>
      <header className="pt-6">
        <h1 className="text-4xl font-bold tracking-tight">{template.name}</h1>
        <p className="mt-3 text-lg text-muted">{template.summary}</p>
        <div className="mt-4 flex flex-wrap gap-2 text-sm">
          {template.tripTypes.map((type) => (
            <span key={type} className="rounded-full bg-surface-2 px-2.5 py-0.5 text-muted">
              {tripTypeTitles[type]}
            </span>
          ))}
        </div>
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <a
            href={`/templates/download/${fileName(template)}`}
            download={fileName(template)}
            className="inline-flex items-center gap-2 rounded-xl bg-accent px-5 py-3 font-semibold text-on-accent transition-colors hover:bg-accent-strong"
          >
            Download for TravelPack
          </a>
          <p className="text-sm text-muted">On your iPhone, open the download and choose TravelPack.</p>
        </div>
      </header>

      <section className="mt-12">
        <p className="text-sm text-muted">
          {template.items.length} items. Quantities shown for a {exampleNights}-night trip; TravelPack adjusts them to
          yours.
        </p>
        {categoriesOf(template).map((category) => (
          <div key={category} className="mt-8">
            <h2 className="text-sm font-semibold tracking-wide text-muted uppercase">{category}</h2>
            <ul className="mt-3 divide-y divide-border rounded-2xl border border-border bg-surface">
              {template.items
                .filter((item) => item.category === category)
                .map((item) => (
                  <li key={item.name} className="flex items-center justify-between gap-4 px-5 py-3">
                    <span>
                      {item.name}
                      {item.packLast && (
                        <span className="ml-2 rounded-md bg-accent-soft px-1.5 py-0.5 text-xs font-medium text-accent-strong">
                          Pack last
                        </span>
                      )}
                    </span>
                    <span className="shrink-0 text-sm text-muted">
                      ×{quantityFor(item, exampleNights)}
                      {scalingNote(item) && <span className="ml-1.5">({scalingNote(item)})</span>}
                    </span>
                  </li>
                ))}
            </ul>
          </div>
        ))}
      </section>
    </div>
  );
}
