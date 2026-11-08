// eslint-disable-next-line @typescript-eslint/no-require-imports
jest.mock("@/app/lib/prisma", () => require("@/test-utils/prisma-mock"));
jest.mock("@/app/lib/auth", () => ({ getCurrentUser: jest.fn() }));
jest.mock("next/navigation", () => ({
  redirect: jest.fn((url: string) => {
    throw new Error(`REDIRECT:${url}`);
  }),
}));
jest.mock("next/cache", () => ({ revalidatePath: jest.fn() }));
jest.mock("bcrypt", () => ({ hash: jest.fn(async () => "hashed-password") }));
jest.mock("@react-pdf/renderer", () => ({ renderToBuffer: jest.fn() }));
jest.mock("@/app/components/reports/top-category-pdf", () => ({
  TopCategoriesReportPDF: jest.fn(),
}));
jest.mock("@/app/components/reports/most-packed-items-pdf", () => ({
  MostPackedItemsReportPDF: jest.fn(),
}));

import prismaMock, { resetPrismaMock } from "@/test-utils/prisma-mock";
import { getCurrentUser } from "@/app/lib/auth";
import { NotFoundError } from "@/app/lib/authz";
import {
  createCategoryAction as createProfileCategory,
  deleteCategoryAction,
  deleteTemplateAction,
  updateCategoryAction,
  updateUserInfoAction,
} from "@/app/profile/actions";
import {
  createTripAction,
  deleteTripAction,
  updateTripAction,
} from "@/app/trips/actions";
import {
  addPackingItemAction,
  createTemplateAction,
  deletePackingListAction,
  deletePackingListItemAction,
  exportPackingListToLink,
  togglePackedAction,
  updatePackingItemAction,
} from "@/app/trips/[id]/packing-lists/actions";
import { getPackingStats } from "@/app/reports/actions";

const prisma = prismaMock as unknown as Record<
  string,
  Record<string, jest.Mock>
>;
const mockedUser = getCurrentUser as jest.Mock;

const USER_A = { id: "user-a", email: "a@example.com", name: "A" };
const TRIP_ID = "11111111-1111-4111-8111-111111111111";
const LIST_ID = "22222222-2222-4222-8222-222222222222";
const ITEM_ID = "33333333-3333-4333-8333-333333333333";
const CATEGORY_ID = "44444444-4444-4444-8444-444444444444";

function form(fields: Record<string, string>) {
  const fd = new FormData();
  for (const [k, v] of Object.entries(fields)) fd.set(k, v);
  return fd;
}

beforeEach(() => {
  jest.clearAllMocks();
  resetPrismaMock();
  mockedUser.mockResolvedValue(USER_A);
});

describe("updateUserInfoAction", () => {
  const valid = {
    name: "New Name",
    email: "a@example.com",
    password: "",
    confirmPassword: "",
  };

  it("updates the signed-in user, ignoring a forged userId", async () => {
    await updateUserInfoAction(undefined, form({ ...valid, userId: "user-b" }));

    expect(prisma.user.update).toHaveBeenCalledTimes(1);
    expect(prisma.user.update.mock.calls[0][0].where).toEqual({
      id: "user-a",
    });
  });

  it("redirects to sign-in when there is no session", async () => {
    mockedUser.mockResolvedValue(null);
    await expect(
      updateUserInfoAction(undefined, form({ ...valid, userId: "user-b" })),
    ).rejects.toThrow("REDIRECT:/signin");
    expect(prisma.user.update).not.toHaveBeenCalled();
  });

  it("rejects an email that belongs to another account", async () => {
    prisma.user.findUnique.mockResolvedValue({ id: "user-b" });
    const result = await updateUserInfoAction(
      undefined,
      form({ ...valid, email: "b@example.com" }),
    );
    expect(result).toEqual({ errors: { email: ["Email already in use"] } });
    expect(prisma.user.update).not.toHaveBeenCalled();
  });

  it("enforces the sign-up password rules", async () => {
    const result = await updateUserInfoAction(
      undefined,
      form({ ...valid, password: "weak", confirmPassword: "weak" }),
    );
    expect(result).toHaveProperty("errors.password");
    expect(prisma.user.update).not.toHaveBeenCalled();
  });

  it("rejects mismatched passwords", async () => {
    const result = await updateUserInfoAction(
      undefined,
      form({ ...valid, password: "Str0ng!pass", confirmPassword: "other" }),
    );
    expect(result).toEqual({
      errors: { confirmPassword: ["Passwords do not match"] },
    });
  });
});

