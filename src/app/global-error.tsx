"use client";

import "./globals.css";

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <div className="mx-auto max-w-xl px-4 py-28 text-center sm:px-6">
          <h1 className="text-4xl font-bold tracking-tight">Something went wrong</h1>
          <p className="mt-4 text-muted">Please try again.</p>
          <button
            onClick={reset}
            className="mt-8 rounded-xl bg-accent px-5 py-3 font-semibold text-on-accent hover:bg-accent-strong"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
