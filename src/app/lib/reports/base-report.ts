import { PackingReport, SearchFilters } from "@/app/lib/types";

export abstract class ReportBase {
  abstract generate(
    userId: string,
    filters: SearchFilters,
  ): Promise<PackingReport[]>;
}
