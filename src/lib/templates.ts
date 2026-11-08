// Curated templates, served as `.travelpack` schema v1 files that the iOS app imports.
// The app decodes strictly: only the keys below are allowed.

export type Scaling = "fixed" | "perNight" | "perDay";
export type TripType =
  | "beach"
  | "city"
  | "business"
  | "ski"
  | "camping"
  | "baby"
  | "international"
  | "roadTrip";

export const tripTypeTitles: Record<TripType, string> = {
  beach: "Beach",
  city: "City break",
  business: "Business",
  ski: "Ski",
  camping: "Camping",
  baby: "With a baby",
  international: "International",
  roadTrip: "Road trip",
};

export interface TemplateItem {
  name: string;
  quantity: number;
  category: string;
  scaling?: Scaling;
  offset?: number;
  packLast?: boolean;
}

export interface Template {
  slug: string;
  name: string;
  summary: string;
  tripTypes: TripType[];
  items: TemplateItem[];
}

const C = "Clothing";
const T = "Toiletries";
const E = "Electronics";
const D = "Travel Documents";
const G = "Gear";
const B = "Baby";

const perNight = (offset = 0) => ({ scaling: "perNight" as const, offset });
const perDay = (offset = 0) => ({ scaling: "perDay" as const, offset });
const last = { packLast: true };

