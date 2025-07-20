import { PackingReport } from "@/app/lib/types";

export abstract class ReportBase {
  abstract generate(
    userId: string,
    filters: Record<string, unknown>,
  ): Promise<PackingReport[]>;
}
