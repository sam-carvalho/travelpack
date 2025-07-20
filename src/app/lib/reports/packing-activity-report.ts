import { TripService } from "@/services/trip-service";
import { ReportBase } from "./base-report";
import { PackingReport, SearchFilters } from "@/app/lib/types";

export class PackingActivityReport extends ReportBase {
  async generate(
    userId: string,
    filters: SearchFilters,
  ): Promise<PackingReport[]> {
    const service = new TripService();
    const trips = await service.getFilteredTripsByUser(userId, filters);

    return trips.flatMap((trip) =>
      trip.packingLists.map((list) => ({
        tripId: trip.id,
        tripName: trip.name,
        destination: trip.destination,
        startDate: trip.startDate.toISOString().split("T")[0],
        endDate: trip.endDate.toISOString().split("T")[0],
        items: list.items.map((item) => ({
          id: item.id,
          name: item.name,
          quantity: item.quantity,
        })),
      })),
    );
  }
}
