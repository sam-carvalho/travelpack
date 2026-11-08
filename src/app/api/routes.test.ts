// eslint-disable-next-line @typescript-eslint/no-require-imports
jest.mock("@/app/lib/prisma", () => require("@/test-utils/prisma-mock"));
jest.mock("@/app/lib/auth", () => ({ getCurrentUser: jest.fn() }));
jest.mock("next/navigation", () => ({
  redirect: jest.fn((url: string) => {
    throw new Error(`REDIRECT:${url}`);
  }),
}));
jest.mock("@react-pdf/renderer", () => ({
  renderToBuffer: jest.fn(async () => Buffer.from("%PDF")),
}));
jest.mock("@/app/components/lists/list-pdf", () => ({
  PackingListPdf: () => null,
}));

import prismaMock, { resetPrismaMock } from "@/test-utils/prisma-mock";
import { getCurrentUser } from "@/app/lib/auth";
import { GET as exportPdf } from "@/app/api/export-pdf/route";
import { GET as exportData } from "@/app/api/export-data/route";
import type { NextRequest } from "next/server";

const prisma = prismaMock as unknown as Record<
  string,
  Record<string, jest.Mock>
>;
const mockedUser = getCurrentUser as jest.Mock;
const LIST_ID = "22222222-2222-4222-8222-222222222222";

const pdfRequest = (id?: string) =>
  ({
    url: `https://travelpack.test/api/export-pdf${id ? `?packingListId=${id}` : ""}`,
  }) as unknown as NextRequest;

beforeEach(() => {
  jest.clearAllMocks();
  resetPrismaMock();
  mockedUser.mockResolvedValue({ id: "user-a", email: "a@example.com" });
});

describe("GET /api/export-pdf", () => {
  it("requires a session", async () => {
    mockedUser.mockResolvedValue(null);
    const res = await exportPdf(pdfRequest(LIST_ID));
    expect(res.status).toBe(401);
    expect(prisma.packingList.findFirst).not.toHaveBeenCalled();
  });

  it("returns 404 for another user's list", async () => {
    prisma.packingList.findFirst.mockResolvedValue(null);
    const res = await exportPdf(pdfRequest(LIST_ID));
    expect(res.status).toBe(404);
    expect(prisma.packingList.findUnique).not.toHaveBeenCalled();
  });

  it("returns 400 without a list id", async () => {
    const res = await exportPdf(pdfRequest());
    expect(res.status).toBe(400);
  });

  it("renders owned lists with a safe file name", async () => {
    prisma.packingList.findFirst.mockResolvedValue({
      id: LIST_ID,
      tripId: "t",
    });
    prisma.packingList.findUnique.mockResolvedValue({
      id: LIST_ID,
      name: 'Evil"\r\nSet-Cookie: x=1',
      trip: {},
    });
    prisma.item.findMany.mockResolvedValue([]);

    const res = await exportPdf(pdfRequest(LIST_ID));
    expect(res.status).toBe(200);
    const disposition = res.headers.get("Content-Disposition") ?? "";
    expect(disposition).not.toMatch(/[\r\n]/);
    expect(disposition).toMatch(/^attachment; filename="[^"]*"; filename\*=/);
  });
});

describe("GET /api/export-data", () => {
  it("requires a session", async () => {
    mockedUser.mockResolvedValue(null);
    const res = await exportData();
    expect(res.status).toBe(401);
    expect(prisma.trip.findMany).not.toHaveBeenCalled();
  });

  it("exports only the signed-in user's data", async () => {
    prisma.category.findMany.mockResolvedValue([{ id: "c1", name: "Clothing" }]);
    prisma.trip.findMany.mockResolvedValue([]);
    prisma.template.findMany.mockResolvedValue([]);

    const res = await exportData();
    expect(res.status).toBe(200);
    for (const model of ["category", "trip", "template"]) {
      expect(prisma[model].findMany.mock.calls[0][0].where).toEqual({
        userId: "user-a",
      });
    }
    expect(res.headers.get("Content-Disposition")).toContain(".travelpack");
    expect(res.headers.get("Cache-Control")).toBe("no-store");

    const body = JSON.parse(await res.text());
    expect(body).toMatchObject({
      format: "travelpack",
      schemaVersion: 1,
      categories: [{ id: "c1", name: "Clothing" }],
    });
  });
});
