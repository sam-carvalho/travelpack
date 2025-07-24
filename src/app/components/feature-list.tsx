import {
  CalendarDaysIcon,
  ClipboardDocumentListIcon,
  ChartPieIcon,
} from "@heroicons/react/24/outline";

const features = [
  {
    title: "Manage Trips",
    description: "Keep all your travel details in one place.",
    icon: <CalendarDaysIcon className="mx-auto h-8 w-8" />,
  },
  {
    title: "Create Checklists",
    description: "Build personalized packing lists for your journeys.",
    icon: <ClipboardDocumentListIcon className="mx-auto h-8 w-8" />,
  },
  {
    title: "Track Progress",
    description: "Monitor your packing progress with ease.",
    icon: <ChartPieIcon className="mx-auto h-8 w-8" />,
  },
];

export default function FeatureList() {
  return (
    <section className="my-8 items-center justify-between gap-16">
      <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-3">
        {features.map((feature, idx) => (
          <div
            key={idx}
            className="rounded-xl bg-neutral-50 p-8 text-center shadow-md"
          >
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-orange-300">
              {feature.icon}
            </div>
            <h3 className="text-2xl font-semibold">{feature.title}</h3>
            <p className="mt-2 text-lg">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
