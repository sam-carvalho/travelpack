"use client";

export default function GlobalError({
  /* eslint-disable @typescript-eslint/no-unused-vars */
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body className="mx-8 mt-8 min-h-screen overflow-visible bg-blue-100 text-gray-900 lg:mx-70">
        <div className="grid h-full place-items-center px-6 py-24 sm:py-32 lg:px-8">
          <div className="text-center">
            <p className="mb-4 text-7xl font-extrabold tracking-tight text-amber-600 lg:text-9xl">
              500
            </p>
            <h1 className="mt-4 text-5xl font-semibold tracking-tight text-gray-900 sm:text-7xl">
              Internal Server Error.
            </h1>
            <p className="m-4 text-lg font-light text-gray-500">
              We are already working to solve the problem.{" "}
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <button
                className="cursor-pointer rounded-xl bg-gradient-to-r from-amber-500 to-pink-500 px-4 py-3 text-lg font-semibold text-white transition-all duration-300 hover:to-pink-600"
                onClick={() => reset()}
              >
                Go back home
              </button>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
