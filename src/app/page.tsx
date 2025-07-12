import FeatureList from "./components/feature-list";
import Hero from "./components/hero";

export default function Home() {
  return (
    <div>
      <div className="flex flex-col items-center mt-6">
        <Hero />
        <FeatureList />
      </div>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center"></footer>
    </div>
  );
}
