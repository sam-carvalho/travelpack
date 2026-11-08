import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-10 text-sm text-muted sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p>© {new Date().getFullYear()} TravelPack.</p>
        <nav aria-label="Footer" className="flex flex-wrap gap-x-6 gap-y-2">
          <Link href="/features" className="hover:text-text">Features</Link>
          <Link href="/templates" className="hover:text-text">Templates</Link>
          <Link href="/support" className="hover:text-text">Support</Link>
          <Link href="/privacy" className="hover:text-text">Privacy</Link>
        </nav>
      </div>
    </footer>
  );
}
