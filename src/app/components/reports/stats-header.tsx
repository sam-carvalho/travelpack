"use client";

export function StatsHeader({
  stats,
}: {
  stats: { label: string; value: string | number }[];
}) {
  return (
    <section className="mb-8">
      <h1 className="text-center text-2xl font-bold">Packing Insights</h1>
      <p className="text-center text-gray-500">
        A snapshot of your packing activity
      </p>

      <div className="mt-6 grid grid-cols-1 text-center sm:grid-cols-2 md:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="border-t-1 border-orange-700 bg-gray-50 p-6"
          >
            <p className="text-2xl font-semibold">{stat.value}</p>
            <p className="text-sm text-gray-600">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
