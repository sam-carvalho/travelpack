import { Category } from "@/app/lib/types";
import { buildOptions, formatOption } from "./formatSelectOption";

describe("formatOption", () => {
  it("returns object with label and value", () => {
    const result = formatOption("Clothes", "123");
    expect(result).toEqual({ label: "Clothes", value: "123" });
  });
});

describe("buildOptions", () => {
  it("returns empty array if categories is undefined", () => {
    expect(buildOptions(undefined)).toEqual([]);
  });

  it("maps categories to label/value pairs", () => {
    const categories: Category[] = [
      { id: "1", name: "Clothes", userId: "abc" },
      { id: "2", name: "Electronics", userId: "abc" },
    ];
    const result = buildOptions(categories);
    expect(result).toEqual([
      { label: "Clothes", value: "1" },
      { label: "Electronics", value: "2" },
    ]);
  });
});
