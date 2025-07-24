import { PackingReport } from "@/app/lib/types";

export function PackingReportResult({ data }: { data: PackingReport[] }) {
  if (data.length === 0)
    return (
      <p className="rounded-b-xl border-x border-b border-gray-200 bg-white p-8 shadow-lg">
        No results found.
      </p>
    );

  return (
    <ul className="rounded-b-xl border-x border-b border-gray-200 bg-white p-8 shadow-lg">
      {data.map((report) => (
        <li
          key={report.tripId}
          className="m-4 rounded border border-gray-100 p-4 shadow-sm"
        >
          <h3 className="text-lg font-semibold">{report.tripName}</h3>
          <p className="text-sm text-gray-600">
            {report.destination} ({report.startDate} – {report.endDate})
          </p>
          <ul className="mt-2 list-disc pl-4 text-sm">
            {report.items.map((item) => (
              <li key={item.id}>
                {item.name} — Qty: {item.quantity}
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ul>
  );
}
