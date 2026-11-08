// eslint-disable-next-line @typescript-eslint/no-require-imports
jest.mock("@/app/lib/prisma", () => require("@/test-utils/prisma-mock"));

import { toExportDocument } from "./export-service";

describe("toExportDocument", () => {
  const now = new Date("2026-11-07T12:00:00Z");

  it("maps rows to the v1 schema with ISO dates", () => {
    const doc = toExportDocument(
      {
        categories: [{ id: "c1", name: "Clothing" }],
        trips: [
          {
            id: "t1",
            name: "Lisbon",
            destination: "Portugal",
            startDate: new Date("2027-03-01T00:00:00Z"),
            endDate: new Date("2027-03-05T00:00:00Z"),
            notes: null,
            packingLists: [
              {
                id: "l1",
                name: "Main",
                items: [
                  {
                    id: "i1",
                    name: "Socks",
                    quantity: 4,
                    packed: true,
                    categoryId: "c1",
                    createdAt: new Date("2026-10-01T00:00:00Z"),
                  },
                ],
              },
            ],
          },
        ],
        templates: [],
      },
      now,
    );

    expect(doc).toEqual({
      format: "travelpack",
      schemaVersion: 1,
      exportedAt: "2026-11-07T12:00:00.000Z",
      source: "web",
      categories: [{ id: "c1", name: "Clothing" }],
      trips: [
        {
          id: "t1",
          name: "Lisbon",
          destination: "Portugal",
          startDate: "2027-03-01T00:00:00.000Z",
          endDate: "2027-03-05T00:00:00.000Z",
          notes: null,
          packingLists: [
            {
              id: "l1",
              name: "Main",
              items: [
                {
                  id: "i1",
                  name: "Socks",
                  quantity: 4,
                  packed: true,
                  categoryId: "c1",
                  createdAt: "2026-10-01T00:00:00.000Z",
                },
              ],
            },
          ],
        },
      ],
      templates: [],
    });
  });

  it("drops category references that are not part of the export", () => {
    const doc = toExportDocument(
      {
        categories: [],
        trips: [],
        templates: [
          {
            id: "tpl",
            name: "Beach",
            createdAt: now,
            items: [
              { id: "x", name: "Towel", quantity: 1, categoryId: "foreign" },
            ],
          },
        ],
      },
      now,
    );
    expect(doc.templates[0].items[0].categoryId).toBeNull();
  });
});
