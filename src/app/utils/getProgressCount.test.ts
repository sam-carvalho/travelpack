import { PackingList } from "@/app/lib/types";
import { getProgressCounts } from "./getProgressCount";

describe("getProgressCounts", () => {
  it("returns 0s if list is null", () => {
    expect(getProgressCounts(null)).toEqual({ totalCount: 0, progress: 0 });
  });

  it("returns 0s if list has no items", () => {
    const list = { items: [] } as unknown as PackingList;
    expect(getProgressCounts(list)).toEqual({ totalCount: 0, progress: 0 });
  });

  it("calculates correct progress", () => {
    const list: PackingList = {
      id: "1",
      name: "trip1",
      tripId: "trip1",
      items: [
        {
          id: "a",
          name: "Shirt",
          packed: true,
          quantity: 0,
          packingListId: "",
          categoryId: null,
        },
        {
          id: "b",
          name: "Toothbrush",
          packed: false,
          quantity: 0,
          packingListId: "",
          categoryId: null,
        },
        {
          id: "c",
          name: "Charger",
          packed: true,
          quantity: 0,
          packingListId: "",
          categoryId: null,
        },
      ],
    };
    expect(getProgressCounts(list)).toEqual({ totalCount: 3, progress: 67 });
  });
});
