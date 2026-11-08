export function ExportData() {
  return (
    <section className="mx-12 mb-20 max-w-xl space-y-4 rounded-xl border border-gray-200 bg-white p-8 shadow-lg">
      <h2 className="text-xl font-semibold">Export Your Data</h2>
      <p className="text-sm text-gray-600">
        Download all your trips, packing lists, categories and templates as a
        <code className="mx-1">.travelpack</code>file. You can import it into
        the TravelPack iOS app.
      </p>
      <a
        href="/api/export-data"
        download
        className="inline-block cursor-pointer rounded-md bg-gradient-to-r from-amber-500 to-pink-500 px-6 py-3 font-medium text-white shadow transition-all duration-300 hover:to-pink-800"
      >
        Download my data
      </a>
    </section>
  );
}