export const templates: Template[] = [
  {
    slug: "carry-on-weekend",
    name: "Carry-on weekend",
    summary: "Two or three nights, one small bag, nothing extra.",
    tripTypes: ["city"],
    items: [
      { name: "Underwear", quantity: 1, category: C, ...perNight(1) },
      { name: "Socks", quantity: 1, category: C, ...perNight(1) },
      { name: "T-shirts", quantity: 1, category: C, ...perDay() },
      { name: "Jeans", quantity: 1, category: C },
      { name: "Sweater", quantity: 1, category: C },
      { name: "Comfortable shoes", quantity: 1, category: C },
      { name: "Toiletry bag (liquids under 100 ml)", quantity: 1, category: T },
      { name: "Toothbrush", quantity: 1, category: T, ...last },
      { name: "Phone charger", quantity: 1, category: E, ...last },
      { name: "Earbuds", quantity: 1, category: E },
      { name: "ID", quantity: 1, category: D, ...last },
      { name: "Tote bag", quantity: 1, category: G },
    ],
  },
  {
    slug: "long-haul-flight",
    name: "Long-haul flight kit",
    summary: "What goes in your personal item for 8+ hours in the air.",
    tripTypes: ["international"],
    items: [
      { name: "Passport", quantity: 1, category: D, ...last },
      { name: "Boarding pass", quantity: 1, category: D, ...last },
      { name: "Pen for arrival forms", quantity: 1, category: D },
      { name: "Neck pillow", quantity: 1, category: G },
      { name: "Eye mask", quantity: 1, category: G },
      { name: "Earplugs", quantity: 1, category: G },
      { name: "Empty water bottle", quantity: 1, category: G },
      { name: "Snacks", quantity: 2, category: G },
      { name: "Compression socks", quantity: 1, category: C },
      { name: "Warm layer", quantity: 1, category: C },
      { name: "Spare top", quantity: 1, category: C },
      { name: "Noise-cancelling headphones", quantity: 1, category: E },
      { name: "Power bank", quantity: 1, category: E, ...last },
      { name: "Travel adapter", quantity: 1, category: E },
      { name: "Lip balm", quantity: 1, category: T },
      { name: "Moisturizer (travel size)", quantity: 1, category: T },
      { name: "Toothbrush and toothpaste", quantity: 1, category: T },
    ],
  },
  {
    slug: "beach-week-with-kids",
    name: "Beach week with kids",
    summary: "Sun, sand and snacks for the whole family.",
    tripTypes: ["beach", "baby"],
    items: [
      { name: "Kids' swimsuits", quantity: 2, category: C },
      { name: "Rash guards", quantity: 2, category: C },
      { name: "Kids' sun hats", quantity: 2, category: C },
      { name: "Water shoes", quantity: 1, category: C },
      { name: "Kids' outfits", quantity: 1, category: C, ...perDay(1) },
      { name: "Kids' sunscreen", quantity: 1, category: T },
      { name: "After-sun lotion", quantity: 1, category: T },
      { name: "Swim diapers", quantity: 3, category: B, ...perDay() },
      { name: "Beach toys", quantity: 1, category: G },
      { name: "Beach tent or umbrella", quantity: 1, category: G },
      { name: "Beach towels", quantity: 4, category: G },
      { name: "Cooler bag", quantity: 1, category: G },
      { name: "Refillable water bottles", quantity: 3, category: G },
      { name: "Snacks", quantity: 1, category: G, ...last },
      { name: "Kids' medicine and thermometer", quantity: 1, category: T, ...last },
    ],
  },
  {
    slug: "winter-city-break",
    name: "Winter city break",
    summary: "Staying warm while walking a city at −15 °C.",
    tripTypes: ["city"],
    items: [
      { name: "Insulated winter coat", quantity: 1, category: C },
      { name: "Waterproof winter boots", quantity: 1, category: C },
      { name: "Thermal base layers", quantity: 2, category: C },
      { name: "Wool socks", quantity: 1, category: C, ...perDay() },
      { name: "Toque", quantity: 1, category: C },
      { name: "Mittens", quantity: 1, category: C },
      { name: "Scarf or neck warmer", quantity: 1, category: C },
      { name: "Sweaters", quantity: 2, category: C },
      { name: "Hand warmers", quantity: 4, category: G },
      { name: "Lip balm", quantity: 1, category: T },
      { name: "Rich moisturizer", quantity: 1, category: T },
      { name: "Touchscreen gloves", quantity: 1, category: E },
      { name: "Power bank (cold drains batteries)", quantity: 1, category: E, ...last },
    ],
  },
  {
    slug: "business-conference",
    name: "Business conference",
    summary: "Talks by day, dinners by night, a laptop always charged.",
    tripTypes: ["business"],
    items: [
      { name: "Laptop", quantity: 1, category: E, ...last },
      { name: "Laptop charger", quantity: 1, category: E, ...last },
      { name: "USB-C hub or adapters", quantity: 1, category: E },
      { name: "Power bank", quantity: 1, category: E },
      { name: "Badge or registration email", quantity: 1, category: D },
      { name: "Business cards", quantity: 1, category: D },
      { name: "Work tops", quantity: 1, category: C, ...perDay() },
      { name: "Blazer", quantity: 1, category: C },
      { name: "Dinner outfit", quantity: 1, category: C },
      { name: "Comfortable dress shoes", quantity: 1, category: C },
      { name: "Underwear", quantity: 1, category: C, ...perNight(1) },
      { name: "Socks", quantity: 1, category: C, ...perNight(1) },
      { name: "Notebook and pen", quantity: 1, category: G },
      { name: "Refillable water bottle", quantity: 1, category: G },
      { name: "Mints", quantity: 1, category: T },
    ],
  },
  {
    slug: "wedding-weekend",
    name: "Wedding guest weekend",
    summary: "The outfit, the gift, and everything you'll wish you'd brought.",
    tripTypes: ["city"],
    items: [
      { name: "Wedding outfit", quantity: 1, category: C, ...last },
      { name: "Dress shoes", quantity: 1, category: C },
      { name: "Flats or spare shoes for dancing", quantity: 1, category: C },
      { name: "Rehearsal dinner outfit", quantity: 1, category: C },
      { name: "Casual outfits", quantity: 1, category: C, ...perDay() },
      { name: "Garment bag", quantity: 1, category: G },
      { name: "Gift and card", quantity: 1, category: G, ...last },
      { name: "Clutch or small bag", quantity: 1, category: G },
      { name: "Steamer or wrinkle spray", quantity: 1, category: G },
      { name: "Blister plasters", quantity: 1, category: T },
      { name: "Makeup and touch-up kit", quantity: 1, category: T },
      { name: "Phone charger", quantity: 1, category: E, ...last },
    ],
  },
  {
    slug: "camping-weekend",
    name: "Camping weekend",
    summary: "Two nights at a drive-in campsite.",
    tripTypes: ["camping"],
    items: [
      { name: "Tent", quantity: 1, category: G },
      { name: "Sleeping bags", quantity: 1, category: G },
      { name: "Sleeping pads", quantity: 1, category: G },
      { name: "Camp stove and fuel", quantity: 1, category: G },
      { name: "Lighter or matches", quantity: 1, category: G },
      { name: "Cooler", quantity: 1, category: G, ...last },
      { name: "Pots, plates and utensils", quantity: 1, category: G },
      { name: "Headlamps", quantity: 1, category: G },
      { name: "Water jug", quantity: 1, category: G },
      { name: "Camp chairs", quantity: 2, category: G },
      { name: "First-aid kit", quantity: 1, category: G },
      { name: "Rain jacket", quantity: 1, category: C },
      { name: "Fleece", quantity: 1, category: C },
      { name: "Hiking socks", quantity: 1, category: C, ...perDay() },
      { name: "Insect repellent", quantity: 1, category: T },
      { name: "Biodegradable soap", quantity: 1, category: T },
      { name: "Campsite reservation", quantity: 1, category: D },
    ],
  },
  {
    slug: "road-trip-with-a-toddler",
    name: "Road trip with a toddler",
    summary: "Hours in the car without anyone melting down.",
    tripTypes: ["roadTrip", "baby"],
    items: [
      { name: "Car seat", quantity: 1, category: B },
      { name: "Diapers", quantity: 5, category: B, ...perDay() },
      { name: "Wipes", quantity: 2, category: B },
      { name: "Change of clothes in reach", quantity: 2, category: B },
      { name: "Toddler outfits", quantity: 1, category: B, ...perDay(1) },
      { name: "Sippy cups", quantity: 2, category: B },
      { name: "Snacks", quantity: 1, category: B, ...last },
      { name: "Favorite toy or blanket", quantity: 1, category: B, ...last },
      { name: "Tablet with downloaded shows", quantity: 1, category: E },
      { name: "Kids' headphones", quantity: 1, category: E },
      { name: "Car charger", quantity: 1, category: E },
      { name: "Window sun shades", quantity: 2, category: G },
      { name: "Garbage bags", quantity: 3, category: G },
      { name: "Paper towels", quantity: 1, category: G },
      { name: "Travel potty", quantity: 1, category: G },
      { name: "Kids' medicine", quantity: 1, category: T },
      { name: "Driver's license", quantity: 1, category: D, ...last },
    ],
  },
];