describe("item actions", () => {
  it("togglePackedAction refuses items the user does not own", async () => {
    prisma.item.findFirst.mockResolvedValue(null);
    await expect(
      togglePackedAction(form({ itemId: ITEM_ID, packed: "on" })),
    ).rejects.toBeInstanceOf(NotFoundError);

    expect(prisma.item.findFirst.mock.calls[0][0].where).toEqual({
      id: ITEM_ID,
      packingList: { trip: { userId: "user-a" } },
    });
    expect(prisma.item.update).not.toHaveBeenCalled();
  });

  it("togglePackedAction updates owned items", async () => {
    prisma.item.findFirst.mockResolvedValue({
      id: ITEM_ID,
      packingListId: LIST_ID,
      packingList: { tripId: TRIP_ID },
    });
    await togglePackedAction(form({ itemId: ITEM_ID, packed: "on" }));
    expect(prisma.item.update).toHaveBeenCalledWith({
      where: { id: ITEM_ID },
      data: { packed: true },
    });
  });

  it("togglePackedAction rejects malformed ids without querying", async () => {
    await expect(
      togglePackedAction(form({ itemId: "not-a-uuid" })),
    ).rejects.toBeInstanceOf(NotFoundError);
    expect(prisma.item.findFirst).not.toHaveBeenCalled();
  });

  it("deletePackingListItemAction refuses items the user does not own", async () => {
    prisma.item.findFirst.mockResolvedValue(null);
    await expect(deletePackingListItemAction(ITEM_ID)).rejects.toBeInstanceOf(
      NotFoundError,
    );
    expect(prisma.item.delete).not.toHaveBeenCalled();
  });

  it("updatePackingItemAction refuses items the user does not own", async () => {
    prisma.item.findFirst.mockResolvedValue(null);
    await expect(
      updatePackingItemAction(ITEM_ID, {
        name: "Socks",
        quantity: 2,
        categoryId: null,
      }),
    ).rejects.toBeInstanceOf(NotFoundError);
    expect(prisma.item.update).not.toHaveBeenCalled();
  });

  it("addPackingItemAction refuses lists the user does not own", async () => {
    prisma.packingList.findFirst.mockResolvedValue(null);
    await expect(
      addPackingItemAction(LIST_ID, { name: "Socks", quantity: 2 }),
    ).rejects.toBeInstanceOf(NotFoundError);
    expect(prisma.packingList.findFirst.mock.calls[0][0].where).toEqual({
      id: LIST_ID,
      trip: { userId: "user-a" },
    });
    expect(prisma.item.create).not.toHaveBeenCalled();
  });

  it("addPackingItemAction refuses another user's category", async () => {
    prisma.packingList.findFirst.mockResolvedValue({
      id: LIST_ID,
      tripId: TRIP_ID,
    });
    prisma.category.findFirst.mockResolvedValue(null);
    await expect(
      addPackingItemAction(LIST_ID, {
        name: "Socks",
        quantity: 2,
        categoryId: CATEGORY_ID,
      }),
    ).rejects.toBeInstanceOf(NotFoundError);
    expect(prisma.category.findFirst.mock.calls[0][0].where).toEqual({
      id: CATEGORY_ID,
      userId: "user-a",
    });
    expect(prisma.item.create).not.toHaveBeenCalled();
  });

  it("addPackingItemAction validates input", async () => {
    prisma.packingList.findFirst.mockResolvedValue({
      id: LIST_ID,
      tripId: TRIP_ID,
    });
    await expect(
      addPackingItemAction(LIST_ID, { name: "  ", quantity: 1 }),
    ).rejects.toThrow();
    await expect(
      addPackingItemAction(LIST_ID, { name: "Socks", quantity: 0 }),
    ).rejects.toThrow();
    await expect(
      addPackingItemAction(LIST_ID, { name: "x".repeat(101), quantity: 1 }),
    ).rejects.toThrow();
    expect(prisma.item.create).not.toHaveBeenCalled();
  });

  it("addPackingItemAction creates items on owned lists", async () => {
    prisma.packingList.findFirst.mockResolvedValue({
      id: LIST_ID,
      tripId: TRIP_ID,
    });
    await addPackingItemAction(LIST_ID, { name: " Socks ", quantity: 3 });
    expect(prisma.item.create).toHaveBeenCalledWith({
      data: {
        name: "Socks",
        quantity: 3,
        categoryId: null,
        packed: false,
        packingListId: LIST_ID,
      },
    });
  });
});

