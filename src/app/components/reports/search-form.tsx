"use client";

import { useDebouncedCallback } from "use-debounce";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function PackingReportSearchForm() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [keyword, setKeyword] = useState(searchParams.get("keyword") || "");

  const handleSearch = useDebouncedCallback(() => {
    const params = new URLSearchParams(searchParams);

    /* eslint-disable @typescript-eslint/no-unused-expressions */
    keyword ? params.set("keyword", keyword) : params.delete("keyword");

    router.replace(`${pathname}?${params.toString()}`);
  }, 300);

  useEffect(() => {
    handleSearch();
  }, [keyword]);

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="mb-0 w-full rounded-t-xl border-x border-t border-gray-200 bg-white p-8 shadow-lg"
    >
      <div className="mb-4 flex flex-wrap gap-4">
        <div className="flex min-w-[200px] flex-1 flex-col">
          <label className="mb-1 text-sm font-medium text-gray-700">
            Search keyword
          </label>
          <input
            type="text"
            onChange={(e) => setKeyword(e.target.value)}
            defaultValue={searchParams.get("keyword")?.toString()}
            className="fmt-1 w-full rounded-lg border border-gray-400 px-3 py-2"
            placeholder="e.g. Paris, charger"
          />
        </div>
      </div>
    </form>
  );
}
