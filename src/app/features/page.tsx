import type { Metadata } from "next";
import AppStoreButton from "@/components/app-store-button";
import Phone from "@/components/phone";

export const metadata: Metadata = {
  title: "Features",
  description: "Everything TravelPack does: smart lists, bags, post-trip learning, reminders, documents and privacy.",
};

type Feature = { title: string; body: string; pro?: boolean };

const groups: { title: string; intro: string; screen?: { src: string; alt: string }; features: Feature[] }[] = [
  {
    title: "Lists that build themselves",
    intro: "Start with a real list, not a blank page.",
    screen: { src: "/screens/list.png", alt: "A packing list with quantities scaled to the trip" },
    features: [
      { title: "Starter templates by trip type", body: "Beach, city, business, ski, camping, road trip, international and with a baby. Pick several and they merge without duplicates." },
      { title: "Quantities that scale", body: "Socks and underwear follow the number of nights. Change the dates and the list updates." },
      { title: "AI drafts on your iPhone", body: "Apple Intelligence drafts a list for your destination and dates. You review every item before it's added.", pro: true },
      { title: "Quick-add", body: "Type “3 t-shirts” and it lands in Clothing with a quantity of 3. Autocomplete remembers what you've packed before." },
      { title: "Your own templates", body: "Save any list as a template, edit it, and reuse it.", pro: true },
    ],
  },
  {
    title: "Organized your way",
    intro: "One simple list, or one section per bag.",
    screen: { src: "/screens/bags.png", alt: "Choosing carry-on and checked bags for a trip" },
    features: [
      { title: "Optional bags", body: "Turn on carry-on, checked, backpack or your own bags. Each gets its own section and progress. Leave them off to keep one list." },
      { title: "Pack last", body: "Toothbrush, chargers and passport go in a separate checklist for the morning you leave." },
      { title: "Before-you-go to-dos", body: "Check in online, water the plants, tell your bank you're traveling. Suggested when they fit the trip." },
    ],
  },
  {
    title: "Learns from every trip",
    intro: "Your lists get shorter and better.",
    screen: { src: "/screens/review.png", alt: "Reviewing which items were used after a trip" },
    features: [
      { title: "Post-trip review", body: "Mark what you used. Things you never touch get flagged on similar trips." },
      { title: "Never forget it twice", body: "Anything you forgot is suggested next time, right on the trip screen." },
    ],
  },
  {
    title: "Right on time",
    intro: "Help at the moments you need it.",
    features: [
      { title: "Reminders", body: "Two days before, on departure morning for your pack-last items, when it's time to repack, and a nudge to review when you're home." },
      { title: "Widgets and Live Activity", body: "See what's left on your Home Screen, and your pack-last checklist on the Lock Screen on departure day." },
      { title: "Documents check", body: "Warns if your passport expires within six months of your return, and reminds you about visas and travel insurance." },
      { title: "Siri and Shortcuts", body: "“What's left to pack?” or “Add sunscreen to my Lisbon list”, hands-free." },
    ],
  },
  {
    title: "Private and yours",
    intro: "Built so we never see your data.",
    features: [
      { title: "No account", body: "Nothing to sign up for. Purchases restore with your Apple ID." },
      { title: "Stays on your iPhone", body: "Trips, lists and documents are stored on your device, protected by iOS file encryption, with an optional Face ID lock." },
      { title: "Share as a file", body: "Send a trip and its lists to family by AirDrop or Messages as a .travelpack file. You see a preview before anything is imported." },
    ],
  },
];

export default function Features() {
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6">
      <header className="pt-14 pb-6 sm:pt-20">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Features</h1>
        <p className="mt-4 max-w-2xl text-lg text-muted">
          Everything in TravelPack for iPhone. Features marked Pro are part of the optional upgrade; everything else is
          free.
        </p>
      </header>

      {groups.map((group) => (
        <section
          key={group.title}
          className={`grid items-start gap-10 border-t border-border py-14 ${group.screen ? "lg:grid-cols-[1fr_300px]" : ""}`}
        >
          <div>
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">{group.title}</h2>
            <p className="mt-2 text-muted">{group.intro}</p>
            <dl className="mt-8 grid gap-x-10 gap-y-7 sm:grid-cols-2">
              {group.features.map((f) => (
                <div key={f.title}>
                  <dt className="flex items-center gap-2 font-semibold">
                    {f.title}
                    {f.pro && (
                      <span className="rounded-md bg-accent-soft px-1.5 py-0.5 text-xs font-semibold text-accent-strong">
                        Pro
                      </span>
                    )}
                  </dt>
                  <dd className="mt-1.5 leading-relaxed text-muted">{f.body}</dd>
                </div>
              ))}
            </dl>
          </div>
          {group.screen && (
            <div className="mx-auto w-[60%] max-w-[300px] lg:w-full">
              <Phone src={group.screen.src} alt={group.screen.alt} />
            </div>
          )}
        </section>
      ))}

      <section className="border-t border-border pt-14 text-center">
        <h2 className="text-2xl font-bold tracking-tight">Requirements</h2>
        <p className="mx-auto mt-3 max-w-xl text-muted">
          iPhone with iOS 27 or later. AI drafts need an iPhone that supports Apple Intelligence, with it turned on.
        </p>
        <AppStoreButton className="mt-8" />
      </section>
    </div>
  );
}
