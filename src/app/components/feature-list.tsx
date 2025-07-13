import {
  CalendarDaysIcon,
  ClipboardDocumentListIcon,
  ChartPieIcon,
} from "@heroicons/react/24/outline";

const features = [
  {
    title: "Manage Trips",
    description: "Keep all your travel details in one place.",
    icon: <CalendarDaysIcon className="h-8 w-8 mx-auto" />,
  },
  {
    title: "Create Checklists",
    description: "Build personalized packing lists for your journeys.",
    icon: <ClipboardDocumentListIcon className="h-8 w-8 mx-auto" />,
  },
  {
    title: "Track Progress",
    description: "Monitor your packing progress with ease.",
    icon: <ChartPieIcon className="h-8 w-8  mx-auto" />,
  },
];

export default function FeatureList() {
  return (
    <section className="items-center justify-between gap-16 my-8">
      <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
        {features.map((feature, idx) => (
          <div
            key={idx}
            className="bg-neutral-50 p-8 rounded-xl shadow-md text-center"
          >
            <div className="w-16 h-16 mx-auto bg-orange-300 rounded-full flex items-center justify-center mb-4">
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
