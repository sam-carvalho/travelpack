import { ReportRecord } from "@/app/lib/types";
import { PDFExporter } from "../pdf-export-service";

export abstract class BaseReport {
  protected userId: string;
  protected title: string;
  protected timestamp: Date;
  protected data: ReportRecord[];

  constructor(userId: string, title: string) {
    this.userId = userId;
    this.title = title;
    this.timestamp = new Date();
    this.data = [];
  }

  abstract fetchData(): Promise<void>;

  getMetadata() {
    return {
      title: this.title,
      timestamp: this.timestamp.toISOString(),
      userId: this.userId,
    };
  }

  async exportToPDF(): Promise<Buffer> {
    const exporter = new PDFExporter(this.title, this.timestamp, this.data);
    return exporter.generate();
  }

  getTabularData(): ReportRecord[] {
    return this.data;
  }
}
