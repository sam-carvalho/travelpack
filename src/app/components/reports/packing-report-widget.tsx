"use client";

import { ArrowDownTrayIcon } from "@heroicons/react/24/solid";
import { ReactNode } from "react";

export function PackingReportWidget({
  title,
  description,
  chart,
  legend,
  onDownload,
  footer,
}: {
  title: string;
  description: string;
  chart: ReactNode;
  legend: ReactNode;
  onDownload: () => void;
  footer?: ReactNode;
}) {
  return (
    <div className="mt-8 mb-8 rounded-xl border border-gray-200 bg-white p-8 shadow-lg">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
          <p className="text-xs text-gray-500">{description}</p>
        </div>
        <button
          onClick={onDownload}
          className="text-gray-500 transition hover:text-gray-800"
          title="Generate Report"
        >
          <ArrowDownTrayIcon className="h-4 w-4" />
        </button>
      </div>

      <div className="my-4 flex justify-center">{chart}</div>

      <div className="flex flex-wrap justify-center gap-4 text-xs text-gray-600">
        {legend}
      </div>

      {footer && (
        <div className="mt-4 flex items-center justify-between border-t pt-2 text-xs text-gray-500">
          {footer}
        </div>
      )}
    </div>
  );
}
