import Image from "next/image";
import Link from "next/link";

const links = [
  { href: "/features", label: "Features" },
  { href: "/templates", label: "Templates" },
  { href: "/support", label: "Support" },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-20 border-b border-border/70 bg-bg/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5 font-semibold">
          <Image src="/app-icon.png" alt="" width={32} height={32} className="rounded-[9px]" />
          <span className="hidden text-lg tracking-tight min-[420px]:inline">TravelPack</span>
        </Link>
        <nav aria-label="Main" className="flex items-center gap-1 text-[15px] sm:gap-2">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-lg px-2.5 py-2 text-muted transition-colors hover:bg-surface-2 hover:text-text sm:px-3"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