describe("list, trip, template and category actions", () => {
  it("deletePackingListAction refuses lists the user does not own", async () => {
    prisma.packingList.findFirst.mockResolvedValue(null);
    await expect(deletePackingListAction(LIST_ID)).rejects.toBeInstanceOf(
      NotFoundError,
    );
    expect(prisma.packingList.delete).not.toHaveBeenCalled();
  });

  it("createTemplateAction refuses lists the user does not own", async () => {
    prisma.packingList.findFirst.mockResolvedValue(null);
    await expect(createTemplateAction(LIST_ID)).rejects.toBeInstanceOf(
      NotFoundError,
    );
    expect(prisma.template.create).not.toHaveBeenCalled();
  });

  it("createTripAction creates the trip for the session user", async () => {
    await expect(
      createTripAction({
        name: "Lisbon",
        destination: "Portugal",
        startDate: new Date("2027-03-01"),
        endDate: new Date("2027-03-05"),
      }),
    ).rejects.toThrow("REDIRECT:/trips");
    expect(prisma.trip.create.mock.calls[0][0].data.userId).toBe("user-a");
  });

  it("createTripAction rejects an end date before the start date", async () => {
    await expect(
      createTripAction({
        name: "Lisbon",
        destination: "Portugal",
        startDate: new Date("2027-03-05"),
        endDate: new Date("2027-03-01"),
      }),
    ).rejects.toThrow("End date must be after start date");
    expect(prisma.trip.create).not.toHaveBeenCalled();
  });

  it("updateTripAction refuses trips the user does not own", async () => {
    prisma.trip.findFirst.mockResolvedValue(null);
    await expect(
      updateTripAction(TRIP_ID, { name: "Hijacked" }),
    ).rejects.toBeInstanceOf(NotFoundError);
    expect(prisma.trip.updateMany).not.toHaveBeenCalled();
  });

  it("deleteTripAction is scoped to the session user", async () => {
    await expect(deleteTripAction(TRIP_ID)).rejects.toThrow("REDIRECT:/trips");
    expect(prisma.trip.deleteMany).toHaveBeenCalledWith({
      where: { id: TRIP_ID, userId: "user-a" },
    });
  });

  it("category and template actions are scoped to the session user", async () => {
    prisma.category.create.mockResolvedValue({ id: CATEGORY_ID, name: "Gear" });
    await createProfileCategory("Gear");
    expect(prisma.category.create.mock.calls[0][0].data.userId).toBe("user-a");

    await updateCategoryAction(CATEGORY_ID, "Renamed");
    expect(prisma.category.updateMany.mock.calls[0][0].where).toEqual({
      id: CATEGORY_ID,
      userId: "user-a",
    });

    await deleteCategoryAction(CATEGORY_ID);
    expect(prisma.category.deleteMany.mock.calls[0][0].where).toEqual({
      id: CATEGORY_ID,
      userId: "user-a",
    });

    await deleteTemplateAction("template-1");
    expect(prisma.template.deleteMany.mock.calls[0][0].where).toEqual({
      id: "template-1",
      userId: "user-a",
    });
  });
});

describe("exportPackingListToLink", () => {
  it("refuses lists the user does not own", async () => {
    prisma.packingList.findFirst.mockResolvedValue(null);
    await expect(exportPackingListToLink(LIST_ID)).rejects.toBeInstanceOf(
      NotFoundError,
    );
    expect(prisma.sharedPackingList.create).not.toHaveBeenCalled();
  });

  it("builds the snapshot from the database with category names only", async () => {
    prisma.packingList.findFirst.mockResolvedValue({
      id: LIST_ID,
      tripId: TRIP_ID,
    });
    prisma.packingList.findUnique.mockResolvedValue({
      id: LIST_ID,
      name: "Main",
      tripId: TRIP_ID,
      trip: {
        name: "Lisbon",
        destination: "Portugal",
        startDate: new Date("2027-03-01"),
        endDate: new Date("2027-03-05"),
        notes: null,
      },
    });
    prisma.item.findMany.mockResolvedValue([
      {
        id: ITEM_ID,
        name: "Socks",
        quantity: 4,
        categoryId: CATEGORY_ID,
        category: { id: CATEGORY_ID, name: "Clothing", userId: "user-a" },
      },
    ]);
    prisma.sharedPackingList.create.mockResolvedValue({ id: "shared-1" });

    await exportPackingListToLink(LIST_ID);

    const data = prisma.sharedPackingList.create.mock.calls[0][0].data;
    expect(data.items).toEqual([
      { name: "Socks", quantity: 4, categoryName: "Clothing" },
    ]);
    expect(JSON.stringify(data)).not.toContain(CATEGORY_ID);
  });
});

describe("reports", () => {
  it("are computed for the session user only", async () => {
    prisma.item.aggregate.mockResolvedValue({ _sum: { quantity: 0 } });
    await getPackingStats();
    expect(prisma.trip.count).toHaveBeenCalledWith({
      where: { userId: "user-a" },
    });
  });

  it("redirect when signed out", async () => {
    mockedUser.mockResolvedValue(null);
    await expect(getPackingStats()).rejects.toThrow("REDIRECT:/signin");
  });
});
