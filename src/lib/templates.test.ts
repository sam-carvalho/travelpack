import { fileName, quantityFor, templates, toTravelPackDocument, tripTypeTitles } from "./templates";

// Mirrors the iOS decoder (TravelPackDocument.swift), which rejects unknown keys.
const allowed = {
  document: ["format", "schemaVersion", "exportedAt", "source", "categories", "trips", "templates"],
  category: ["id", "name"],
  template: ["id", "name", "createdAt", "items", "tripTypes"],
  item: ["id", "name", "quantity", "categoryId", "scaling", "scalingOffset", "packLast"],
};

const onlyKeys = (value: object, keys: string[]) =>
  expect(Object.keys(value).filter((k) => !keys.includes(k))).toEqual([]);

describe("templates", () => {
  it("have unique slugs that are safe in a file name", () => {
    const slugs = templates.map((t) => t.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    slugs.forEach((slug) => expect(slug).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/));
  });

  it("stay within the app's import limits", () => {
    for (const t of templates) {
      expect(t.name.length).toBeLessThanOrEqual(100);
      expect(t.items.length).toBeGreaterThan(0);
      expect(t.items.length).toBeLessThanOrEqual(500);
      expect(t.tripTypes.every((type) => type in tripTypeTitles)).toBe(true);
      expect(new Set(t.items.map((i) => i.name.toLowerCase())).size).toBe(t.items.length);
      for (const item of t.items) {
        expect(item.name.length).toBeLessThanOrEqual(100);
        expect(item.category.length).toBeLessThanOrEqual(50);
        expect(item.quantity).toBeGreaterThanOrEqual(1);
        expect(item.quantity).toBeLessThanOrEqual(999);
        expect(Math.abs(item.offset ?? 0)).toBeLessThanOrEqual(10);
      }
    }
  });

  it("export as strict .travelpack schema v1 documents", () => {
    const exportedAt = new Date("2026-11-08T12:00:00Z");
    for (const t of templates) {
      const doc = toTravelPackDocument(t, exportedAt);
      onlyKeys(doc, allowed.document);
      expect(doc).toMatchObject({ format: "travelpack", schemaVersion: 1, source: "web", trips: [] });
      expect(doc.exportedAt).toBe("2026-11-08T12:00:00.000Z");
      doc.categories.forEach((c) => onlyKeys(c, allowed.category));
      expect(doc.templates).toHaveLength(1);
      const [template] = doc.templates;
      onlyKeys(template, allowed.template);
      const categoryIds = new Set(doc.categories.map((c) => c.id));
      for (const item of template.items) {
        onlyKeys(item, allowed.item);
        expect(categoryIds.has(item.categoryId)).toBe(true);
        expect(["fixed", "perNight", "perDay"]).toContain(item.scaling);
      }
      expect(JSON.stringify(doc).length).toBeLessThan(1_000_000);
    }
  });

  it("name files with the .travelpack extension", () => {
    expect(fileName(templates[0])).toBe(`${templates[0].slug}.travelpack`);
  });

  it("scale quantities like the app", () => {
    expect(quantityFor({ name: "Socks", quantity: 1, category: "C", scaling: "perNight", offset: 1 }, 4)).toBe(5);
    expect(quantityFor({ name: "Tops", quantity: 1, category: "C", scaling: "perDay" }, 4)).toBe(5);
    expect(quantityFor({ name: "Hat", quantity: 2, category: "C" }, 4)).toBe(2);
  });
});