export function findTemplate(slug: string): Template | undefined {
  return templates.find((t) => t.slug === slug);
}

export function fileName(template: Template): string {
  return `${template.slug}.travelpack`;
}

export function categoriesOf(template: Template): string[] {
  return [...new Set(template.items.map((i) => i.category))];
}

const categoryId = (name: string) =>
  "cat-" + name.toLowerCase().replace(/[^a-z0-9]+/g, "-");

export function toTravelPackDocument(template: Template, exportedAt: Date) {
  return {
    format: "travelpack",
    schemaVersion: 1,
    exportedAt: exportedAt.toISOString(),
    source: "web",
    categories: categoriesOf(template).map((name) => ({
      id: categoryId(name),
      name,
    })),
    trips: [],
    templates: [
      {
        id: `web.${template.slug}`,
        name: template.name,
        tripTypes: template.tripTypes,
        items: template.items.map((item, index) => ({
          id: `${template.slug}-${index + 1}`,
          name: item.name,
          quantity: item.quantity,
          categoryId: categoryId(item.category),
          scaling: item.scaling ?? "fixed",
          scalingOffset: item.offset ?? 0,
          packLast: item.packLast ?? false,
        })),
      },
    ],
  };
}

/** Example quantity for a trip of `nights` nights, matching the app's QuantityScaler. */
export function quantityFor(item: TemplateItem, nights: number): number {
  const offset = item.offset ?? 0;
  const raw =
    item.scaling === "perNight"
      ? item.quantity * nights + offset
      : item.scaling === "perDay"
        ? item.quantity * (nights + 1) + offset
        : item.quantity;
  return Math.min(999, Math.max(1, raw));
}
