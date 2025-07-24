import FeatureList from "./components/feature-list";
import Hero from "./components/hero";

export default function Home() {
  return (
    <div>
      <div className="mt-6 flex flex-col items-center">
        <Hero />
        <FeatureList />
      </div>
    </div>
  );
}
